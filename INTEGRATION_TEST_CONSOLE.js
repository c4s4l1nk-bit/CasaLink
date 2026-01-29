// CasaLink Integration Testing Console Script
// Copy and paste this into browser console to validate MVC implementation
// Date: January 30, 2026

console.log("%c=== CasaLink MVC Integration Testing Suite ===", "font-size: 16px; font-weight: bold; color: #2563eb;");
console.log("%cStarting comprehensive system validation...", "color: #059669; font-weight: bold;");

// ============================================================================
// PHASE 1: ENVIRONMENT VERIFICATION
// ============================================================================

console.log("\n%c=== PHASE 1: Environment Verification ===", "font-size: 14px; font-weight: bold; color: #2563eb;");

// Check if Firebase is loaded
if (typeof firebase !== 'undefined') {
    console.log("%c✅ Firebase SDK loaded", "color: #059669; font-weight: bold;");
} else {
    console.error("%c❌ Firebase SDK NOT loaded", "color: #dc2626; font-weight: bold;");
}

// Check if Firebase App initialized
if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
    console.log("%c✅ Firebase App initialized", "color: #059669; font-weight: bold;");
    console.log("   - Number of Firebase apps: " + firebase.apps.length);
} else {
    console.error("%c❌ Firebase App NOT initialized", "color: #dc2626; font-weight: bold;");
}

// ============================================================================
// PHASE 2: SERVICE VERIFICATION
// ============================================================================

console.log("\n%c=== PHASE 2: Service Verification ===", "font-size: 14px; font-weight: bold; color: #2563eb;");

// Check if Services are initialized
const services = {
    firebaseService: typeof window.firebaseService !== 'undefined',
    authService: typeof window.authService !== 'undefined',
    dataService: typeof window.dataService !== 'undefined'
};

console.log("Service Status:");
console.log("  - FirebaseService: " + (services.firebaseService ? "✅ Available" : "❌ NOT available"));
console.log("  - AuthService: " + (services.authService ? "✅ Available" : "❌ NOT available"));
console.log("  - DataService: " + (services.dataService ? "✅ Available" : "❌ NOT available"));

if (Object.values(services).every(v => v)) {
    console.log("%c✅ All services initialized successfully", "color: #059669; font-weight: bold;");
} else {
    console.warn("%c⚠️  Some services missing - check bootstrap order", "color: #ea580c; font-weight: bold;");
}

// ============================================================================
// PHASE 3: MODEL VERIFICATION
// ============================================================================

console.log("\n%c=== PHASE 3: Model Verification ===", "font-size: 14px; font-weight: bold; color: #2563eb;");

const models = {
    User: typeof User !== 'undefined',
    Property: typeof Property !== 'undefined',
    Unit: typeof Unit !== 'undefined',
    Lease: typeof Lease !== 'undefined',
    Bill: typeof Bill !== 'undefined',
    MaintenanceRequest: typeof MaintenanceRequest !== 'undefined'
};

console.log("Model Status:");
Object.entries(models).forEach(([name, loaded]) => {
    console.log("  - " + name + ": " + (loaded ? "✅ Available" : "❌ NOT available"));
});

if (Object.values(models).every(v => v)) {
    console.log("%c✅ All models loaded successfully", "color: #059669; font-weight: bold;");
} else {
    console.warn("%c⚠️  Some models missing", "color: #ea580c; font-weight: bold;");
}

// ============================================================================
// PHASE 4: CONTROLLER VERIFICATION
// ============================================================================

console.log("\n%c=== PHASE 4: Controller Verification ===", "font-size: 14px; font-weight: bold; color: #2563eb;");

const controllers = {
    authController: typeof window.authController !== 'undefined',
    dashboardController: typeof window.dashboardController !== 'undefined',
    propertiesController: typeof window.propertiesController !== 'undefined',
    tenantsController: typeof window.tenantsController !== 'undefined',
    billingController: typeof window.billingController !== 'undefined',
    maintenanceController: typeof window.maintenanceController !== 'undefined'
};

console.log("Controller Status:");
Object.entries(controllers).forEach(([name, loaded]) => {
    console.log("  - " + name + ": " + (loaded ? "✅ Available" : "❌ NOT available"));
});

if (Object.values(controllers).every(v => v)) {
    console.log("%c✅ All controllers initialized successfully", "color: #059669; font-weight: bold;");
} else {
    console.warn("%c⚠️  Some controllers missing", "color: #ea580c; font-weight: bold;");
}

// ============================================================================
// PHASE 5: AUTHENTICATION STATUS
// ============================================================================

