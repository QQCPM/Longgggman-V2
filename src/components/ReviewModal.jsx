import React from 'react';
import { Eye, EyeOff, Check, X, Volume2 } from 'lucide-react';

const ReviewModal = ({ 
  reviewMode, 
  currentReviewIndex, 
  showDefinition, 
  setShowDefinition, 
  markAnswer, 
  onClose 
}) => {
  const currentWord = reviewMode.words[currentReviewIndex];
  const progress = ((currentReviewIndex + 1) / reviewMode.words.length) * 100;

  const playPronunciation = (word) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const formatCategoryValue = (value) => {
    return value.replace('_', ' ').charAt(0).toUpperCase() + value.slice(1).replace('_', ' ');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Review: {formatCategoryValue(reviewMode.value)}
              </h2>
              <p className="text-gray-600">
                Word {currentReviewIndex + 1} of {reviewMode.words.length}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-sm text-gray-600 mt-2 text-right">
            {Math.round(progress)}% Complete
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentWord && (
            <div className="text-center">
              {/* Word Display */}
              <div className="mb-6">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <h3 className="text-4xl font-bold text-gray-800">
                    {currentWord.word}
                  </h3>
                  {currentWord.phonetic && (
                    <button
                      onClick={() => playPronunciation(currentWord.word)}
                      className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Play pronunciation"
                    >
                      <Volume2 className="w-6 h-6" />
                    </button>
                  )}
                </div>
                
                {currentWord.phonetic && (
                  <p className="text-lg text-gray-600 mb-4">{currentWord.phonetic}</p>
                )}
                
                <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                  {currentWord.partOfSpeech}
                </span>
              </div>

              {/* Definition Section */}
              {!showDefinition ? (
                <div className="mb-8">
                  <p className="text-gray-600 mb-6">
                    Do you know the meaning of this word?
                  </p>
                  <button
                    onClick={() => setShowDefinition(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg flex items-center gap-2 mx-auto transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                    Show Definition
                  </button>
                </div>
              ) : (
                <div className="mb-8">
                  <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <p className="text-lg text-gray-800 mb-4 leading-relaxed">
                      {currentWord.definition}
                    </p>
                    {currentWord.example && (
                      <div className="bg-white rounded-lg p-4 border-l-4 border-indigo-500">
                        <p className="text-gray-700 italic">
                          <strong>Example:</strong> {currentWord.example}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-6">
                    Did you know this word?
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              {showDefinition && (
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => markAnswer(false)}
                    className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <X className="w-5 h-5" />
                    Didn't Know
                  </button>
                  <button
                    onClick={() => markAnswer(true)}
                    className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Check className="w-5 h-5" />
                    Knew It
                  </button>
                </div>
              )}

              {/* Word Metadata */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex justify-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>Difficulty: {currentWord.categories.difficulty}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Topic: {formatCategoryValue(currentWord.categories.topic)}</span>
                  </div>
                  {currentWord.reviewCount > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      <span>Reviewed {currentWord.reviewCount} times</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;