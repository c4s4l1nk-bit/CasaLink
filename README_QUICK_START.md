# CasaLink MVC Architecture - Quick Start Guide

## 📋 What's Been Created

Your CasaLink project now has a professional **Clean MVC Architecture**. Here's what's been set up:

### ✅ Complete
- **Models** (6 classes): User, Property, Unit, Lease, Bill, MaintenanceRequest
- **Services** (3 classes): FirebaseService, AuthService, DataService
- **Utilities**: Helpers, Formatters, Constants
- **Controllers**: AuthController (example)
- **Documentation**: Architecture guide, implementation guide, this quick start

### 📁 Directory Structure
```
CasaLink/
├── models/                 # Data models
│   ├── User.js
│   ├── Property.js
│   ├── Unit.js
│   ├── Lease.js
│   ├── Bill.js
│   └── MaintenanceRequest.js
├── views/                  # HTML templates (to be created)
│   ├── auth/
│   ├── dashboard/
│   ├── properties/
│   ├── tenants/
│   ├── billing/
│   ├── maintenance/
│   └── admin/
├── controllers/            # Business logic
│   ├── AuthController.js
│   ├── DashboardController.js
│   ├── PropertyController.js
│   ├── TenantController.js
│   ├── BillingController.js
│   ├── MaintenanceController.js
│   └── AdminController.js
├── services/              # External integrations
│   ├── FirebaseService.js
│   ├── AuthService.js
│   ├── DataService.js
│   └── NotificationService.js
├── utilities/             # Helpers
│   ├── helpers.js
│   ├── formatters.js
│   ├── constants.js
│   └── validators.js
└── Documentation
    ├── MVC_REFACTORING_GUIDE.md
    ├── MVC_ARCHITECTURE.md
    ├── MVC_IMPLEMENTATION_GUIDE.md
    └── README_QUICK_START.md (this file)
```

---

## 🚀 Getting Started

### Step 1: Understand the Architecture (15 minutes)

Read these in order:
1. **MVC_REFACTORING_GUIDE.md** - Why and what is MVC
2. **MVC_ARCHITECTURE.md** - Detailed layer responsibilities
3. **This file** - Quick reference

### Step 2: Test the Models (5 minutes)

Open browser console and test:
```javascript
// Test User model
const user = new User({
  email: 'landlord@example.com',
  name: 'John Landlord',
  role: 'landlord'
});

console.log(user.isValid()); // true
console.log(user.isLandlord()); // true
console.log(user.toJSON()); // {id: null, email: "landlord@example.com", ...}

// Test validation errors
const badUser = new User({ email: 'bad' });
console.log(badUser.getValidationErrors()); // ["Email is required", ...]
```

### Step 3: Load All Files in HTML

Update your `index.html`:
```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div id="app"></div>

    <!-- Firebase -->
    <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"></script>

    <!-- Config -->
    <script src="config/firebase.js"></script>

    <!-- Models -->
    <script src="models/User.js"></script>
    <script src="models/Property.js"></script>
    <script src="models/Unit.js"></script>
    <script src="models/Lease.js"></script>
    <script src="models/Bill.js"></script>
    <script src="models/MaintenanceRequest.js"></script>

    <!-- Services -->
    <script src="services/FirebaseService.js"></script>
    <script src="services/AuthService.js"></script>
    <script src="services/DataService.js"></script>

    <!-- Utilities -->
    <script src="utilities/helpers.js"></script>
    <script src="utilities/formatters.js"></script>
    <script src="utilities/constants.js"></script>

    <!-- Controllers -->
    <script src="controllers/AuthController.js"></script>
    <script src="controllers/DashboardController.js"></script>
    <!-- ... add more controllers as created -->

    <!-- App Bootstrap -->
    <script src="app.js"></script>
</body>
</html>
```

### Step 4: Create app.js

Create `app.js` in root folder:
```javascript
/**
 * CasaLink App Bootstrap
 */
class CasaLinkApp {
  constructor(firebaseConfig) {
    // Initialize services
    this.firebaseService = new FirebaseService(firebaseConfig);
    this.authService = new AuthService(this.firebaseService);
    this.dataService = new DataService(this.firebaseService);
    
    console.log('✅ CasaLink App initialized');
    this.init();
  }

  async init() {
    // Check auth state
    this.firebaseService.onAuthStateChanged(async (user) => {
      if (user) {
        console.log('✅ User logged in');
        // Show dashboard
      } else {
        console.log('❌ User not logged in');
        // Show login
      }
    });
  }
}

// Bootstrap on page load
document.addEventListener('DOMContentLoaded', () => {
  const firebaseConfig = {
    apiKey: "YOUR_KEY",
    authDomain: "YOUR_DOMAIN",
    projectId: "YOUR_PROJECT",
    storageBucket: "YOUR_BUCKET",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
  };

  window.app = new CasaLinkApp(firebaseConfig);
});
```

