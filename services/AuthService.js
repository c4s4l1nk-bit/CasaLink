/**
 * AuthService
 * Handles authentication logic and user management
 * Uses FirebaseService for actual Firebase operations
 */
class AuthService {
  constructor(firebaseService) {
    this.firebaseService = firebaseService;
  }

  /**
   * Register new user
   * @param {string} email
   * @param {string} password
   * @param {object} userData - Additional user data (name, role, etc)
   * @returns {Promise<User>}
   */
  async register(email, password, userData) {
    try {
      // Create Firebase auth user
      const result = await this.firebaseService.signUp(email, password);
      const firebaseUser = result.user;

      // Create user document in Firestore
      const user = new User({
        id: firebaseUser.uid,
        email: email,
        ...userData
      });

      if (!user.isValid()) {
        throw new Error('Invalid user data: ' + user.getValidationErrors().join(', '));
      }

      // Store in Firestore
      await this.firebaseService.update('users', firebaseUser.uid, user.toJSON());

      console.log('✅ User registered:', email);
      return user;
    } catch (error) {
      console.error('❌ Registration error:', error);
      throw error;
    }
  }

  /**
   * Login user
   * @param {string} email
   * @param {string} password
   * @returns {Promise<User>}
   */
  async login(email, password) {
    try {
      const result = await this.firebaseService.signIn(email, password);
      const firebaseUser = result.user;

      // Get user data from Firestore
      const userDoc = await this.firebaseService.read('users', firebaseUser.uid);
      
      if (!userDoc) {
        throw new Error('User record not found');
      }

      const userData = userDoc.data();
      const user = new User({
        id: firebaseUser.uid,
        email: firebaseUser.email,
        ...userData
      });

      console.log('✅ User logged in:', email);
      return user;
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  }

  /**
   * Logout user
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      await this.firebaseService.signOut();
      console.log('✅ User logged out');
    } catch (error) {
      console.error('❌ Logout error:', error);
      throw error;
    }
  }

  /**
   * Get current user
   * @returns {User | null}
   */
  getCurrentUser() {
    const firebaseUser = this.firebaseService.getCurrentUser();
    if (!firebaseUser) return null;

    // This would need to be filled from Firestore
    return new User({
      id: firebaseUser.uid,
      email: firebaseUser.email
    });
  }

  /**
   * Update user profile
   * @param {string} userId
   * @param {object} updates
   * @returns {Promise<User>}
   */
  async updateProfile(userId, updates) {
    try {
      const user = new User(updates);
      const errors = user.getValidationErrors();
      
      if (errors.length > 0) {
        throw new Error('Validation failed: ' + errors.join(', '));
      }

      await this.firebaseService.update('users', userId, updates);
      
      console.log('✅ Profile updated:', userId);
      return user;
    } catch (error) {
      console.error('❌ Profile update error:', error);
      throw error;
    }
  }

  /**
   * Change password
   * @param {string} currentPassword
   * @param {string} newPassword
   * @returns {Promise<void>}
   */
  async changePassword(currentPassword, newPassword) {
    try {
      const user = this.firebaseService.getCurrentUser();
      if (!user || !user.email) {
        throw new Error('No user logged in');
      }

      // Re-authenticate user
      const credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      await user.reauthenticateWithCredential(credential);

      // Update password
      await user.updatePassword(newPassword);

      console.log('✅ Password changed');
    } catch (error) {
      console.error('❌ Password change error:', error);
      throw error;
    }
  }

  /**
   * Reset password (send email)
   * @param {string} email
   * @returns {Promise<void>}
   */
  async resetPassword(email) {
    try {
      await this.firebaseService.getAuth().sendPasswordResetEmail(email);
      console.log('✅ Password reset email sent:', email);
    } catch (error) {
      console.error('❌ Password reset error:', error);
      throw error;
    }
  }

  /**
   * Check if user is admin
   * @param {string} userId
   * @returns {Promise<boolean>}
   */
  async isAdmin(userId) {
    try {
      const userDoc = await this.firebaseService.read('users', userId);
      if (!userDoc) return false;
      
      const userData = userDoc.data();
      return userData.role === 'admin';
    } catch (error) {
      console.error('❌ Error checking admin status:', error);
      return false;
    }
  }

  /**
   * Get error message for Firebase error code
   * @param {string} errorCode
   * @returns {string}
   */
  getErrorMessage(errorCode) {
    const messages = {
      'auth/email-already-in-use': 'Email is already registered',
      'auth/invalid-email': 'Invalid email address',
      'auth/operation-not-allowed': 'Operation not allowed',
      'auth/weak-password': 'Password is too weak',
      'auth/user-not-found': 'User not found',
      'auth/wrong-password': 'Incorrect password',
      'auth/too-many-requests': 'Too many login attempts. Please try again later.',
      'auth/account-exists-with-different-credential': 'Account already exists with different credentials'
    };
    return messages[errorCode] || 'An authentication error occurred';
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AuthService;
}
