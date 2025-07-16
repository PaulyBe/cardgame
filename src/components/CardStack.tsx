import React from 'react';
import { Card } from './Card';
import { useCardStack } from '../hooks/useCardStack';
import { Users, Smartphone, MessageCircle, Heart, Sparkles } from 'lucide-react';

export const CardStack: React.FC = () => {
  const { currentQuestions, swipeCard, categoryFilter, setFilter } = useCardStack();

  const handleCardClick = () => {
    swipeCard();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <div className="p-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            1000 Questions
          </h1>
        </div>
        <p className="text-gray-600 max-w-md mx-auto">
          Meaningful questions to spark deeper conversations and stronger connections
        </p>
        
        {/* Mobile swipe hint */}
        <div className="mt-4 sm:hidden flex items-center justify-center gap-2 text-sm text-gray-500">
          <Smartphone size={16} />
          <span>Swipe cards left or right</span>
        </div>
      </div>

      {/* Card Stack Container */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="relative w-full max-w-md aspect-[3/4] max-h-[600px]">
          {/* Background decorative elements */}
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-indigo-200/30 rounded-full blur-xl"></div>
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-200/30 rounded-full blur-xl"></div>
          
          {/* Cards */}
          {currentQuestions.map((question, index) => (
            <Card
              key={`${question.id}-${Date.now()}-${index}`}
              question={question}
              isTop={index === 0}
              zIndex={currentQuestions.length - index}
              onSwipe={swipeCard}
            />
          ))}

          {/* Tap area for non-touch devices - hidden on mobile */}
          <div
            className="absolute inset-0 cursor-pointer z-10 hidden sm:block"
            onClick={handleCardClick}
            style={{ pointerEvents: 'auto' }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 text-center">
        {/* Category Filter Buttons */}
        <div className="mb-6">
          <div className="flex justify-center gap-2 sm:gap-3 mb-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                categoryFilter === 'all'
                  ? 'bg-gray-800 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('light')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                categoryFilter === 'light'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
              }`}
            >
              <MessageCircle size={16} />
              Light
            </button>
            <button
              onClick={() => setFilter('medium')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                categoryFilter === 'medium'
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
              }`}
            >
              <Heart size={16} />
              Medium
            </button>
            <button
              onClick={() => setFilter('deep')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                categoryFilter === 'deep'
                  ? 'bg-pink-500 text-white shadow-lg'
                  : 'bg-pink-100 text-pink-600 hover:bg-pink-200'
              }`}
            >
              <Sparkles size={16} />
              Deep
            </button>
          </div>
        </div>
        
        {/* Mobile instructions */}
        <div className="mt-4 sm:hidden text-xs text-gray-400 max-w-xs mx-auto">
          Swipe cards in any direction for new questions
        </div>
      </div>
    </div>
  );
};