import React, { useEffect } from 'react';
import AuthForm from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboard';
import CreateProject from './pages/CreateProject';
import Workspaces from './pages/WorkSpace';
import DirectMessages from './pages/DirectMessages';
import MatchExplorer from './pages/MatchExplorer';
import Profile from './pages/Profile';
import MainLayout from './components/layout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { auth } from './utils/firebase'; // Firebase auth

function App() {
  useEffect(() => {
    const initializeToken = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const token = await user.getIdToken();
          localStorage.setItem('idToken', token); // Store token for interceptors
        } catch (error) {
          console.error('Failed to initialize token:', error);
        }
      }
    };
    initializeToken();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<AuthForm />} />
        <Route path="/onboarding" element={<Onboarding />} />

        {/* Protected Routes */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-project" element={<CreateProject />} />
          <Route path="/my-workspaces" element={<Workspaces />} />
          <Route path="/messages" element={<DirectMessages />} />
          <Route path="/explore-matches" element={<MatchExplorer />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
