import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '@/components/ErrorFallback';
import GlobalLoadingScreen from '@/components/GlobalLoading';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Donate from '@/pages/Donate';
import MemberDashboard from '@/pages/MemberDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import Events from '@/pages/Events';
import Blog from '@/pages/Blog';
import Login from '@/pages/Login';
import SignUp from '@/pages/SignUp';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import RSVPAdminTable from '@/pages/RSVPAdminTable';
import { QueryClient } from '@tanstack/react-query';

import EventDetails from '@/pages/EventDetails';

function App() {
  return (
    <QueryClient>
      <Router>
        <ThemeProvider defaultTheme="system" storageKey="iwc-theme">
          <Toaster />
          <GlobalLoadingScreen />
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/donate" element={<Donate />} />
                <Route path="/member" element={<MemberDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/admin/rsvps" element={<RSVPAdminTable />} />
                <Route path="/events" element={<Events />} />
                <Route path="/events/:id" element={<EventDetails />} />
              </Routes>
            </AuthProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </Router>
    </QueryClient>
  );
}

export default App;
