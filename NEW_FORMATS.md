# KreaCAD v1.1.4 - Yeni Format Desteği

## 🆕 Eklenen Yeni Formatlar

Bu güncelleme ile KreaCAD artık çok daha fazla 2D ve 3D dosya formatını desteklemektedir:

### 🎨 2D CAD Formatları
- **SVG** (.svg) - Scalable Vector Graphics
- **DXF** (.dxf) - Drawing Exchange Format (AutoCAD)

### 🧊 3D Formatları
- **USDZ** (.usdz) - Universal Scene Description (Apple AR)
- **XYZ** (.xyz) - Point Cloud formatı
- **STPZ** (.stpz) - Sıkıştırılmış STEP dosyaları

## 📋 Tüm Desteklenen Formatlar

### 3D Katı ve Yüzey Modelleri
- **3DM** - Rhinoceros 3D
- **3DS** - 3D Studio
- **STEP/STP** - ISO 10303 standardı
- **IGES/IGS** - Endüstri standardı
- **BREP** - Boundary representation
- **FCSTD** - FreeCAD formatı
- **BIM** - Building Information Modeling
- **IFC** - Industry Foundation Classes
- **STPZ** - Sıkıştırılmış STEP

### 3D Mesh/Polygon Formatları
- **STL** - Stereolithography (3D baskı)
- **OBJ** - Wavefront formatı
- **PLY** - Polygon File Format
- **OFF** - Object File Format
- **GLTF/GLB** - GL Transmission Format
- **FBX** - Autodesk formatı
- **DAE** - Collada formatı
- **WRL** - VRML formatı
- **3MF** - 3D Manufacturing Format
- **AMF** - Additive Manufacturing Format
- **USDZ** - Universal Scene Description

### 2D Formatları
- **SVG** - Scalable Vector Graphics
- **DXF** - Drawing Exchange Format

### Point Cloud Formatları
- **XYZ** - XYZ Point Cloud

## 🚀 Kullanım

Yeni formatları kullanmak için:

1. Dosyanızı web arayüzüne sürükleyin
2. Veya "Dosya Aç" butonunu kullanın
3. Desteklenen uzantılardan birini seçin

## 🔧 Teknik Detaylar

- **Build**: 73
- **Versiyon**: 1.1.4
- **Three.js**: 0.163.0
- **Toplam desteklenen format**: 24 farklı dosya tipi

## 📝 Notlar

- DXF desteği temel 2D entity'ler için (Line, Circle, Polyline)
- XYZ point cloud dosyaları küçük küpler olarak görselleştirilir
- STPZ dosyaları otomatik olarak açılır ve STEP olarak işlenir
- SVG dosyaları 3D extrude edilmiş şekilde görüntülenir

## 🔮 Gelecek Güncellemeler

Planlanan yeni formatlar:
- DWG (AutoCAD native)
- SLDPRT/SLDASM (SolidWorks)
- CATPART/CATPRODUCT (CATIA)
- USD (text version)
- X3D format desteği
