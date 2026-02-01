# KreaCAD React Website - Setup & Development Guide

## Overview

KreaCAD has been successfully converted from a fork-based structure to a modern React.js website. This document provides step-by-step instructions for development, building, and deployment.

## Prerequisites

- Node.js >= 18.x
- npm >= 10.x
- Git

## Installation

1. **Install dependencies:**
```bash
npm install
```

This installs both the original project dependencies and the new React dependencies.

## Development

### Running the React Development Server

```bash
npm run react:dev
```

This starts the Vite development server:
- **URL**: http://localhost:5173
- **Features**: Hot Module Replacement (HMR) for instant updates
- **Auto-open**: Browser opens automatically

### Project File Structure

```
src/react/
├── App.jsx                 # Main application component
├── main.jsx               # Vite entry point
├── components/            # React components
│   ├── Header.jsx        # Top navigation
│   ├── Toolbar.jsx       # Action buttons and file upload
│   ├── Navigator.jsx     # Left panel - model tree
│   ├── ViewerComponent.jsx # Center - 3D canvas
│   └── Sidebar.jsx       # Right panel - properties
├── context/              # Global state
│   └── ViewerContext.jsx # React Context for viewer state
├── hooks/               # Custom React hooks
│   └── useFileUpload.js # File upload handler
└── styles/              # CSS files
    └── index.css        # Global styles with Tailwind
```

## Building

### Development Build
```bash
npm run react:build
```
- Creates unoptimized bundle for debugging
- Includes source maps
- Output: `dist_react/`

### Production Build
```bash
npm run react:build
```
- Minified and optimized
- Removes source maps
- Code splitting enabled

### Build Output
- **dist_react/index.html**: Main HTML file
- **dist_react/assets/**: JavaScript and CSS bundles

## Running the Built App

### Development Mode
```bash
npm run react:dev
```

### Production Server
```bash
npm run react:serve
```
- Builds the app
- Serves on http://localhost:8080
- Use for production testing

## Key Features

### 1. 3D File Viewer
- Supports 23+ file formats
- Drag-and-drop file upload
- Automatic model fitting
- Interactive 3D manipulation

### 2. State Management
- React Context API
- useReducer for complex state
- Custom hooks for features
- Global viewer instance management

### 3. Responsive UI
- Tailwind CSS for styling
- Mobile-friendly layout
- Collapsible panels
- Responsive toolbar

### 4. Components

#### Header Component
- Logo and branding
- Navigation links
- Action buttons

#### Toolbar Component
- File upload button
- View controls (zoom, fit)
- Snapshots and measurements
- Display toggles (grid, axis)

#### Navigator Component
- Model tree view
- Navigation mode selector
- Projection mode selector
- Visibility toggle

#### ViewerComponent
- Three.js canvas rendering
- Automatic resize handling
- Engine initialization
- Event handling

#### Sidebar Component
- Tabbed interface:
  - **Meshes**: Model objects
  - **Materials**: Material properties
  - **Properties**: Model statistics

## Adding New Features

### 1. Add a New Component

**File**: `src/react/components/MyComponent.jsx`

```jsx
import React from 'react';
import { useViewer } from '../context/ViewerContext';

const MyComponent = () => {
  const { state, dispatch } = useViewer();

  return (
    <div className="p-4 bg-white rounded-lg">
      <h2 className="font-bold">My Component</h2>
    </div>
  );
};

export default MyComponent;
```

**Update**: `src/react/App.jsx`

```jsx
import MyComponent from './components/MyComponent';

// Add to layout
<MyComponent />
```

### 2. Add Custom State

**Edit**: `src/react/context/ViewerContext.jsx`

```javascript
const initialState = {
  // ... existing state
  myFeature: {
    enabled: false,
    value: null,
  },
};

// Add reducer case
case 'SET_MY_FEATURE':
  return {
    ...state,
    myFeature: { ...state.myFeature, ...action.payload },
  };
```

### 3. Add Custom Hook

**File**: `src/react/hooks/useMyFeature.js`

```javascript
import { useCallback } from 'react';
import { useViewer } from '../context/ViewerContext';

export const useMyFeature = () => {
  const { state, dispatch } = useViewer();

  const doSomething = useCallback(() => {
    dispatch({ type: 'SET_MY_FEATURE', payload: { value: 42 } });
  }, [dispatch]);

  return { doSomething };
};
```

## Configuration Files

### vite.config.js
- Build tool configuration
- React plugin setup
- Development server settings
- Build output options

### tailwind.config.js
- Tailwind CSS customization
- Custom colors and fonts
- Plugin configuration

### postcss.config.js
- CSS processing pipeline
- Tailwind CSS integration
- Autoprefixer settings

## Styling with Tailwind CSS

### Common Patterns

**Buttons**:
```jsx
<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
  Click
</button>
```

**Flexbox Layout**:
```jsx
<div className="flex items-center justify-between gap-4">
  {/* content */}