console.log("\n%c=== PHASE 5: Authentication Status ===", "font-size: 14px; font-weight: bold; color: #2563eb;");

if (typeof firebase !== 'undefined' && firebase.auth) {
    const auth = firebase.auth();
    const currentUser = auth.currentUser;
    
    if (currentUser) {
        console.log("%c✅ User is authenticated", "color: #059669; font-weight: bold;");
        console.log("   - UID: " + currentUser.uid);
        console.log("   - Email: " + currentUser.email);
        console.log("   - Display Name: " + (currentUser.displayName || "Not set"));
    } else {
        console.log("%c⚠️  User not authenticated", "color: #ea580c; font-weight: bold;");
        console.log("   - Please login first");
    }
} else {
    console.error("%c❌ Firebase Auth not available", "color: #dc2626; font-weight: bold;");
}

// ============================================================================
// PHASE 6: VIEW HELPER FUNCTIONS
// ============================================================================

console.log("\n%c=== PHASE 6: View Helper Functions ===", "font-size: 14px; font-weight: bold; color: #2563eb;");

const helpers = {
    'Dashboard': typeof window.updateDashboardStats !== 'undefined',
    'Properties': typeof window.displayProperties !== 'undefined',
    'Tenants': typeof window.displayTenants !== 'undefined',
    'Billing': typeof window.displayBills !== 'undefined',
    'Maintenance': typeof window.displayMaintenanceRequests !== 'undefined'
};

console.log("View Helper Status:");
Object.entries(helpers).forEach(([name, available]) => {
    console.log("  - " + name + " helpers: " + (available ? "✅ Available" : "❌ NOT available"));
});

// ============================================================================
// PHASE 7: UTILITY FUNCTIONS
// ============================================================================

console.log("\n%c=== PHASE 7: Utility Functions ===", "font-size: 14px; font-weight: bold; color: #2563eb;");

const utilities = {
    'generateId': typeof generateId !== 'undefined',
    'formatCurrency': typeof formatCurrency !== 'undefined',
    'formatDate': typeof formatDate !== 'undefined',
    'debounce': typeof debounce !== 'undefined',
    'showNotification': typeof showNotification !== 'undefined'
};

console.log("Utility Status:");
let utilCount = 0;
Object.entries(utilities).forEach(([name, available]) => {
    if (available) {
        console.log("  - " + name + ": ✅");
        utilCount++;
    } else {
        console.log("  - " + name + ": ❌");
    }
});

console.log("   Total available: " + utilCount + "/5");

// ============================================================================
// PHASE 8: MODEL INSTANTIATION TEST
// ============================================================================

console.log("\n%c=== PHASE 8: Model Instantiation Test ===", "font-size: 14px; font-weight: bold; color: #2563eb;");

try {
    // Test User Model
    if (typeof User !== 'undefined') {
        const testUser = new User({
            id: 'test-user-' + Date.now(),
            name: 'Test User',
            email: 'test@example.com',
            password: 'Test@123456',
            role: 'landlord'
        });
        console.log("%c✅ User model instantiation successful", "color: #059669;");
        console.log("   - User ID: " + testUser.id);
        console.log("   - Validation: " + (testUser.isValid() ? "✅ PASS" : "❌ FAIL"));
    }
} catch (e) {
    console.error("%c❌ User model instantiation failed: " + e.message, "color: #dc2626;");
}

try {
    // Test Property Model
    if (typeof Property !== 'undefined') {
        const testProperty = new Property({
            id: 'test-prop-' + Date.now(),
            address: '123 Test St',
            city: 'Test City',
            state: 'TS',
            zipCode: '12345',
            propertyType: 'apartment',
            bedrooms: 2,
            bathrooms: 1,
            monthlyRate: 1500,
            ownerID: 'test-user-1'
        });
        console.log("%c✅ Property model instantiation successful", "color: #059669;");
        console.log("   - Address: " + testProperty.address);
        console.log("   - Validation: " + (testProperty.isValid() ? "✅ PASS" : "❌ FAIL"));
    }
} catch (e) {
    console.error("%c❌ Property model instantiation failed: " + e.message, "color: #dc2626;");
}

// ============================================================================
// PHASE 9: CONTROLLER METHOD TEST
// ============================================================================

console.log("\n%c=== PHASE 9: Controller Method Availability Test ===", "font-size: 14px; font-weight: bold; color: #2563eb;");

