/**
 * Constants
 * Application-wide constants and configuration values
 */

const AppConstants = {
  // Application Info
  APP_NAME: 'CasaLink',
  APP_VERSION: '1.0.0',
  
  // User Roles
  ROLES: {
    ADMIN: 'admin',
    LANDLORD: 'landlord',
    TENANT: 'tenant'
  },

  // Property Types
  PROPERTY_TYPES: [
    'apartment',
    'house',
    'condo',
    'townhouse',
    'multi-family',
    'commercial'
  ],

  // Unit Status
  UNIT_STATUS: {
    VACANT: 'vacant',
    OCCUPIED: 'occupied',
    MAINTENANCE: 'maintenance'
  },

  // Lease Status
  LEASE_STATUS: {
    ACTIVE: 'active',
    ENDED: 'ended',
    PENDING: 'pending'
  },

  // Bill Status
  BILL_STATUS: {
    PENDING: 'pending',
    PAID: 'paid',
    OVERDUE: 'overdue',
    PARTIAL: 'partial',
    CANCELLED: 'cancelled'
  },

  // Payment Methods
  PAYMENT_METHODS: [
    'bank-transfer',
    'credit-card',
    'debit-card',
    'check',
    'cash',
    'other'
  ],

  // Maintenance Priority
  MAINTENANCE_PRIORITY: {
    LOW: 'low',
    NORMAL: 'normal',
    HIGH: 'high',
    EMERGENCY: 'emergency'
  },

  // Maintenance Category
  MAINTENANCE_CATEGORY: [
    'plumbing',
    'electrical',
    'structural',
    'hvac',
    'appliance',
    'general',
    'landscaping',
    'other'
  ],

  // Maintenance Status
  MAINTENANCE_STATUS: {
    OPEN: 'open',
    ASSIGNED: 'assigned',
    IN_PROGRESS: 'in-progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
  },

  // Validation Rules
  VALIDATION: {
    MIN_PASSWORD_LENGTH: 6,
    MIN_NAME_LENGTH: 2,
    MAX_NAME_LENGTH: 100,
    MIN_PHONE_LENGTH: 10,
    MAX_DESCRIPTION_LENGTH: 5000
  },

  // Late Fee Configuration
  LATE_FEE: {
    PERCENTAGE: 0.10, // 10% of rent
    FLAT_AMOUNT: 50,
    USE_PERCENTAGE: true
  },

  // Number of Days before rent due is late
  LATE_THRESHOLD_DAYS: 5,

  // Date Formats
  DATE_FORMATS: {
    SHORT: 'MM/DD/YY',
    LONG: 'MMMM DD, YYYY',
    FULL: 'dddd, MMMM DD, YYYY'
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    OPTIONS: [10, 25, 50, 100]
  },

  // Local Storage Keys
  STORAGE_KEYS: {
    USER: 'casalink_user',
    ADMIN_SESSION: 'admin_session',
    THEME: 'casalink_theme',
    LANGUAGE: 'casalink_language',
    LAST_PAGE: 'casalink_last_page'
  },

  // API Endpoints (if using REST API)
  API: {
    BASE_URL: 'https://api.casalink.com',
    VERSION: 'v1',
    TIMEOUT: 10000 // 10 seconds
  },

  // Notification Types
  NOTIFICATION_TYPES: {
    RENT_DUE: 'rent_due',
    RENT_OVERDUE: 'rent_overdue',
    MAINTENANCE: 'maintenance',
    MESSAGE: 'message',
    SYSTEM: 'system'
  },

  // Default Values
  DEFAULTS: {
    CURRENCY: 'USD',
    TIMEZONE: 'America/New_York',
    LANGUAGE: 'en',
    THEME: 'light'
  },

  // Error Messages
  ERRORS: {
    VALIDATION_ERROR: 'Please check your input and try again',
    NETWORK_ERROR: 'Network error. Please check your connection',
    AUTH_ERROR: 'Authentication failed. Please log in again',
    PERMISSION_ERROR: 'You do not have permission to perform this action',
    NOT_FOUND: 'Resource not found',
    SERVER_ERROR: 'Server error. Please try again later'
  },

  // Success Messages
  SUCCESS_MESSAGES: {
    CREATED: 'Successfully created',
    UPDATED: 'Successfully updated',
    DELETED: 'Successfully deleted',
    SAVED: 'Successfully saved',
    SENT: 'Successfully sent'
  }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AppConstants;
}