---

## 📚 Quick Reference

### Models
```javascript
// User
const user = new User({ email: '...', name: '...', role: 'landlord' });
user.isValid()          // Check if valid
user.isAdmin()          // Check if admin
user.getValidationErrors() // Get error list
user.toJSON()           // Convert to JSON

// Property
const property = new Property({ name: '...', address: '...', totalUnits: 5 });
property.getFullAddress() // Get formatted address

// Unit
const unit = new Unit({ unitNumber: '101', rentAmount: 1200, propertyId: '...' });
unit.isOccupied()       // Check if occupied
unit.isVacant()         // Check if vacant

// Lease
const lease = new Lease({ startDate: new Date(), monthlyRent: 1200 });
lease.isActive()        // Check if active
lease.isExpired()       // Check if expired
lease.isExpiringSoon()  // Check if expiring in 30 days

// Bill
const bill = new Bill({ amount: 1200, dueDate: new Date() });
bill.isOverdue()        // Check if overdue
bill.getRemainingAmount() // Get unpaid amount
bill.getDaysOverdue()   // Get how many days overdue

// MaintenanceRequest
const request = new MaintenanceRequest({ title: '...', description: '...' });
request.isUrgent()      // Check if high priority
request.getDaysSinceCreation() // Get age
```

### Services
```javascript
// Firebase Service
const fs = new FirebaseService(config);
await fs.create('users', userData);         // Create
const doc = await fs.read('users', id);     // Read
await fs.update('users', id, updates);      // Update
await fs.delete('users', id);                // Delete
const snapshot = await fs.query('users', [['role', '==', 'landlord']]); // Query

// Auth Service
const as = new AuthService(firebaseService);
const user = await as.login(email, password);     // Login
const user = await as.register(email, password, data); // Register
await as.logout();                                  // Logout
await as.changePassword(old, new);                // Change password
const isAdmin = await as.isAdmin(userId);         // Check admin

// Data Service
const ds = new DataService(firebaseService);
const user = await ds.getUser(userId);                      // Get user
const users = await ds.getUsers({ role: 'landlord' });      // Query users
const properties = await ds.getLandlordProperties(id);      // Get properties
const units = await ds.getPropertyUnits(propertyId);        // Get units
const bills = await ds.getUnitBills(unitId);               // Get bills
const requests = await ds.getUnitMaintenanceRequests(id); // Get requests
```

### Utilities
```javascript
// Helpers
AppHelpers.generateId()                 // Random ID
AppHelpers.debounce(func, wait)        // Debounce function
AppHelpers.deepClone(obj)              // Deep copy
AppHelpers.showToast(msg, 'success')   // Show notification

// Formatters
Formatters.formatCurrency(100)         // $100.00
Formatters.formatDate(date, 'long')    // January 30, 2026
Formatters.formatPhone('5551234567')   // (555) 123-4567
Formatters.formatTimeAgo(date)         // "2 days ago"
Formatters.formatStatusBadge('paid')   // HTML badge

// Constants
AppConstants.ROLES                     // { ADMIN, LANDLORD, TENANT }
AppConstants.UNIT_STATUS               // { VACANT, OCCUPIED, MAINTENANCE }
AppConstants.BILL_STATUS               // { PENDING, PAID, OVERDUE, PARTIAL }
AppConstants.MAINTENANCE_PRIORITY      // { LOW, NORMAL, HIGH, EMERGENCY }
AppConstants.VALIDATION                // Min/max lengths
```

---

## 💡 Architecture Flow

```
User clicks button
        ↓
    View (HTML)
 (event listener)
        ↓
   Controller
(handle logic)
        ↓
    Service
(get/save data)
        ↓
  Firebase/DB
        ↓
    Model
(transform data)
        ↓
    Service
(return data)
        ↓
   Controller
(update view)
        ↓
    View (HTML)
(display result)
```

---

## 🔧 Creating a New Feature

### Example: Add a new "ReportsController"

#### 1. Create model if needed
```javascript
// models/Report.js
class Report {
  constructor(data = {}) {
    this.id = data.id;
    this.landlordId = data.landlordId;
    this.type = data.type; // 'revenue', 'occupancy', etc
    this.data = data.data;
    this.createdAt = data.createdAt || new Date();
  }

  isValid() {
    return this.landlordId && this.type && this.data;
  }

  toJSON() {
    return {
      id: this.id,
      landlordId: this.landlordId,
      type: this.type,
      data: this.data,
      createdAt: this.createdAt
    };
  }
}
```

