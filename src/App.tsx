import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Events from "./pages/Events";
import Media from "./pages/Media";
import Blog from "./pages/Blog";
import Sermons from "./pages/Sermons";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MemberArea from "./pages/MemberArea";
import Donate from "./pages/Donate";
import AdminDashboard from "./pages/AdminDashboard";
import ResetPassword from "./pages/ResetPassword";
import UpdatePassword from "./pages/UpdatePassword";
import GlobalLoadingScreen from "@/components/GlobalLoadingScreen";

const queryClient = new QueryClient();

const App = () => {
  const [appLoading, setAppLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate initial app load (replace with real logic as needed)
    const timeout = setTimeout(() => setAppLoading(false), 1200);
    return () => clearTimeout(timeout);
  }, []);

  if (appLoading) return <GlobalLoadingScreen />;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="iwc-ui-theme">
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
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
                <Route path="/member" element={<MemberArea />} />
                <Route path="/admin" element={<AdminDashboard />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
