import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Coins, Trophy, History, Settings, 
  LogOut, Bell, Shield, Crown 
} from 'lucide-react';
import useGameStore from '../../store/gameStore';
import './UserPanel.scss';

const UserPanel = () => {
  const { user, balance, games } = useGameStore();
  const [activeTab, setActiveTab] = useState('overview');
  
  const stats = {
    totalGames: games.length,
    gamesWon: games.filter(g => g.status === 'won').length,
    winRate: games.length > 0 ? 
      Math.round((games.filter(g => g.status === 'won').length / games.length) * 100) : 0,
    totalSpent: games.reduce((sum, game) => sum + game.price, 0),
    totalWon: games.filter(g => g.status === 'won')
      .reduce((sum, game) => sum + game.prize, 0)
  };
  
  const achievements = [
    { id: 'first_win', name: 'First Win', icon: '🏆', unlocked: true },
    { id: 'card_collector', name: 'Card Collector', icon: '🃏', unlocked: true },
    { id: 'bingo_master', name: 'BINGO Master', icon: '👑', unlocked: false },
    { id: 'lucky_streak', name: 'Lucky Streak', icon: '🍀', unlocked: false },
    { id: 'high_roller', name: 'High Roller', icon: '💰', unlocked: false }
  ];
  
  const recentGames = [
    { id: 1, date: '2024-01-15', result: 'Won', prize: 500, cards: 5 },
    { id: 2, date: '2024-01-14', result: 'Lost', prize: 0, cards: 3 },
    { id: 3, date: '2024-01-13', result: 'Won', prize: 250, cards: 2 }
  ];
  
  return (
    <div className="user-panel">
      {/* User Profile Header */}
      <motion.div 
        className="profile-header"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="avatar-container">
          {user?.photoUrl ? (
            <img src={user.photoUrl} alt={user.firstName} className="avatar" />
          ) : (
            <div className="avatar-placeholder">
              <User size={32} />
            </div>
          )}
          <div className="online-indicator"></div>
        </div>
        
        <div className="user-info">
          <h2>{user?.firstName} {user?.lastName}</h2>
          <p className="username">@{user?.username || 'player'}</p>
          
          <div className="user-stats">
            <div className="stat-item">
              <Trophy size={16} />
              <span>Rank: #{stats.winRate || 'N/A'}</span>
            </div>
            <div className="stat-item">
              <Shield size={16} />
              <span>Level: {Math.floor(stats.totalGames / 10) + 1}</span>
            </div>
          </div>
        </div>
        
        <div className="balance-display">
          <Coins size={24} className="coins-icon" />
          <div className="balance-amount">
            <span className="amount">{balance}</span>
            <span className="label">coins</span>
          </div>
          <button className="add-coins-btn">+ Add</button>
        </div>
      </motion.div>
      
      {/* Navigation Tabs */}
      <div className="tabs-container">
        {['overview', 'games', 'achievements', 'settings'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'overview' && <User size={18} />}
            {tab === 'games' && <History size={18} />}
            {tab === 'achievements' && <Trophy size={18} />}
            {tab === 'settings' && <Settings size={18} />}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      
      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="overview-content"
          >
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon total-games">
                  <History size={24} />
                </div>
                <h3>{stats.totalGames}</h3>
                <p>Total Games</p>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon games-won">
                  <Trophy size={24} />
                </div>
                <h3>{stats.gamesWon}</h3>
                <p>Games Won</p>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon win-rate">
                  <Crown size={24} />
                </div>
                <h3>{stats.winRate}%</h3>
                <p>Win Rate</p>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon total-won">
                  <Coins size={24} />
                </div>
                <h3>{stats.totalWon}</h3>
                <p>Total Won</p>
              </div>
            </div>
            
            <div className="recent-activity">
              <h3>Recent Activity</h3>
              <div className="activity-list">
                {recentGames.map(game => (
                  <div key={game.id} className="activity-item">
                    <div className="activity-info">
                      <span className="activity-date">{game.date}</span>
                      <span className="activity-desc">
                        Played {game.cards} cards - {game.result}
                      </span>
                    </div>
                    <div className={`activity-prize ${game.result === 'Won' ? 'won' : 'lost'}`}>
                      {game.result === 'Won' ? `+${game.prize}` : '-'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
        
        {activeTab === 'games' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="games-content"
          >
            <h3>Your Games</h3>
            <div className="games-list">
              {games.map(game => (
                <div key={game.id} className="game-item">
                  <div className="game-info">
                    <h4>{game.name}</h4>
                    <p>Status: <span className={`status ${game.status}`}>{game.status}</span></p>
                    <p>Cards: {game.cards?.length || 0}</p>
                  </div>
                  <div className="game-actions">
                    {game.status === 'active' && (
                      <button className="join-btn">Join</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
        
        {activeTab === 'achievements' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="achievements-content"
          >
            <h3>Achievements</h3>
            <div className="achievements-grid">
              {achievements.map(achievement => (
                <div 
                  key={achievement.id} 
                  className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
                >
                  <div className="achievement-icon">
                    {achievement.icon}
                  </div>
                  <div className="achievement-info">
                    <h4>{achievement.name}</h4>
                    <p>{achievement.unlocked ? 'Unlocked!' : 'Locked'}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
        
        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="settings-content"
          >
            <h3>Settings</h3>
            <div className="settings-list">
              <div className="setting-item">
                <Bell size={20} />
                <div className="setting-info">
                  <h4>Notifications</h4>
                  <p>Get notified about new games</p>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>
              
              <div className="setting-item">
                <Shield size={20} />
                <div className="setting-info">
                  <h4>Privacy</h4>
                  <p>Control your profile visibility</p>
                </div>
                <button className="privacy-btn">Edit</button>
              </div>
              
              <div className="setting-item">
                <Settings size={20} />
                <div className="setting-info">
                  <h4>Preferences</h4>
                  <p>Game preferences and themes</p>
                </div>
                <button className="preferences-btn">Customize</button>
              </div>
            </div>
            
            <button className="logout-btn">
              <LogOut size={18} />
              Log Out
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UserPanel;
