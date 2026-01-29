# CasaLink MVC Refactoring Guide

## Overview
This document outlines the refactoring of CasaLink from a scattered script structure to a Clean, Simple MVC Architecture suitable for a Capstone project.

## Why MVC?
- **Separation of Concerns**: Each layer has a single responsibility
- **Maintainability**: Easy to locate and modify code
- **Scalability**: Simple to add new features without modifying existing code
- **Testability**: Components can be tested independently
- **Academic Value**: Clear demonstration of software architecture knowledge

---

## Current Structure (Before)
```
CasaLink/
├── index.html / admin/*.html (mixed logic + views)
├── config/firebase.js
├── css/ (styles)
├── js/
│   ├── app.js (1000+ lines - everything here)
│   ├── auth.js (auth logic scattered)
│   ├── dataManager.js (data layer mixed)
│   ├── modalManager.js
│   ├── chartManager.js
│   └── admin/ (admin scripts)
└── public/
```

**Problems:**
- HTML files contain inline JavaScript (mixing view & logic)
- Data access, business logic, and UI are tangled
- Hard to understand data flow
- Difficult to maintain and extend
- No clear separation of responsibilities

---

## Target Structure (After)
```
CasaLink/
├── config/
│   └── firebase.js (Firebase configuration)
├── models/
│   ├── User.js (User data model)
│   ├── Property.js (Property data model)
│   ├── Unit.js (Unit data model)
│   ├── Lease.js (Lease data model)
│   ├── Bill.js (Bill data model)
│   ├── MaintenanceRequest.js
│   └── TenantApplication.js
├── views/
│   ├── auth/
│   │   ├── login.html
│   │   └── signup.html
│   ├── dashboard/
│   │   └── dashboard.html
│   ├── properties/
│   │   ├── list.html
│   │   └── detail.html
│   ├── tenants/
│   │   ├── list.html
│   │   └── detail.html
│   ├── billing/
│   │   ├── list.html
│   │   └── detail.html
│   ├── maintenance/
│   │   ├── list.html
│   │   └── detail.html
│   └── admin/
│       ├── dashboard.html
│       ├── users.html
│       ├── analytics.html
│       └── settings.html
├── controllers/
│   ├── AuthController.js
│   ├── DashboardController.js
│   ├── PropertyController.js
│   ├── TenantController.js
│   ├── BillingController.js
│   ├── MaintenanceController.js
│   └── AdminController.js
├── services/
│   ├── FirebaseService.js (Firebase operations)
│   ├── AuthService.js (authentication)
│   ├── DataService.js (data operations)
│   ├── NotificationService.js
│   └── ValidationService.js
├── utilities/
│   ├── helpers.js (utility functions)
│   ├── formatters.js (date, currency formatting)
│   ├── validators.js (form validation)
│   ├── constants.js (app constants)
│   └── logger.js (logging)
├── public/
│   └── index.html (main entry point)
├── css/
│   └── style.css
├── sw.js (service worker)
└── app.js (main bootstrap file)
```

---

## MVC Layer Responsibilities

### 1. **Models** (Data Layer)
- **Purpose**: Define data structure and validation
- **Contains**: Class definitions with properties and methods
- **Responsibilities**:
  - Define object properties
  - Validate data
  - Transform data for storage/retrieval
  - No direct Firebase calls (use services)

**Example:**
```javascript
// models/User.js
class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.name = data.name;
    this.role = data.role; // 'landlord', 'tenant', 'admin'
    this.createdAt = data.createdAt;
  }

  isValid() {
    return this.email && this.name && this.role;
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      role: this.role,
      createdAt: this.createdAt
    };
  }
}
```

### 2. **Views** (Presentation Layer)
- **Purpose**: Present data to user, capture user input
- **Contains**: HTML templates with minimal inline JavaScript
- **Responsibilities**:
  - Display data from controllers
  - Capture user input
  - Trigger controller actions (via event listeners)
  - No business logic or data fetching

**Example:**
```html
<!-- views/dashboard/dashboard.html -->
<div class="dashboard-container">
  <div class="stats-grid" id="statsContainer">
    <!-- Populated by controller -->
  </div>
  <button id="createPropertyBtn" class="btn btn-primary">Create Property</button>
</div>

<script>
  // Only event listeners here - no logic
  document.getElementById('createPropertyBtn')?.addEventListener('click', () => {
    dashboardController.showCreatePropertyModal();
  });
</script>
```

### 3. **Controllers** (Logic Layer)
- **Purpose**: Handle user interactions and orchestrate data flow
- **Contains**: Business logic and user action handlers
- **Responsibilities**:
  - Handle user interactions (clicks, form submissions)
  - Call services to fetch/save data
  - Update views with new data
  - Manage application state (for this section)

**Example:**
```javascript
// controllers/DashboardController.js
class DashboardController {
  constructor(dashboardService, dataService) {
    this.dashboardService = dashboardService;
    this.dataService = dataService;
    this.init();
  }

  async init() {
    await this.loadDashboardData();
  }

  async loadDashboardData() {
    try {
      const user = await this.dataService.getCurrentUser();
      const properties = await this.dataService.getLandlordProperties(user.id);
      this.renderDashboard(properties);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  }

  renderDashboard(properties) {
    const container = document.getElementById('statsContainer');
    container.innerHTML = properties.map(p => `
      <div class="stat-card">
        <h3>${p.name}</h3>
        <p>Units: ${p.units.length}</p>
      </div>
    `).join('');
  }

  async showCreatePropertyModal() {
    // Handle property creation
  }
}
```

