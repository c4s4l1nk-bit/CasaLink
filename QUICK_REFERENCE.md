# CasaLink MVC - Visual Reference & Cheat Sheet

## 🏗️ Architecture Layers at a Glance

```
┌─────────────────────────────────────────────────────┐
│                    USER INTERFACE                    │
│  (Views - HTML, CSS, Events)                        │
│  views/auth/login.html, views/dashboard/...         │
└──────────────────┬──────────────────────────────────┘
                   │ User interaction
                   ↓
┌─────────────────────────────────────────────────────┐
│              BUSINESS LOGIC                         │
│  (Controllers - Handle events, update views)        │
│  controllers/AuthController.js, ...                 │
└──────────────────┬──────────────────────────────────┘
                   │ Call service methods
                   ↓
┌─────────────────────────────────────────────────────┐
│        EXTERNAL OPERATIONS & BUSINESS RULES         │
│  (Services - Firebase, auth, data operations)       │
│  services/DataService.js, AuthService.js, ...       │
└──────────────────┬──────────────────────────────────┘
                   │ Fetch/save data
                   ↓
┌─────────────────────────────────────────────────────┐
│              DATA STORAGE & VALIDATION              │
│  (Models - Data structure, validation, helpers)     │
│  models/User.js, models/Property.js, ...            │
└──────────────────┬──────────────────────────────────┘
                   │
                   ↓
         ┌─────────────────────┐
         │  FIREBASE / DATABASE │
         └─────────────────────┘
```

---

## 📚 Layer Purposes Quick Reference

| Layer | Purpose | Responsibility | Example |
|-------|---------|-----------------|---------|
| **Views** | Display & Capture | Show data, capture input, emit events | `login.html`, `dashboard.html` |
| **Controllers** | Orchestrate | Handle user events, call services, update views | `AuthController.login()` |
| **Services** | Execute | Business logic, database ops, calculations | `AuthService.login(email, pwd)` |
| **Models** | Define & Validate | Data structure, validation, helpers | `User.isValid()` |
| **Utilities** | Assist | Helpers, formatters, constants | `Formatters.formatCurrency()` |

---

## 🔄 Data Flow Examples

### Example 1: User Login

```
┌──────────────────────────┐
│ User clicks Login button │
└────────────┬─────────────┘
             │
             ↓
┌──────────────────────────────────────────┐
│ View (login.html)                        │
│ - Captures email & password              │
│ - Calls authController.handleLogin()     │
└────────────┬─────────────────────────────┘
             │
             ↓
┌──────────────────────────────────────────┐
│ Controller (AuthController)              │
│ - Validates input                        │
│ - Calls authService.login()              │
│ - Updates view with result               │
└────────────┬─────────────────────────────┘
             │
             ↓
┌──────────────────────────────────────────┐
│ Service (AuthService)                    │
│ - Calls Firebase signIn()                │
│ - Fetches user from Firestore            │
│ - Creates User model                     │
│ - Returns User object                    │
└────────────┬─────────────────────────────┘
             │
             ↓
┌──────────────────────────────────────────┐
│ Model (User)                             │
│ - User { id, email, name, role }        │
│ - Methods: isAdmin(), toJSON()           │
└────────────┬─────────────────────────────┘
             │
             ↓
┌──────────────────────────────────────────┐
│ Service returns User object              │
└────────────┬─────────────────────────────┘
             │
             ↓
┌──────────────────────────────────────────┐
│ Controller updates view                  │
│ - Hides login section                    │
│ - Shows dashboard                        │
│ - Stores user in localStorage            │
└────────────┬─────────────────────────────┘
             │
             ↓
┌──────────────────────────────────────────┐
│ View (dashboard.html)                    │
│ - Displays user info                     │
│ - Shows user-specific content            │
└──────────────────────────────────────────┘
```

### Example 2: Create Property

```
User fills form
    ↓
View calls propertyController.handleCreate()
    ↓
Controller validates input
    ↓
Controller creates Property model
    ↓
Controller calls dataService.createProperty()
    ↓
Service validates model
    ↓
Service calls firebaseService.create()
    ↓
Firebase creates document
    ↓
Service returns property ID
    ↓
Controller shows success message
    ↓
Controller reloads property list
    ↓
View displays updated list
```

---

## 📋 Models Reference

### User Model
```javascript
new User({
  id: 'user123',
  email: 'landlord@example.com',
  name: 'John Landlord',
  role: 'landlord'  // 'admin', 'landlord', 'tenant'
})

// Methods:
.isValid()              // Check if valid
.isAdmin()              // Is admin?
.isLandlord()           // Is landlord?
.isTenant()             // Is tenant?
.getDisplayName()       // Get display name
.toJSON()               // Convert to JSON
.getValidationErrors()  // Get error list
```

