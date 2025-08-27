
import React from 'react';
import { HashRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import PatientsList from './pages/PatientsList';
import PatientDetail from './pages/PatientDetail';
import PrescriptionEditor from './pages/PrescriptionEditor';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import PrescriptionPrintPreview from './components/PrescriptionPrintPreview';

const MainLayout: React.FC = () => (
    <>
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
                <div className="container mx-auto px-6 py-8">
                    <Outlet />
                </div>
            </main>
        </div>
    </>
);

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
          <Routes>
              {/* Standalone route for printing, without the main layout */}
              <Route path="/print/prescription/:patientId/:visitId" element={<PrescriptionPrintPreview />} />
              
              {/* Layout route that wraps all main pages */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/patients" element={<PatientsList />} />
                <Route path="/patient/:id" element={<PatientDetail />} />
                <Route path="/prescription/new/:patientId" element={<PrescriptionEditor />} />
                <Route path="/prescription/edit/:patientId/:visitId" element={<PrescriptionEditor />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Route>
          </Routes>
        </div>
      </HashRouter>
    </AppProvider>
  );
};

export default App;
