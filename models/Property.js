/**
 * Property Model
 * Represents a rental property owned by a landlord
 */
class Property {
  constructor(data = {}) {
    this.id = data.id || null;
    this.landlordId = data.landlordId || data.ownerID || '';
    this.name = data.name || '';
    this.address = data.address || '';
    this.city = data.city || '';
    this.state = data.state || '';
    this.zipCode = data.zipCode || '';
    this.country = data.country || '';
    this.propertyType = data.propertyType || 'apartment'; // apartment, house, condo, etc
    this.totalUnits = data.totalUnits || 0;
    this.bedrooms = data.bedrooms || 0;
    this.bathrooms = data.bathrooms || 0;
    this.monthlyRate = data.monthlyRate || 0;
    this.description = data.description || '';
    this.amenities = data.amenities || [];
    this.images = data.images || [];
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  /**
   * Validate property data
   * @returns {boolean}
   */
  isValid() {
    // Relaxed validation to accept properties created with minimal fields
    const hasOwner = !!this.landlordId;
    const hasLocation = !!(this.address && this.city && this.state);
    const hasUnitsOrRate = (this.totalUnits > 0) || (this.bedrooms > 0) || (this.monthlyRate > 0);

    return hasLocation && hasUnitsOrRate;
  }

  /**
   * Get full address
   * @returns {string}
   */
  getFullAddress() {
    return `${this.address}, ${this.city}, ${this.state} ${this.zipCode}`;
  }

  /**
   * Convert to JSON
   * @returns {object}
   */
  toJSON() {
    return {
      id: this.id,
      landlordId: this.landlordId,
      name: this.name,
      address: this.address,
      city: this.city,
      state: this.state,
      zipCode: this.zipCode,
      country: this.country,
      propertyType: this.propertyType,
      totalUnits: this.totalUnits,
      description: this.description,
      amenities: this.amenities,
      images: this.images,
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
    if (!this.address) errors.push('Address is required');
    if (!this.city) errors.push('City is required');
    if (!this.state) errors.push('State is required');
    if (!(this.totalUnits > 0) && !(this.bedrooms > 0) && !(this.monthlyRate > 0)) {
      errors.push('Provide total units, bedrooms, or a monthly rate');
    }
    return errors;
  }
}
