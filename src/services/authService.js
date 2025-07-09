class AuthService {
  constructor() {
    this.isGoogleAPILoaded = false;
    this.CLIENT_ID = 'your-google-client-id'; // Replace with actual Google OAuth client ID
  }

  // Initialize Google API
  async initGoogleAPI() {
    return new Promise((resolve, reject) => {
      if (this.isGoogleAPILoaded) {
        resolve();
        return;
      }

      // Load Google API script
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        window.gapi.load('auth2', () => {
          window.gapi.auth2.init({
            client_id: this.CLIENT_ID
          }).then(() => {
            this.isGoogleAPILoaded = true;
            resolve();
          }).catch(reject);
        });
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Gmail OAuth login
  async loginWithGmail() {
    try {
      // For development, use mock authentication
      if (process.env.NODE_ENV === 'development' || !this.CLIENT_ID.includes('googleusercontent.com')) {
        return this.mockLogin();
      }

      await this.initGoogleAPI();
      const authInstance = window.gapi.auth2.getAuthInstance();
      const googleUser = await authInstance.signIn();
      
      const profile = googleUser.getBasicProfile();
      return {
        id: profile.getId(),
        name: profile.getName(),
        email: profile.getEmail(),
        picture: profile.getImageUrl(),
        token: googleUser.getAuthResponse().access_token
      };
    } catch (error) {
      console.error('Google login failed:', error);
      // Fallback to mock login
      return this.mockLogin();
    }
  }

  // Mock login for development
  mockLogin() {
    const mockUsers = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@gmail.com',
        picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane.smith@gmail.com',
        picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane'
      }
    ];

    // Return a random mock user
    return mockUsers[Math.floor(Math.random() * mockUsers.length)];
  }

  // Logout
  async logout() {
    try {
      if (this.isGoogleAPILoaded && window.gapi && window.gapi.auth2) {
        const authInstance = window.gapi.auth2.getAuthInstance();
        if (authInstance.isSignedIn.get()) {
          await authInstance.signOut();
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    try {
      if (this.isGoogleAPILoaded && window.gapi && window.gapi.auth2) {
        const authInstance = window.gapi.auth2.getAuthInstance();
        return authInstance.isSignedIn.get();
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  // Get current user
  getCurrentUser() {
    try {
      if (this.isGoogleAPILoaded && window.gapi && window.gapi.auth2) {
        const authInstance = window.gapi.auth2.getAuthInstance();
        if (authInstance.isSignedIn.get()) {
          const googleUser = authInstance.currentUser.get();
          const profile = googleUser.getBasicProfile();
          return {
            id: profile.getId(),
            name: profile.getName(),
            email: profile.getEmail(),
            picture: profile.getImageUrl(),
            token: googleUser.getAuthResponse().access_token
          };
        }
      }
      return null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Refresh token if needed
  async refreshToken() {
    try {
      if (this.isGoogleAPILoaded && window.gapi && window.gapi.auth2) {
        const authInstance = window.gapi.auth2.getAuthInstance();
        if (authInstance.isSignedIn.get()) {
          const googleUser = authInstance.currentUser.get();
          await googleUser.reloadAuthResponse();
          return googleUser.getAuthResponse().access_token;
        }
      }
      return null;
    } catch (error) {
      console.error('Token refresh error:', error);
      return null;
    }
  }
}

export const authService = new AuthService();