import React, { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";
import AuthGuard from "@/components/AuthGuard";
import GlobalLoadingScreen from "@/components/GlobalLoadingScreen";
import { supabaseEnvMissing } from "@/integrations/supabase/client";
const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const Events = lazy(() => import("./pages/Events"));
const Media = lazy(() => import("./pages/Media"));
const Blog = lazy(() => import("./pages/Blog"));
const Sermons = lazy(() => import("./pages/Sermons"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Contact = lazy(() => import("./pages/Contact"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Donate = lazy(() => import("./pages/Donate"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const UpdatePassword = lazy(() => import("./pages/UpdatePassword"));
const MemberArea = lazy(() => import("./pages/MemberArea"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent" />
    </div>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        if (error?.status === 404) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
    mutations: {
      retry: 1,
    },
  },
});

const App = () => {
  const [appLoading, setAppLoading] = React.useState(true);

  React.useEffect(() => {
    const timeout = setTimeout(() => setAppLoading(false), 1200);
    return () => clearTimeout(timeout);
  }, []);

  if (appLoading) return <GlobalLoadingScreen />;
  if (supabaseEnvMissing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <ErrorDisplay
          title="Configuration Required"
          message="Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file to load the app."
          showRetry={false}
        />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" storageKey="iwc-ui-theme">
          <TooltipProvider>
            <AuthProvider>
              <BrowserRouter>
                <Suspense fallback={<GlobalLoadingScreen />}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/media" element={<Media />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/sermons" element={<Sermons />} />
                    <Route path="/donate" element={<Donate />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/update-password" element={<UpdatePassword />} />
                    <Route path="/member" element={
                      <AuthGuard>
                        <MemberArea />
                      </AuthGuard>
                    } />
                    <Route path="/admin" element={
                      <AuthGuard adminOnly>
                        <AdminDashboard />
                      </AuthGuard>
                    } />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
              <Toaster />
              <Sonner />
            </AuthProvider>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
