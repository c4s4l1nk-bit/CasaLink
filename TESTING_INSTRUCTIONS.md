# CasaLink Integration Testing - How to Run Tests

**Phase**: Phase 9 - Integration Testing & Validation  
**Date Created**: January 30, 2026  
**Status**: Ready for Execution

---

## Quick Start

### Step 1: Set Up Testing Environment

```
1. Open your CasaLink application in a browser
2. Login with a test account
3. Press F12 to open Developer Tools
4. Go to "Console" tab
5. You're ready to test!
```

### Step 2: Run Environment Validation

```javascript
// Copy and paste this entire file into browser console:
// File: INTEGRATION_TEST_CONSOLE.js

// The script will automatically:
// ✅ Verify Firebase is loaded
// ✅ Check all services are initialized
// ✅ Verify all models are loaded
// ✅ Check all controllers exist
// ✅ Test model instantiation
// ✅ Verify Firestore connectivity
// ✅ Display comprehensive summary
```

**Location**: Copy from [INTEGRATION_TEST_CONSOLE.js](INTEGRATION_TEST_CONSOLE.js)

### Step 3: Review Results

The console will display:
- ✅ All green checkmarks = System ready
- ⚠️ Orange warnings = Minor issues
- ❌ Red errors = Blocking issues

---

## Detailed Testing Guide

### CATEGORY 1: Authentication Testing (5 Tests)

#### Test 1.1: User Signup ✅

**Prerequisites**: Login page accessible

**Steps**:
```
1. Close browser or clear cache (to start fresh)
2. Open CasaLink application
3. If logged in, logout first
4. Click "Sign Up" link
5. Fill the form:
   - Name: Test User
   - Email: testuser@example.com
   - Password: Test@123456
   - Confirm Password: Test@123456
   - Role: Select "Landlord"
6. Click "Create Account"
```

**Expected Results**:
```
✅ Form validates all fields
✅ Password validation shows strength
✅ Confirm password matches
✅ Account created successfully
✅ Automatically logged in
✅ Redirected to dashboard
✅ No console errors
```

**Verification**:
```
In Console:
1. Should see no errors
2. Should see successful auth event
3. User data should be in Firestore
```

**Test Status**: [ ] PASS [ ] FAIL [ ] BLOCKED

---

#### Test 1.2: User Login ✅

**Prerequisites**: Test user account exists from previous test

**Steps**:
```
1. Logout if currently logged in
2. On login page, enter:
   - Email: testuser@example.com
   - Password: Test@123456
3. Click "Login" button
4. Wait for redirect to dashboard
```

**Expected Results**:
```
✅ Login form validates
✅ Firebase authentication succeeds
✅ Dashboard loads
✅ Welcome message shows name
✅ All dashboard data populated
✅ No console errors
```

**Verification**:
```
In Console:
1. Check for no authentication errors
2. User should be current user: firebase.auth().currentUser.email
3. User document should load from Firestore
```

**Test Status**: [ ] PASS [ ] FAIL [ ] BLOCKED

---

#### Test 1.3: Invalid Credentials ✅

**Prerequisites**: Login page accessible

**Steps**:
```
1. On login page, enter:
   - Email: wronguser@example.com
   - Password: WrongPassword123
2. Click "Login"
3. Observe error handling
```

**Expected Results**:
```
✅ Form validation works
✅ Error message displays (e.g., "User not found")
✅ Form remains on page (doesn't navigate)
✅ User can retry
✅ No sensitive data leaked
✅ No console errors
```

**Verification**:
```
In Console:
1. Should see Firebase auth error
2. User should be null: firebase.auth().currentUser === null
3. Error message should be user-friendly
```

**Test Status**: [ ] PASS [ ] FAIL [ ] BLOCKED

---

#### Test 1.4: Logout ✅

**Prerequisites**: User logged in

**Steps**:
```
1. Be on any authenticated page (dashboard)
2. Look for logout button/option
3. Click "Logout" or "Sign Out"
4. Observe the result
```

**Expected Results**:
```
✅ Session cleared
✅ Redirected to login page
✅ Cannot go back to dashboard without login
✅ All user data cleared from memory
✅ No console errors
```

**Verification**:
```
In Console:
1. firebase.auth().currentUser should be null
2. Try to access protected page - should redirect to login
3. No user data should be accessible
```

**Test Status**: [ ] PASS [ ] FAIL [ ] BLOCKED

---

#### Test 1.5: Remember Me ✅

**Prerequisites**: Test user exists

