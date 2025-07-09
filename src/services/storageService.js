class StorageService {
  constructor() {
    this.STORAGE_KEYS = {
      USER: 'wordwise_user',
      WORDS: 'wordwise_words_',
      CATEGORIES: 'wordwise_categories_',
      SETTINGS: 'wordwise_settings_'
    };
  }

  // User management
  saveUser(userData) {
    try {
      localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(userData));
    } catch (error) {
      console.error('Failed to save user data:', error);
    }
  }

  getUser() {
    try {
      const userData = localStorage.getItem(this.STORAGE_KEYS.USER);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Failed to get user data:', error);
      return null;
    }
  }

  clearUser() {
    try {
      localStorage.removeItem(this.STORAGE_KEYS.USER);
    } catch (error) {
      console.error('Failed to clear user data:', error);
    }
  }

  // Words management
  saveWords(userEmail, words) {
    try {
      const key = this.STORAGE_KEYS.WORDS + this.hashEmail(userEmail);
      localStorage.setItem(key, JSON.stringify(words));
    } catch (error) {
      console.error('Failed to save words:', error);
    }
  }

  getSavedWords(userEmail) {
    try {
      const key = this.STORAGE_KEYS.WORDS + this.hashEmail(userEmail);
      const words = localStorage.getItem(key);
      return words ? JSON.parse(words) : [];
    } catch (error) {
      console.error('Failed to get saved words:', error);
      return [];
    }
  }

  // Categories management
  saveCategories(userEmail, categories) {
    try {
      const key = this.STORAGE_KEYS.CATEGORIES + this.hashEmail(userEmail);
      localStorage.setItem(key, JSON.stringify(categories));
    } catch (error) {
      console.error('Failed to save categories:', error);
    }
  }

  getCategories(userEmail) {
    try {
      const key = this.STORAGE_KEYS.CATEGORIES + this.hashEmail(userEmail);
      const categories = localStorage.getItem(key);
      return categories ? JSON.parse(categories) : {};
    } catch (error) {
      console.error('Failed to get categories:', error);
      return {};
    }
  }

  // Settings management
  saveSettings(userEmail, settings) {
    try {
      const key = this.STORAGE_KEYS.SETTINGS + this.hashEmail(userEmail);
      localStorage.setItem(key, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }

  getSettings(userEmail) {
    try {
      const key = this.STORAGE_KEYS.SETTINGS + this.hashEmail(userEmail);
      const settings = localStorage.getItem(key);
      return settings ? JSON.parse(settings) : this.getDefaultSettings();
    } catch (error) {
      console.error('Failed to get settings:', error);
      return this.getDefaultSettings();
    }
  }

  getDefaultSettings() {
    return {
      theme: 'light',
      reviewMode: 'flashcard',
      dailyGoal: 10,
      notifications: true,
      autoPlay: false
    };
  }

  // Export/Import functionality
  exportUserData(userEmail) {
    try {
      const words = this.getSavedWords(userEmail);
      const categories = this.getCategories(userEmail);
      const settings = this.getSettings(userEmail);
      
      return {
        version: '1.0',
        exportDate: new Date().toISOString(),
        userEmail: userEmail,
        words: words,
        categories: categories,
        settings: settings
      };
    } catch (error) {
      console.error('Failed to export user data:', error);
      return null;
    }
  }

  importUserData(userEmail, data) {
    try {
      if (data.version !== '1.0') {
        throw new Error('Unsupported data version');
      }

      this.saveWords(userEmail, data.words || []);
      this.saveCategories(userEmail, data.categories || {});
      this.saveSettings(userEmail, data.settings || this.getDefaultSettings());
      
      return true;
    } catch (error) {
      console.error('Failed to import user data:', error);
      return false;
    }
  }

  // Utility methods
  hashEmail(email) {
    // Simple hash function for email to create unique storage keys
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
      const char = email.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString();
  }

  // Storage cleanup
  clearAllUserData(userEmail) {
    try {
      const emailHash = this.hashEmail(userEmail);
      const keys = [
        this.STORAGE_KEYS.WORDS + emailHash,
        this.STORAGE_KEYS.CATEGORIES + emailHash,
        this.STORAGE_KEYS.SETTINGS + emailHash
      ];
      
      keys.forEach(key => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error('Failed to clear user data:', error);
      return false;
    }
  }

  // Get storage usage info
  getStorageInfo() {
    try {
      let totalSize = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key) && key.startsWith('wordwise_')) {
          totalSize += localStorage[key].length;
        }
      }
      
      return {
        totalSize: totalSize,
        availableSize: 5 * 1024 * 1024 - totalSize, // Assume 5MB limit
        itemCount: Object.keys(localStorage).filter(key => key.startsWith('wordwise_')).length
      };
    } catch (error) {
      console.error('Failed to get storage info:', error);
      return { totalSize: 0, availableSize: 0, itemCount: 0 };
    }
  }
}

export const storageService = new StorageService();