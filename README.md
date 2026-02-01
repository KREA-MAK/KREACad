# KreaCAD - Advanced 3D CAD Viewer

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

KreaCAD is a professional and advanced 3D CAD viewer solution designed for visualizing and exploring CAD models in your browser. This repository contains the source code of the application and the powerful library behind it.


## Example

https://kreacad.fabus.app


## Supported file formats

* **Import**: 3dm, 3ds, 3mf, amf, bim, brep, dae, fbx, fcstd, gltf, ifc, iges, step, stl, obj, off, ply, wrl.
* **Export**: 3dm, bim, gltf, obj, off, stl, ply.
## External Libraries

KreaCAD leverages a robust ecosystem of cutting-edge open-source libraries to deliver exceptional 3D visualization capabilities:

### Core Rendering & 3D Graphics
* **[three.js](https://github.com/mrdoob/three.js)** - Powerful WebGL-based 3D graphics library for smooth rendering and interactive visualization
* **[draco](https://github.com/google/draco)** - Advanced 3D mesh compression for optimized file sizes and faster loading

### CAD & Engineering Format Support
* **[rhino3dm](https://github.com/mcneel/rhino3dm)** - Native support for Rhino 3D models and advanced NURBS geometry
* **[web-ifc](https://github.com/tomvandig/web-ifc)** - Industry Foundation Classes (IFC) support for BIM workflows
* **[occt-import-js](https://github.com/kovacsv/occt-import-js)** - OpenCASCADE-based import engine for STEP, IGES, and BREP formats

### User Interface & Utilities
* **[pickr](https://github.com/Simonwep/pickr)** - Modern color picker component for material and appearance customization
* **[fflate](https://github.com/101arrowz/fflate)** - High-performance compression library for efficient file handling

All libraries are carefully selected for performance, reliability, and compatibility with modern web standards.
