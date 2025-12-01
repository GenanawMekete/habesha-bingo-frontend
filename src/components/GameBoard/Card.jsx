import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Star } from 'lucide-react';
import './Card.scss';

const Card = ({ 
  numbers, 
  theme = 'classic', 
  isSelected = false,
  onSelect,
  onDeselect,
  drawnNumbers = [],
  interactive = true 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  const handleClick = () => {
    if (!interactive) return;
    
    if (isSelected) {
      onDeselect?.();
    } else {
      onSelect?.();
    }
    
    // Add haptic feedback for Telegram
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
  };
  
  const columns = ['B', 'I', 'N', 'G', 'O'];
  
  // Check if a number is marked (drawn)
  const isMarked = (number) => {
    if (number === 'FREE') return true;
    return drawnNumbers.includes(number);
  };
  
  // Check for winning patterns
  const checkWinningPatterns = () => {
    const patterns = [];
    
    // Check rows
    for (let i = 0; i < 5; i++) {
      if (numbers[i].every((num, j) => isMarked(num) || (i === 2 && j === 2))) {
        patterns.push(`row-${i}`);
      }
    }
    
    // Check columns
    for (let j = 0; j < 5; j++) {
      if (numbers.every((row, i) => isMarked(row[j]) || (i === 2 && j === 2))) {
        patterns.push(`col-${j}`);
      }
    }
    
    // Check diagonals
    if ([0,1,2,3,4].every(i => isMarked(numbers[i][i]) || i === 2)) {
      patterns.push('diagonal-1');
    }
    
    if ([0,1,2,3,4].every(i => isMarked(numbers[i][4-i]) || i === 2)) {
      patterns.push('diagonal-2');
    }
    
    return patterns;
  };
  
  const winningPatterns = checkWinningPatterns();
  const hasWon = winningPatterns.length > 0;
  
  return (
    <motion.div
      className={`bingo-card ${theme} ${isSelected ? 'selected' : ''} ${hasWon ? 'winning' : ''}`}
      whileHover={interactive ? { scale: 1.05, rotateY: 5 } : {}}
      whileTap={interactive ? { scale: 0.95 } : {}}
      onClick={handleClick}
      initial={{ rotateY: 0 }}
      animate={{ rotateY: isFlipped ? 180 : 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      {/* Front of card */}
      <div className="card-front">
        <div className="card-header">
          <div className="card-title">
            <span className="bingo-text">BINGO</span>
            <span className="theme-badge">{theme}</span>
          </div>
          
          {interactive && (
            <div className="selection-indicator">
              {isSelected ? (
                <motion.div
                  className="selected-icon"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring' }}
                >
                  <Check size={16} />
                </motion.div>
              ) : (
                <div className="select-hint">Click to select</div>
              )}
            </div>
          )}
        </div>
        
        <div className="column-headers">
          {columns.map(letter => (
            <div key={letter} className="column-header">
              {letter}
            </div>
          ))}
        </div>
        
        <div className="numbers-grid">
          {numbers.map((row, rowIndex) => (
            <div key={rowIndex} className="card-row">
              {row.map((number, colIndex) => (
                <motion.div
                  key={`${rowIndex}-${colIndex}`}
                  className={`number-cell ${
                    rowIndex === 2 && colIndex === 2 ? 'free-cell' : ''
                  } ${isMarked(number) ? 'marked' : ''}
                  ${winningPatterns.includes(`row-${rowIndex}`) ? 'winning-row' : ''}
                  ${winningPatterns.includes(`col-${colIndex}`) ? 'winning-col' : ''}
                  ${(winningPatterns.includes('diagonal-1') && rowIndex === colIndex) ||
                    (winningPatterns.includes('diagonal-2') && rowIndex === 4 - colIndex) 
                    ? 'winning-diagonal' : ''}`}
                  whileHover={{ scale: isMarked(number) ? 1.1 : 1 }}
                >
                  {number === 'FREE' ? (
                    <div className="free-text">FREE</div>
                  ) : (
                    <>
                      <span className="number">{number}</span>
                      {isMarked(number) && (
                        <motion.div
                          className="marker"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring' }}
                        />
                      )}
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          ))}
        </div>
        
        {hasWon && (
          <motion.div
            className="winning-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Star className="winning-star" />
            <span className="winning-text">WINNER!</span>
          </motion.div>
        )}
      </div>
      
      {/* Back of card (flipped view) */}
      <div className="card-back">
        <div className="back-content">
          <div className="back-pattern"></div>
          <div className="back-info">
            <h3>BINGO CARD</h3>
            <p>Theme: {theme}</p>
            <p>Numbers: 1-75</p>
            {hasWon && <p className="winner-badge">🎉 WINNING CARD!</p>}
          </div>
          <button 
            className="flip-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsFlipped(!isFlipped);
            }}
          >
            Flip
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Card;
