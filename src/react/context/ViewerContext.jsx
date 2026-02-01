import React, { createContext, useReducer, useCallback } from 'react';

export const ViewerContext = createContext();

export const ViewerProvider = ({ children }) => {
  const initialState = {
    viewer: null,
    model: null,
    loading: false,
    error: null,
    selectedMeshes: [],
    selectedMaterials: [],
    settings: {
      theme: 'light',
      navigationMode: 'Orbit',
      projectionMode: 'Perspective',
      backgroundColor: { r: 200, g: 200, b: 200 },
      gridVisible: true,
      axisVisible: true,
    },
    sidebar: {
      visible: true,
      activePanel: 'meshes',
    },
    navigator: {
      visible: true,
    },
    toolbar: {
      visible: true,
    },
  };

  const viewerReducer = (state, action) => {
    switch (action.type) {
      case 'SET_VIEWER':
        return { ...state, viewer: action.payload };
      case 'SET_MODEL':
        return { ...state, model: action.payload };
      case 'SET_LOADING':
        return { ...state, loading: action.payload };
      case 'SET_ERROR':
        return { ...state, error: action.payload };
      case 'SET_SELECTED_MESHES':
        return { ...state, selectedMeshes: action.payload };
      case 'ADD_SELECTED_MESH':
        return {
          ...state,
          selectedMeshes: [...new Set([...state.selectedMeshes, action.payload])],
        };
      case 'REMOVE_SELECTED_MESH':
        return {
          ...state,
          selectedMeshes: state.selectedMeshes.filter((m) => m !== action.payload),
        };
      case 'UPDATE_SETTINGS':
        return {
          ...state,
          settings: { ...state.settings, ...action.payload },
        };
      case 'TOGGLE_SIDEBAR':
        return {
          ...state,
          sidebar: { ...state.sidebar, visible: !state.sidebar.visible },
        };
      case 'SET_SIDEBAR_PANEL':
        return {
          ...state,
          sidebar: { ...state.sidebar, activePanel: action.payload },
        };
      case 'TOGGLE_NAVIGATOR':
        return {
          ...state,
          navigator: { ...state.navigator, visible: !state.navigator.visible },
        };
      case 'TOGGLE_TOOLBAR':
        return {
          ...state,
          toolbar: { ...state.toolbar, visible: !state.toolbar.visible },
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(viewerReducer, initialState);

  const setViewer = useCallback((viewer) => {
    dispatch({ type: 'SET_VIEWER', payload: viewer });
  }, []);

  const setModel = useCallback((model) => {
    dispatch({ type: 'SET_MODEL', payload: model });
  }, []);

  const setLoading = useCallback((loading) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setError = useCallback((error) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const updateSettings = useCallback((settings) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  }, []);

  const toggleSidebar = useCallback(() => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  }, []);

  const setSidebarPanel = useCallback((panel) => {
    dispatch({ type: 'SET_SIDEBAR_PANEL', payload: panel });
  }, []);

  const toggleNavigator = useCallback(() => {
    dispatch({ type: 'TOGGLE_NAVIGATOR' });
  }, []);

  const toggleToolbar = useCallback(() => {
    dispatch({ type: 'TOGGLE_TOOLBAR' });
  }, []);

  const value = {
    state,
    dispatch,
    setViewer,
    setModel,
    setLoading,
    setError,
    updateSettings,
    toggleSidebar,
    setSidebarPanel,
    toggleNavigator,
    toggleToolbar,
  };

  return <ViewerContext.Provider value={value}>{children}</ViewerContext.Provider>;
};

export const useViewer = () => {
  const context = React.useContext(ViewerContext);
  if (!context) {
    throw new Error('useViewer must be used within ViewerProvider');
  }
  return context;
};
