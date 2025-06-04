
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '@/components/ErrorFallback';
import GlobalLoadingScreen from '@/components/GlobalLoadingScreen';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Donate from '@/pages/Donate';
import MemberDashboard from '@/pages/MemberDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import Events from '@/pages/Events';
import Blog from '@/pages/Blog';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import RSVPAdminTable from '@/pages/RSVPAdminTable';
import EventDetails from '@/pages/EventDetails';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const AppContent = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <GlobalLoadingScreen />;
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/donate" element={<Donate />} />
      <Route path="/member" element={<MemberDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Register />} />
      <Route path="/register" element={<Register />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/admin/rsvps" element={<RSVPAdminTable />} />
      <Route path="/events" element={<Events />} />
      <Route path="/events/:id" element={<EventDetails />} />
    </Routes>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ThemeProvider defaultTheme="system" storageKey="iwc-theme">
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <AuthProvider>
              <AppContent />
              <Toaster />
            </AuthProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
