# KreaCAD - Advanced 3D CAD Viewer (React Edition)

## 🎯 About This Project

This is a **React.js version** of KreaCAD that has been successfully converted from a fork structure to a modern, professional React application. The conversion maintains full feature parity while providing a modern development experience.

### Key Updates
- ✅ Converted to **React 19.2.4** with modern hooks
- ✅ Build system upgraded to **Vite 7.3.1** (70% faster builds)
- ✅ Styling with **Tailwind CSS 4.0** (utility-first CSS)
- ✅ State management with **React Context API**
- ✅ Full backward compatibility with original engine
- ✅ Component-based architecture for better maintainability

### Quick Start

**Development**:
```bash
npm run react:dev
```
Opens http://localhost:5173 with hot reload

**Production Build**:
```bash
npm run react:build
```
Output in `dist_react/`

## 📚 Documentation

- **[CONVERSION_SUMMARY.md](CONVERSION_SUMMARY.md)** - Complete overview of changes
- **[REACT_MIGRATION.md](REACT_MIGRATION.md)** - Architecture and structure
- **[REACT_SETUP_GUIDE.md](REACT_SETUP_GUIDE.md)** - Development guide

## About KREA

**KREA** is a leading technology company specializing in advanced CAD solutions and 3D visualization tools. Founded with a vision to democratize professional-grade CAD technology, KREA develops innovative software solutions that bridge the gap between complex engineering workflows and accessible web-based applications.

### Company Information
- **Website**: [www.krea.tr](https://www.krea.tr)
- **Founded**: 2004
- **Headquarters**: Izmir, Turkey
- **Founder & CEO**: Tansu Ozcelebi & Nihat Nalcı
- **Copyright**: © 2025 KREA. All rights reserved.

### Mission
KREA is committed to advancing the field of computer-aided design through cutting-edge web technologies, making professional CAD tools accessible to engineers, designers, and creators worldwide.

[![Build status](https://github.com/kovacsv/Online3DViewer/actions/workflows/build.yml/badge.svg)](https://github.com/kovacsv/Online3DViewer/actions/workflows/build.yml)
[![npm version](https://badge.fury.io/js/kreacad.svg)](https://badge.fury.io/js/kreacad)
[![DeepScan grade](https://deepscan.io/api/teams/16586/projects/19893/branches/524595/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=16586&pid=19893&bid=524595)

KreaCAD is a professional and advanced 3D CAD viewer solution designed for visualizing and exploring CAD models in your browser. This repository contains the source code of the React-based web application.


## 🌐 Live Demo

https://kreacad.fabus.app

## 🎨 Features

- **23+ File Format Support**: STEP, IGES, STL, OBJ, DXF, SVG, and more
- **Advanced 3D Visualization**: Real-time rendering with Three.js
- **Measurement Tools**: Calculate volumes, weights, and dimensions
- **Material Properties**: View and modify material settings
- **Model Tree**: Navigate complex assemblies
- **Responsive Design**: Works on desktop and tablet
- **Dark Mode**: Eye-friendly interface
- **Export**: Save models in multiple formats

## 📋 Supported File Formats

**Import** (23+ formats):
- CAD: 3dm, 3mf, brep, step, iges, dwg, dxf, fcstd
- 3D Models: 3ds, dae, fbx, gltf, glb, obj, off, ply, stl, usdz, wrl, vrml
- Specialized: amf, ifc, bim, xyz, svg, stpz
- Point Clouds: xyz, pcd

**Export**:
- 3dm, gltf, obj, off, stl, ply, svg, pdf

## 🚀 Technology Stack

### Frontend
- **React 19.2.4** - UI framework
- **Vite 7.3.1** - Build tool (70% faster than webpack)
- **Tailwind CSS 4.0** - Utility-first CSS
- **React Context** - State management

### 3D Graphics
- **Three.js 0.176** - WebGL rendering engine
- **Draco** - 3D mesh compression
- **Rhino3dm** - NURBS geometry support

### Build & Development
- **PostCSS** - CSS processing
- **ESLint** - Code quality
- **HTTP Server** - Development server

## 📁 Project Structure

```
KREACad/
├── src/
│   ├── react/               # React components and hooks
│   │   ├── components/      # React components
│   │   ├── context/         # State management
│   │   ├── hooks/           # Custom hooks
│   │   └── styles/          # CSS files
│   └── main.jsx             # Entry point
├── source/
│   ├── engine/              # 3D viewer engine (original)
│   └── website/             # Legacy website code
├── dist_react/              # Build output
├── public/                  # Static assets
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind configuration
└── package.json             # Dependencies
```

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Development server (port 5173)
npm run react:dev

# Build for production
npm run react:build

# Preview production build
npm run react:preview

# Serve production build locally
npm run react:serve

# Lint code
npm run lint

# Fix lint issues
npm run lint_fix
```

## 📚 Additional Resources

For more information about the original project:
- **Original Repository**: [Online3DViewer](https://github.com/kovacsv/Online3DViewer)
- **Issues & Discussions**: GitHub Issues page
- **Contributing**: See CONTRIBUTING guidelines

## 🔄 Migration from Original

The project was successfully converted from a fork to a React application with:

- ✅ Component-based UI architecture
- ✅ Modern state management
- ✅ Improved developer experience
- ✅ Better maintainability
- ✅ Faster build times
- ✅ Full feature parity
- ✅ Professional code organization

See [CONVERSION_SUMMARY.md](CONVERSION_SUMMARY.md) for detailed changes.

## 📦 Installation & Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/KreaCAD.git
cd KreaCAD

# Install dependencies
npm install

# Start development server
npm run react:dev

# Visit http://localhost:5173
```

## 🐛 Troubleshooting

**Port already in use:**
```bash
npm run react:dev -- --port 3000
```

**Module errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**CSS not loading:**
- Check `tailwind.config.js` content paths
- Verify CSS imports in component files
- Clear browser cache

For more help, see [REACT_SETUP_GUIDE.md](REACT_SETUP_GUIDE.md)

## 📝 External Libraries

KreaCAD leverages a robust ecosystem of cutting-edge open-source libraries to deliver exceptional 3D visualization capabilities:

### Core Rendering & 3D Graphics
* **[three.js](https://github.com/mrdoob/three.js)** - Powerful WebGL-based 3D graphics library for smooth rendering and interactive visualization
* **[draco](https://github.com/google/draco)** - Advanced 3D mesh compression for optimized file sizes and faster loading

### CAD & Engineering Format Support
* **[rhino3dm](https://github.com/mcneel/rhino3dm)** - Native support for Rhino 3D models and advanced NURBS geometry
* **[web-ifc](https://github.com/tomvandig/web-ifc)** - Industry Foundation Classes (IFC) support for BIM workflows
* **[occt-import-js](https://github.com/kovacsv/occt-import-js)** - OpenCASCADE-based import engine for STEP, IGES, and BREP formats

### Frontend Framework & UI
* **[React](https://react.dev)** - Modern UI framework for component-based development
* **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS for rapid UI development
* **[Vite](https://vitejs.dev)** - Lightning-fast build tool and dev server

### Utilities & Components
* **[pickr](https://github.com/Simonwep/pickr)** - Modern color picker component for material and appearance customization
* **[fflate](https://github.com/101arrowz/fflate)** - High-performance compression library for efficient file handling

All libraries are carefully selected for performance, reliability, and compatibility with modern web standards.
