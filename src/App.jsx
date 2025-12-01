import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import useTelegram from './hooks/useTelegram';
import useGameStore from './store/gameStore';
import { initWebSocket } from './services/websocket';

// Components
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import GameRoom from './pages/Game/GameRoom';
import Dashboard from './pages/Dashboard/Dashboard';
import LoadingScreen from './components/Animations/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

// Styles
import './styles/main.scss';

function App() {
  const { initTelegram, user, isTelegramReady } = useTelegram();
  const { isLoading, error, initializeGame } = useGameStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        // Initialize Telegram
        await initTelegram();
        
        // Initialize game store
        await initializeGame();
        
        // Connect WebSocket
        await initWebSocket();
        
        setIsInitialized(true);
        
        // Vibration effect for Telegram
        if (window.Telegram?.WebApp?.HapticFeedback) {
          window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        }
      } catch (err) {
        console.error('Initialization error:', err);
      }
    };

    init();
  }, []);

  if (isLoading && !isInitialized) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>⚠️ Connection Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="app-container">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="app-content"
            >
              <Navbar user={user} />
              
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/game/:roomId" element={<GameRoom />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </main>
              
              <footer className="app-footer">
                <p>🎯 Telegram BINGO © {new Date().getFullYear()}</p>
                <p>Play responsibly | Contact: support@bingogame.com</p>
              </footer>
            </motion.div>
          </AnimatePresence>
          
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1e293b',
                color: '#fff',
                borderRadius: '10px',
                border: '1px solid #334155',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
