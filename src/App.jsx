import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import useTelegramAuth from './hooks/useTelegramAuth';
import telegramService from './services/telegram';
import './App.css';

function App() {
  const { isAuthenticating, authError } = useTelegramAuth();
  
  useEffect(() => {
    // Apply Telegram theme on mount
    if (telegramService.isTelegram()) {
      telegramService.applyTheme();
      
      // Disable pull-to-refresh on mobile
      document.body.style.overscrollBehavior = 'none';
      
      // Set app height for mobile
      const setAppHeight = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      };
      
      setAppHeight();
      window.addEventListener('resize', setAppHeight);
      
      return () => window.removeEventListener('resize', setAppHeight);
    }
  }, []);

  if (isAuthenticating) {
    return (
      <div className="telegram-loading">
        <div className="spinner"></div>
        <p>Connecting to Telegram...</p>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="telegram-error">
        <h2>⚠️ Connection Error</h2>
        <p>{authError}</p>
        <button onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="telegram-app">
      {/* Your app content here */}
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
