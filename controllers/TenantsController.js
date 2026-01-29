/**
 * TenantsController
 * Handles all tenant management interactions
 * Orchestrates between Tenants views and DataService
 */

class TenantsController {
    constructor(dataService) {
        this.service = dataService;
        this.currentFilter = '';
        this.statusFilter = '';
        this.currentPage = 1;
        this.itemsPerPage = 15;
        this.allTenants = [];
        this.setupEventListeners();
    }

    /**
     * Initialize controller
     */
    async init() {
        try {
            window.setTenantsLoading(true);
            await this.loadTenants();
            window.hideTenantsError();
        } catch (error) {
            console.error('Error initializing tenants:', error);
            window.showTenantsError('Failed to load tenants');
        } finally {
            window.setTenantsLoading(false);
        }
    }

    /**
     * Load all tenants from service
     */
    async loadTenants() {
        try {
            this.allTenants = await this.service.getTenants();
            this.displayFilteredTenants();
        } catch (error) {
            throw new Error(`Failed to load tenants: ${error.message}`);
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Event listeners handled in views
    }

    /**
     * Search tenants by name or email
     */
    searchTenants(query) {
        this.currentFilter = query.toLowerCase();
        this.currentPage = 1;
        this.displayFilteredTenants();
    }

    /**
     * Filter tenants by status
     */
    filterByStatus(status) {
        this.statusFilter = status;
        this.currentPage = 1;
        this.displayFilteredTenants();
    }

    /**
     * Display filtered tenants
     */
    displayFilteredTenants() {
        let filtered = this.allTenants;

        if (this.currentFilter) {
            filtered = filtered.filter(tenant =>
                tenant.fullName.toLowerCase().includes(this.currentFilter) ||
                tenant.email.toLowerCase().includes(this.currentFilter)
            );
        }

        if (this.statusFilter) {
            filtered = filtered.filter(tenant => tenant.status === this.statusFilter);
        }

        // Paginate
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const paginated = filtered.slice(start, end);

        // Display in view
        window.displayTenants(paginated);
    }

    /**
     * View tenant details
     */
    viewTenant(tenantId) {
        const tenant = this.allTenants.find(t => t.id === tenantId);
        if (tenant) {
            window.location.hash = `#tenant/${tenantId}`;
            console.log('Navigating to tenant detail:', tenantId);
        }
    }

    /**
     * Open add tenant modal
     */
    openAddTenantModal() {
        console.log('Opening add tenant modal');
        if (window.modalManager) {
            window.modalManager.openModal('addTenant');
        }
    }

    /**
     * Open edit tenant modal
     */
    openEditTenantModal(tenantId) {
        const tenant = this.allTenants.find(t => t.id === tenantId);
        if (tenant) {
            console.log('Opening edit modal for tenant:', tenantId);
            if (window.modalManager) {
                window.modalManager.openModal('editTenant', tenant);
            }
        }
    }

    /**
     * Create new tenant
     */
    async createTenant(tenantData) {
        try {
            window.setTenantsLoading(true);
            window.hideTenantsError();

            const user = new User(tenantData);
            if (!user.isValid()) {
                const errors = user.getValidationErrors();
                throw new Error(errors.join(', '));
            }

            await this.service.createTenant(tenantData);
            await this.loadTenants();

            if (window.modalManager) {
                window.modalManager.closeModal('addTenant');
            }

            if (window.notificationManager) {
                window.notificationManager.success('Tenant added successfully');
            }
        } catch (error) {
            console.error('Error creating tenant:', error);
            window.showTenantsError(error.message || 'Failed to add tenant');
        } finally {
            window.setTenantsLoading(false);
        }
    }

    /**
     * Update tenant
     */
    async updateTenant(tenantId, tenantData) {
        try {
            window.setTenantsLoading(true);
            window.hideTenantsError();

            const user = new User(tenantData);
            if (!user.isValid()) {
                const errors = user.getValidationErrors();
                throw new Error(errors.join(', '));
            }

            await this.service.updateTenant(tenantId, tenantData);
            await this.loadTenants();

            if (window.modalManager) {
                window.modalManager.closeModal('editTenant');
            }

            if (window.notificationManager) {
                window.notificationManager.success('Tenant updated successfully');
            }
        } catch (error) {
            console.error('Error updating tenant:', error);
            window.showTenantsError(error.message || 'Failed to update tenant');
        } finally {
            window.setTenantsLoading(false);
        }
    }

    /**
     * Delete tenant
     */
    async deleteTenant(tenantId) {
        try {
            window.setTenantsLoading(true);
            window.hideTenantsError();

            await this.service.deleteTenant(tenantId);
            await this.loadTenants();

            if (window.notificationManager) {
                window.notificationManager.success('Tenant deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting tenant:', error);
            window.showTenantsError(error.message || 'Failed to delete tenant');
        } finally {
            window.setTenantsLoading(false);
        }
    }

    /**
     * Get tenant statistics
     */
    async getTenantStats() {
        try {
            const stats = {
                total: this.allTenants.length,
                active: this.allTenants.filter(t => t.status === 'active').length,
                inactive: this.allTenants.filter(t => t.status === 'inactive').length
            };
            return stats;
        } catch (error) {
            console.error('Error getting tenant stats:', error);
            return null;
        }
    }
}

// Initialize and expose to window
if (window.dataService) {
    window.tenantsController = new TenantsController(window.dataService);
}