**Steps**:
```
1. On login page
2. Check "Remember Me" checkbox
3. Enter credentials and login
4. Wait for successful login
5. Close the browser completely (or tab)
6. Reopen CasaLink in new tab
7. Check if auto-logged in
```

**Expected Results**:
```
✅ Remember me checkbox present
✅ Email saved in local storage
✅ On reload, user auto-logged in (if remember-me was checked)
✅ Dashboard loads without entering credentials
✅ Session still valid
```

**Verification**:
```
In Console:
1. Check localStorage for saved email:
   localStorage.getItem('rememberMeEmail')
2. Should contain email address
3. Can logout and uncheck remember-me for next login
```

**Test Status**: [ ] PASS [ ] FAIL [ ] BLOCKED

---

### CATEGORY 2: Model Validation Testing (5 Tests)

#### Test 2.1: User Model Validation ✅

**In Console**:
```javascript
// Test valid user
const validUser = new User({
    id: 'test-' + Date.now(),
    name: 'John Doe',
    email: 'john@example.com',
    password: 'Pass@123456',
    role: 'landlord',
    phone: '+1-555-0123'
});

console.log('Valid User - isValid():', validUser.isValid());
console.log('Valid User - validation errors:', validUser.getValidationErrors());

// Test invalid user (missing email)
const invalidUser = new User({
    id: 'test-2',
    name: 'Jane Doe',
    password: 'Pass@123456',
    role: 'landlord'
});

console.log('Invalid User - isValid():', invalidUser.isValid());
console.log('Invalid User - validation errors:', invalidUser.getValidationErrors());
```

**Expected Results**:
```
✅ Valid user passes validation (true)
✅ Invalid user fails validation (false)
✅ Error messages are clear and specific
✅ Required fields are enforced
```

**Test Status**: [ ] PASS [ ] FAIL [ ] BLOCKED

---

#### Test 2.2: Property Model Validation ✅

**In Console**:
```javascript
// Test valid property
const validProperty = new Property({
    id: 'prop-' + Date.now(),
    address: '123 Main St',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62701',
    propertyType: 'apartment',
    bedrooms: 2,
    bathrooms: 1.5,
    monthlyRate: 1500,
    ownerID: 'owner-123'
});

console.log('Valid Property - isValid():', validProperty.isValid());
console.log('Valid Property - errors:', validProperty.getValidationErrors());

// Test invalid property (negative rent)
const invalidProperty = new Property({
    id: 'prop-2',
    address: '456 Oak Ave',
    city: 'Shelbyville',
    state: 'IL',
    zipCode: '62702',
    propertyType: 'house',
    bedrooms: 3,
    bathrooms: 2,
    monthlyRate: -1500,  // Invalid: negative
    ownerID: 'owner-123'
});

console.log('Invalid Property - isValid():', invalidProperty.isValid());
console.log('Invalid Property - errors:', invalidProperty.getValidationErrors());
```

**Expected Results**:
```
✅ Valid property passes validation
✅ Invalid property fails validation
✅ Monthly rate > 0 validation enforced
✅ Required address fields validated
```

**Test Status**: [ ] PASS [ ] FAIL [ ] BLOCKED

---

#### Test 2.3: Lease Model Validation ✅

**In Console**:
```javascript
// Test valid lease
const validLease = new Lease({
    id: 'lease-' + Date.now(),
    unitID: 'unit-123',
    tenantID: 'tenant-123',
    startDate: new Date('2025-02-01'),
    endDate: new Date('2026-02-01'),
    monthlyRent: 1500,
    securityDeposit: 3000,
    status: 'active'
});

console.log('Valid Lease - isValid():', validLease.isValid());
console.log('Valid Lease - errors:', validLease.getValidationErrors());

// Test invalid lease (end date before start date)
const invalidLease = new Lease({
    id: 'lease-2',
    unitID: 'unit-456',
    tenantID: 'tenant-456',
    startDate: new Date('2026-02-01'),
    endDate: new Date('2025-02-01'),  // Invalid: before start
    monthlyRent: 1500,
    securityDeposit: 3000,
    status: 'active'
});

console.log('Invalid Lease - isValid():', invalidLease.isValid());
console.log('Invalid Lease - errors:', invalidLease.getValidationErrors());
```

**Expected Results**:
```
✅ Valid lease passes validation
✅ Invalid lease fails validation
✅ End date must be after start date
✅ Rent and deposit > 0
```

**Test Status**: [ ] PASS [ ] FAIL [ ] BLOCKED

---

