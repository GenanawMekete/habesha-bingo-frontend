class TelegramService {
  constructor() {
    this.webApp = null;
    this.user = null;
    this.isReady = false;
    this.initData = null;
  }

  // Initialize Telegram WebApp
  init() {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      this.webApp = window.Telegram.WebApp;
      
      // Expand the app
      this.webApp.expand();
      
      // Set theme params
      this.applyTheme();
      
      // Mark as ready
      this.webApp.ready();
      
      // Get init data
      this.initData = this.webApp.initData;
      this.initDataUnsafe = this.webApp.initDataUnsafe;
      this.user = this.webApp.initDataUnsafe?.user;
      
      this.isReady = true;
      
      console.log('Telegram WebApp initialized:', {
        user: this.user,
        platform: this.webApp.platform,
        version: this.webApp.version
      });
      
      // Listen for theme changes
      this.webApp.onEvent('themeChanged', this.applyTheme.bind(this));
      
      // Listen for viewport changes
      this.webApp.onEvent('viewportChanged', (isStateStable) => {
        console.log('Viewport changed, stable:', isStateStable);
      });
      
      return true;
    }
    
    console.log('Not running in Telegram WebApp');
    return false;
  }

  // Apply Telegram theme
  applyTheme() {
    if (!this.webApp) return;
    
    const theme = this.webApp.themeParams;
    
    // Apply theme to CSS variables
    document.documentElement.style.setProperty('--tg-bg-color', theme.bg_color || '#212121');
    document.documentElement.style.setProperty('--tg-text-color', theme.text_color || '#ffffff');
    document.documentElement.style.setProperty('--tg-hint-color', theme.hint_color || '#aaaaaa');
    document.documentElement.style.setProperty('--tg-link-color', theme.link_color || '#8774e1');
    document.documentElement.style.setProperty('--tg-button-color', theme.button_color || '#8774e1');
    document.documentElement.style.setProperty('--tg-button-text-color', theme.button_text_color || '#ffffff');
    
    // Apply background color
    document.body.style.backgroundColor = theme.bg_color || '#212121';
    document.body.style.color = theme.text_color || '#ffffff';
  }

  // Get Telegram user data
  getUser() {
    return this.user;
  }

  // Get init data for backend verification
  getInitData() {
    return this.initData;
  }

  // Check if running in Telegram
  isTelegram() {
    return this.isReady;
  }

  // Haptic feedback
  hapticFeedback(type = 'impact', style = 'light') {
    if (!this.webApp?.HapticFeedback) return;
    
    switch (type) {
      case 'impact':
        this.webApp.HapticFeedback.impactOccurred(style);
        break;
      case 'notification':
        this.webApp.HapticFeedback.notificationOccurred(style);
        break;
      case 'selection':
        this.webApp.HapticFeedback.selectionChanged();
        break;
    }
  }

  // Show alert
  showAlert(message) {
    if (this.webApp?.showAlert) {
      this.webApp.showAlert(message);
    } else {
      alert(message);
    }
  }

  // Show confirm dialog
  showConfirm(message) {
    if (this.webApp?.showConfirm) {
      return new Promise((resolve) => {
        this.webApp.showConfirm(message, (confirmed) => {
          resolve(confirmed);
        });
      });
    }
    return Promise.resolve(confirm(message));
  }

  // Share URL
  shareURL(url, text) {
    if (this.webApp?.shareURL) {
      this.webApp.shareURL(url, text);
    } else if (navigator.share) {
      navigator.share({ url, text });
    } else {
      navigator.clipboard.writeText(url);
      this.showAlert('Link copied to clipboard!');
    }
  }

  // Close WebApp
  close() {
    if (this.webApp?.close) {
      this.webApp.close();
    }
  }

  // Enable/disable closing confirmation
  enableClosingConfirmation() {
    if (this.webApp?.enableClosingConfirmation) {
      this.webApp.enableClosingConfirmation();
    }
  }

  disableClosingConfirmation() {
    if (this.webApp?.disableClosingConfirmation) {
      this.webApp.disableClosingConfirmation();
    }
  }

  // Get platform info
  getPlatform() {
    return this.webApp?.platform || 'unknown';
  }

  // Check if app is expanded
  isExpanded() {
    return this.webApp?.isExpanded || false;
  }

  // Get viewport height
  getViewportHeight() {
    return this.webApp?.viewportHeight || window.innerHeight;
  }

  // Set background color
  setBackgroundColor(color) {
    if (this.webApp?.setBackgroundColor) {
      this.webApp.setBackgroundColor(color);
    }
  }

  // Set header color
  setHeaderColor(color) {
    if (this.webApp?.setHeaderColor) {
      this.webApp.setHeaderColor(color);
    }
  }
}

// Export singleton instance
const telegramService = new TelegramService();
export default telegramService;
