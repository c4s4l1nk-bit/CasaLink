/**
 * FirebaseService
 * Handles all Firebase operations (Firestore, Auth)
 * Provides a clean abstraction over Firebase SDK
 */
class FirebaseService {
  constructor(config) {
    this.config = config;
    this.db = null;
    this.auth = null;
    this.app = null;
    this.init();
  }

  /**
   * Initialize Firebase
   */
  init() {
    try {
      if (!firebase) {
        console.error('Firebase SDK not loaded');
        return;
      }

      // Check if already initialized
      if (firebase.apps.length === 0) {
        this.app = firebase.initializeApp(this.config);
      } else {
        this.app = firebase.app();
      }

      this.auth = firebase.auth();
      this.db = firebase.firestore();

      // Set persistence
      this.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .catch(err => console.warn('Persistence error:', err));

      console.log('✅ Firebase initialized successfully');
    } catch (error) {
      console.error('❌ Firebase initialization error:', error);
    }
  }

  /**
   * Get Firestore instance
   * @returns {firebase.firestore.Firestore}
   */
  getDb() {
    return this.db;
  }

  /**
   * Get Auth instance
   * @returns {firebase.auth.Auth}
   */
  getAuth() {
    return this.auth;
  }

  /**
   * CREATE - Add document to collection
   * @param {string} collection - Collection name
   * @param {object} data - Document data
   * @returns {Promise<string>} - Document ID
   */
  async create(collection, data) {
    try {
      const docRef = await this.db.collection(collection).add(data);
      console.log(`✅ Created ${collection}:`, docRef.id);
      return docRef.id;
    } catch (error) {
      console.error(`❌ Error creating ${collection}:`, error);
      throw error;
    }
  }

  /**
   * READ - Get single document
   * @param {string} collection - Collection name
   * @param {string} docId - Document ID
   * @returns {Promise<DocumentSnapshot>}
   */
  async read(collection, docId) {
    try {
      const doc = await this.db.collection(collection).doc(docId).get();
      if (doc.exists) {
        return doc;
      } else {
        console.warn(`Document not found: ${collection}/${docId}`);
        return null;
      }
    } catch (error) {
      console.error(`❌ Error reading ${collection}/${docId}:`, error);
      throw error;
    }
  }

  /**
   * UPDATE - Update document
   * @param {string} collection - Collection name
   * @param {string} docId - Document ID
   * @param {object} data - Data to update
   * @returns {Promise<void>}
   */
  async update(collection, docId, data) {
    try {
      await this.db.collection(collection).doc(docId).update({
        ...data,
        updatedAt: new Date()
      });
      console.log(`✅ Updated ${collection}/${docId}`);
    } catch (error) {
      console.error(`❌ Error updating ${collection}/${docId}:`, error);
      throw error;
    }
  }

  /**
   * DELETE - Delete document
   * @param {string} collection - Collection name
   * @param {string} docId - Document ID
   * @returns {Promise<void>}
   */
  async delete(collection, docId) {
    try {
      await this.db.collection(collection).doc(docId).delete();
      console.log(`✅ Deleted ${collection}/${docId}`);
    } catch (error) {
      console.error(`❌ Error deleting ${collection}/${docId}:`, error);
      throw error;
    }
  }

  /**
   * QUERY - Query collection
   * @param {string} collection - Collection name
   * @param {array} conditions - Array of [field, operator, value]
   * @param {object} options - { orderBy, limit, startAfter }
   * @returns {Promise<QuerySnapshot>}
   */
  async query(collection, conditions = [], options = {}) {
    try {
      let query = this.db.collection(collection);

      // Apply conditions
      if (conditions && conditions.length > 0) {
        conditions.forEach(([field, operator, value]) => {
          query = query.where(field, operator, value);
        });
      }

      // Apply ordering
      if (options.orderBy) {
        query = query.orderBy(options.orderBy.field, options.orderBy.direction || 'asc');
      }

      // Apply limit
      if (options.limit) {
        query = query.limit(options.limit);
      }

      const snapshot = await query.get();
      return snapshot;
    } catch (error) {
      console.error(`❌ Error querying ${collection}:`, error);
      throw error;
    }
  }

  /**
   * LISTEN - Real-time listener for collection
   * @param {string} collection - Collection name
   * @param {array} conditions - Query conditions
   * @param {function} callback - Called with snapshot
   * @returns {function} - Unsubscribe function
   */
  listen(collection, conditions = [], callback) {
    try {
      let query = this.db.collection(collection);

      if (conditions && conditions.length > 0) {
        conditions.forEach(([field, operator, value]) => {
          query = query.where(field, operator, value);
        });
      }

      const unsubscribe = query.onSnapshot(callback, error => {
        console.error(`❌ Error listening to ${collection}:`, error);
      });

      return unsubscribe;
    } catch (error) {
      console.error(`❌ Error setting up listener for ${collection}:`, error);
      throw error;
    }
  }

  /**
   * BATCH - Execute multiple writes
   * @param {function} operations - Function that receives batch
   * @returns {Promise<void>}
   */
  async batch(operations) {
    try {
      const batch = this.db.batch();
      await operations(batch);
      await batch.commit();
      console.log('✅ Batch operation completed');
    } catch (error) {
      console.error('❌ Batch operation failed:', error);
      throw error;
    }
  }

  /**
   * Get authentication state
   * @param {function} callback - Called when auth state changes
   * @returns {function} - Unsubscribe function
   */
  onAuthStateChanged(callback) {
    return this.auth.onAuthStateChanged(callback);
  }

  /**
   * Sign up with email and password
   * @param {string} email
   * @param {string} password
   * @returns {Promise<UserCredential>}
   */
  async signUp(email, password) {
    try {
      return await this.auth.createUserWithEmailAndPassword(email, password);
    } catch (error) {
      console.error('❌ Sign up error:', error);
      throw error;
    }
  }

  /**
   * Sign in with email and password
   * @param {string} email
   * @param {string} password
   * @returns {Promise<UserCredential>}
   */
  async signIn(email, password) {
    try {
      return await this.auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error('❌ Sign in error:', error);
      throw error;
    }
  }

  /**
   * Sign out
   * @returns {Promise<void>}
   */
  async signOut() {
    try {
      await this.auth.signOut();
      console.log('✅ Signed out');
    } catch (error) {
      console.error('❌ Sign out error:', error);
      throw error;
    }
  }

  /**
   * Get current user
   * @returns {firebase.User | null}
   */
  getCurrentUser() {
    return this.auth.currentUser;
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FirebaseService;
}
