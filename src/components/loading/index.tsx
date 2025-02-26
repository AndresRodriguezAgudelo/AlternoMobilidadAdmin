import React from 'react';
import './styled.css';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export const Loading: React.FC<LoadingProps> = ({ 
  size = 'medium',
  color = 'var(--blue-500)'
}) => {
  return (
    <div className={`loading-container ${size}`}>
      <div 
        className="loading-spinner"
        style={{ borderColor: color }}
      />
      <div 
        className="loading-spinner inner"
        style={{ borderColor: color }}
      />
    </div>
  );
};
