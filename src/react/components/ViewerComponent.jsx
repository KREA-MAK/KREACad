import React, { useRef, useEffect } from 'react';
import { useViewer } from '../context/ViewerContext.jsx';

const ViewerComponent = () => {
  const viewerDivRef = useRef(null);
  const canvasRef = useRef(null);
  const modelLoaderRef = useRef(null);
  const { state, setViewer, setModelLoader } = useViewer();

  useEffect(() => {
    if (!viewerDivRef.current) return;

    let viewer = null;

    const initializeViewer = async () => {
      try {
        // Dynamic import to avoid path resolution issues
        const Engine = await import('@engine/main.js');

        // Create a canvas element for the viewer
        const canvas = document.createElement('canvas');
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.display = 'block';

        // Append canvas to div
        viewerDivRef.current.innerHTML = '';
        viewerDivRef.current.appendChild(canvas);

        // Initialize the 3D viewer with the canvas
        viewer = new Engine.Viewer();
        viewer.Init(canvas);

        // Setup the model loader for loading 3D files
        const ThreeModelLoader = await import('@engine/threejs/threemodelloader.js');
        const modelLoader = new ThreeModelLoader.ThreeModelLoader(viewer);
        modelLoaderRef.current = modelLoader;

        // Setup the viewer
        if (viewer.SetExternalLibLocation) {
          viewer.SetExternalLibLocation('./libs/');
        }

        // Resize after canvas is mounted
        setTimeout(() => {
          if (viewerDivRef.current && viewer) {
            const width = viewerDivRef.current.clientWidth;
            const height = viewerDivRef.current.clientHeight;
            if (width > 0 && height > 0) {
              viewer.Resize(width, height);
            }
          }
        }, 100);

        setViewer(viewer);
        setModelLoader(modelLoader);

        // Handle window resize
        const handleResize = () => {
          if (viewerDivRef.current && viewer) {
            const width = viewerDivRef.current.clientWidth;
            const height = viewerDivRef.current.clientHeight;
            if (width > 0 && height > 0) {
              viewer.Resize(width, height);
            }
          }
        };

        window.addEventListener('resize', handleResize);

        // Cleanup function
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      } catch (err) {
        console.error('Failed to load engine:', err);
      }
    };

    initializeViewer();

    return () => {
      // Cleanup on component unmount
      if (viewer) {
        viewer = null;
      }
    };
  }, [setViewer]);

  return (
    <div
      ref={viewerDivRef}
      className="flex-1 w-full h-full bg-gray-900"
      style={{ display: 'flex' }}
    />
  );
};

export default ViewerComponent;
