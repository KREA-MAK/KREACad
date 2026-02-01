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
        const importerFiles = await import('@engine/import/importerfiles.js');
        const importer = await import('@engine/import/importer.js');
        const geometry = await import('@engine/geometry/geometry.js');

        // Use the viewer to load model from file list
        if (state.viewer && state.modelLoader) {
          // Convert FileList to InputFile objects using the engine helper
          const inputFiles = importerFiles.InputFilesFromFileObjects(files);
          
          // Create import settings
          const importSettings = new importer.ImportSettings();

          // Load model with callbacks
          state.modelLoader.LoadModel(inputFiles, importSettings, {
            onLoadStart: () => {
              console.log('Loading model started...');
            },
            onFileListProgress: (current, total) => {
              console.log(`Loading files: ${current}/${total}`);
            },
            onFileLoadProgress: (current, total) => {
              console.log(`File progress: ${current}/${total}`);
            },
            onImportStart: () => {
              console.log('Importing model...');
            },
            onVisualizationStart: () => {
              console.log('Visualizing model...');
            },
            onModelFinished: (importResult, threeObject) => {
              console.log('Model loaded successfully');
              state.viewer.SetMainObject(threeObject);
              
              // Get bounding sphere and fit to view
              const boundingSphere = state.viewer.GetBoundingSphere(() => true);
              state.viewer.AdjustClippingPlanesToSphere(boundingSphere);
              state.viewer.SetUpVector(geometry.Direction.Y, false);
              state.viewer.FitSphereToWindow(boundingSphere, false);
              
              setModel({
                name: files[0].name,
                meshCount: importResult.model ? importResult.model.GetMeshCount() : 0,
              });
            },
            onTextureLoaded: () => {
              state.viewer.Render();
            },
            onLoadError: (importError) => {
              console.error('Model load error:', importError);
              let message = 'Failed to load model';
              if (importError.message) {
                message += ': ' + importError.message;
              }
              setError(message);
            }
          });

          setModel({
            name: files[0].name,
            meshCount: 0,
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