### Property Model
```javascript
new Property({
  landlordId: 'landlord123',
  name: 'Sunset Apartments',
  address: '123 Main St',
  city: 'San Francisco',
  state: 'CA',
  totalUnits: 12
})

// Methods:
.isValid()
.getFullAddress()  // "123 Main St, San Francisco, CA"
.toJSON()
.getValidationErrors()
```

### Unit Model
```javascript
new Unit({
  propertyId: 'prop123',
  unitNumber: '101',
  bedroomCount: 2,
  bathroomCount: 1,
  rentAmount: 2000,
  status: 'occupied'  // 'vacant', 'occupied', 'maintenance'
})

// Methods:
.isValid()
.isOccupied()   // Check if occupied
.isVacant()     // Check if vacant
.getDisplayName() // "Unit 101"
.toJSON()
.getValidationErrors()
```

### Lease Model
```javascript
new Lease({
  unitId: 'unit123',
  tenantId: 'tenant123',
  startDate: new Date('2026-01-01'),
  endDate: new Date('2027-01-01'),
  monthlyRent: 2000
})

// Methods:
.isValid()
.isActive()         // Is active?
.isExpired()        // Has ended?
.isExpiringSoon()   // Ends within 30 days?
.getDurationInMonths() // 12
.toJSON()
.getValidationErrors()
```

### Bill Model
```javascript
new Bill({
  unitId: 'unit123',
  tenantId: 'tenant123',
  amount: 2000,
  dueDate: new Date('2026-02-01'),
  status: 'pending'  // 'pending', 'paid', 'overdue'
})

// Methods:
.isValid()
.isOverdue()         // Is overdue?
.isPaid()            // Is paid?
.getRemainingAmount() // Amount still owed
.getDaysOverdue()    // Days overdue
.getTotalAmount()    // Amount + late fees
.toJSON()
.getValidationErrors()
```

### MaintenanceRequest Model
```javascript
new MaintenanceRequest({
  unitId: 'unit123',
  title: 'Leaky faucet',
  description: 'Kitchen faucet dripping',
  category: 'plumbing',  // plumbing, electrical, etc
  priority: 'normal'  // low, normal, high, emergency
})

// Methods:
.isValid()
.isOpen()            // Not yet completed?
.isCompleted()       // Is completed?
.isUrgent()          // High or emergency priority?
.getPriorityColor()  // Get color for UI
.getDaysSinceCreation() // Age in days
.toJSON()
.getValidationErrors()
```

---

## 🛠️ Services Reference

### FirebaseService
```javascript
const fs = new FirebaseService(config);

// CRUD Operations
await fs.create('users', userData)              // Add document
const doc = await fs.read('users', userId)     // Get by ID
await fs.update('users', userId, updates)      // Update
await fs.delete('users', userId)                // Delete

// Queries
const snapshot = await fs.query(
  'properties',
  [['landlordId', '==', landlordId]],  // Conditions
  { orderBy: { field: 'name' }, limit: 10 }
)

// Real-time Listeners
const unsubscribe = fs.listen(
  'bills',
  [['status', '==', 'overdue']],
  (snapshot) => {
    snapshot.docs.forEach(doc => {
      // Handle document
    })
  }
)
unsubscribe() // Stop listening

// Batch Operations
await fs.batch(async (batch) => {
  batch.set(ref1, data1)
  batch.update(ref2, data2)
  batch.delete(ref3)
})

// Auth
await fs.signUp(email, password)
await fs.signIn(email, password)
await fs.signOut()
const user = fs.getCurrentUser()
fs.onAuthStateChanged(callback)
```

### AuthService
```javascript
const as = new AuthService(firebaseService);

// Authentication
const user = await as.login(email, password)
const user = await as.register(email, password, userData)
await as.logout()

// User Management
const user = await as.getCurrentUser()
const isAdmin = await as.isAdmin(userId)

// Password
await as.changePassword(currentPassword, newPassword)
await as.resetPassword(email)

// Errors
const message = as.getErrorMessage(errorCode)
```

