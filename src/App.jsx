import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Brain, User, LogOut, Plus, Star, RotateCcw, Check, X, BarChart3, Target, TrendingUp, Eye, EyeOff } from 'lucide-react';
import { dictionaryAPI } from './services/dictionaryAPI';
import { storageService } from './services/storageService';
import { authService } from './services/authService';
import LoginComponent from './components/LoginComponent';
import SearchView from './components/SearchView';
import CollectionView from './components/CollectionView';
import LearnView from './components/LearnView';
import StatsView from './components/StatsView';
import ReviewModal from './components/ReviewModal';
import Header from './components/Header';

const PersonalDictionaryApp = () => {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('search');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [savedWords, setSavedWords] = useState([]);
  const [categories, setCategories] = useState({});
  const [reviewMode, setReviewMode] = useState(null);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [showDefinition, setShowDefinition] = useState(false);
  const [reviewStats, setReviewStats] = useState({ correct: 0, total: 0 });
  const [loading, setLoading] = useState(false);

  // Load data on component mount
  useEffect(() => {
    const savedUser = storageService.getUser();
    if (savedUser) {
      setUser(savedUser);
      loadUserData(savedUser.email);
    }
  }, []);

  // Load user's saved words and categories
  const loadUserData = (userEmail) => {
    const words = storageService.getSavedWords(userEmail);
    const cats = storageService.getCategories(userEmail);
    setSavedWords(words);
    setCategories(cats);
  };

  // Enhanced Gmail login with real authentication
  const handleGmailLogin = async () => {
    try {
      const userData = await authService.loginWithGmail();
      setUser(userData);
      storageService.saveUser(userData);
      loadUserData(userData.email);
    } catch (error) {
      console.error('Login failed:', error);
      // Fallback to mock login for development
      const mockUser = {
        name: 'John Doe',
        email: 'john.doe@gmail.com',
        picture: 'https://via.placeholder.com/40'
      };
      setUser(mockUser);
      storageService.saveUser(mockUser);
      loadUserData(mockUser.email);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setSavedWords([]);
    setCategories({});
    setCurrentView('search');
    storageService.clearUser();
  };

  // Enhanced dictionary search with real API
  const searchWord = async (word) => {
    setLoading(true);
    try {
      const result = await dictionaryAPI.searchWord(word);
      setSearchResult(result);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResult({
        word: word,
        phonetic: `/${word}/`,
        meanings: [{
          partOfSpeech: 'unknown',
          definitions: [{
            definition: `Could not find definition for "${word}". Please check spelling or try another word.`,
            example: null
          }]
        }],
        error: true
      });
    } finally {
      setLoading(false);
    }
  };

  // AI categorization (enhanced with better logic)
  const categorizeWord = async (word, definition, partOfSpeech) => {
    try {
      // Simple rule-based categorization for now
      const difficulty = determineDifficulty(word, definition);
      const topic = determineTopic(word, definition);
      const wordType = determineWordType(word, definition);
      
      return { difficulty, topic, word_type: wordType };
    } catch (error) {
      console.error('Categorization error:', error);
      return {
        difficulty: 'intermediate',
        topic: 'daily_life',
        word_type: 'common'
      };
    }
  };

  // Helper functions for categorization
  const determineDifficulty = (word, definition) => {
    const wordLength = word.length;
    const definitionLength = definition.length;
    
    if (wordLength <= 5 && definitionLength <= 50) return 'beginner';
    if (wordLength <= 8 && definitionLength <= 100) return 'intermediate';
    return 'advanced';
  };

  const determineTopic = (word, definition) => {
    const businessWords = ['business', 'corporate', 'company', 'profit', 'revenue'];
    const academicWords = ['theory', 'research', 'analysis', 'hypothesis', 'methodology'];
    const technicalWords = ['system', 'process', 'algorithm', 'database', 'software'];
    
    const text = (word + ' ' + definition).toLowerCase();
    
    if (businessWords.some(bw => text.includes(bw))) return 'business';
    if (academicWords.some(aw => text.includes(aw))) return 'academic';
    if (technicalWords.some(tw => text.includes(tw))) return 'technical';
    return 'daily_life';
  };

  const determineWordType = (word, definition) => {
    const commonWords = ['make', 'get', 'go', 'come', 'take', 'see', 'know', 'think', 'say', 'tell'];
    const academicWords = ['analyze', 'synthesize', 'hypothesize', 'conceptualize'];
    
    if (commonWords.includes(word.toLowerCase())) return 'common';
    if (academicWords.includes(word.toLowerCase())) return 'academic';
    if (word.length > 10) return 'specialized';
    return 'common';
  };

  // Enhanced save word function
  const saveWord = async () => {
    if (!searchResult || !user || searchResult.error) return;

    // Check if word already exists
    const existingWord = savedWords.find(w => w.word.toLowerCase() === searchResult.word.toLowerCase());
    if (existingWord) {
      alert('This word is already in your collection!');
      return;
    }

    const definition = searchResult.meanings[0].definitions[0].definition;
    const partOfSpeech = searchResult.meanings[0].partOfSpeech;
    
    const wordCategories = await categorizeWord(searchResult.word, definition, partOfSpeech);
    
    const newWord = {
      id: Date.now(),
      word: searchResult.word,
      phonetic: searchResult.phonetic,
      definition: definition,
      example: searchResult.meanings[0].definitions[0].example,
      partOfSpeech: partOfSpeech,
      categories: wordCategories,
      dateAdded: new Date().toISOString(),
      reviewCount: 0,
      lastReviewed: null,
      difficulty: 0, // 0 = not reviewed, 1 = hard, 2 = medium, 3 = easy
      nextReview: new Date().toISOString()
    };

    const updatedWords = [...savedWords, newWord];
    setSavedWords(updatedWords);
    
    // Update categories count
    const updatedCategories = { ...categories };
    Object.entries(wordCategories).forEach(([key, value]) => {
      if (!updatedCategories[key]) updatedCategories[key] = {};
      updatedCategories[key][value] = (updatedCategories[key][value] || 0) + 1;
    });
    setCategories(updatedCategories);
    
    // Save to storage
    storageService.saveWords(user.email, updatedWords);
    storageService.saveCategories(user.email, updatedCategories);
  };

  // Enhanced review functions
  const startReview = (categoryType, categoryValue) => {
    const wordsToReview = savedWords.filter(word => 
      word.categories[categoryType] === categoryValue
    );
    
    if (wordsToReview.length === 0) {
      alert('No words found in this category!');
      return;
    }
    
    // Shuffle words for better learning
    const shuffledWords = [...wordsToReview].sort(() => Math.random() - 0.5);
    
    setReviewMode({ 
      words: shuffledWords, 
      type: categoryType, 
      value: categoryValue,
      startTime: new Date()
    });
    setCurrentReviewIndex(0);
    setShowDefinition(false);
    setReviewStats({ correct: 0, total: 0 });
  };

  const markAnswer = (correct) => {
    const currentWord = reviewMode.words[currentReviewIndex];
    
    // Update word statistics
    const updatedWords = savedWords.map(word => {
      if (word.id === currentWord.id) {
        return {
          ...word,
          reviewCount: word.reviewCount + 1,
          lastReviewed: new Date().toISOString(),
          difficulty: correct ? Math.min(word.difficulty + 1, 3) : Math.max(word.difficulty - 1, 0)
        };
      }
      return word;
    });
    
    setSavedWords(updatedWords);
    storageService.saveWords(user.email, updatedWords);
    
    setReviewStats(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1
    }));

    if (currentReviewIndex < reviewMode.words.length - 1) {
      setCurrentReviewIndex(prev => prev + 1);
      setShowDefinition(false);
    } else {
      // Review complete
      const finalScore = reviewStats.correct + (correct ? 1 : 0);
      const totalQuestions = reviewStats.total + 1;
      const percentage = Math.round((finalScore / totalQuestions) * 100);
      
      alert(`Review Complete!\nScore: ${finalScore}/${totalQuestions} (${percentage}%)\nKeep up the great work!`);
      setReviewMode(null);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      searchWord(searchTerm.trim());
    }
  };

  if (!user) {
    return <LoginComponent onLogin={handleGmailLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={user}
        currentView={currentView}
        setCurrentView={setCurrentView}
        savedWordsCount={savedWords.length}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {reviewMode && (
          <ReviewModal
            reviewMode={reviewMode}
            currentReviewIndex={currentReviewIndex}
            showDefinition={showDefinition}
            setShowDefinition={setShowDefinition}
            markAnswer={markAnswer}
            onClose={() => setReviewMode(null)}
          />
        )}

        {currentView === 'search' && (
          <SearchView
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            searchResult={searchResult}
            loading={loading}
            onSearch={handleSearch}
            onSaveWord={saveWord}
          />
        )}

        {currentView === 'collection' && (
          <CollectionView savedWords={savedWords} />
        )}

        {currentView === 'learn' && (
          <LearnView
            categories={categories}
            savedWords={savedWords}
            onStartReview={startReview}
          />
        )}

        {currentView === 'stats' && (
          <StatsView
            savedWords={savedWords}
            categories={categories}
          />
        )}
      </main>
    </div>
  );
};

export default PersonalDictionaryApp;