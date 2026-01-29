/**
 * Unit Model
 * Represents a rental unit within a property
 */
class Unit {
  constructor(data = {}) {
    this.id = data.id || null;
    this.propertyId = data.propertyId || '';
    this.unitNumber = data.unitNumber || '';
    this.bedroomCount = data.bedroomCount || 0;
    this.bathroomCount = data.bathroomCount || 0;
    this.squareFeet = data.squareFeet || 0;
    this.rentAmount = data.rentAmount || 0;
    this.securityDeposit = data.securityDeposit || 0;
    this.status = data.status || 'vacant'; // vacant, occupied, maintenance
    this.currentTenantId = data.currentTenantId || null;
    this.leaseStartDate = data.leaseStartDate || null;
    this.leaseEndDate = data.leaseEndDate || null;
    this.description = data.description || '';
    this.amenities = data.amenities || [];
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  /**
   * Validate unit data
   * @returns {boolean}
   */
  isValid() {
    return this.propertyId && this.unitNumber && 
           this.bedroomCount >= 0 && this.bathroomCount >= 0 && 
           this.rentAmount > 0;
  }

  /**
   * Check if unit is occupied
   * @returns {boolean}
   */
  isOccupied() {
    return this.status === 'occupied' && this.currentTenantId !== null;
  }

  /**
   * Check if unit is vacant
   * @returns {boolean}
   */
  isVacant() {
    return this.status === 'vacant';
  }

  /**
   * Get display name
   * @returns {string}
   */
  getDisplayName() {
    return `Unit ${this.unitNumber}`;
  }

  /**
   * Convert to JSON
   * @returns {object}
   */
  toJSON() {
    return {
      id: this.id,
      propertyId: this.propertyId,
      unitNumber: this.unitNumber,
      bedroomCount: this.bedroomCount,
      bathroomCount: this.bathroomCount,
      squareFeet: this.squareFeet,
      rentAmount: this.rentAmount,
      securityDeposit: this.securityDeposit,
      status: this.status,
      currentTenantId: this.currentTenantId,
      leaseStartDate: this.leaseStartDate,
      leaseEndDate: this.leaseEndDate,
      description: this.description,
      amenities: this.amenities,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Get validation errors
   * @returns {string[]}
   */
  getValidationErrors() {
    const errors = [];
    if (!this.unitNumber) errors.push('Unit number is required');
    if (this.bedroomCount < 0) errors.push('Bedroom count cannot be negative');
    if (this.bathroomCount < 0) errors.push('Bathroom count cannot be negative');
    if (!this.rentAmount || this.rentAmount <= 0) {
      errors.push('Rent amount must be greater than 0');
    }
    return errors;
  }
}
