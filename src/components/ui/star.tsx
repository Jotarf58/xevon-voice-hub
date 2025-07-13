import React from 'react';
import { cn } from '@/lib/utils';

interface StarProps {
  className?: string;
  size?: number;
  animated?: boolean;
  glowing?: boolean;
}

export const Star: React.FC<StarProps> = ({ 
  className, 
  size = 40, 
  animated = false, 
  glowing = false 
}) => {
  return (
    <div 
      className={cn(
        "inline-block",
        animated && "animate-spin-star",
        glowing && "animate-pulse-glow",
        className
      )}
      style={{ width: size, height: size }}
    >
      <svg 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className="w-full h-full text-xevon-red"
      >
        <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" />
      </svg>
    </div>
  );
};