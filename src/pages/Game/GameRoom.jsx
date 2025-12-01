import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Clock, Trophy, Volume2, VolumeX, 
  Settings, Share2, Crown, Bell, Zap 
} from 'lucide-react';
import Confetti from 'react-confetti';
import Card from '../../components/GameBoard/Card';
import useGameStore from '../../store/gameStore';
import useGameSocket from '../../hooks/useGameSocket';
import toast from 'react-hot-toast';
import './GameRoom.scss';

const GameRoom = () => {
  const { roomId } = useParams();
  const { currentGame, selectedCards, balance } = useGameStore();
  const { 
    gameState, 
    drawnNumbers, 
    players, 
    timeLeft,
    joinGame,
    drawNumber,
    markNumber,
    leaveGame
  } = useGameSocket(roomId);
  
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeCard, setActiveCard] = useState(0);
  
  useEffect(() => {
    if (roomId) {
      joinGame(roomId);
    }
    
    return () => {
      leaveGame();
    };
  }, [roomId]);
  
  useEffect(() => {
    if (gameState?.winner) {
      if (gameState.winner.userId === 'current-user') {
        setShowConfetti(true);
        toast.success('🎉 You won the game!', {
          duration: 10000,
          style: {
            background: '#f59e0b',
            color: 'white',
          },
        });
        
        // Play victory sound
        if (isSoundOn) {
          playSound('victory');
        }
        
        setTimeout(() => setShowConfetti(false), 10000);
      }
    }
  }, [gameState?.winner]);
  
  const handleDrawNumber = () => {
    if (gameState?.isMyTurn) {
      drawNumber();
    }
  };
  
  const playSound = (soundName) => {
    const audio = new Audio(`/sounds/${soundName}.mp3`);
    audio.volume = 0.3;
    audio.play().catch(console.log);
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const getWinningPatterns = (cardNumbers) => {
    const patterns = [];
    const drawnSet = new Set(drawnNumbers);
    
    // Check rows
    for (let i = 0; i < 5; i++) {
      if (cardNumbers[i].every((num, j) => 
        drawnSet.has(num) || num === 'FREE' || (i === 2 && j === 2)
      )) {
        patterns.push(`row-${i}`);
      }
    }
    
    // Check columns
    for (let j = 0; j < 5; j++) {
      if (cardNumbers.every((row, i) => 
        drawnSet.has(row[j]) || row[j] === 'FREE' || (i === 2 && j === 2)
      )) {
        patterns.push(`col-${j}`);
      }
    }
    
    return patterns;
  };
  
  return (
    <div className="game-room">
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
      
      {/* Game Header */}
      <div className="game-header">
        <div className="header-left">
          <h1>🎯 BINGO Game #{roomId}</h1>
          <div className="game-status">
            <span className={`status-badge ${gameState?.status}`}>
              {gameState?.status || 'Loading...'}
            </span>
            <div className="players-count">
              <Users size={16} />
              <span>{players.length} players</span>
            </div>
          </div>
        </div>
        
        <div className="header-right">
          <div className="game-timer">
            <Clock size={20} />
            <span className="time">{formatTime(timeLeft)}</span>
          </div>
          
          <div className="game-balance">
            <Zap size={20} />
            <span>{balance} coins</span>
          </div>
          
          <div className="game-actions">
            <button 
              className="action-btn sound-btn"
              onClick={() => setIsSoundOn(!isSoundOn)}
            >
              {isSoundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            <button className="action-btn settings-btn">
              <Settings size={20} />
            </button>
            <button className="action-btn share-btn">
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Game Area */}
      <div className="game-main">
        {/* Left Panel - Game Info */}
        <div className="game-sidebar left">
          <div className="sidebar-section players-section">
            <h3><Users size={18} /> Players ({players.length})</h3>
            <div className="players-list">
              {players.map((player, index) => (
                <div key={player.id} className="player-item">
                  <div className="player-rank">
                    {index < 3 ? ['🥇', '🥈', '🥉'][index] : `#${index + 1}`}
                  </div>
                  <div className="player-info">
                    <span className="player-name">{player.name}</span>
                    <span className="player-cards">{player.cards} cards</span>
                  </div>
                  {player.isHost && <Crown size={16} className="host-crown" />}
                </div>
              ))}
            </div>
          </div>
          
          <div className="sidebar-section prize-pool">
            <h3><Trophy size={18} /> Prize Pool</h3>
            <div className="prize-amount">
              <span className="amount">{gameState?.prizePool || 0}</span>
              <span className="currency">coins</span>
            </div>
            <div className="prize-distribution">
              <div className="prize-tier">
                <span className="position">1st</span>
                <span className="percentage">50%</span>
                <span className="prize">{Math.round((gameState?.prizePool || 0) * 0.5)} coins</span>
              </div>
              <div className="prize-tier">
                <span className="position">2nd</span>
                <span className="percentage">30%</span>
                <span className="prize">{Math.round((gameState?.prizePool || 0) * 0.3)} coins</span>
              </div>
              <div className="prize-tier">
                <span className="position">3rd</span>
                <span className="percentage">20%</span>
                <span className="prize">{Math.round((gameState?.prizePool || 0) * 0.2)} coins</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Center Panel - Game Board */}
        <div className="game-center">
          {/* Drawn Numbers */}
          <div className="drawn-numbers-section">
            <h3>Drawn Numbers ({drawnNumbers.length})</h3>
            <div className="drawn-numbers">
              <AnimatePresence>
                {drawnNumbers.map((number, index) => (
                  <motion.div
                    key={index}
                    className="drawn-number"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ 
                      type: 'spring',
                      stiffness: 200,
                      damping: 15,
                      delay: index * 0.05 
                    }}
                  >
                    {number}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            {gameState?.isMyTurn && (
              <motion.button
                className="draw-button"
                onClick={handleDrawNumber}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Zap size={24} />
                Draw Next Number
              </motion.button>
            )}
          </div>
          
          {/* Player Cards */}
          <div className="player-cards-section">
            <h3>Your Cards ({selectedCards.length})</h3>
            {selectedCards.length === 0 ? (
              <div className="no-cards-message">
                <p>You haven't selected any cards for this game!</p>
                <button className="select-cards-btn">
                  Select Cards Now
                </button>
              </div>
            ) : (
              <div className="cards-carousel">
                <button 
                  className="carousel-btn prev"
                  onClick={() => setActiveCard(a => Math.max(0, a - 1))}
                  disabled={activeCard === 0}
                >
                  ←
                </button>
                
                <div className="cards-viewport">
                  <motion.div
                    className="cards-track"
                    animate={{ x: `-${activeCard * 320}px` }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {selectedCards.map((card, index) => (
                      <div key={card.id} className="card-slide">
                        <Card
                          numbers={card.numbers}
                          theme={card.theme}
                          drawnNumbers={drawnNumbers}
                          interactive={false}
                        />
                        <div className="card-stats">
                          <span className="matches">
                            Matches: {getWinningPatterns(card.numbers).length}
                          </span>
                          <span className="card-id">{card.id}</span>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </div>
                
                <button 
                  className="carousel-btn next"
                  onClick={() => setActiveCard(a => 
                    Math.min(selectedCards.length - 1, a + 1)
                  )}
                  disabled={activeCard === selectedCards.length - 1}
                >
                  →
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Panel - Chat & Actions */}
        <div className="game-sidebar right">
          <div className="sidebar-section game-chat">
            <h3>💬 Game Chat</h3>
            <div className="chat-messages">
              {gameState?.chat?.map((msg, index) => (
                <div key={index} className="chat-message">
                  <span className="sender">{msg.sender}:</span>
                  <span className="text">{msg.text}</span>
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input type="text" placeholder="Type a message..." />
              <button className="send-btn">Send</button>
            </div>
          </div>
          
          <div className="sidebar-section quick-actions">
            <h3>⚡ Quick Actions</h3>
            <div className="action-buttons">
              <button className="action-btn primary">
                <Bell size={18} />
                Claim Bonus
              </button>
              <button className="action-btn secondary">
                <Zap size={18} />
                Auto-Mark
              </button>
              <button className="action-btn warning">
                Leave Game
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Game Controls Bottom Bar */}
      <div className="game-controls">
        <div className="control-group">
          <button className="control-btn">
            <span className="icon">🎲</span>
            <span className="label">Auto Play</span>
          </button>
          <button className="control-btn">
            <span className="icon">🎯</span>
            <span className="label">Patterns</span>
          </button>
          <button className="control-btn">
            <span className="icon">📊</span>
            <span className="label">Stats</span>
          </button>
        </div>
        
        <div className="game-progress">
          <div className="progress-bar">
            <motion.div 
              className="progress-fill"
              animate={{ width: `${(drawnNumbers.length / 75) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="progress-text">
            {drawnNumbers.length} / 75 numbers drawn
          </div>
        </div>
        
        <div className="winning-patterns">
          <h4>Active Patterns:</h4>
          <div className="patterns-list">
            {['Standard BINGO', 'Four Corners', 'Full House', 'X Pattern'].map(pattern => (
              <span key={pattern} className="pattern-tag">{pattern}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameRoom;