### DataService
```javascript
const ds = new DataService(firebaseService);

// USERS
const user = await ds.getUser(userId)
const users = await ds.getUsers({ role: 'landlord' })
const id = await ds.createUser(userModel)
await ds.updateUser(userId, updates)
await ds.deleteUser(userId)

// PROPERTIES
const props = await ds.getLandlordProperties(landlordId)
const prop = await ds.getProperty(propertyId)
const id = await ds.createProperty(propertyModel)
await ds.updateProperty(propertyId, updates)

// UNITS
const units = await ds.getPropertyUnits(propertyId)
const unit = await ds.getUnit(unitId)
const id = await ds.createUnit(unitModel)
await ds.updateUnit(unitId, updates)

// LEASES
const leases = await ds.getUnitLeases(unitId)
const lease = await ds.getActiveLeaseForUnit(unitId)
const id = await ds.createLease(leaseModel)

// BILLS
const bills = await ds.getUnitBills(unitId, { status: 'overdue' })
const overdue = await ds.getOverdueBills(landlordId)
const id = await ds.createBill(billModel)
await ds.updateBill(billId, updates)

// MAINTENANCE
const requests = await ds.getUnitMaintenanceRequests(unitId)
const openRequests = await ds.getPropertyOpenRequests(propertyId)
const id = await ds.createMaintenanceRequest(requestModel)
await ds.updateMaintenanceRequest(requestId, updates)
```

---

## 🎨 Utilities Reference

### AppHelpers
```javascript
// ID Generation
const id = AppHelpers.generateId()  // Unique ID

// Delays
await AppHelpers.delay(1000)  // Wait 1 second

// Function Optimization
const debounced = AppHelpers.debounce(func, 300)  // Wait 300ms
const throttled = AppHelpers.throttle(func, 1000)  // Max once/1s

// Object Operations
const clone = AppHelpers.deepClone(obj)  // Deep copy
const isEmpty = AppHelpers.isEmpty(obj)  // Check if empty
const merged = AppHelpers.merge(obj1, obj2)  // Merge objects

// URL
const param = AppHelpers.getQueryParam('id')  // Get URL param

// Validation
const valid = AppHelpers.isValidEmail(email)
const valid = AppHelpers.isValidPhone(phone)

// String
const titled = AppHelpers.capitalize(str)
const titled = AppHelpers.camelToTitle('myString')  // "My String"

// Logging
AppHelpers.log('Message', 'success')  // Log with emoji
AppHelpers.log('Error', 'error')

// Notifications
AppHelpers.showToast('Success!', 'success', 3000)
AppHelpers.showToast('Error', 'error', 5000)
```

### Formatters
```javascript
// Dates
Formatters.formatDate(date, 'short')      // 01/30/26
Formatters.formatDate(date, 'long')       // January 30, 2026
Formatters.formatDate(date, 'full')       // Wednesday, January 30, 2026
Formatters.formatDateTime(date)           // 01/30/26 02:30 PM

// Currency
Formatters.formatCurrency(1234.56)        // $1,234.56
Formatters.formatCurrency(1234, 'EUR')    // €1,234.00

// Phone
Formatters.formatPhone('5551234567')      // (555) 123-4567

// Percentage
Formatters.formatPercentage(0.75)         // 75%
Formatters.formatPercentage(0.75, 2)      // 75.00%

// Time
Formatters.formatTimeAgo(date)            // "2 hours ago"

// File Size
Formatters.formatFileSize(1024)           // 1 KB

// Names
Formatters.formatName('john doe')         // John Doe

// Status
Formatters.formatStatusBadge('paid')      // HTML badge
Formatters.formatLabel('bill_status')     // "Bill Status"

// Text
Formatters.truncate('Long text...', 20)   // "Long text..."
```

### Constants
```javascript
AppConstants.ROLES  // { ADMIN: 'admin', LANDLORD: 'landlord', TENANT: 'tenant' }
AppConstants.UNIT_STATUS  // { VACANT, OCCUPIED, MAINTENANCE }
AppConstants.LEASE_STATUS  // { ACTIVE, ENDED, PENDING }
AppConstants.BILL_STATUS  // { PENDING, PAID, OVERDUE, PARTIAL }
AppConstants.MAINTENANCE_PRIORITY  // { LOW, NORMAL, HIGH, EMERGENCY }
AppConstants.VALIDATION  // { MIN_PASSWORD_LENGTH: 6, ... }
AppConstants.STORAGE_KEYS  // { USER, ADMIN_SESSION, ... }
```

---

## 🎬 Controller Pattern

All controllers follow this pattern:

