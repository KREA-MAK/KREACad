import { useCallback } from 'react';
import { useViewer } from '../context/ViewerContext.jsx';

export const useFileUpload = () => {
  const { setLoading, setModel, setError, state } = useViewer();

  const handleFileUpload = useCallback(
    async (files) => {
      if (!files || files.length === 0) return;

      setLoading(true);
      setError(null);

      try {
        // Dynamic import to avoid path resolution issues
        const Engine = await import('@engine/main.js');

        // Use the viewer to load model from file list
        if (state.viewer) {
          // Convert FileList to InputFile objects
          const inputFiles = [];
          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            inputFiles.push(
              new Engine.InputFile(file.name, file)
            );
          }

          // Call the correct viewer method (LoadModelFromInputFiles)
          state.viewer.LoadModelFromInputFiles(inputFiles);

          setModel({
            name: files[0].name,
            meshCount: 0, // Will be updated when model loads
          });
        }
      } catch (error) {
        console.error('File upload error:', error);
        setError(error.message || 'Failed to load file');
      } finally {
        setLoading(false);
      }
    },
    [state.viewer, setLoading, setModel, setError]
  );

  return { handleFileUpload };
};
