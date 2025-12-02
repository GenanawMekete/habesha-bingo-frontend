import { useEffect, useState } from 'react';
import api from '../services/api';
import telegramService from '../services/telegram';
import useGameStore from '../store/gameStore';

const useTelegramAuth = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState(null);
  const { setUser, setBalance, setTelegramData } = useGameStore();

  useEffect(() => {
    const authenticateWithTelegram = async () => {
      // Check if running in Telegram
      const isTelegram = telegramService.init();
      
      if (!isTelegram) {
        console.log('Running in browser mode');
        // Load user from localStorage for testing
        const savedUser = localStorage.getItem('bingo_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
        return;
      }

      // Get Telegram init data
      const initData = telegramService.getInitData();
      const telegramUser = telegramService.getUser();

      if (!initData || !telegramUser) {
        setAuthError('No Telegram user data found');
        return;
      }

      setIsAuthenticating(true);

      try {
        // Send to backend for verification
        const response = await api.post('/telegram/auth', { initData });
        
        if (response.data.success) {
          const { token, user } = response.data;
          
          // Store token
          localStorage.setItem('token', token);
          
          // Update store
          setUser(user);
          setBalance(user.coins);
          setTelegramData({
            webApp: telegramService.webApp,
            platform: telegramService.getPlatform(),
            theme: telegramService.webApp.themeParams
          });
          
          // Store user data
          localStorage.setItem('bingo_user', JSON.stringify(user));
          
          console.log('Telegram authentication successful:', user);
          
          // Haptic feedback for success
          telegramService.hapticFeedback('notification', 'success');
        } else {
          throw new Error(response.data.message || 'Authentication failed');
        }
      } catch (error) {
        console.error('Telegram auth error:', error);
        setAuthError(error.message);
        
        // Show error to user
        telegramService.showAlert(`Authentication failed: ${error.message}`);
      } finally {
        setIsAuthenticating(false);
      }
    };

    authenticateWithTelegram();
  }, [setUser, setBalance, setTelegramData]);

  return { isAuthenticating, authError };
};

export default useTelegramAuth;
