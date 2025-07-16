import { useState, useCallback } from 'react';
import { Question } from '../types';
import { questions } from '../data/questions';

// Mode: 'category' (single) or 'all' (one from each)
type StackMode = { type: 'category', category: 'light' | 'medium' | 'deep' } | { type: 'all' };

export const useCardStack = () => {
  const [mode, setMode] = useState<StackMode>({ type: 'category', category: 'light' });
  const [usedQuestions, setUsedQuestions] = useState<Set<number>>(new Set());

  // Helper to get questions for current mode
  const getQuestionsForMode = useCallback((): Question[] => {
    if (mode.type === 'category') {
      return questions.filter(q => q.category === mode.category);
    } else {
      // One random from each category
      const categories: ('light' | 'medium' | 'deep')[] = ['light', 'medium', 'deep'];
      return categories.map(cat => {
        const catQuestions = questions.filter(q => q.category === cat);
        return catQuestions[Math.floor(Math.random() * catQuestions.length)];
      }).filter(Boolean);
    }
  }, [mode]);

  // Initial state
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>(() => {
    return questions.filter(q => q.category === 'light').sort(() => Math.random() - 0.5).slice(0, 3);
  });

  // When mode changes, update stack
  const updateStackForMode = useCallback((newMode: StackMode) => {
    setMode(newMode);
    setUsedQuestions(new Set());
    if (newMode.type === 'category') {
      const categoryQuestions = questions.filter(q => q.category === newMode.category);
      const shuffled = [...categoryQuestions].sort(() => Math.random() - 0.5);
      setCurrentQuestions(shuffled.slice(0, 3));
    } else {
      // All categories: one random from each
      const categories: ('light' | 'medium' | 'deep')[] = ['light', 'medium', 'deep'];
      const selected: Question[] = categories.map(cat => {
        const catQuestions = questions.filter(q => q.category === cat);
        return catQuestions[Math.floor(Math.random() * catQuestions.length)];
      }).filter(Boolean);
      setCurrentQuestions(selected);
    }
  }, []);

  // Swiping only works in category mode
  const getRandomQuestion = useCallback((): Question => {
    if (mode.type !== 'category') return questions[0]; // fallback
    const availableQuestions = questions.filter(q => q.category === mode.category && !usedQuestions.has(q.id));
    const categoryQuestions = questions.filter(q => q.category === mode.category);
    if (availableQuestions.length === 0) {
      setUsedQuestions(new Set());
      return categoryQuestions[Math.floor(Math.random() * categoryQuestions.length)];
    }
    return availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
  }, [usedQuestions, mode]);

  const swipeCard = useCallback(() => {
    if (mode.type !== 'category') return; // Only allow swipe in category mode
    setCurrentQuestions(prev => {
      const newQuestions = [...prev];
      const topQuestion = newQuestions.shift();
      if (topQuestion) {
        setUsedQuestions(prev => new Set([...prev, topQuestion.id]));
      }
      const newQuestion = getRandomQuestion();
      newQuestions.push(newQuestion);
      return newQuestions;
    });
  }, [getRandomQuestion, mode]);

  return {
    currentQuestions,
    swipeCard,
    mode,
    setMode: updateStackForMode,
  };
};