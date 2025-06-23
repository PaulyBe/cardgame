import { useState, useCallback } from 'react';
import { Question } from '../types';
import { questions } from '../data/questions';

export const useCardStack = () => {
  const [usedQuestions, setUsedQuestions] = useState<Set<number>>(new Set());
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>(() => {
    // Initialize with 3 random questions
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  });

  const getRandomQuestion = useCallback((): Question => {
    const availableQuestions = questions.filter(q => !usedQuestions.has(q.id));
    
    // If we've used all questions, reset
    if (availableQuestions.length === 0) {
      setUsedQuestions(new Set());
      return questions[Math.floor(Math.random() * questions.length)];
    }
    
    return availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
  }, [usedQuestions]);

  const swipeCard = useCallback(() => {
    setCurrentQuestions(prev => {
      const newQuestions = [...prev];
      const topQuestion = newQuestions.shift();
      
      if (topQuestion) {
        setUsedQuestions(prev => new Set([...prev, topQuestion.id]));
      }
      
      // Add a new question to the back
      const newQuestion = getRandomQuestion();
      newQuestions.push(newQuestion);
      
      return newQuestions;
    });
  }, [getRandomQuestion]);

  return {
    currentQuestions,
    swipeCard,
  };
};