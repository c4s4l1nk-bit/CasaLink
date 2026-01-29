# CasaLink MVC Architecture Documentation

## Overview

CasaLink follows a **Clean, Simple MVC (Model-View-Controller) Architecture** designed specifically for a Capstone project. This document explains the architecture, file organization, and how to extend the system.

---

## Architecture Layers

### 1. **Models** (`/models`)
**Purpose**: Data structures and validation

Models are classes that represent the core entities in your system. They:
- Define data properties
- Include validation methods
- Provide data transformation methods
- Contain no business logic or Firebase calls

**Files**:
- `User.js` - User data model
- `Property.js` - Property data model
- `Unit.js` - Rental unit model
- `Lease.js` - Lease agreement model
- `Bill.js` - Payment/bill model
- `MaintenanceRequest.js` - Maintenance request model

**Example**:
```javascript
class User {
  constructor(data = {}) {
    this.id = data.id;
    this.email = data.email;
    this.name = data.name;
    this.role = data.role;
  }

  isValid() {
    return this.email && this.name && this.role;
  }

  toJSON() {
    return { id: this.id, email: this.email, name: this.name, role: this.role };
  }
}
```

---

### 2. **Views** (`/views`)
**Purpose**: User interface presentation

Views are HTML templates that:
- Display data to the user
- Capture user input
- Trigger controller actions
- Contain minimal inline JavaScript (only event listeners)

**Structure**:
```
views/
├── auth/
│   ├── login.html
│   └── signup.html
├── dashboard/
│   └── dashboard.html
├── properties/
│   ├── list.html
│   └── detail.html
├── tenants/
├── billing/
├── maintenance/
└── admin/
```

**Example**:
```html
<!-- views/auth/login.html -->
<form id="loginForm">
  <input id="email" type="email" required>
  <input id="password" type="password" required>
  <button type="submit">Login</button>
</form>

<script>
  // Only event listeners - no logic here
  document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    authController.handleLogin(
      document.getElementById('email').value,
      document.getElementById('password').value
    );
  });
</script>
```

---

### 3. **Controllers** (`/controllers`)
**Purpose**: Business logic and user interaction handling

Controllers:
- Handle user interactions from views
- Orchestrate data flow
- Call services to fetch/save data
- Update views with new data
- Manage state for their specific section

**Example**:
```javascript
class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  async handleLogin(email, password) {
    try {
      const user = await this.authService.login(email, password);
      this.showDashboard(user);
    } catch (error) {
      this.showError(error.message);
    }
  }

  showError(message) {
    document.getElementById('errorMessage').textContent = message;
  }

  showDashboard(user) {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('dashboardSection').style.display = 'block';
  }
}
```

---

### 4. **Services** (`/services`)
**Purpose**: Business logic, data operations, and external integrations

Services:
- Handle Firebase/API operations
- Implement business rules
- Provide reusable data operations
- Should NOT directly manipulate DOM

**Main Services**:

#### `FirebaseService.js`
Provides abstraction over Firebase SDK:
```javascript
const firebaseService = new FirebaseService(config);

// CRUD operations
await firebaseService.create('users', userData);
const doc = await firebaseService.read('users', userId);
await firebaseService.update('users', userId, updates);
await firebaseService.delete('users', userId);

// Query operations
const snapshot = await firebaseService.query('properties', [
  ['landlordId', '==', landlordId]
]);

// Real-time listeners
const unsubscribe = firebaseService.listen('properties', [], (snapshot) => {
  // Handle real-time updates
});
```

#### `AuthService.js`
Handles authentication:
```javascript
const authService = new AuthService(firebaseService);

// User authentication
const user = await authService.login(email, password);
const user = await authService.register(email, password, userData);
await authService.logout();

// Password management
await authService.changePassword(currentPassword, newPassword);
await authService.resetPassword(email);

// Admin check
const isAdmin = await authService.isAdmin(userId);
```

#### `DataService.js`
Handles all data CRUD operations:
```javascript
const dataService = new DataService(firebaseService);

// User operations
const user = await dataService.getUser(userId);
const users = await dataService.getUsers({ role: 'tenant' });

// Property operations
const properties = await dataService.getLandlordProperties(landlordId);
const property = await dataService.getProperty(propertyId);

// Unit operations
const units = await dataService.getPropertyUnits(propertyId);
const unit = await dataService.getUnit(unitId);

// Bill operations
const bills = await dataService.getUnitBills(unitId);
const overdueBills = await dataService.getOverdueBills(landlordId);

// Maintenance operations
const requests = await dataService.getUnitMaintenanceRequests(unitId);
const openRequests = await dataService.getPropertyOpenRequests(propertyId);
```

