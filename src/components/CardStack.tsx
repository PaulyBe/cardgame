import React from 'react';
import { Card } from './Card';
import { useCardStack } from '../hooks/useCardStack';
import { RefreshCw, Users, Smartphone } from 'lucide-react';

export const CardStack: React.FC = () => {
  const { currentQuestions, swipeCard } = useCardStack();

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
        <button
          onClick={swipeCard}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 active:scale-95"
        >
          <RefreshCw size={20} />
          New Question
        </button>
        
        <div className="mt-4 flex justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-500 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            <span className="hidden sm:inline">Light & Fun</span>
            <span className="sm:hidden">Light</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
            <span className="hidden sm:inline">Getting Deeper</span>
            <span className="sm:hidden">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
            <span className="hidden sm:inline">Deep Connection</span>
            <span className="sm:hidden">Deep</span>
          </div>
        </div>

        {/* Buttons to choose light, medium or deep */}
        <div className="mt-4 sm:hidden text-s text-gray-500 max-w-xs mx-auto">
          Choose Mode:
        </div>
        <div className="mt-4 flex justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-500 flex-wrap">
        <button
          // onClick={swipeCard}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-400 text-white rounded-full font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 active:scale-95"
        >
          Light
        </button>
        <button
          // onClick={swipeCard}
          className="inline-flex items-center gap-2 px-6 py-3 bg-purple-400 text-white rounded-full font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 active:scale-95"
        >
          Medium
        </button>
        <button
          // onClick={swipeCard}
          className="inline-flex items-center gap-2 px-6 py-3 bg-pink-400 text-white rounded-full font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 active:scale-95"
        >
          Deep
        </button>
        </div>
        {/* Mobile instructions */}
        <div className="mt-4 sm:hidden text-xs text-gray-400 max-w-xs mx-auto">
          Swipe cards in any direction or tap the button above for new questions
        </div>
      </div>
    </div>
  );
};