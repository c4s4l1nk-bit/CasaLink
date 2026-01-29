/**
 * User Model
 * Represents a user in the CasaLink system
 * Roles: 'landlord', 'tenant', 'admin'
 */
class User {
  constructor(data = {}) {
    this.id = data.id || null;
    this.email = data.email || '';
    this.name = data.name || '';
    this.phone = data.phone || '';
    this.role = data.role || 'tenant'; // landlord, tenant, admin
    this.profileImage = data.profileImage || null;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.isActive = data.isActive !== false;
    this.metadata = data.metadata || {};
  }

  /**
   * Check if user data is valid
   * @returns {boolean}
   */
  isValid() {
    return this.email && this.name && this.role && 
           /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
  }

  /**
   * Check if user is admin
   * @returns {boolean}
   */
  isAdmin() {
    return this.role === 'admin';
  }

  /**
   * Check if user is landlord
   * @returns {boolean}
   */
  isLandlord() {
    return this.role === 'landlord';
  }

  /**
   * Check if user is tenant
   * @returns {boolean}
   */
  isTenant() {
    return this.role === 'tenant';
  }

  /**
   * Get user display name
   * @returns {string}
   */
  getDisplayName() {
    return this.name || this.email.split('@')[0];
  }

  /**
   * Convert to JSON for storage
   * @returns {object}
   */
  toJSON() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      phone: this.phone,
      role: this.role,
      profileImage: this.profileImage,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      isActive: this.isActive,
      metadata: this.metadata
    };
  }

  /**
   * Get validation errors
   * @returns {string[]} Array of error messages
   */
  getValidationErrors() {
    const errors = [];
    if (!this.email) errors.push('Email is required');
    if (!this.name) errors.push('Name is required');
    if (!this.role) errors.push('Role is required');
    if (this.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      errors.push('Invalid email format');
    }
    return errors;
  }
}
