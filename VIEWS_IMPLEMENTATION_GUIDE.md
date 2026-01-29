# Views Layer Implementation Guide

## Overview

The Views Layer contains all HTML templates organized by feature module. Each view follows a strict MVC pattern where:
- **HTML**: Contains only DOM elements and styling
- **Event Listeners**: Bind UI interactions to controller methods
- **Helper Functions**: Provide read-only DOM manipulation (display data, show errors, loading states)
- **NO Business Logic**: All logic is handled by controllers

## Views Architecture

```
views/
├── auth/                    # Authentication views
│   ├── login.html          # Login form
│   ├── signup.html         # Registration form
│   └── forgot-password.html # Password reset
├── dashboard/              # Main dashboard
│   └── dashboard.html      # Dashboard overview
├── properties/             # Property management
│   ├── list.html          # Property listing
│   └── detail.html        # Property details
├── tenants/               # Tenant management
│   ├── list.html          # Tenant listing
│   └── detail.html        # Tenant profile
├── billing/               # Billing/payments
│   ├── list.html          # Bills listing
│   └── detail.html        # Bill details
├── maintenance/           # Maintenance requests
│   ├── list.html          # Requests listing
│   └── detail.html        # Request details
└── admin/                 # Admin panel
    ├── dashboard.html     # Admin dashboard
    ├── users.html         # User management
    └── analytics.html     # Analytics
```

## View Template Pattern

Every view follows this structure:

### 1. HTML Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Title</title>
    <link rel="stylesheet" href="../../css/style.css">
    <style>
        /* Page-specific styles */
    </style>
</head>
<body class="page-name">
    <div class="container">
        <!-- HTML content only - NO LOGIC -->
    </div>

    <script>
        // Event listeners and helper functions only
    </script>
</body>
</html>
```

### 2. Event Listeners Pattern
```javascript
// Bind DOM elements to controller methods
document.getElementById('submitBtn')?.addEventListener('click', () => {
    // Get values from form
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Call controller method - controller handles all logic
    if (window.authController) {
        window.authController.handleLogin(email, password);
    }
});
```

### 3. Helper Functions Pattern
```javascript
// Helper: Display data in view
window.displayUsers = function(users) {
    const container = document.getElementById('usersList');
    // Build HTML from data
    let html = '';
    users.forEach(user => {
        html += `<div>${user.name}</div>`;
    });
    container.innerHTML = html;
};

// Helper: Show/hide loading state
window.setLoading = function(isLoading) {
    const btn = document.querySelector('button[type="submit"]');
    btn.disabled = isLoading;
};

// Helper: Show error message
window.showError = function(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.classList.add('show');
};
```

## Key Principles

### ✅ DO - Keep in Views
- **HTML Elements**: Forms, buttons, lists, cards
- **CSS Styling**: Layout, colors, animations
- **Event Listeners**: Click, submit, change events
- **DOM Queries**: Getting form values, finding elements
- **Helper Functions**: Displaying data, showing errors, loading states
- **Element Attributes**: data-id, data-type for identifying items

### ❌ DON'T - Keep Out of Views
- **Business Logic**: Validation algorithms, calculations
- **API Calls**: Calling Firebase, making HTTP requests
- **Data Processing**: Transforming data, filtering, sorting
- **State Management**: Storing global state
- **Authentication Checks**: Determining user access
- **Database Operations**: Create, read, update, delete

## Example Views

### Login Form (views/auth/login.html)
```html
<form id="loginForm">
    <input id="loginEmail" type="email" required>
    <input id="loginPassword" type="password" required>
    <button type="submit">Sign In</button>
</form>

<script>
document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (window.authController) {
        window.authController.handleLogin(email, password);
    }
});

window.showLoginError = function(message) {
    // Display error
};
</script>
```

### Property Listing (views/properties/list.html)
```html
<div id="propertiesGrid" class="grid">
    <!-- Empty, filled by controller -->
</div>

