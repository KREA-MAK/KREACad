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

        const inputFiles = [];

        // Convert FileList to array of InputFile objects
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          inputFiles.push(
            new Engine.InputFile(file.name, file)
          );
        }

        // Use the viewer to import files
        if (state.viewer) {
          const importSettings = new Engine.ImportSettings();

          await Engine.Import3DViewerFiles(
            state.viewer,
            inputFiles,
            importSettings
          );

          // Fit the view
          if (state.viewer.FitToWindow) {
            state.viewer.FitToWindow();
          }

          setModel({
            name: files[0].name,
            meshCount: state.viewer.GetModel()?.GetMeshCount() || 0,
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
