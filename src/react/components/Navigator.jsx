import React from 'react';
import { useViewer } from '../context/ViewerContext.jsx';

const Navigator = () => {
  const { state, toggleNavigator } = useViewer();

  if (!state.navigator.visible) return null;

  return (
    <div className="w-56 bg-gray-800 text-gray-100 flex flex-col overflow-hidden">
      <div className="p-3 border-b border-gray-700 flex items-center justify-between bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-100">Navigator</h2>
        <button
          onClick={toggleNavigator}
          className="p-1 hover:bg-gray-700 rounded transition"
          title="Close Navigator"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-1">
          <div className="border border-gray-700 rounded p-2 bg-gray-900">
            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-800 p-1 rounded text-sm">
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 5v2h6V5H9zm0 4v2h6V9H9zm0 4v2h6v-2H9z" />
              </svg>
              <span className="text-sm text-gray-300 font-medium">Model</span>
            </div>
            {state.model && (
              <div className="ml-4 space-y-1">
                <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-700 p-2 rounded text-sm text-gray-300">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span>Body</span>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-700 space-y-2">
            <div>
              <label className="text-xs font-semibold text-gray-400 block mb-2">View Mode</label>
              <select className="w-full px-2 py-1 text-sm bg-gray-700 border border-gray-600 rounded text-gray-200">
                <option>Perspective</option>
                <option>Orthographic</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-400 block mb-2">Navigation</label>
              <select className="w-full px-2 py-1 text-sm bg-gray-700 border border-gray-600 rounded text-gray-200">
                <option>Orbit</option>
                <option>Free</option>
                <option>Walk</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigator;
