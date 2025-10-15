# SureConsent Navigation Structure

## Overview
The SureConsent plugin now uses a header-based navigation structure similar to SureMails, with main navigation in the top header and sub-navigation in a secondary header below.

## Navigation Architecture

### Main Navigation (Header)
- **Dashboard** - Main overview page
- **Cookie Banner** - Banner configuration and setup
- **Cookie Settings** - Cookie categories and management
- **Analytics** - Reports and consent logs
- **Advanced** - Advanced features and settings

### Sub-Navigation (Secondary Header)

#### Cookie Banner
- **Quick Setup** - Quick cookie banner setup
- **Content** - Banner text and messaging
- **Layout** - Banner positioning and layout
- **Design** - Visual styling and themes

#### Cookie Settings
- **Cookie Categories** - Manage cookie categories
- **Scanned Cookies** - View and manage scanned cookies

#### Analytics
- **Consent Logs** - View consent history
- **Reports** - Analytics and reporting (placeholder)

#### Advanced
- **Geo Rules** - Geographic targeting rules
- **Custom Scripts** - Custom JavaScript integration (placeholder)

## WordPress Admin Menu Structure

The plugin creates the following WordPress admin menu structure:

```
SureConsent (Main Menu)
├── Dashboard
├── Cookie Banner
├── Cookie Settings
├── Analytics
└── Advanced
```

## URL Structure

The navigation uses URL parameters to maintain state:
- `?tab=dashboard` - Dashboard page
- `?tab=banner&subtab=quick-setup` - Cookie Banner > Quick Setup
- `?tab=settings&subtab=categories` - Cookie Settings > Cookie Categories
- etc.

## Components

### TopNavigation.jsx
Main navigation component that handles:
- Header navigation with main tabs
- Sub-navigation header for secondary tabs
- Mobile hamburger menu
- Logo and branding
- Action buttons (help, notifications)

### AdminApp.jsx
Main application component that:
- Manages navigation state
- Handles URL parameter synchronization
- Renders appropriate content based on active tab/subtab
- Provides settings context

## Key Features

1. **Responsive Design** - Mobile-friendly with hamburger menu
2. **URL Synchronization** - Browser back/forward support
3. **State Management** - Maintains active tab state
4. **Consistent Styling** - Uses Force UI components
5. **Extensible** - Easy to add new tabs and sub-tabs

## Migration from Sidebar Navigation

The previous sidebar navigation has been replaced with:
- Header-based main navigation
- Sub-navigation tabs for grouped features
- Cleaner, more modern interface
- Better mobile experience
- Consistent with SureMails design patterns