import React from 'react';
import { useFileUpload } from '../hooks/useFileUpload.js';

const IntroScreen = ({ isVisible }) => {
  const { handleFileUpload } = useFileUpload();

  if (!isVisible) return null;

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const fileFormats = [
    { ext: '3dm', name: 'Rhino 3D' },
    { ext: '3ds', name: '3D Studio' },
    { ext: '3mf', name: '3D Manufacturing' },
    { ext: 'amf', name: 'Additive Manufacturing' },
    { ext: 'bim', name: 'BIM File' },
    { ext: 'brep', name: 'BREP' },
    { ext: 'dae', name: 'COLLADA' },
    { ext: 'dxf', name: 'AutoCAD DXF' },
    { ext: 'fbx', name: 'FBX' },
    { ext: 'fcstd', name: 'FreeCAD' },
    { ext: 'gltf', name: 'glTF/GLB' },
    { ext: 'ifc', name: 'IFC BIM' },
    { ext: 'iges', name: 'IGES' },
    { ext: 'step', name: 'STEP' },
    { ext: 'stpz', name: 'STEP (Compressed)' },
    { ext: 'stl', name: 'STL' },
    { ext: 'svg', name: 'SVG' },
    { ext: 'obj', name: 'Wavefront OBJ' },
    { ext: 'off', name: 'OFF' },
    { ext: 'ply', name: 'PLY' },
    { ext: 'wrl', name: 'VRML' },
    { ext: 'xyz', name: 'Point Cloud' },
  ];

  return (
    <div
      className="absolute inset-0 bg-gray-900 overflow-y-auto flex items-center justify-center cursor-default"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{ zIndex: 10 }}
    >
      <div className="text-center py-12 px-4">
        {/* Logo */}
        <div className="mb-8">
          <img
            src="/assets/logos/krea_logo.png"
            alt="KreaCAD"
            className="h-24 w-auto mx-auto mb-4"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div className="text-4xl font-bold text-white mb-2">KreaCAD</div>
          <div className="text-sm text-gray-400">Advanced 3D CAD Viewer & Measurement Tool</div>
        </div>

        {/* Drag and Drop Area */}
        <div className="max-w-2xl mx-auto mb-12">
          <label className="block border-2 border-dashed border-gray-600 rounded-lg p-12 cursor-pointer hover:border-blue-500 transition">
            <div className="text-gray-300 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
              <div className="text-lg font-medium text-gray-200">Drag and drop your CAD files here</div>
              <div className="text-sm text-gray-400 mt-2">or click to browse</div>
            </div>
            <input
              type="file"
              multiple
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
              accept=".obj,.stl,.step,.stp,.dwg,.dxf,.3dm,.iges,.igs,.ply,.fbx,.gltf,.glb,.usdz,.xyz,.svg,.3mf,.amf,.off,.wrl,.vrml,.ifc,.fcstd,.3ds,.dae,.bim,.brep,.fcstd"
            />
          </label>
        </div>

        {/* Supported Formats */}
        <div className="max-w-4xl mx-auto">
          <div className="text-sm text-gray-400 mb-4 font-semibold">Supported Formats (23+):</div>
          <div className="grid grid-cols-4 gap-3 md:grid-cols-6 lg:grid-cols-8">
            {fileFormats.map((format) => (
              <a
                key={format.ext}
                href="#"
                className="px-3 py-2 text-xs text-center rounded bg-gray-800 text-blue-400 hover:bg-gray-700 hover:text-blue-300 transition border border-gray-700"
                title={format.name}
              >
                {format.ext}
              </a>
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-xs text-gray-500">
          <p>© 2025 KreaCAD • Professional 3D CAD Viewer</p>
        </div>
      </div>
    </div>
  );
};

export default IntroScreen;
