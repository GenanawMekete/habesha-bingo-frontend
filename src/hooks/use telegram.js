import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const useTelegram = () => {
  const [user, setUser] = useState(null);
  const [isTelegramReady, setIsTelegramReady] = useState(false);
  const [webApp, setWebApp] = useState(null);

  const initTelegram = useCallback(async () => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      setWebApp(tg);

      // Initialize Telegram WebApp
      tg.ready();
      tg.expand();

      // Get user data
      const initData = tg.initDataUnsafe;
      
      if (initData?.user) {
        const tgUser = {
          id: initData.user.id,
          firstName: initData.user.first_name,
          lastName: initData.user.last_name,
          username: initData.user.username,
          photoUrl: initData.user.photo_url,
          isPremium: initData.user.is_premium || false,
          languageCode: initData.user.language_code,
        };
        
        setUser(tgUser);
        
        // Store in localStorage for non-Telegram mode
        localStorage.setItem('tg_user', JSON.stringify(tgUser));
        
        // Send to backend for authentication
        try {
          const response = await fetch('/api/auth/telegram', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              initData: tg.initData,
              user: tgUser
            })
          });
          
          const data = await response.json();
          if (data.success && data.token) {
            localStorage.setItem('token', data.token);
          }
        } catch (error) {
          console.error('Auth error:', error);
        }
      }

      // Set theme colors
      if (tg.themeParams) {
        document.documentElement.style.setProperty(
          '--tg-theme-bg-color',
          tg.themeParams.bg_color || '#212121'
        );
        document.documentElement.style.setProperty(
          '--tg-theme-text-color',
          tg.themeParams.text_color || '#ffffff'
        );
      }

      setIsTelegramReady(true);
      return tg;
    } else {
      // Fallback for non-Telegram environment
      console.log('Running in standalone mode');
      const storedUser = localStorage.getItem('tg_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsTelegramReady(true);
      return null;
    }
  }, []);

  // Telegram-specific functions
  const showAlert = useCallback((message) => {
    if (webApp?.showAlert) {
      webApp.showAlert(message);
    } else {
      alert(message);
    }
  }, [webApp]);

  const showConfirm = useCallback((message) => {
    if (webApp?.showConfirm) {
      return new Promise((resolve) => {
        webApp.showConfirm(message, (confirmed) => {
          resolve(confirmed);
        });
      });
    } else {
      return Promise.resolve(confirm(message));
    }
  }, [webApp]);

  const hapticFeedback = useCallback((type = 'impact', style = 'light') => {
    if (webApp?.HapticFeedback) {
      switch (type) {
        case 'impact':
          webApp.HapticFeedback.impactOccurred(style);
          break;
        case 'notification':
          webApp.HapticFeedback.notificationOccurred(style);
          break;
        case 'selection':
          webApp.HapticFeedback.selectionChanged();
          break;
      }
    }
  }, [webApp]);

  const shareURL = useCallback((url, text) => {
    if (webApp?.shareURL) {
      webApp.shareURL(url, text);
    } else if (navigator.share) {
      navigator.share({ url, text });
    } else {
      toast('Copy this URL to share: ' + url);
      navigator.clipboard.writeText(url);
    }
  }, [webApp]);

  // Handle theme changes
  useEffect(() => {
    if (webApp) {
      const handleThemeChange = () => {
        if (webApp.themeParams) {
          document.documentElement.style.setProperty(
            '--tg-theme-bg-color',
            webApp.themeParams.bg_color
          );
          document.documentElement.style.setProperty(
            '--tg-theme-text-color',
            webApp.themeParams.text_color
          );
        }
      };

      webApp.onEvent('themeChanged', handleThemeChange);
      return () => {
        webApp.offEvent('themeChanged', handleThemeChange);
      };
    }
  }, [webApp]);

  // Handle viewport changes
  useEffect(() => {
    if (webApp) {
      const handleViewportChange = (isExpanded) => {
        if (isExpanded) {
          document.body.classList.add('tg-expanded');
        } else {
          document.body.classList.remove('tg-expanded');
        }
      };

      webApp.onEvent('viewportChanged', handleViewportChange);
      return () => {
        webApp.offEvent('viewportChanged', handleViewportChange);
      };
    }
  }, [webApp]);

  return {
    webApp,
    user,
    isTelegramReady,
    initTelegram,
    showAlert,
    showConfirm,
    hapticFeedback,
    shareURL,
  };
};

export default useTelegram;
