import React from 'react';
import { useViewer } from '../context/ViewerContext.jsx';

const Sidebar = () => {
  const { state, setSidebarPanel } = useViewer();

  if (!state.sidebar.visible) return null;

  return (
    <div className="w-72 bg-gray-800 text-gray-100 flex flex-col overflow-hidden">
      {/* Sidebar Header with Tabs */}
      <div className="border-b border-gray-700 flex gap-1 p-2 bg-gray-900">
        <button
          onClick={() => setSidebarPanel('meshes')}
          className={`px-3 py-1 rounded text-xs font-medium transition ${
            state.sidebar.activePanel === 'meshes'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
          }`}
        >
          Meshes
        </button>
        <button
          onClick={() => setSidebarPanel('materials')}
          className={`px-3 py-1 rounded text-xs font-medium transition ${
            state.sidebar.activePanel === 'materials'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
          }`}
        >
          Materials
        </button>
        <button
          onClick={() => setSidebarPanel('properties')}
          className={`px-3 py-1 rounded text-xs font-medium transition ${
            state.sidebar.activePanel === 'properties'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
          }`}
        >
          Properties
        </button>
      </div>

      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {state.sidebar.activePanel === 'meshes' && (
          <div>
            <h3 className="font-semibold text-gray-200 mb-4 text-sm">Model Objects</h3>
            {state.model ? (
              <ul className="space-y-1">
                <li className="p-2 bg-gray-700 rounded hover:bg-gray-600 cursor-pointer transition text-sm text-gray-300">
                  <span>Model Mesh</span>
                </li>
              </ul>
            ) : (
              <p className="text-xs text-gray-500">No model loaded</p>
            )}
          </div>
        )}

        {state.sidebar.activePanel === 'materials' && (
          <div>
            <h3 className="font-semibold text-gray-200 mb-4 text-sm">Materials</h3>
            {state.model ? (
              <div className="space-y-2">
                <div className="p-2 bg-gray-700 rounded">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-500 rounded"></div>
                    <span className="text-xs text-gray-300">Default Material</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-500">No materials loaded</p>
            )}
          </div>
        )}

        {state.sidebar.activePanel === 'properties' && (
          <div>
            <h3 className="font-semibold text-gray-200 mb-4 text-sm">Properties</h3>
            {state.model ? (
              <div className="space-y-2">
                <div>
                  <label className="text-xs font-semibold text-gray-400 block mb-1">
                    Vertex Count
                  </label>
                  <p className="text-sm text-gray-300">0</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 block mb-1">
                    Triangle Count
                  </label>
                  <p className="text-sm text-gray-300">0</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 block mb-1">
                    Material Count
                  </label>
                  <p className="text-sm text-gray-300">0</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-500">No model loaded</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