```javascript
class [Feature]Controller {
  constructor(service1, service2) {
    this.service1 = service1;
    this.service2 = service2;
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Setup click handlers, form submissions, etc
    document.getElementById('btn')?.addEventListener('click', 
      () => this.handleAction()
    );
  }

  async handleAction() {
    this.setLoading(true);
    try {
      // Call service
      const result = await this.service1.doSomething();
      // Update view
      this.render(result);
      this.showSuccess('Done!');
    } catch (error) {
      this.showError(error.message);
    } finally {
      this.setLoading(false);
    }
  }

  render(data) {
    // Update HTML with data
  }

  showError(msg) {
    AppHelpers.showToast(msg, 'error');
  }

  showSuccess(msg) {
    AppHelpers.showToast(msg, 'success');
  }

  setLoading(isLoading) {
    // Show/hide loading indicator
  }
}
```

---

## 📂 File Loading Order

Always load in this order:

```html
<!-- 1. Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"></script>

<!-- 2. Config -->
<script src="config/firebase.js"></script>

<!-- 3. Models (in any order) -->
<script src="models/User.js"></script>
<script src="models/Property.js"></script>
<script src="models/Unit.js"></script>
<script src="models/Lease.js"></script>
<script src="models/Bill.js"></script>
<script src="models/MaintenanceRequest.js"></script>

<!-- 4. Services (in any order) -->
<script src="services/FirebaseService.js"></script>
<script src="services/AuthService.js"></script>
<script src="services/DataService.js"></script>

<!-- 5. Utilities (in any order) -->
<script src="utilities/helpers.js"></script>
<script src="utilities/formatters.js"></script>
<script src="utilities/constants.js"></script>

<!-- 6. Controllers (any order) -->
<script src="controllers/AuthController.js"></script>
<script src="controllers/DashboardController.js"></script>
<!-- ... more controllers ... -->

<!-- 7. App Bootstrap -->
<script src="app.js"></script>
```

---

## ✅ Validation Pattern

All models validate the same way:

```javascript
// Create model
const user = new User(data);

// Check if valid
if (!user.isValid()) {
  const errors = user.getValidationErrors();
  console.log('Errors:', errors);
  // ['Email is required', 'Name is required']
  return;
}

// Save to database
const id = await dataService.createUser(user);
```

---

## 🔍 Debugging Checklist

- [ ] Firebase SDK loaded? `console.log(firebase)`
- [ ] Models defined? `console.log(User)`
- [ ] Services initialized? `console.log(firebaseService)`
- [ ] Controllers bound? `console.log(authController)`
- [ ] No console errors? Check browser console
- [ ] DOM elements exist? Check Elements tab
- [ ] Network requests? Check Network tab
- [ ] Data in Firebase? Check Firestore console

---

## 💻 Browser Console Commands

```javascript
// Check everything is loaded
[User, Property, Unit, Lease, Bill, MaintenanceRequest].forEach(m => {
  console.log(`${m.name}: `, m.toString().substring(0, 50));
});

// Test model
const user = new User({ email: 'test@test.com', name: 'Test', role: 'tenant' });
console.log('Valid:', user.isValid());
console.log('Errors:', user.getValidationErrors());

// Test service
const props = await dataService.getLandlordProperties('landlord-123');
console.log('Properties:', props);

// Test formatter
console.log(Formatters.formatCurrency(1234.56));
console.log(Formatters.formatDate(new Date()));

// Test helper
AppHelpers.showToast('Test message', 'success');
const id = AppHelpers.generateId();

// Check constants
console.table(AppConstants.ROLES);
console.table(AppConstants.BILL_STATUS);
```

---

## 🎯 Common Tasks

### Create a new user
```javascript
const user = new User({
  email: 'newtenant@example.com',
  name: 'New Tenant',
  role: 'tenant'
});

if (user.isValid()) {
  const userId = await dataService.createUser(user);
  console.log('User created:', userId);
}
```

### Get all landlord properties
```javascript
const properties = await dataService.getLandlordProperties('landlord-id-123');
properties.forEach(prop => {
  console.log(prop.name + ' (' + prop.totalUnits + ' units)');
});
```

### Check if bill is overdue
```javascript
const bills = await dataService.getUnitBills('unit-123');
bills.forEach(bill => {
  if (bill.isOverdue()) {
    console.log(bill.amount + ' is ' + bill.getDaysOverdue() + ' days overdue');
  }
});
```

### Format and display data
```javascript
bills.forEach(bill => {
  console.log(
    Formatters.formatDate(bill.dueDate) + ': ' +
    Formatters.formatCurrency(bill.amount) + ' - ' +
    Formatters.formatStatusBadge(bill.status)
  );
});
```

---

This cheat sheet provides quick reference for:
- Architecture overview
- Data flow examples
- Model/Service API reference
- Utilities quick lookup
- Controller pattern
- Debugging commands
- Common tasks

Bookmark this for fast reference while developing!

