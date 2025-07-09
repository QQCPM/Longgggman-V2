import React, { useMemo } from 'react';
import { BookOpen, TrendingUp, Target, Brain, Calendar, Award, BarChart3, PieChart } from 'lucide-react';

const StatsView = ({ savedWords, categories }) => {
  const stats = useMemo(() => {
    const totalWords = savedWords.length;
    const reviewedWords = savedWords.filter(w => w.reviewCount > 0).length;
    const masteredWords = savedWords.filter(w => w.difficulty >= 2).length;
    const advancedWords = categories.difficulty?.advanced || 0;
    const totalReviews = savedWords.reduce((sum, word) => sum + word.reviewCount, 0);
    
    // Calculate words added in the last 7 days
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const recentWords = savedWords.filter(w => new Date(w.dateAdded) >= lastWeek).length;

    // Calculate daily average
    const firstWordDate = savedWords.length > 0 
      ? new Date(Math.min(...savedWords.map(w => new Date(w.dateAdded))))
      : new Date();
    const daysSinceFirst = Math.max(1, Math.ceil((new Date() - firstWordDate) / (1000 * 60 * 60 * 24)));
    const dailyAverage = Math.round((totalWords / daysSinceFirst) * 10) / 10;

    return {
      totalWords,
      reviewedWords,
      masteredWords,
      advancedWords,
      totalReviews,
      recentWords,
      dailyAverage,
      reviewRate: totalWords > 0 ? Math.round((reviewedWords / totalWords) * 100) : 0,
      masteryRate: totalWords > 0 ? Math.round((masteredWords / totalWords) * 100) : 0
    };
  }, [savedWords, categories]);

  const getCategoryStats = () => {
    return Object.entries(categories).map(([categoryType, categoryData]) => ({
      type: categoryType,
      name: categoryType === 'word_type' ? 'Word Type' : categoryType.charAt(0).toUpperCase() + categoryType.slice(1),
      data: Object.entries(categoryData).map(([value, count]) => ({
        label: value.replace('_', ' ').charAt(0).toUpperCase() + value.slice(1).replace('_', ' '),
        count,
        percentage: Math.round((count / savedWords.length) * 100)
      }))
    }));
  };

  const getActivityData = () => {
    const last30Days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const wordsAdded = savedWords.filter(w => 
        w.dateAdded.split('T')[0] === dateStr
      ).length;
      
      last30Days.push({
        date: dateStr,
        count: wordsAdded,
        day: date.getDate()
      });
    }
    
    return last30Days;
  };

  const activityData = getActivityData();
  const maxActivity = Math.max(...activityData.map(d => d.count), 1);

  const getActivityColor = (count) => {
    if (count === 0) return 'bg-gray-100';
    if (count === 1) return 'bg-green-200';
    if (count <= 3) return 'bg-green-400';
    return 'bg-green-600';
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Learning Statistics</h2>
        <p className="text-gray-600">Track your vocabulary growth and learning progress</p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card text-center">
          <BookOpen className="w-12 h-12 text-blue-500 mx-auto mb-3" />
          <h3 className="text-3xl font-bold text-gray-800 mb-1">{stats.totalWords}</h3>
          <p className="text-gray-600">Total Words</p>
          {stats.recentWords > 0 && (
            <p className="text-sm text-green-600 mt-1">+{stats.recentWords} this week</p>
          )}
        </div>
        
        <div className="card text-center">
          <TrendingUp className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <h3 className="text-3xl font-bold text-gray-800 mb-1">{stats.reviewedWords}</h3>
          <p className="text-gray-600">Words Reviewed</p>
          <p className="text-sm text-gray-500 mt-1">{stats.reviewRate}% of collection</p>
        </div>
        
        <div className="card text-center">
          <Target className="w-12 h-12 text-purple-500 mx-auto mb-3" />
          <h3 className="text-3xl font-bold text-gray-800 mb-1">{stats.masteredWords}</h3>
          <p className="text-gray-600">Mastered</p>
          <p className="text-sm text-gray-500 mt-1">{stats.masteryRate}% mastery rate</p>
        </div>
        
        <div className="card text-center">
          <Brain className="w-12 h-12 text-indigo-500 mx-auto mb-3" />
          <h3 className="text-3xl font-bold text-gray-800 mb-1">{stats.totalReviews}</h3>
          <p className="text-gray-600">Total Reviews</p>
          <p className="text-sm text-gray-500 mt-1">{stats.dailyAverage} words/day avg</p>
        </div>
      </div>

      {/* Activity Heatmap */}
      <div className="card mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-600" />
          Activity Over Last 30 Days
        </h3>
        
        <div className="grid grid-cols-10 gap-1 mb-4">
          {activityData.map((day, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-6 h-6 rounded ${getActivityColor(day.count)} border border-gray-200`}
                title={`${day.date}: ${day.count} words added`}
              ></div>
              {index % 5 === 0 && (
                <span className="text-xs text-gray-500 mt-1">{day.day}</span>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-gray-100 rounded"></div>
            <div className="w-3 h-3 bg-green-200 rounded"></div>
            <div className="w-3 h-3 bg-green-400 rounded"></div>
            <div className="w-3 h-3 bg-green-600 rounded"></div>
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {getCategoryStats().map((category, index) => (
          <div key={index} className="card">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-gray-600" />
              {category.name}
            </h3>
            
            <div className="space-y-3">
              {category.data.map((item, itemIndex) => (
                <div key={itemIndex}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    <span className="text-sm text-gray-500">{item.count} ({item.percentage}%)</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Learning Insights */}
      <div className="card bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-600" />
          Learning Insights
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Progress Highlights</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                {stats.masteryRate >= 50 
                  ? `Excellent progress! You've mastered ${stats.masteryRate}% of your words.`
                  : `Keep going! ${stats.masteredWords} words mastered so far.`
                }
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                {stats.dailyAverage >= 1
                  ? `Great consistency! Adding ${stats.dailyAverage} words per day on average.`
                  : `Consider setting a daily goal to build vocabulary faster.`
                }
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                {stats.reviewRate >= 70
                  ? `Excellent review habits! ${stats.reviewRate}% of words reviewed.`
                  : `Try reviewing more words to improve retention.`
                }
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Recommendations</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                {stats.totalWords - stats.reviewedWords > 0 
                  ? `Review ${stats.totalWords - stats.reviewedWords} unreviewed words for better retention.`
                  : 'All words reviewed! Great job maintaining your vocabulary.'
                }
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                {stats.advancedWords < stats.totalWords * 0.3
                  ? 'Try adding more advanced words to challenge yourself.'
                  : 'Good balance of word difficulty levels!'
                }
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                Focus on categories with lower mastery rates for balanced learning.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {savedWords.length === 0 && (
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">No statistics available yet</p>
          <p className="text-gray-400">Add some words to see your learning progress!</p>
        </div>
      )}
    </div>
  );
};

export default StatsView;