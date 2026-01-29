/**
 * Utility Functions & Helpers
 * Common helper functions used across the application
 */

class AppHelpers {
  /**
   * Generate a unique ID
   * @returns {string}
   */
  static generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Delay execution (for async operations)
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise<void>}
   */
  static delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Debounce function
   * @param {function} func
   * @param {number} wait - Wait time in ms
   * @returns {function}
   */
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Throttle function
   * @param {function} func
   * @param {number} limit - Limit in ms
   * @returns {function}
   */
  static throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Deep clone object
   * @param {object} obj
   * @returns {object}
   */
  static deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Check if object is empty
   * @param {object} obj
   * @returns {boolean}
   */
  static isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  /**
   * Merge objects
   * @param {object} target
   * @param {object} source
   * @returns {object}
   */
  static merge(target, source) {
    return { ...target, ...source };
  }

  /**
   * Get query parameter from URL
   * @param {string} param - Parameter name
   * @returns {string | null}
   */
  static getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  /**
   * Check if string is valid email
   * @param {string} email
   * @returns {boolean}
   */
  static isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  /**
   * Check if string is valid phone
   * @param {string} phone
   * @returns {boolean}
   */
  static isValidPhone(phone) {
    const regex = /^\d{10,}$/;
    return regex.test(phone.replace(/\D/g, ''));
  }

  /**
   * Capitalize string
   * @param {string} str
   * @returns {string}
   */
  static capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Convert camelCase to Title Case
   * @param {string} str
   * @returns {string}
   */
  static camelToTitle(str) {
    return str
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  /**
   * Log with timestamp
   * @param {string} message
   * @param {string} level - 'info', 'warn', 'error', 'success'
   */
  static log(message, level = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = {
      'info': 'ℹ️',
      'warn': '⚠️',
      'error': '❌',
      'success': '✅'
    }[level] || '📝';

    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  /**
   * Show toast notification
   * @param {string} message
   * @param {string} type - 'success', 'error', 'info', 'warning'
   * @param {number} duration - Duration in ms
   */
  static showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 12px 20px;
      background: ${this.getToastColor(type)};
      color: white;
      border-radius: 4px;
      z-index: 10000;
      font-size: 14px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  /**
   * Get toast color based on type
   * @param {string} type
   * @returns {string}
   */
  static getToastColor(type) {
    const colors = {
      'success': '#10b981',
      'error': '#ef4444',
      'info': '#3b82f6',
      'warning': '#f59e0b'
    };
    return colors[type] || colors.info;
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AppHelpers;
}
