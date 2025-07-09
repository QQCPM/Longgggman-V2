import React, { useState, useEffect } from 'react';
import { Search, Plus, Volume2, BookOpen, Lightbulb } from 'lucide-react';
import { dictionaryAPI } from '../services/dictionaryAPI';

const SearchView = ({ searchTerm, setSearchTerm, searchResult, loading, onSearch, onSaveWord }) => {
  const [wordOfTheDay, setWordOfTheDay] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    loadWordOfTheDay();
  }, []);

  const loadWordOfTheDay = async () => {
    try {
      const word = await dictionaryAPI.getWordOfTheDay();
      setWordOfTheDay(word);
    } catch (error) {
      console.error('Failed to load word of the day:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  const playPronunciation = (word) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const searchWordOfTheDay = () => {
    if (wordOfTheDay) {
      setSearchTerm(wordOfTheDay.word);
      onSearch();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Discover New Words</h2>
        <p className="text-gray-600">Search for words and add them to your personal collection</p>
      </div>

      {/* Word of the Day */}
      {wordOfTheDay && (
        <div className="mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-indigo-800">Word of the Day</h3>
          </div>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h4 className="text-2xl font-bold text-gray-800 mb-1">{wordOfTheDay.word}</h4>
              <p className="text-gray-600 mb-2">{wordOfTheDay.phonetic}</p>
              <p className="text-gray-700">{wordOfTheDay.meanings[0].definitions[0].definition}</p>
            </div>
            <button
              onClick={searchWordOfTheDay}
              className="btn-primary ml-4 whitespace-nowrap"
            >
              Explore Word
            </button>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter a word to search..."
            className="input-field pl-12 pr-4 py-4 text-lg"
            disabled={loading}
          />
          <button
            onClick={onSearch}
            disabled={loading || !searchTerm.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Search Result */}
      {searchResult && (
        <div className="card">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-3xl font-bold text-gray-800">{searchResult.word}</h3>
                {searchResult.phonetic && (
                  <button
                    onClick={() => playPronunciation(searchResult.word)}
                    className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Play pronunciation"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                )}
              </div>
              {searchResult.phonetic && (
                <p className="text-lg text-gray-600 mb-4">{searchResult.phonetic}</p>
              )}
            </div>
            
            {!searchResult.error && (
              <button
                onClick={onSaveWord}
                className="btn-primary flex items-center gap-2 ml-4"
              >
                <Plus className="w-4 h-4" />
                Save Word
              </button>
            )}
          </div>

          {searchResult.error ? (
            <div className="text-center py-8">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">Word not found</p>
              <p className="text-gray-400">Please check the spelling and try again</p>
            </div>
          ) : (
            <div className="space-y-6">
              {searchResult.meanings.map((meaning, index) => (
                <div key={index}>
                  <span className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
                    {meaning.partOfSpeech}
                  </span>
                  
                  <div className="space-y-4">
                    {meaning.definitions.map((def, defIndex) => (
                      <div key={defIndex} className="pl-4 border-l-4 border-gray-100">
                        <p className="text-lg text-gray-800 mb-2">{def.definition}</p>
                        {def.example && (
                          <p className="text-gray-600 italic">
                            <strong>Example:</strong> {def.example}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Search Tips */}
      {!searchResult && !loading && (
        <div className="bg-gray-50 rounded-xl p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Search Tips</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">What you can search:</h4>
              <ul className="space-y-1">
                <li>• Common English words</li>
                <li>• Academic vocabulary</li>
                <li>• Technical terms</li>
                <li>• Synonyms and antonyms</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Features:</h4>
              <ul className="space-y-1">
                <li>• Audio pronunciation</li>
                <li>• Multiple definitions</li>
                <li>• Usage examples</li>
                <li>• Part of speech</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchView;