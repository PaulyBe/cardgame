export interface Question {
  id: number;
  text: string;
  category: 'light' | 'medium' | 'deep';
}

export interface CardProps {
  question: Question;
  isTop?: boolean;
  zIndex: number;
  onSwipe: () => void;
}