#### 2. Add service methods
```javascript
// In services/DataService.js
async getReports(landlordId) {
  const conditions = [['landlordId', '==', landlordId]];
  const snapshot = await this.firebaseService.query('reports', conditions);
  return snapshot.docs.map(doc => new Report(doc.data()));
}

async createReport(report) {
  if (!report.isValid()) {
    throw new Error('Invalid report');
  }
  return await this.firebaseService.create('reports', report.toJSON());
}
```

#### 3. Create controller
```javascript
// controllers/ReportsController.js
class ReportsController {
  constructor(dataService) {
    this.dataService = dataService;
  }

  async loadReports(landlordId) {
    const reports = await this.dataService.getReports(landlordId);
    this.renderReports(reports);
  }

  renderReports(reports) {
    // Update HTML
  }

  async generateReport(type) {
    // Generate new report
  }
}
```

#### 4. Initialize in app.js
```javascript
this.reportsController = new ReportsController(this.dataService);
```

---

## 🧪 Testing Commands

```javascript
// In browser console, after files are loaded

// Test 1: Models work
const user = new User({ email: 'test@test.com', name: 'Test' });
console.assert(user.isValid() === true, 'User model failed');

// Test 2: Services initialized
console.assert(window.firebaseService, 'Firebase service missing');
console.assert(window.authService, 'Auth service missing');
console.assert(window.dataService, 'Data service missing');

// Test 3: Utilities available
console.assert(AppHelpers, 'Helpers missing');
console.assert(Formatters, 'Formatters missing');
console.assert(AppConstants, 'Constants missing');

// Test 4: Controllers available
console.assert(window.authController, 'Auth controller missing');

console.log('✅ All tests passed!');
```

---

## 📖 Documentation Files

1. **MVC_REFACTORING_GUIDE.md** (Read First)
   - Why MVC?
   - Architecture overview
   - Pros and cons
   - Benefits for capstone

2. **MVC_ARCHITECTURE.md** (Reference)
   - Detailed layer responsibilities
   - Data flow diagrams
   - Best practices
   - Security notes

3. **MVC_IMPLEMENTATION_GUIDE.md** (How-To)
   - Step-by-step implementation
   - Phase-by-phase breakdown
   - Code examples
   - Troubleshooting

4. **This file** (Quick Start)
   - What's created
   - Quick commands
   - Common patterns
   - Getting started

---

## ⚠️ Important Notes

### Order Matters
Always load files in this order:
1. Firebase SDK
2. Config
3. Models
4. Services
5. Utilities
6. Controllers
7. App bootstrap

### No Global State (Mostly)
- Controllers manage their own state
- Avoid global variables
- Use services to share data

### Validation First
- Always validate models before saving
- Use model.getValidationErrors() to debug

### Error Handling
```javascript
try {
  await this.dataService.createUser(user);
  AppHelpers.showToast('User created!', 'success');
} catch (error) {
  AppHelpers.showToast(error.message, 'error');
  console.error('Error:', error);
}
```

---

## 🎯 Next Steps

1. **Read the full architecture docs**
   - Start with MVC_REFACTORING_GUIDE.md
   - Then read MVC_ARCHITECTURE.md

2. **Create remaining controllers**
   - DashboardController
   - PropertyController
   - TenantController
   - BillingController
   - MaintenanceController
   - AdminController

3. **Extract views from existing HTML**
   - Move HTML into separate view files
   - Remove logic from views

4. **Implement app.js bootstrap**
   - Initialize all services and controllers
   - Handle auth state
   - Load views

5. **Test everything**
   - Auth flows
   - CRUD operations
   - UI interactions

6. **Deploy with confidence**
   - Clean architecture
   - Well-documented
   - Easy to maintain

---

## 🎓 For Your Capstone Presentation

### Key Points to Explain

**Architecture Layers:**
- Models define data structure
- Views show UI
- Controllers handle user interactions
- Services manage business logic
- Utilities provide helpers

**Data Flow:**
- User interaction → View → Controller → Service → Database → Back to View

**Benefits:**
- Separation of concerns
- Easy to test
- Easy to extend
- Professional structure
- Industry standard

**Code Examples:**
Show how each layer works together with a simple example like login or create property

---

## 💪 You're Ready!

Your CasaLink project now has:
- ✅ Professional MVC architecture
- ✅ Clean separation of concerns
- ✅ Reusable components
- ✅ Comprehensive documentation
- ✅ Example implementations

Start with the documentation, understand the architecture, then implement the remaining pieces following the same patterns shown in the examples.

**Questions?** Refer to the documentation files or browser console for debugging.

**Good luck with your Capstone! 🚀**

