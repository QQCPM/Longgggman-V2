import React from 'react';
import { Target, BookOpen, Star, Brain, Play, Trophy, Clock } from 'lucide-react';

const LearnView = ({ categories, savedWords, onStartReview }) => {
  const getCategoryIcon = (categoryType) => {
    switch (categoryType) {
      case 'difficulty': return Target;
      case 'topic': return BookOpen;
      case 'word_type': return Star;
      default: return Brain;
    }
  };

  const getCategoryColor = (categoryType) => {
    switch (categoryType) {
      case 'difficulty': return 'text-blue-500';
      case 'topic': return 'text-green-500';
      case 'word_type': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

  const getCategoryBgColor = (categoryType) => {
    switch (categoryType) {
      case 'difficulty': return 'bg-blue-50 border-blue-200';
      case 'topic': return 'bg-green-50 border-green-200';
      case 'word_type': return 'bg-purple-50 border-purple-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const formatCategoryName = (category, value) => {
    if (category === 'word_type') {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
    return value.replace('_', ' ').charAt(0).toUpperCase() + value.slice(1).replace('_', ' ');
  };

  const getReviewStats = (categoryType, categoryValue) => {
    const words = savedWords.filter(word => word.categories[categoryType] === categoryValue);
    const reviewed = words.filter(word => word.reviewCount > 0).length;
    const needsReview = words.filter(word => word.reviewCount === 0 || word.difficulty < 2).length;
    
    return { total: words.length, reviewed, needsReview };
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Smart Learning</h2>
        <p className="text-gray-600">Practice your words by categories for effective learning</p>
      </div>

      {savedWords.length === 0 ? (
        <div className="text-center py-12">
          <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">Add some words to your collection to start learning!</p>
          <p className="text-gray-400">Search for words and save them to begin your learning journey</p>
        </div>
      ) : (
        <>
          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <BookOpen className="w-10 h-10 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{savedWords.length}</div>
              <div className="text-sm text-gray-600">Total Words</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <Trophy className="w-10 h-10 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">
                {savedWords.filter(w => w.reviewCount > 0).length}
              </div>
              <div className="text-sm text-gray-600">Words Reviewed</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <Target className="w-10 h-10 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">
                {savedWords.filter(w => w.difficulty >= 2).length}
              </div>
              <div className="text-sm text-gray-600">Mastered</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <Clock className="w-10 h-10 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">
                {savedWords.filter(w => w.reviewCount === 0 || w.difficulty < 2).length}
              </div>
              <div className="text-sm text-gray-600">Need Review</div>
            </div>
          </div>

          {/* Learning Categories */}
          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(categories).map(([categoryType, categoryData]) => {
              const Icon = getCategoryIcon(categoryType);
              const colorClass = getCategoryColor(categoryType);
              const bgClass = getCategoryBgColor(categoryType);
              
              return (
                <div key={categoryType} className={`card border-2 ${bgClass}`}>
                  <h3 className={`text-xl font-bold text-gray-800 mb-4 flex items-center gap-2`}>
                    <Icon className={`w-5 h-5 ${colorClass}`} />
                    By {categoryType === 'word_type' ? 'Type' : formatCategoryName('', categoryType)}
                  </h3>
                  
                  <div className="space-y-3">
                    {Object.entries(categoryData).map(([value, count]) => {
                      const stats = getReviewStats(categoryType, value);
                      const progress = stats.total > 0 ? Math.round((stats.reviewed / stats.total) * 100) : 0;
                      
                      return (
                        <div key={value} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-gray-800">
                              {formatCategoryName(categoryType, value)}
                            </span>
                            <span className="text-sm text-gray-500">{count} words</span>
                          </div>
                          
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                              <div 
                                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-600">{progress}%</span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="text-xs text-gray-500">
                              {stats.reviewed} reviewed • {stats.needsReview} need practice
                            </div>
                            <button
                              onClick={() => onStartReview(categoryType, value)}
                              className="btn-primary text-sm py-1 px-3 flex items-center gap-1"
                            >
                              <Play className="w-3 h-3" />
                              Review
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Learning Tips */}
          <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-600" />
              Learning Tips
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Effective Practice:</h4>
                <ul className="space-y-1">
                  <li>• Review words regularly for better retention</li>
                  <li>• Focus on difficult categories first</li>
                  <li>• Practice with examples and context</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Progress Tracking:</h4>
                <ul className="space-y-1">
                  <li>• Green progress bars show mastery level</li>
                  <li>• Words marked as "known" advance faster</li>
                  <li>• Regular review maintains long-term memory</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LearnView;