---

### 5. **Utilities** (`/utilities`)
**Purpose**: Helper functions and constants

**Files**:

#### `helpers.js`
Common utility functions:
```javascript
AppHelpers.generateId();
AppHelpers.debounce(function, delay);
AppHelpers.deepClone(object);
AppHelpers.isValidEmail(email);
AppHelpers.showToast(message, type, duration);
```

#### `formatters.js`
Data formatting functions:
```javascript
Formatters.formatDate(date, 'long');
Formatters.formatCurrency(amount, 'USD');
Formatters.formatPhone(phoneNumber);
Formatters.formatTimeAgo(date);
Formatters.formatStatusBadge(status);
```

#### `constants.js`
Application-wide constants:
```javascript
AppConstants.ROLES
AppConstants.UNIT_STATUS
AppConstants.BILL_STATUS
AppConstants.MAINTENANCE_PRIORITY
AppConstants.VALIDATION
```

---

## Data Flow Diagram

```
┌─────────────────┐
│  User Action    │
│  (Click, Input) │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   View/HTML     │
│ (Event Listener)│
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   Controller    │
│ (Handle Action) │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│    Service      │
│(Business Logic) │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│Firebase/Database│
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│    Model        │
│(Data Structure) │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│    Service      │
│ (Return Data)   │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   Controller    │
│  (Update View)  │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   View/HTML     │
│(Display Result) │
└─────────────────┘
```

---

## Application Bootstrap (`app.js`)

The main entry point initializes all layers:

```javascript
class CasaLinkApp {
  constructor(firebaseConfig) {
    // Initialize Firebase
    this.firebaseService = new FirebaseService(firebaseConfig);
    
    // Initialize Services
    this.authService = new AuthService(this.firebaseService);
    this.dataService = new DataService(this.firebaseService);
    
    // Initialize Controllers
    this.authController = new AuthController(this.authService);
    this.dashboardController = new DashboardController(this.dataService);
    this.propertyController = new PropertyController(this.dataService);
    // ... more controllers
    
    this.init();
  }

  async init() {
    // Check if user is logged in
    const user = this.authService.getCurrentUser();
    
    if (user) {
      this.showDashboard();
    } else {
      this.showLoginPage();
    }
  }

  showLoginPage() {
    document.getElementById('loginSection').style.display = 'block';
  }

  showDashboard() {
    document.getElementById('dashboardSection').style.display = 'block';
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  const app = new CasaLinkApp(firebaseConfig);
});
```

---

## How to Add a New Feature

### Example: Adding Tenant Management

#### Step 1: Create Model (`models/Tenant.js`)
```javascript
class Tenant {
  constructor(data = {}) {
    this.id = data.id || null;
    this.userId = data.userId || '';
    this.unitId = data.unitId || '';
    this.moveInDate = data.moveInDate || null;
    // ... other properties
  }

  isValid() {
    return this.userId && this.unitId && this.moveInDate;
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      unitId: this.unitId,
      moveInDate: this.moveInDate
    };
  }
}
```

#### Step 2: Create Controller (`controllers/TenantController.js`)
```javascript
class TenantController {
  constructor(dataService) {
    this.dataService = dataService;
    this.init();
  }

  async init() {
    await this.loadTenants();
  }

  async loadTenants() {
    try {
      const tenants = await this.dataService.getTenants();
      this.renderTenants(tenants);
    } catch (error) {
      this.showError('Failed to load tenants');
    }
  }

  renderTenants(tenants) {
    // Update view with tenant data
  }
}
```

#### Step 3: Create View (`views/tenants/list.html`)
```html
<div id="tenantsList" class="tenants-container">
  <button id="addTenantBtn">Add Tenant</button>
  <table id="tenantsTable">
    <!-- Populated by controller -->
  </table>
</div>

<script>
  document.getElementById('addTenantBtn')?.addEventListener('click', () => {
    tenantController.showAddForm();
  });
</script>
```

#### Step 4: Add Methods to DataService (`services/DataService.js`)
```javascript
async getTenants() {
  const snapshot = await this.firebaseService.query('tenants', []);
  return snapshot.docs.map(doc => new Tenant(doc.data()));
}

async createTenant(tenant) {
  if (!tenant.isValid()) {
    throw new Error('Invalid tenant: ' + tenant.getValidationErrors().join(', '));
  }
  return await this.firebaseService.create('tenants', tenant.toJSON());
}
```

#### Step 5: Initialize in `app.js`
```javascript
this.tenantController = new TenantController(this.dataService);
```

