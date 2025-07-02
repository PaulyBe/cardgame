import React, { useState, useRef, useEffect } from 'react';
import { CardProps } from '../types';
import { Heart, MessageCircle, Sparkles } from 'lucide-react';

const categoryConfig = {
  light: {
    gradient: 'from-blue-400 to-blue-600',
    border: 'border-blue-200',
    icon: MessageCircle,
    label: 'Light & Fun',
  },
  medium: {
    gradient: 'from-purple-400 to-purple-600',
    border: 'border-purple-200',
    icon: Heart,
    label: 'Getting Deeper',
  },
  deep: {
    gradient: 'from-pink-400 to-pink-600',
    border: 'border-pink-200',
    icon: Sparkles,
    label: 'Deep Connection',
  },
};

export const Card: React.FC<CardProps> = ({ question, isTop = false, zIndex, onSwipe }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const config = categoryConfig[question.category];
  const IconComponent = config.icon;

  const handleStart = (clientX: number, clientY: number) => {
    if (!isTop) return;
    setIsDragging(true);
    setStartPos({ x: clientX, y: clientY });
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging || !isTop) return;
    
    const deltaX = clientX - startPos.x;
    const deltaY = clientY - startPos.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleEnd = () => {
    if (!isDragging || !isTop) return;
    
    const threshold = 80;
    const distance = Math.sqrt(dragOffset.x ** 2 + dragOffset.y ** 2);
    
    if (distance > threshold || Math.abs(dragOffset.x) > threshold) {
      onSwipe();
    }
    
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    handleEnd();
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleMove(e.clientX, e.clientY);
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleEnd();
      }
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        e.preventDefault();
        const touch = e.touches[0];
        handleMove(touch.clientX, touch.clientY);
      }
    };

    const handleGlobalTouchEnd = (e: TouchEvent) => {
      if (isDragging) {
        e.preventDefault();
        handleEnd();
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
      document.addEventListener('touchend', handleGlobalTouchEnd, { passive: false });
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchmove', handleGlobalTouchMove);
      document.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, [isDragging]);

  const rotation = isTop ? (dragOffset.x / 8) : 0;
  const scale = isTop ? (isDragging ? 1.02 : 1) : 0.95;
  const translateY = isTop ? 0 : zIndex * 8;
  const opacity = isTop ? 1 : Math.max(0.8, 1 - zIndex * 0.1);

  return (
    <div
      ref={cardRef}
      className={`absolute inset-0 select-none ${isTop ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'}`}
      style={{
        transform: `translate(${dragOffset.x}px, ${dragOffset.y + translateY}px) rotate(${rotation}deg) scale(${scale})`,
        zIndex,
        opacity,
        transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Main card with solid white background */}
      <div className={`w-full h-full bg-white rounded-3xl shadow-2xl border-2 ${config.border} overflow-hidden relative`}>
        
        {/* Header with category */}
        <div className={`h-20 bg-gradient-to-r ${config.gradient} flex items-center justify-center relative overflow-hidden`}>
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative flex items-center gap-3 text-white">
            <IconComponent size={24} />
            <span className="font-semibold text-lg">{config.label}</span>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-2 right-4 w-12 h-12 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-2 left-4 w-8 h-8 bg-white/10 rounded-full blur-lg"></div>
        </div>

        {/* Question content with solid white background */}
        <div className="p-8 h-full flex items-center justify-center bg-white">
          <div className="text-center pb-20">
            <p className="text-2xl leading-relaxed text-gray-800 font-medium">
              {question.text}
            </p>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      </div>
    </div>
  );
};