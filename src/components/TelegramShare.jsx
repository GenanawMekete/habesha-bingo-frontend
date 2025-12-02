import React from 'react';
import telegramService from '../services/telegram';

const TelegramShare = ({ gameId, gameName }) => {
  const handleShare = () => {
    const link = `${window.location.origin}/game/${gameId}`;
    const text = `Join my BINGO game "${gameName}"! Let's play together!`;
    
    telegramService.shareURL(link, text);
    
    // Haptic feedback
    telegramService.hapticFeedback('impact', 'medium');
  };
  
  return (
    <button 
      className="tg-share-button"
      onClick={handleShare}
    >
      <span>📤</span>
      Invite Friends
    </button>
  );
};

export default TelegramShare;