---

## File Organization Quick Reference

```
CasaLink/
│
├── models/                    # Data structure & validation
│   ├── User.js
│   ├── Property.js
│   ├── Unit.js
│   ├── Lease.js
│   ├── Bill.js
│   └── MaintenanceRequest.js
│
├── views/                     # HTML templates & UI
│   ├── auth/
│   ├── dashboard/
│   ├── properties/
│   ├── tenants/
│   ├── billing/
│   ├── maintenance/
│   └── admin/
│
├── controllers/               # Business logic & interactions
│   ├── AuthController.js
│   ├── DashboardController.js
│   ├── PropertyController.js
│   ├── TenantController.js
│   ├── BillingController.js
│   ├── MaintenanceController.js
│   └── AdminController.js
│
├── services/                  # External integrations & operations
│   ├── FirebaseService.js
│   ├── AuthService.js
│   ├── DataService.js
│   └── NotificationService.js
│
├── utilities/                 # Helpers & constants
│   ├── helpers.js
│   ├── formatters.js
│   ├── constants.js
│   └── validators.js
│
├── config/
│   └── firebase.js
│
├── css/
│   └── style.css
│
├── public/
│   └── index.html            # Main entry point
│
├── app.js                    # Application bootstrap
├── sw.js                     # Service worker
└── manifest.json            # PWA manifest
```

---

## Best Practices

### 1. **Separation of Concerns**
- Views: Display data and capture input only
- Controllers: Handle user interactions and orchestrate data flow
- Services: Implement business logic and data operations
- Models: Define data structure and validation

### 2. **Error Handling**
```javascript
try {
  const user = await authService.login(email, password);
} catch (error) {
  controller.showError('Login failed: ' + error.message);
}
```

### 3. **Dependency Injection**
```javascript
// Good - dependencies injected
class AuthController {
  constructor(authService, dataService) {
    this.authService = authService;
    this.dataService = dataService;
  }
}

// Bad - creating dependencies internally
class AuthController {
  constructor() {
    this.authService = new AuthService(); // Tight coupling
  }
}
```

### 4. **Validation**
```javascript
const user = new User(userData);
if (!user.isValid()) {
  const errors = user.getValidationErrors();
  // Handle validation errors
}
```

### 5. **Async/Await**
```javascript
// Always use try-catch with async operations
async handleSubmit(data) {
  try {
    await this.dataService.createUser(data);
    this.showSuccess('User created');
  } catch (error) {
    this.showError(error.message);
  }
}
```

---

## Testing the MVC Structure

Each layer can be tested independently:

```javascript
// Test Model
const user = new User({ email: 'test@example.com', name: 'Test' });
console.assert(user.isValid() === true);

// Test Service (mocking Firebase)
const mockFirebase = { ... };
const dataService = new DataService(mockFirebase);
const users = await dataService.getUsers();
console.assert(users.length > 0);

// Test Controller (mocking Service)
const mockDataService = { ... };
const controller = new DashboardController(mockDataService);
await controller.loadDashboardData();
```

---

## Debugging Tips

1. **Use Chrome DevTools Console**
   ```javascript
   // Check if services are initialized
   console.log(window.firebaseService);
   console.log(window.dataService);
   ```

2. **Log Data Flow**
   - Add console.logs in controllers to see when data flows
   - Use AppHelpers.log() for styled logging

3. **Check DOM Updates**
   - Open Elements tab to see if HTML is being updated
   - Check computed styles for visibility issues

4. **Monitor Network**
   - Open Network tab to see Firebase calls
   - Check Response to see data from database

---

## Performance Considerations

1. **Lazy Load Views**: Load view HTML only when needed
2. **Cache Data**: Store frequently accessed data in memory
3. **Use Real-time Listeners Sparingly**: Too many listeners = slower app
4. **Debounce/Throttle**: Use helpers for frequent events
5. **Batch Database Operations**: Use batch() for multiple writes

---

## Security Notes

1. **Never expose API keys** in client-side code
2. **Validate on server**: Always validate data on backend
3. **Use Firebase Security Rules**: Configure proper access control
4. **Sanitize user input**: Clean HTML to prevent XSS
5. **Encrypt sensitive data**: Use HTTPS for all communications

---

## Conclusion

This MVC architecture provides:
- ✅ Clear separation of concerns
- ✅ Easy to understand and explain
- ✅ Easy to test and maintain
- ✅ Professional structure for Capstone project
- ✅ Simple to extend with new features

Follow these principles, and your CasaLink application will be well-organized, maintainable, and impressive for evaluation!