<script>
if (window.propertiesController) {
    window.propertiesController.init();
}

window.displayProperties = function(properties) {
    const grid = document.getElementById('propertiesGrid');
    let html = '';
    properties.forEach(prop => {
        html += `
            <div class="card" data-property-id="${prop.id}">
                <h3>${prop.name}</h3>
                <p>${prop.address}</p>
            </div>
        `;
    });
    grid.innerHTML = html;
};
</script>
```

### Dashboard (views/dashboard/dashboard.html)
```html
<div class="stat-card">
    <div class="stat-value" id="statProperties">0</div>
</div>

<div id="propertiesList">
    <!-- Filled by controller -->
</div>

<script>
if (window.dashboardController) {
    window.dashboardController.init();
}

window.updateDashboardStats = function(stats) {
    document.getElementById('statProperties').textContent = stats.properties;
};

window.displayPropertiesList = function(properties) {
    // Display each property
};
</script>
```

## Data Flow

```
User Action
    ↓
Event Listener in View
    ↓
Call window.controllerName.methodName()
    ↓
Controller processes logic
    ↓
Controller calls window.viewHelper(data)
    ↓
View displays data to user
```

## Helper Function Naming Conventions

### Display Functions
```javascript
window.displayUsers()           // List of items
window.displayUserDetail()      // Single item
window.updateDashboardStats()   // Update metrics
```

### State Functions
```javascript
window.setLoading()        // Show/hide loading indicator
window.showError()         // Display error message
window.hideError()         // Clear error message
window.clearForm()         // Reset form fields
```

### Individual Element Updates
```javascript
window.updatePropertyName()    // Update single field
window.enableButton()          // Enable button
window.disableButton()         // Disable button
```

## Integration with Controllers

Each view expects a corresponding controller:

- `views/auth/login.html` → `js/controllers/AuthController.js`
  - Uses `window.authController.handleLogin()`

- `views/dashboard/dashboard.html` → `js/controllers/DashboardController.js`
  - Uses `window.dashboardController.init()`

- `views/properties/list.html` → `js/controllers/PropertiesController.js`
  - Uses `window.propertiesController.init()`

Controllers expose methods that views call via `window.controllerName`:

```javascript
// In Controller
window.authController = {
    handleLogin: function(email, password) { ... },
    handleSignup: function(email, password, name, role) { ... }
};

// In View
if (window.authController) {
    window.authController.handleLogin(email, password);
}
```

## Loading Views into App

Load views using fetch or as HTML files referenced in main app:

```javascript
// In app.js or main bootstrap
async function loadPage(pageName) {
    const response = await fetch(`/views/${pageName}/${pageName}.html`);
    const html = await response.text();
    document.getElementById('app').innerHTML = html;
}

// OR include directly in HTML
<div id="app">
    <iframe src="views/dashboard/dashboard.html"></iframe>
</div>
```

## Best Practices

1. **Query Selectors**: Use `.querySelector()` instead of jQuery
2. **Optional Chaining**: Use `?.` to safely access optional elements
3. **Data Attributes**: Use `data-*` attributes to identify items
4. **Loading States**: Always show loading indicator during async operations
5. **Error Messages**: Display errors prominently with helpful text
6. **Debouncing**: Debounce search/filter inputs to reduce calls
7. **Comments**: Clearly comment sections (Event Listeners, Helpers)
8. **Accessibility**: Use proper ARIA labels and semantic HTML

## Testing Views

Views should be tested by verifying:
1. Event listeners are properly bound
2. Helper functions update DOM correctly
3. Form values are collected properly
4. No console errors on interaction
5. Controller methods are called with correct parameters
6. Views display data returned by controllers

## Next Steps

After creating views:
1. Create corresponding controllers for each view
2. Controllers use services to fetch/save data
3. Services use models for validation
4. Test complete data flow end-to-end
5. Add error handling and edge cases
6. Optimize performance with debouncing/throttling
