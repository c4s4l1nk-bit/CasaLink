/**
 * Lease Model
 * Represents a lease agreement between landlord and tenant
 */
class Lease {
  constructor(data = {}) {
    this.id = data.id || null;
    this.unitId = data.unitId || '';
    this.propertyId = data.propertyId || '';
    this.tenantId = data.tenantId || '';
    this.landlordId = data.landlordId || '';
    this.startDate = data.startDate || new Date();
    this.endDate = data.endDate || null;
    this.monthlyRent = data.monthlyRent || 0;
    this.securityDeposit = data.securityDeposit || 0;
    this.depositPaid = data.depositPaid || false;
    this.terms = data.terms || '';
    this.status = data.status || 'active'; // active, ended, pending
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.renewalDate = data.renewalDate || null;
  }

  /**
   * Validate lease data
   * @returns {boolean}
   */
  isValid() {
    return this.unitId && this.tenantId && this.landlordId && 
           this.monthlyRent > 0 && this.startDate;
  }

  /**
   * Check if lease is active
   * @returns {boolean}
   */
  isActive() {
    return this.status === 'active';
  }

  /**
   * Check if lease is expired
   * @returns {boolean}
   */
  isExpired() {
    if (!this.endDate) return false;
    return new Date() > new Date(this.endDate);
  }

  /**
   * Check if lease is expiring soon (within 30 days)
   * @returns {boolean}
   */
  isExpiringSoon() {
    if (!this.endDate) return false;
    const daysUntilExpiry = (new Date(this.endDate) - new Date()) / (1000 * 60 * 60 * 24);
    return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
  }

  /**
   * Get lease duration in months
   * @returns {number}
   */
  getDurationInMonths() {
    const start = new Date(this.startDate);
    const end = new Date(this.endDate || new Date());
    return Math.floor((end - start) / (1000 * 60 * 60 * 24 * 30.44));
  }

  /**
   * Convert to JSON
   * @returns {object}
   */
  toJSON() {
    return {
      id: this.id,
      unitId: this.unitId,
      propertyId: this.propertyId,
      tenantId: this.tenantId,
      landlordId: this.landlordId,
      startDate: this.startDate,
      endDate: this.endDate,
      monthlyRent: this.monthlyRent,
      securityDeposit: this.securityDeposit,
      depositPaid: this.depositPaid,
      terms: this.terms,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      renewalDate: this.renewalDate
    };
  }

  /**
   * Get validation errors
   * @returns {string[]}
   */
  getValidationErrors() {
    const errors = [];
    if (!this.unitId) errors.push('Unit is required');
    if (!this.tenantId) errors.push('Tenant is required');
    if (!this.monthlyRent || this.monthlyRent <= 0) {
      errors.push('Monthly rent must be greater than 0');
    }
    if (!this.startDate) errors.push('Start date is required');
    if (this.endDate && new Date(this.startDate) >= new Date(this.endDate)) {
      errors.push('End date must be after start date');
    }
    return errors;
  }
}
