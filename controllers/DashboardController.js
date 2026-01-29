/**
 * DashboardController
 * Handles dashboard interactions and data aggregation
 * Orchestrates between Dashboard view and DataService
 */

class DashboardController {
    constructor(dataService) {
        this.service = dataService;
        this.currentUser = null;
        this.dashboardData = {};
        this.initialized = false;
        this.setupEventListeners();
    }

    /**
     * Wait for user to be authenticated before initializing
     */
    async waitForAuth() {
        return new Promise((resolve) => {
            const checkAuth = () => {
                if (window.currentUser) {
                    this.currentUser = window.currentUser;
                    console.log('✅ DashboardController: User authenticated:', this.currentUser.email);
                    resolve();
                } else {
                    console.log('⏳ DashboardController: Waiting for auth...');
                    setTimeout(checkAuth, 100);
                }
            };
            checkAuth();
        });
    }

    /**
     * Initialize controller with auth check
     */
    async init() {
        try {
            if (this.initialized) {
                console.log('✅ DashboardController already initialized');
                return;
            }

            console.log('🚀 DashboardController initializing...');
            
            // Wait for authentication
            await this.waitForAuth();
            
            // Update header
            if (window.updateDashboardHeader) {
                window.updateDashboardHeader(this.currentUser.name);
            }

            // Set loading states
            if (window.setDashboardLoading) {
                window.setDashboardLoading('properties', true);
                window.setDashboardLoading('activity', true);
                window.setDashboardLoading('maintenance', true);
                window.setDashboardLoading('leases', true);
            }

            // Load all dashboard data in parallel with error handling
            await Promise.all([
                this.loadStatistics(),
                this.loadRecentProperties(),
                this.loadRecentActivity(),
                this.loadMaintenanceRequests(),
                this.loadUpcomingLeases()
            ]);

            this.initialized = true;
            console.log('✅ DashboardController initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing dashboard:', error);
            this.handleInitializationError(error);
        } finally {
            // Ensure loading states are cleared
            if (window.setDashboardLoading) {
                window.setDashboardLoading('properties', false);
                window.setDashboardLoading('activity', false);
                window.setDashboardLoading('maintenance', false);
                window.setDashboardLoading('leases', false);
            }
        }
    }

    /**
     * Handle initialization errors gracefully
     */
    handleInitializationError(error) {
        console.error('Dashboard initialization error:', error);
        
        // Set default stats
        if (window.updateDashboardStats) {
            window.updateDashboardStats({
                properties: 0,
                tenants: 0,
                overdueBills: 0,
                pendingRequests: 0
            });
        }
        
        // Clear any displayed lists
        if (window.displayProperties) {
            window.displayProperties([]);
        }
        if (window.displayMaintenanceRequests) {
            window.displayMaintenanceRequests([]);
        }
        if (window.displayLeases) {
            window.displayLeases([]);
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Event listeners handled in dashboard view
    }

    /**
     * Load dashboard statistics
     */
    async loadStatistics() {
        try {
            window.setDashboardLoading('properties', true);

            const [properties, tenants, bills, maintenance] = await Promise.all([
                this.service.getProperties(),
                this.service.getTenants(),
                this.service.getBills(),
                this.service.getMaintenanceRequests()
            ]);

            const stats = {
                properties: properties.length,
                tenants: tenants.length,
                overdueBills: bills.filter(b => b.status === 'overdue').length,
                pendingRequests: maintenance.filter(m => m.status !== 'closed').length
            };

            window.updateDashboardStats(stats);
        } catch (error) {
            console.error('Error loading statistics:', error);
        } finally {
            window.setDashboardLoading('properties', false);
        }
    }

    /**
     * Load recent properties
     */
    async loadRecentProperties() {
        try {
            window.setDashboardLoading('properties', true);

            const properties = await this.service.getProperties();
            const recent = properties
                .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
                .slice(0, 5);

            window.displayPropertiesList(recent);
        } catch (error) {
            console.error('Error loading recent properties:', error);
        } finally {
            window.setDashboardLoading('properties', false);
        }
    }

    /**
     * Load recent activity
     */
    async loadRecentActivity() {
        try {
            window.setDashboardLoading('activity', true);

            // Aggregate activity from various sources
            const [properties, bills, maintenance] = await Promise.all([
                this.service.getProperties(),
                this.service.getBills(),
                this.service.getMaintenanceRequests()
            ]);

            const activity = [
                ...properties.map(p => ({
                    type: 'property',
                    message: `New property: ${p.name}`,
                    date: p.createdDate
                })),
                ...bills.map(b => ({
                    type: 'bill',
                    message: `Bill created for ${b.tenantName}`,
                    date: b.createdDate
                })),
                ...maintenance.map(m => ({
                    type: 'maintenance',
                    message: `Maintenance request: ${m.title}`,
                    date: m.createdDate
                }))
            ]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 10);

            // Display would go here (not implemented in current views)
        } catch (error) {
            console.error('Error loading recent activity:', error);
        } finally {
            window.setDashboardLoading('activity', false);
        }
    }

