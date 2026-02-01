import React from 'react';
import { ViewerProvider, ViewerContext } from './context/ViewerContext.jsx';
import Header from './components/Header.jsx';
import Toolbar from './components/Toolbar.jsx';
import Navigator from './components/Navigator.jsx';
import ViewerComponent from './components/ViewerComponent.jsx';
import Sidebar from './components/Sidebar.jsx';
import IntroScreen from './components/IntroScreen.jsx';

const AppLayout = () => {
  const { state } = React.useContext(ViewerContext);
  const isModelLoaded = state?.model?.name !== undefined && state?.model?.name !== null;

  return (
    <div className="flex flex-col h-screen w-screen bg-white relative">
      {/* Header */}
      <Header />

      {/* Toolbar */}
      <Toolbar />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden bg-gray-900 relative">
        {/* Intro Screen - Shows when no model is loaded */}
        {!isModelLoaded && <IntroScreen isVisible={true} />}

        {/* Left Navigator */}
        <Navigator />

        {/* Center Viewer */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <ViewerComponent />
        </div>

        {/* Right Sidebar */}
        <Sidebar />
      </div>
    </div>
  );
};

const App = () => {
  return (
    <ViewerProvider>
      <AppLayout />
    </ViewerProvider>
  );
};

export default App;
