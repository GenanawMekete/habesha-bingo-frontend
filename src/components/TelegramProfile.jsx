import React from 'react';
import telegramService from '../services/telegram';
import useGameStore from '../store/gameStore';

const TelegramProfile = () => {
  const { user } = useGameStore();
  const isTelegram = telegramService.isTelegram();
  
  if (!isTelegram || !user) return null;
  
  return (
    <div className="telegram-profile">
      {user.photoUrl ? (
        <img 
          src={user.photoUrl} 
          alt={user.firstName}
          className="profile-photo"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}
      
      {!user.photoUrl && (
        <div className="profile-initials">
          {user.firstName?.[0]}{user.lastName?.[0]}
        </div>
      )}
      
      <div className="profile-info">
        <div className="profile-name">
          {user.firstName} {user.lastName}
        </div>
        {user.username && (
          <div className="profile-username">
            @{user.username}
          </div>
        )}
        {user.isPremium && (
          <div className="profile-premium">
            ⭐ Premium
          </div>
        )}
      </div>
    </div>
  );
};

export default TelegramProfile;