    /**
     * Load maintenance requests
     */
    async loadMaintenanceRequests() {
        try {
            window.setDashboardLoading('maintenance', true);

            const requests = await this.service.getMaintenanceRequests();
            const pending = requests
                .filter(r => r.status !== 'closed')
                .sort((a, b) => {
                    const priorityMap = { urgent: 3, high: 2, medium: 1, low: 0 };
                    return priorityMap[b.priority] - priorityMap[a.priority];
                })
                .slice(0, 5);

            window.displayMaintenanceList(pending);
        } catch (error) {
            console.error('Error loading maintenance requests:', error);
        } finally {
            window.setDashboardLoading('maintenance', false);
        }
    }

    /**
     * Load upcoming lease expirations
     */
    async loadUpcomingLeases() {
        try {
            window.setDashboardLoading('leases', true);

            const leases = await this.service.getLeases();
            const today = new Date();
            const upcoming = leases
                .filter(l => {
                    const expDate = new Date(l.expirationDate);
                    const daysUntilExp = Math.floor((expDate - today) / (1000 * 60 * 60 * 24));
                    return daysUntilExp > 0 && daysUntilExp <= 90;
                })
                .sort((a, b) => new Date(a.expirationDate) - new Date(b.expirationDate))
                .slice(0, 5)
                .map(l => ({
                    ...l,
                    daysRemaining: Math.floor(
                        (new Date(l.expirationDate) - today) / (1000 * 60 * 60 * 24)
                    )
                }));

            window.displayLeasesList(upcoming);
        } catch (error) {
            console.error('Error loading upcoming leases:', error);
        } finally {
            window.setDashboardLoading('leases', false);
        }
    }

    /**
     * Navigate to properties
     */
    navigateToProperties() {
        window.location.hash = '#properties';
        if (window.propertiesController) {
            window.propertiesController.init();
        }
    }

    /**
     * Navigate to maintenance
     */
    navigateToMaintenance() {
        window.location.hash = '#maintenance';
        if (window.maintenanceController) {
            window.maintenanceController.init();
        }
    }

    /**
     * Navigate to leases
     */
    navigateToLeases() {
        window.location.hash = '#leases';
        // Load leases controller when created
    }

    /**
     * Get summary metrics
     */
    async getSummaryMetrics() {
        try {
            const [properties, tenants, bills, maintenance] = await Promise.all([
                this.service.getProperties(),
                this.service.getTenants(),
                this.service.getBills(),
                this.service.getMaintenanceRequests()
            ]);

            return {
                properties: properties.length,
                tenants: tenants.length,
                revenue: bills
                    .filter(b => b.status === 'paid')
                    .reduce((sum, b) => sum + b.amount, 0),
                pendingRevenue: bills
                    .filter(b => b.status !== 'paid')
                    .reduce((sum, b) => sum + b.amount, 0),
                maintenanceRequests: maintenance.length,
                completedMaintenance: maintenance.filter(m => m.status === 'closed').length
            };
        } catch (error) {
            console.error('Error getting summary metrics:', error);
            return null;
        }
    }

    /**
     * Get occupancy metrics
     */
    async getOccupancyMetrics() {
        try {
            const properties = await this.service.getProperties();
            const totalUnits = properties.reduce((sum, p) => sum + (p.units?.length || 0), 0);
            const occupiedUnits = properties.reduce((sum, p) => sum + (p.occupiedUnits || 0), 0);

            return {
                totalUnits,
                occupiedUnits,
                vacantUnits: totalUnits - occupiedUnits,
                occupancyRate: totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0
            };
        } catch (error) {
            console.error('Error getting occupancy metrics:', error);
            return null;
        }
    }

    /**
     * Get revenue metrics
     */
    async getRevenueMetrics() {
        try {
            const bills = await this.service.getBills();
            const lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth() - 1);

            const thisMonthBills = bills.filter(b => new Date(b.createdDate) > lastMonth);

            return {
                totalRevenue: thisMonthBills.reduce((sum, b) => sum + b.amount, 0),
                paidRevenue: thisMonthBills
                    .filter(b => b.status === 'paid')
                    .reduce((sum, b) => sum + b.amount, 0),
                pendingRevenue: thisMonthBills
                    .filter(b => b.status === 'pending')
                    .reduce((sum, b) => sum + b.amount, 0),
                overdueRevenue: thisMonthBills
                    .filter(b => b.status === 'overdue')
                    .reduce((sum, b) => sum + b.amount, 0)
            };
        } catch (error) {
            console.error('Error getting revenue metrics:', error);
            return null;
        }
    }
}

// Initialize and expose to window
if (window.dataService) {
    window.dashboardController = new DashboardController(window.dataService);
}