#### Test 2.4: Bill Model Validation ✅

**In Console**:
```javascript
// Test valid bill
const validBill = new Bill({
    id: 'bill-' + Date.now(),
    leaseID: 'lease-123',
    amount: 1500,
    dueDate: new Date('2026-02-01'),
    status: 'unpaid',
    month: 'February 2025'
});

console.log('Valid Bill - isValid():', validBill.isValid());
console.log('Valid Bill - errors:', validBill.getValidationErrors());

// Test invalid bill (negative amount)
const invalidBill = new Bill({
    id: 'bill-2',
    leaseID: 'lease-456',
    amount: -1500,  // Invalid: negative
    dueDate: new Date('2026-02-01'),
    status: 'unpaid',
    month: 'February 2025'
});

console.log('Invalid Bill - isValid():', invalidBill.isValid());
console.log('Invalid Bill - errors:', invalidBill.getValidationErrors());
```

**Expected Results**:
```
✅ Valid bill passes validation
✅ Invalid bill fails validation
✅ Amount must be > 0
✅ Status is valid (unpaid, paid, overdue)
```

**Test Status**: [ ] PASS [ ] FAIL [ ] BLOCKED

---

#### Test 2.5: MaintenanceRequest Model Validation ✅

**In Console**:
```javascript
// Test valid request
const validRequest = new MaintenanceRequest({
    id: 'maint-' + Date.now(),
    propertyID: 'prop-123',
    description: 'Leaky faucet in bathroom',
    priority: 'high',
    status: 'open',
    reportedDate: new Date()
});

console.log('Valid Request - isValid():', validRequest.isValid());
console.log('Valid Request - errors:', validRequest.getValidationErrors());

// Test invalid request (invalid priority)
const invalidRequest = new MaintenanceRequest({
    id: 'maint-2',
    propertyID: 'prop-456',
    description: 'Door broken',
    priority: 'maybe',  // Invalid: not a valid priority
    status: 'open',
    reportedDate: new Date()
});

console.log('Invalid Request - isValid():', invalidRequest.isValid());
console.log('Invalid Request - errors:', invalidRequest.getValidationErrors());
```

**Expected Results**:
```
✅ Valid request passes validation
✅ Invalid request fails validation
✅ Priority must be: low, medium, high, urgent
✅ Status must be: open, in-progress, closed
✅ Description required
```

**Test Status**: [ ] PASS [ ] FAIL [ ] BLOCKED

---

### CATEGORY 3: Controller Testing (5 Tests)

#### Test 3.1: DashboardController ✅

**Steps**:
```
1. Login to application
2. Should be on dashboard
3. Open browser console
4. Run the dashboard initialization
```

**In Console**:
```javascript
// Initialize dashboard
console.log('Initializing Dashboard Controller...');
window.dashboardController.init()
    .then(() => {
        console.log('✅ Dashboard initialized successfully');
        console.log('Dashboard data:', window.dashboardData || 'Check DOM');
    })
    .catch(error => {
        console.error('❌ Dashboard initialization failed:', error);
    });
```

**Expected Results**:
```
✅ Dashboard initializes without errors
✅ Statistics card data loads
✅ Recent properties load
✅ Maintenance requests load
✅ Lease expirations load
✅ All data displays on dashboard
```

**Verification**:
```
In UI:
1. Check dashboard has stat cards with numbers
2. Property list shows properties
3. Maintenance requests show pending items
4. Lease expirations show upcoming dates

In Console:
1. No errors should appear
2. Successful completion message
```

**Test Status**: [ ] PASS [ ] FAIL [ ] BLOCKED

---

#### Test 3.2: PropertiesController ✅

**Steps**:
```
1. Navigate to Properties section
2. Open console
3. Run properties loading tests
```

**In Console**:
```javascript
// Load all properties
console.log('Loading properties...');
window.propertiesController.loadProperties()
    .then(() => {
        console.log('✅ Properties loaded successfully');
    })
    .catch(error => {
        console.error('❌ Failed to load properties:', error);
    });

// Test search
setTimeout(() => {
    console.log('Testing search...');
    window.propertiesController.searchProperties('main');
}, 2000);

// Get statistics
setTimeout(() => {
    console.log('Getting property statistics...');
    const stats = window.propertiesController.getPropertyStats();
    console.log('Property Stats:', stats);
}, 4000);
```

**Expected Results**:
```
✅ All properties load
✅ Properties display in list/grid
✅ Search filters correctly
✅ Statistics calculated accurately
✅ CRUD operations available
```

