import React from 'react';
import { useViewer } from '../context/ViewerContext.jsx';

const Header = () => {
  const { state } = useViewer();

  return (
    <header className="w-full bg-gray-900 text-white border-b border-gray-700">
      <div className="flex items-center justify-between px-4 py-3 gap-4">
        {/* Left: Logo and Title */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <img
            src="/assets/logos/krea_logo.png"
            alt="KreaCAD"
            className="h-8 w-auto"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <h1 className="text-lg font-bold text-white">KreaCAD</h1>
        </div>

        {/* Center: File name display */}
        <div className="flex-1 text-center text-sm text-gray-400 truncate">
          {state.model?.name || 'No file loaded'}
        </div>

        {/* Right: Links and buttons */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <a href="#" className="text-sm text-gray-400 hover:text-white transition">
            Help
          </a>
          <a href="https://github.com" className="text-sm text-gray-400 hover:text-white transition">
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
