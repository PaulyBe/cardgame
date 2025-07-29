import { useState, useCallback } from 'react';
import { Question } from '../types';
import { questions } from '../data/questions';

type CategoryFilter = 'all' | 'light' | 'medium' | 'deep';
export const useCardStack = () => {
  const [usedQuestions, setUsedQuestions] = useState<Set<number>>(new Set());
  const [isInitialSequence, setIsInitialSequence] = useState(true);
  const [initialCardCount, setInitialCardCount] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>(() => {
    // Initialize with 2 light questions and 1 medium question
    const lightQuestions = questions.filter(q => q.category === 'light');
    const mediumQuestions = questions.filter(q => q.category === 'medium');
    
    const shuffledLight = [...lightQuestions].sort(() => Math.random() - 0.5);
    const shuffledMedium = [...mediumQuestions].sort(() => Math.random() - 0.5);
    
    return [
      shuffledLight[0], // First light question
      shuffledLight[1], // Second light question
      shuffledMedium[0]  // First medium question
    ];
  });

  const getFilteredQuestions = useCallback((category: CategoryFilter): Question[] => {
    if (category === 'all') {
      return questions;
    }
    return questions.filter(q => q.category === category);
  }, []);

  const getRandomQuestion = useCallback((): Question => {
    const filteredQuestions = getFilteredQuestions(categoryFilter);
    const availableQuestions = filteredQuestions.filter(q => !usedQuestions.has(q.id));
    
    // If we've used all questions, reset
    if (availableQuestions.length === 0) {
      setUsedQuestions(new Set());
      return filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)];
    }
    
    return availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
  }, [usedQuestions, categoryFilter, getFilteredQuestions]);

  const getNextInitialQuestion = useCallback((): Question => {
    // If we have a category filter active, skip initial sequence and use filtered questions
    if (categoryFilter !== 'all') {
      return getRandomQuestion();
    }
    
    // After the first 3 cards (2 light, 1 medium), we need to provide the next specific questions
    if (initialCardCount === 3) {
      // 4th card should be light
      const lightQuestions = questions.filter(q => q.category === 'light' && !usedQuestions.has(q.id));
      if (lightQuestions.length > 0) {
        return lightQuestions[Math.floor(Math.random() * lightQuestions.length)];
      }
    } else if (initialCardCount === 4) {
      // 5th card should be light  
      const lightQuestions = questions.filter(q => q.category === 'light' && !usedQuestions.has(q.id));
      if (lightQuestions.length > 0) {
        return lightQuestions[Math.floor(Math.random() * lightQuestions.length)];
      }
    } else if (initialCardCount === 5) {
      // 6th card should be medium
      const mediumQuestions = questions.filter(q => q.category === 'medium' && !usedQuestions.has(q.id));
      if (mediumQuestions.length > 0) {
        return mediumQuestions[Math.floor(Math.random() * mediumQuestions.length)];
      }
    }
    
    // Fallback to random if specific category not available
    return getRandomQuestion();
  }, [initialCardCount, usedQuestions, getRandomQuestion, categoryFilter]);

  const setFilter = useCallback((filter: CategoryFilter) => {
    setCategoryFilter(filter);
    
    // Reset the stack with new filtered questions
    const filteredQuestions = getFilteredQuestions(filter);
    const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5);
    
    // Reset used questions and initial sequence when changing filter
    setUsedQuestions(new Set());
    setIsInitialSequence(filter === 'all'); // Only use initial sequence for 'all'
    setInitialCardCount(0);
    
    // Set 3 new questions from the filtered set
    setCurrentQuestions(shuffled.slice(0, 3));
  }, [getFilteredQuestions]);
  const swipeCard = useCallback(() => {
    setCurrentQuestions(prev => {
      const newQuestions = [...prev];
      const topQuestion = newQuestions.shift();
      
      if (topQuestion) {
        setUsedQuestions(prev => new Set([...prev, topQuestion.id]));
      }
      
      // Determine what type of question to add next
      let newQuestion: Question;
      
      if (isInitialSequence && initialCardCount < 6 && categoryFilter === 'all') {
        // We're still in the initial sequence, get the next specific question
        newQuestion = getNextInitialQuestion();
        setInitialCardCount(prev => prev + 1);
        
        if (initialCardCount >= 5) {
          // After 6 total cards shown, switch to random
          setIsInitialSequence(false);
        }
      } else {
        // After initial sequence, use random questions
        newQuestion = getRandomQuestion();
      }
      
      newQuestions.push(newQuestion);
      
      return newQuestions;
    });
  }, [isInitialSequence, initialCardCount, getNextInitialQuestion, getRandomQuestion, categoryFilter]);

  return {
    currentQuestions,
    swipeCard,
    categoryFilter,
    setFilter,
  };
};