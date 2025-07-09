import React, { useState, useMemo } from 'react';
import { BookOpen, Filter, Search, Calendar, Volume2, Tag } from 'lucide-react';

const CollectionView = ({ savedWords }) => {
  const [filterType, setFilterType] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [sortBy, setSortBy] = useState('dateAdded');

  // Filter and sort words
  const filteredAndSortedWords = useMemo(() => {
    let filtered = [...savedWords];

    // Apply search filter
    if (searchFilter) {
      filtered = filtered.filter(word => 
        word.word.toLowerCase().includes(searchFilter.toLowerCase()) ||
        word.definition.toLowerCase().includes(searchFilter.toLowerCase())
      );
    }

    // Apply category filter
    if (filterType !== 'all') {
      filtered = filtered.filter(word => {
        const [category, value] = filterType.split(':');
        return word.categories[category] === value;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'alphabetical':
          return a.word.localeCompare(b.word);
        case 'dateAdded':
          return new Date(b.dateAdded) - new Date(a.dateAdded);
        case 'reviewCount':
          return b.reviewCount - a.reviewCount;
        default:
          return 0;
      }
    });

    return filtered;
  }, [savedWords, filterType, searchFilter, sortBy]);

  // Get unique filter options
  const filterOptions = useMemo(() => {
    const options = [{ value: 'all', label: 'All Words', count: savedWords.length }];
    
    const categoryTypes = ['difficulty', 'topic', 'word_type'];
    categoryTypes.forEach(categoryType => {
      const categories = {};
      savedWords.forEach(word => {
        const value = word.categories[categoryType];
        categories[value] = (categories[value] || 0) + 1;
      });
      
      Object.entries(categories).forEach(([value, count]) => {
        options.push({
          value: `${categoryType}:${value}`,
          label: `${categoryType === 'word_type' ? 'Type' : categoryType}: ${value.replace('_', ' ')}`,
          count
        });
      });
    });
    
    return options;
  }, [savedWords]);

  const playPronunciation = (word) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">My Word Collection</h2>
        <p className="text-gray-600">Your personal vocabulary bank with {savedWords.length} words</p>
      </div>

      {savedWords.length > 0 && (
        <div className="mb-6 bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search words..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none bg-white"
              >
                {filterOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label} ({option.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none bg-white"
            >
              <option value="dateAdded">Recently Added</option>
              <option value="alphabetical">Alphabetical</option>
              <option value="reviewCount">Most Reviewed</option>
            </select>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredAndSortedWords.length} of {savedWords.length} words
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {filteredAndSortedWords.length > 0 ? (
          filteredAndSortedWords.map((word) => (
            <div key={word.id} className="card hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-gray-800">{word.word}</h3>
                    {word.phonetic && (
                      <button
                        onClick={() => playPronunciation(word.word)}
                        className="p-1 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                        title="Play pronunciation"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {word.phonetic && (
                    <p className="text-gray-600 mb-2">{word.phonetic}</p>
                  )}
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getDifficultyColor(word.categories.difficulty)}`}>
                    {word.categories.difficulty}
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium capitalize">
                    {word.categories.topic.replace('_', ' ')}
                  </span>
                </div>
              </div>
              
              <div className="mb-4">
                <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm font-medium mb-2">
                  {word.partOfSpeech}
                </span>
                <p className="text-gray-800 mb-3">{word.definition}</p>
                {word.example && (
                  <p className="text-gray-600 italic pl-4 border-l-4 border-gray-200">
                    Example: {word.example}
                  </p>
                )}
              </div>

              <div className="flex justify-between items-center text-sm text-gray-500 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Added {formatDate(word.dateAdded)}
                  </span>
                  {word.reviewCount > 0 && (
                    <span>
                      Reviewed {word.reviewCount} time{word.reviewCount !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  <span className="capitalize">{word.categories.word_type}</span>
                </div>
              </div>
            </div>
          ))
        ) : savedWords.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No words saved yet</p>
            <p className="text-gray-400">Start by searching for new words!</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No words match your search</p>
            <p className="text-gray-400">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionView;