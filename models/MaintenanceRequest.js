/**
 * MaintenanceRequest Model
 * Represents a maintenance request for a unit
 */
class MaintenanceRequest {
  constructor(data = {}) {
    this.id = data.id || null;
    this.unitId = data.unitId || '';
    this.propertyId = data.propertyId || '';
    this.tenantId = data.tenantId || '';
    this.landlordId = data.landlordId || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.category = data.category || 'general'; // plumbing, electrical, structural, general
    this.priority = data.priority || 'normal'; // low, normal, high, emergency
    this.status = data.status || 'open'; // open, assigned, in-progress, completed, cancelled
    this.estimatedCost = data.estimatedCost || 0;
    this.actualCost = data.actualCost || null;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.completedAt = data.completedAt || null;
    this.assignedTo = data.assignedTo || null;
    this.notes = data.notes || '';
    this.images = data.images || [];
  }

  /**
   * Validate request data
   * @returns {boolean}
   */
  isValid() {
    return this.unitId && this.title && this.description && 
           this.category && this.priority;
  }

  /**
   * Check if request is open
   * @returns {boolean}
   */
  isOpen() {
    return this.status === 'open';
  }

  /**
   * Check if request is completed
   * @returns {boolean}
   */
  isCompleted() {
    return this.status === 'completed';
  }

  /**
   * Check if request is urgent
   * @returns {boolean}
   */
  isUrgent() {
    return this.priority === 'high' || this.priority === 'emergency';
  }

  /**
   * Get priority display color
   * @returns {string}
   */
  getPriorityColor() {
    const colors = {
      low: '#10b981',
      normal: '#3b82f6',
      high: '#f59e0b',
      emergency: '#ef4444'
    };
    return colors[this.priority] || colors.normal;
  }

  /**
   * Get days since creation
   * @returns {number}
   */
  getDaysSinceCreation() {
    return Math.floor((new Date() - new Date(this.createdAt)) / (1000 * 60 * 60 * 24));
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
      title: this.title,
      description: this.description,
      category: this.category,
      priority: this.priority,
      status: this.status,
      estimatedCost: this.estimatedCost,
      actualCost: this.actualCost,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      completedAt: this.completedAt,
      assignedTo: this.assignedTo,
      notes: this.notes,
      images: this.images
    };
  }

  /**
   * Get validation errors
   * @returns {string[]}
   */
  getValidationErrors() {
    const errors = [];
    if (!this.title) errors.push('Title is required');
    if (!this.description) errors.push('Description is required');
    if (!this.category) errors.push('Category is required');
    if (!this.priority) errors.push('Priority is required');
    return errors;
  }
}