**Test Status**: [ ] PASS [ ] FAIL [ ] BLOCKED

---

#### Test 3.3: TenantsController ✅

**Steps**:
```
1. Navigate to Tenants section
2. Open console
3. Run tenant loading tests
```

**In Console**:
```javascript
// Load all tenants
console.log('Loading tenants...');
window.tenantsController.loadTenants()
    .then(() => {
        console.log('✅ Tenants loaded successfully');
    })
    .catch(error => {
        console.error('❌ Failed to load tenants:', error);
    });

// Test search
setTimeout(() => {
    console.log('Testing tenant search...');
    window.tenantsController.searchTenants('john');
}, 2000);

// Get statistics
setTimeout(() => {
    console.log('Getting tenant statistics...');
    const stats = window.tenantsController.getTenantStats();
    console.log('Tenant Stats:', stats);
}, 4000);
```

**Expected Results**:
```
✅ All tenants load
✅ Tenant list displays
✅ Search works correctly
✅ Status filtering works
✅ CRUD operations available
```

**Test Status**: [ ] PASS [ ] FAIL [ ] BLOCKED

---

#### Test 3.4: BillingController ✅

**Steps**:
```
1. Navigate to Billing section
2. Open console
3. Run billing tests
```

**In Console**:
```javascript
// Load all bills
console.log('Loading bills...');
window.billingController.loadBills()
    .then(() => {
        console.log('✅ Bills loaded successfully');
    })
    .catch(error => {
        console.error('❌ Failed to load bills:', error);
    });

// Test filtering by status
setTimeout(() => {
    console.log('Filtering by status...');
    window.billingController.filterByStatus('unpaid');
}, 2000);

// Get billing statistics
setTimeout(() => {
    console.log('Getting billing statistics...');
    // Stats should show: totalDue, pending, overdue, collected
    console.log('Billing stats available');
}, 4000);
```

**Expected Results**:
```
✅ All bills load
✅ Bills display in list
✅ Status filtering works (paid, unpaid, overdue)
✅ Statistics calculated (total due, pending, etc)
✅ Report generation available
```

**Test Status**: [ ] PASS [ ] FAIL [ ] BLOCKED

---

#### Test 3.5: MaintenanceController ✅

**Steps**:
```
1. Navigate to Maintenance section
2. Open console
3. Run maintenance tests
```

**In Console**:
```javascript
// Load all requests
console.log('Loading maintenance requests...');
window.maintenanceController.loadRequests()
    .then(() => {
        console.log('✅ Maintenance requests loaded successfully');
    })
    .catch(error => {
        console.error('❌ Failed to load requests:', error);
    });

// Test filtering by priority
setTimeout(() => {
    console.log('Filtering by priority...');
    window.maintenanceController.filterByPriority('high');
}, 2000);

// Get urgent requests
setTimeout(() => {
    console.log('Getting urgent requests...');
    const urgent = window.maintenanceController.getUrgentRequests();
    console.log('Urgent requests:', urgent);
}, 4000);
```

**Expected Results**:
```
✅ All requests load
✅ Requests display
✅ Priority filtering works (low, medium, high, urgent)
✅ Status filtering works (open, in-progress, closed)
✅ CRUD operations available
✅ Assignment functionality works
```

**Test Status**: [ ] PASS [ ] FAIL [ ] BLOCKED

---

### CATEGORY 4-9: Testing Workflows

See [INTEGRATION_TEST_PLAN.md](INTEGRATION_TEST_PLAN.md) for detailed end-to-end workflow tests and additional testing categories.

---

## Testing Checklist

### Phase 1: Quick Environment Check (10 minutes)
- [ ] Open browser console
- [ ] Paste INTEGRATION_TEST_CONSOLE.js
- [ ] Verify all 6 categories show green checkmarks
- [ ] No errors in console

### Phase 2: Authentication Tests (15 minutes)
- [ ] Test 1.1: Signup - [ ] PASS [ ] FAIL
- [ ] Test 1.2: Login - [ ] PASS [ ] FAIL
- [ ] Test 1.3: Invalid Credentials - [ ] PASS [ ] FAIL
- [ ] Test 1.4: Logout - [ ] PASS [ ] FAIL
- [ ] Test 1.5: Remember Me - [ ] PASS [ ] FAIL