</div>
```

**Grid Layout**:
```jsx
<div className="grid grid-cols-3 gap-4">
  {/* items */}
</div>
```

**Responsive Design**:
```jsx
<div className="flex flex-col md:flex-row lg:flex-row-reverse">
  {/* responsive */}
</div>
```

**Colors & Spacing**:
```jsx
<div className="p-4 m-2 bg-gray-100 text-gray-800 rounded-lg shadow-md">
  Content
</div>
```

## Debugging

### React DevTools
- Install React DevTools extension for your browser
- Inspect component tree
- View state and props
- Trace re-renders

### Browser DevTools
- Open DevTools (F12)
- Console tab for errors
- Network tab for API calls
- Performance tab for optimization

### VSCode Setup

**Recommended Extensions**:
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Prettier
- ESLint

**.vscode/settings.json**:
```json
{
  "editor.formatOnSave": true,
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

## Environment Variables

Create `.env.local` for local configuration:

```env
VITE_API_URL=http://localhost:3000
VITE_ENVIRONMENT=development
```

Use in code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

## Performance Optimization

### Code Splitting
Vite automatically splits code into chunks:
- Vendor code (React, Three.js)
- App code
- Lazy-loaded routes

### Image Optimization
Place images in `public/` or import them:
```jsx
import logo from '../assets/logo.png';
<img src={logo} />
```

### Component Memoization
```jsx
import { memo } from 'react';

const MyComponent = memo(({ prop }) => {
  return <div>{prop}</div>;
});

export default MyComponent;
```

## Deployment

### Build for Production
```bash
npm run react:build
```

### Deploy to Web Server
Copy contents of `dist_react/` to web server:

**Apache**:
```bash
cp -r dist_react/* /var/www/html/
```

**Nginx**:
```bash
cp -r dist_react/* /usr/share/nginx/html/
```

### Docker Deployment

**Dockerfile**:
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run react:build

FROM nginx:alpine
COPY --from=build /app/dist_react /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Troubleshooting

### Issue: Port 5173 already in use
```bash
npm run react:dev -- --port 3000
```

### Issue: Module not found errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Tailwind CSS not working
- Check `tailwind.config.js` content paths
- Verify CSS file imports
- Clear browser cache

### Issue: 3D viewer not rendering
- Check browser console for errors
- Verify engine files are accessible
- Check ViewerComponent mounting

## Next Steps

1. **Implement Advanced Features**:
   - Measurement tools
   - Snapshot/export
   - Sharing dialogs

2. **Add More Pages**:
   - About page
   - Embed guides
   - Documentation

3. **Performance Improvements**:
   - Route-based code splitting
   - Lazy component loading
   - Bundle analysis

4. **Testing**:
   - Unit tests with Vitest
   - Component tests with React Testing Library
   - E2E tests with Playwright

## Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Three.js](https://threejs.org)
- [KreaCAD GitHub](https://github.com/kovacsv/Online3DViewer)

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review component code
3. Check browser console for errors
4. Refer to original project documentation

---

**Last Updated**: February 2026
**Version**: React 1.0
**Based on**: Online3DViewer (KreaCAD Fork)
