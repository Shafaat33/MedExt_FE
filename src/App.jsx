import { useState } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { store } from './store/store';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ExtractionPanel from './components/ExtractionPanel';
import ImageExtraction from './components/ImageExtraction';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="flex bg-[#0a0f1e] min-h-screen text-slate-300 font-sans antialiased overflow-hidden selection:bg-blue-500/30 selection:text-white">
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          <div className="flex flex-col flex-1 h-screen overflow-y-auto w-full lg:pl-64 transition-all duration-300">
            <Header onMenuClick={() => setIsSidebarOpen(true)} />
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/extract" element={<ExtractionPanel />} />
              <Route path="/image-extract" element={<ImageExtraction />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