### Phase 3: Model Validation Tests (15 minutes)
- [ ] Test 2.1: User Model - [ ] PASS [ ] FAIL
- [ ] Test 2.2: Property Model - [ ] PASS [ ] FAIL
- [ ] Test 2.3: Lease Model - [ ] PASS [ ] FAIL
- [ ] Test 2.4: Bill Model - [ ] PASS [ ] FAIL
- [ ] Test 2.5: Maintenance Model - [ ] PASS [ ] FAIL

### Phase 4: Controller Tests (20 minutes)
- [ ] Test 3.1: Dashboard Controller - [ ] PASS [ ] FAIL
- [ ] Test 3.2: Properties Controller - [ ] PASS [ ] FAIL
- [ ] Test 3.3: Tenants Controller - [ ] PASS [ ] FAIL
- [ ] Test 3.4: Billing Controller - [ ] PASS [ ] FAIL
- [ ] Test 3.5: Maintenance Controller - [ ] PASS [ ] FAIL

### Phase 5: End-to-End Workflows (30 minutes)
- [ ] Workflow 1: Property Onboarding - [ ] PASS [ ] FAIL
- [ ] Workflow 2: Tenant Lease Mgmt - [ ] PASS [ ] FAIL
- [ ] Workflow 3: Maintenance Lifecycle - [ ] PASS [ ] FAIL
- [ ] Workflow 4: Reporting - [ ] PASS [ ] FAIL

### Phase 6: Error Scenarios (15 minutes)
- [ ] Test 7.1: Network Failures - [ ] PASS [ ] FAIL
- [ ] Test 7.2: Invalid Data - [ ] PASS [ ] FAIL
- [ ] Test 7.3: Authorization - [ ] PASS [ ] FAIL
- [ ] Test 7.4: Duplicates - [ ] PASS [ ] FAIL

### Phase 7: Performance Tests (10 minutes)
- [ ] Test 8.1: Page Load Time - [ ] PASS [ ] FAIL
- [ ] Test 8.2: Search Performance - [ ] PASS [ ] FAIL
- [ ] Test 8.3: Large Dataset - [ ] PASS [ ] FAIL

### Phase 8: Browser Compatibility (20 minutes)
- [ ] Chrome - [ ] PASS [ ] FAIL
- [ ] Firefox - [ ] PASS [ ] FAIL
- [ ] Edge - [ ] PASS [ ] FAIL
- [ ] Safari - [ ] PASS [ ] FAIL (optional)

---

## Troubleshooting

### Issue: "Firebase SDK not loaded"
**Solution**: Make sure mvcBootstrap.js is running before tests
```javascript
// In console:
typeof firebase !== 'undefined' ? '✅ Firebase loaded' : '❌ Not loaded'
```

### Issue: "Services not initialized"
**Solution**: Check that services are in window
```javascript
window.dataService ? '✅ DataService ready' : '❌ Not ready'
window.authService ? '✅ AuthService ready' : '❌ Not ready'
```

### Issue: "Controllers not found"
**Solution**: Controllers should auto-initialize after auth
```javascript
// Manually reinitialize if needed:
window.dashboardController = new DashboardController(window.dataService);
window.propertiesController = new PropertiesController(window.dataService);
// ... etc
```

### Issue: Errors in console
**Solution**: Note the error message and check:
1. Is user logged in?
2. Is Firebase configured correctly?
3. Do all files exist?
4. Are there typos in collection names?

---

## Reporting Issues

When you find an issue, document it:

```
ISSUE: [Brief description]
Severity: [CRITICAL/HIGH/MEDIUM/LOW]
Test: [Which test revealed it]
Steps to Reproduce:
1. [Step 1]
2. [Step 2]
Expected: [What should happen]
Actual: [What actually happens]
Console Error: [Copy error message]
```

---

## Success Criteria

Your CasaLink project is **PRODUCTION READY** when:

✅ All 37 tests pass  
✅ No critical or high-priority issues  
✅ All data displays correctly  
✅ All CRUD operations work  
✅ Performance acceptable  
✅ Error handling graceful  
✅ Works in all browsers tested  

---

## Next Steps After Testing

1. **All Tests Pass** ✅
   - Document results
   - Mark project as production-ready
   - Prepare for deployment

2. **Some Tests Fail** ⚠️
   - Identify root cause
   - Fix issues in code
   - Re-run affected tests
   - Document fixes

3. **Critical Issues Found** ❌
   - Pause deployment
   - Fix blocking issues
   - Re-test completely
   - Reassess readiness

---

**Testing Document**: Created January 30, 2026  
**Status**: Ready for Execution  
**Duration**: ~2-3 hours for complete testing cycle

Begin with the environment check, then progress through each category systematically. Good luck! 🚀

