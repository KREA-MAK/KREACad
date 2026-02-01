# KreaCAD React Migration Guide

This guide explains how the KreaCAD project has been converted from a fork-based structure to a React.js website.

## Project Structure

```
KREACad/
├── src/
│   ├── react/
│   │   ├── components/
│   │   │   ├── Header.jsx          # Main navigation header
│   │   │   ├── Toolbar.jsx         # File upload and tool controls
│   │   │   ├── Navigator.jsx       # Model tree and view controls
│   │   │   ├── ViewerComponent.jsx # 3D viewer canvas
│   │   │   └── Sidebar.jsx         # Properties and mesh panels
│   │   ├── context/
│   │   │   └── ViewerContext.jsx   # Global state management
│   │   ├── pages/                  # Page components (for future expansion)
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── styles/
│   │   │   └── index.css           # Global styles with Tailwind
│   │   └── App.jsx                 # Main app component
│   └── main.jsx                    # Vite entry point
├── source/
│   ├── engine/                     # Original 3D viewer engine (unchanged)
│   └── website/                    # Original website code (legacy)
├── vite.config.js                  # Vite build configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── postcss.config.js               # PostCSS configuration
└── index_react.html                # React app HTML entry point
```

## Key Changes

### 1. State Management (ViewerContext.jsx)
- **Before**: Global `OV` object and direct DOM manipulation
- **After**: React Context + useReducer for centralized state management

State includes:
- `viewer`: Three.js viewer instance
- `model`: Current 3D model
- `loading`: Loading state
- `settings`: Theme, navigation mode, projection mode
- `sidebar`: Active panel and visibility
- `navigator`: Visibility state
- `toolbar`: Visibility state

### 2. Component Architecture
All UI elements are now React components:
- **Header**: Navigation and branding
- **Toolbar**: File operations and view controls
- **Navigator**: Model tree and camera controls
- **ViewerComponent**: Canvas rendering for 3D viewer
- **Sidebar**: Mesh, material, and property panels

### 3. Build System
- **Before**: ESBuild with custom configurations
- **After**: Vite with React plugin for faster development

### 4. Styling
- **Before**: CSS files in `source/website/css/`
- **After**: Tailwind CSS with component-scoped utilities

## Running the React App

### Development Mode
```bash
npm run react:dev
```
This starts the Vite dev server on `http://localhost:5173`

### Build for Production
```bash
npm run react:build
```
Outputs to `dist_react/`

### Serve Production Build
```bash
npm run react:serve
```
Serves on `http://localhost:8080`

## Integration with Original Engine

The React app fully utilizes the original 3D viewer engine:

1. **Engine Module**: Imported from `source/engine/main.js`
2. **Canvas Integration**: Viewer canvas is mounted in the `ViewerComponent`
3. **File Loading**: Uses original import functions
4. **Features**: All existing features remain functional

## Adding Features

### Adding a New Component
1. Create component file in `src/react/components/`
2. Use `useViewer()` hook to access global state
3. Import and use in `App.jsx`

### Adding Custom Hooks
1. Create hook file in `src/react/hooks/`
2. Use React hooks internally
3. Export and use in components

### Adding Pages (Future)
1. Create page component in `src/react/pages/`
2. Set up routing with React Router (if needed)
3. Link from navigation

## State Management Examples

### Accessing State
```jsx
const { state } = useViewer();
console.log(state.model);
console.log(state.settings.theme);
```

### Updating State
```jsx
const { updateSettings } = useViewer();
updateSettings({ theme: 'dark' });
```

### Dispatching Actions
```jsx
const { dispatch } = useViewer();
dispatch({ type: 'SET_MODEL', payload: newModel });
```

## Migration from Original Website

The original `source/website/` code remains for reference but is no longer used. To migrate functionality:

1. Identify the feature in original code
2. Create corresponding React component
3. Use ViewerContext for state management
4. Integrate with existing components

## Styling with Tailwind CSS

The project uses Tailwind CSS utility classes. Common patterns:

```jsx
// Button
<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
  Click me
</button>

// Grid Layout
<div className="grid grid-cols-3 gap-4">
  {/* items */}
</div>

// Responsive Design
<div className="flex flex-col md:flex-row lg:flex-row-reverse">
  {/* responsive layout */}
</div>
```

## External Libraries

- **React**: UI framework
- **React DOM**: DOM rendering
- **Vite**: Build tool
- **Tailwind CSS**: Utility-first CSS framework
- **Three.js**: 3D graphics (from original engine)
- **PostCSS**: CSS transformation

## File Format Support

All original file formats are supported through the engine:

- STEP (.stp, .step, .stpz)
- IGES (.igs, .iges)
- STL (.stl)
- OBJ (.obj)
- GLTF/GLB (.gltf, .glb)
- DXF (.dxf)
- SVG (.svg)
- And 16+ more formats

## Performance Considerations

1. **Code Splitting**: Vite automatically chunks vendor and app code
2. **Lazy Loading**: Can be added for route-based components
3. **Memoization**: Use React.memo for components that don't need frequent re-renders
4. **Canvas Optimization**: Viewer canvas is optimized in ViewerComponent

## Troubleshooting

### Canvas not rendering
- Check that ViewerComponent is mounted
- Verify engine is properly initialized
- Check browser console for errors

### State not updating
- Use `useViewer()` hook in component
- Dispatch actions correctly with proper type
- Check useEffect dependencies

### Build issues
- Clear node_modules and reinstall: `rm -r node_modules && npm install`
- Check Vite config for correct paths
- Verify all imports are correct

## Next Steps

1. **Complete File Upload**: Implement file handling in Toolbar
2. **Add Dialogs**: Create modal components for settings, export, etc.
3. **Implement Measurements**: Add measurement tool UI
4. **Add Routing**: If multi-page support is needed
5. **Performance**: Implement code splitting and lazy loading

## Contact & Support

For issues or questions about the React migration, refer to the original project:
- GitHub: [kovacsv/Online3DViewer](https://github.com/kovacsv/Online3DViewer)
- KreaCAD: https://kreacad.fabus.app

---

**Note**: This is an independent fork modified to use React.js. The original project remains the primary reference implementation.