const controllerMethods = {
    'dashboardController.init': () => typeof window.dashboardController !== 'undefined' && typeof window.dashboardController.init === 'function',
    'propertiesController.loadProperties': () => typeof window.propertiesController !== 'undefined' && typeof window.propertiesController.loadProperties === 'function',
    'tenantsController.loadTenants': () => typeof window.tenantsController !== 'undefined' && typeof window.tenantsController.loadTenants === 'function',
    'billingController.loadBills': () => typeof window.billingController !== 'undefined' && typeof window.billingController.loadBills === 'function',
    'maintenanceController.loadRequests': () => typeof window.maintenanceController !== 'undefined' && typeof window.maintenanceController.loadRequests === 'function'
};

console.log("Controller Method Status:");
Object.entries(controllerMethods).forEach(([method, test]) => {
    console.log("  - " + method + ": " + (test() ? "✅ Available" : "❌ NOT available"));
});

// ============================================================================
// PHASE 10: FIREBASE CONNECTIVITY TEST
// ============================================================================

console.log("\n%c=== PHASE 10: Firebase Connectivity Test ===", "font-size: 14px; font-weight: bold; color: #2563eb;");

if (typeof firebase !== 'undefined' && firebase.auth().currentUser) {
    console.log("%c✅ Firebase is connected and user authenticated", "color: #059669; font-weight: bold;");
    
    // Test Firestore availability
    if (typeof firebase.firestore !== 'undefined') {
        console.log("%c✅ Firestore available", "color: #059669;");
    } else {
        console.warn("%c⚠️  Firestore not immediately available", "color: #ea580c;");
    }
} else if (typeof firebase !== 'undefined') {
    console.log("%c⚠️  Firebase available but user not authenticated", "color: #ea580c; font-weight: bold;");
    console.log("   - Please login to test authenticated operations");
} else {
    console.error("%c❌ Firebase not available", "color: #dc2626; font-weight: bold;");
}

// ============================================================================
// PHASE 11: SUMMARY
// ============================================================================

console.log("\n%c=== VALIDATION SUMMARY ===", "font-size: 14px; font-weight: bold; color: #2563eb;");

const summary = {
    Firebase: typeof firebase !== 'undefined' && firebase.apps.length > 0,
    Models: Object.values(models).every(v => v),
    Services: Object.values(services).every(v => v),
    Controllers: Object.values(controllers).every(v => v),
    Views: Object.values(helpers).every(v => v),
    Utilities: utilCount >= 3
};

let passCount = Object.values(summary).filter(v => v).length;
let totalCount = Object.keys(summary).length;

console.log("\nCategory Results:");
Object.entries(summary).forEach(([category, result]) => {
    console.log("  " + category + ": " + (result ? "✅ PASS" : "❌ FAIL"));
});

console.log("\n%c" + passCount + "/" + totalCount + " categories passed", 
    passCount === totalCount ? "font-size: 14px; font-weight: bold; color: #059669;" : "font-size: 14px; font-weight: bold; color: #dc2626;");

// Final verdict
if (passCount === totalCount) {
    console.log("%c✅ SYSTEM READY FOR INTEGRATION TESTING", "font-size: 16px; font-weight: bold; color: #059669; background: #dcfce7; padding: 8px; border-radius: 4px;");
} else {
    console.log("%c⚠️  SYSTEM PARTIALLY READY - Some issues detected", "font-size: 16px; font-weight: bold; color: #ea580c; background: #fed7aa; padding: 8px; border-radius: 4px;");
}

// ============================================================================
// PHASE 12: NEXT STEPS
// ============================================================================

console.log("\n%c=== NEXT STEPS ===", "font-size: 14px; font-weight: bold; color: #2563eb;");

console.log(`
%cTo continue testing, you can use these commands:

1. Load Dashboard Data:
   %cwindow.dashboardController.init()

2. Load Properties:
   %cwindow.propertiesController.loadProperties()

3. Load Tenants:
   %cwindow.tenantsController.loadTenants()

4. Load Billing:
   %cwindow.billingController.loadBills()

5. Load Maintenance:
   %cwindow.maintenanceController.loadRequests()

6. Check console for detailed output of each operation

7. Verify data displays correctly in respective views

`, "color: #4b5563;", "color: #2563eb;", "color: #2563eb;", "color: #2563eb;", "color: #2563eb;", "color: #4b5563;", "color: #4b5563;");

console.log("%c=== Integration Testing Console Ready ===", "font-size: 14px; font-weight: bold; color: #059669; background: #dcfce7; padding: 8px; border-radius: 4px;");
console.log("See details above. Check browser console for any errors during testing.");