### 4. **Services** (Business & Data Logic)
- **Purpose**: Encapsulate complex operations and external interactions
- **Contains**: Data fetching, API calls, business logic
- **Responsibilities**:
  - Interact with Firebase
  - Fetch/save data
  - Perform business calculations
  - Authentication logic
  - Validation rules

**Example:**
```javascript
// services/DataService.js
class DataService {
  constructor(firebaseService) {
    this.firebaseService = firebaseService;
  }

  async getLandlordProperties(landlordId) {
    try {
      const snapshot = await this.firebaseService.query(
        'properties',
        [['landlordId', '==', landlordId]]
      );
      return snapshot.docs.map(doc => new Property(doc.data()));
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  }

  async createProperty(propertyData) {
    const property = new Property(propertyData);
    if (!property.isValid()) {
      throw new Error('Invalid property data');
    }
    return this.firebaseService.create('properties', property.toJSON());
  }
}
```

### 5. **Utilities** (Helper Functions)
- **Purpose**: Provide reusable utility functions
- **Contains**: Formatters, validators, constants, helpers
- **Responsibilities**:
  - Format dates and currencies
  - Validate form inputs
  - Provide app constants
  - Logging and debugging

---

## Data Flow Diagram

```
User Interaction (Click, Submit)
        ↓
    View Layer (HTML)
        ↓
    Controller (Handle Event)
        ↓
    Service (Get/Save Data)
        ↓
    Firebase / External API
        ↓
    Service (Return Data)
        ↓
    Model (Create/Update Object)
        ↓
    Controller (Process Result)
        ↓
    View (Update Display)
```

---

## Refactoring Steps

### Phase 1: Setup
1. Create new folder structure
2. Create base classes/interfaces

### Phase 2: Models
1. Create User, Property, Unit, Lease models
2. Move data validation logic

### Phase 3: Services
1. Create FirebaseService from config
2. Create DataService for CRUD operations
3. Extract business logic from controllers

### Phase 4: Controllers
1. Create DashboardController
2. Create PropertyController
3. Create TenantController
4. Create BillingController
5. Create MaintenanceController

### Phase 5: Views
1. Extract HTML from index.html into separate view files
2. Remove inline JavaScript from views
3. Create view templates

### Phase 6: Integration
1. Update app.js to bootstrap MVC
2. Update imports and references
3. Test all features

### Phase 7: Documentation
1. Write usage guides
2. Document architecture decisions
3. Create extension guide

---

## Example: Refactoring Auth Flow

### Before (Mixed):
```javascript
// index.html
<form id="loginForm">
  <input id="email" type="email">
  <input id="password" type="password">
  <button type="submit">Login</button>
</form>

<script>
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // All logic mixed in
    const auth = firebase.auth();
    try {
      const result = await auth.signInWithEmailAndPassword(email, password);
      // Store user
      localStorage.setItem('user', JSON.stringify(result.user));
      // Show dashboard
      document.getElementById('loginSection').style.display = 'none';
      document.getElementById('dashboardSection').style.display = 'block';
    } catch (error) {
      alert(error.message);
    }
  });
</script>
```

### After (MVC):
```javascript
// views/auth/login.html
<form id="loginForm">
  <input id="email" type="email" required>
  <input id="password" type="password" required>
  <button type="submit">Login</button>
  <div id="errorMessage" class="error"></div>
</form>

<script>
  // Only event listeners
  document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    authController.handleLogin(
      document.getElementById('email').value,
      document.getElementById('password').value
    );
  });
</script>
```

```javascript
// controllers/AuthController.js
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

```javascript
// services/AuthService.js
class AuthService {
  constructor(firebaseService) {
    this.firebaseService = firebaseService;
  }

  async login(email, password) {
    const auth = firebase.auth();
    const result = await auth.signInWithEmailAndPassword(email, password);
    const user = await this.getUserWithAdminStatus(result.user);
    return user;
  }

  async getUserWithAdminStatus(firebaseUser) {
    const userDoc = await this.firebaseService.get('users', firebaseUser.uid);
    return new User({
      id: firebaseUser.uid,
      email: firebaseUser.email,
      ...userDoc.data()
    });
  }
}
```

```javascript
// models/User.js
class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.name = data.name;
    this.role = data.role;
  }

  isAdmin() {
    return this.role === 'admin';
  }
}
```

---

## Key Principles

1. **Single Responsibility**: Each class/file does one thing
2. **Dependency Injection**: Pass dependencies, don't create them
3. **No Circular Dependencies**: Services → Models, Controllers → Services
4. **Testability**: Each layer can be tested independently
5. **Minimal HTML Logic**: Views contain only display logic and event bindings
6. **Clear Data Flow**: Always Model → View, never View → Model directly

---

## Benefits for Your Capstone

✅ **Show Clear Architecture**: Evaluators can see organized structure
✅ **Easy to Explain**: Each layer has obvious responsibility
✅ **Professional Structure**: Matches industry standards
✅ **Easy to Extend**: Adding features is straightforward
✅ **Documentation Friendly**: Structure is self-documenting
✅ **Testing Opportunity**: Can write tests for each layer
✅ **Performance**: Better code organization = easier optimization

---

## Next Steps

1. Review this guide
2. Create the new folder structure
3. Start with Phase 1 (Models)
4. Move incrementally through phases
5. Test frequently
6. Document as you go

---

## Questions to Keep in Mind

- **Does this layer have only one responsibility?**
- **Can this be tested independently?**
- **Is data flow always in one direction?**
- **Are dependencies clearly injected?**
- **Could a new developer understand this structure quickly?**

