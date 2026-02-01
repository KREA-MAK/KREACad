import React from 'react';
import { useViewer } from '../context/ViewerContext.jsx';
import { useFileUpload } from '../hooks/useFileUpload.js';

const Toolbar = () => {
  const { state, updateSettings } = useViewer();
  const { handleFileUpload } = useFileUpload();

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    handleFileUpload(files);
  };

  return (
    <div className="w-full bg-gray-800 border-b border-gray-700 p-2 flex items-center gap-2">
      <label className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 cursor-pointer transition">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span>Open File</span>
        <input
          type="file"
          multiple
          onChange={handleFileInputChange}
          className="hidden"
          accept=".obj,.stl,.step,.stp,.dwg,.dxf,.3dm,.iges,.igs,.ply,.fbx,.gltf,.glb,.usdz,.xyz,.svg,.3mf,.amf,.off,.wrl,.vrml,.ifc,.fcstd,.3ds,.dae"
        />
      </label>

      <div className="flex gap-1 ml-2 border-l border-gray-700 pl-2">
        <button
          title="Fit All"
          className="p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded transition text-xs"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
            />
          </svg>
        </button>

        <button
          title="Zoom In"
          className="p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded transition text-xs"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
            />
          </svg>
        </button>

        <button
          title="Zoom Out"
          className="p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded transition text-xs"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
            />
          </svg>
        </button>
      </div>

      <div className="flex gap-1 ml-2 border-l border-gray-700 pl-2">
        <button
          title="Snapshot"
          className="p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded transition text-xs"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>

        <button
          title="Measure"
          className="p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded transition text-xs"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <label className="flex items-center gap-1 text-xs text-gray-300 cursor-pointer hover:text-white">
          <input
            type="checkbox"
            defaultChecked={state.settings.gridVisible}
            className="rounded"
          />
          Grid
        </label>
        <label className="flex items-center gap-1 text-xs text-gray-300 cursor-pointer hover:text-white">
          <input
            type="checkbox"
            defaultChecked={state.settings.axisVisible}
            className="rounded"
          />
          Axis
        </label>
      </div>
    </div>
  );
};

export default Toolbar;
