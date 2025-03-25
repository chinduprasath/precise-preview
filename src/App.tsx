
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import InfluencersPage from "./pages/influencers";
import InfluencerDetailPage from "./pages/influencers/detail";
import ChatsPage from "./pages/chats";
import ReachPage from "./pages/reach";
import ServicesPage from "./pages/services";
import OrdersPage from "./pages/orders";
import RequestsPage from "./pages/requests";
import ReportsPage from "./pages/reports";
import LandingPage from "./pages/landing";
import SignUpPage from "./pages/auth/signup";
import SignInPage from "./pages/auth/signin";
import AdminDashboard from "./pages/dashboard/admin";
import InfluencerDashboard from "./pages/dashboard/influencer";
import BusinessDashboard from "./pages/dashboard/business";
import BusinessProfile from "./pages/account/business";
import InfluencerProfile from "./pages/account/influencer";
import SettingsPage from "./pages/account/settings";
import NotificationsPage from "./pages/notifications";
import NotFound from "./pages/NotFound";
import { BillingPage } from "./pages/billing";
import OnboardPage from "./pages/onboard";
import { ErrorBoundary } from "./components/ErrorBoundary";

// Create a new QueryClient instance - move this inside the component
function App() {
  // Create a new QueryClient instance with proper error handling
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 30000,
        refetchOnWindowFocus: false,
        onError: (error) => {
          console.error("Query error:", error);
        }
      }
    }
  });

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ErrorBoundary>
          <BrowserRouter>
            <Routes>
              {/* Original Routes */}
              <Route path="/app" element={<Index />} />
              <Route path="/influencers" element={<InfluencersPage />} />
              <Route path="/influencers/:id" element={<InfluencerDetailPage />} />
              <Route path="/chats" element={<ChatsPage />} />
              <Route path="/reach" element={<ReachPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/requests" element={<RequestsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              
              {/* New Landing and Auth Pages */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/signin" element={<SignInPage />} />
              
              {/* Dashboard Routes */}
              <Route path="/dashboard/admin" element={<AdminDashboard />} />
              <Route path="/dashboard/influencer" element={<InfluencerDashboard />} />
              <Route path="/dashboard/business" element={<BusinessDashboard />} />
              
              {/* Account Routes */}
              <Route path="/account/business" element={<BusinessProfile />} />
              <Route path="/account/influencer" element={<InfluencerProfile />} />
              <Route path="/account/settings" element={<SettingsPage />} />
              <Route path="/billing" element={<BillingPage />} />
              
              {/* New Onboard Route */}
              <Route path="/onboard" element={<OnboardPage />} />
              
              {/* Redirect Profile route based on user type */}
              <Route path="/account" element={
                <Navigate to={`/account/${localStorage.getItem('userType') || 'business'}`} replace />
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
