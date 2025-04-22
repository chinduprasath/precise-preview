
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "./pages/Index";
import InfluencersPage from "./pages/influencers";
import InfluencerDetailPage from "./pages/influencers/detail";
import ChatsPage from "./pages/chats";
import ReachPage from "./pages/reach";
import ServicesPage from "./pages/services";
import OrdersPage from "./pages/orders";
import PlaceOrderPage from "./pages/orders/place";
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
import AnalyticsPage from "./pages/dashboard/admin/analytics";

function App() {
  // Create a new QueryClient instance with proper error handling
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 30000,
        refetchOnWindowFocus: false,
        meta: {
          errorHandler: (error: Error) => {
            console.error("Query error:", error);
          }
        }
      }
    }
  });

  return (
    <ThemeProvider defaultTheme="system">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <ErrorBoundary>
            <BrowserRouter>
              <Routes>
                {/* Root routes */}
                <Route path="/" element={<Index />} />
                <Route path="/landing" element={<LandingPage />} />
                <Route path="/app" element={<Index />} />
                
                {/* Auth routes */}
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                
                {/* Main application routes */}
                <Route path="/influencers" element={<InfluencersPage />} />
                <Route path="/influencers/:id" element={<InfluencerDetailPage />} />
                <Route path="/chats" element={<ChatsPage />} />
                <Route path="/reach" element={<ReachPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/orders/place" element={<PlaceOrderPage />} />
                <Route path="/requests" element={<RequestsPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                
                {/* Dashboard routes */}
                <Route path="/dashboard/admin" element={<AdminDashboard />} />
                <Route path="/dashboard/admin/analytics" element={<AnalyticsPage />} />
                <Route path="/dashboard/influencer" element={<InfluencerDashboard />} />
                <Route path="/dashboard/business" element={<BusinessDashboard />} />
                
                {/* Account routes */}
                <Route path="/account/business" element={<BusinessProfile />} />
                <Route path="/account/influencer" element={<InfluencerProfile />} />
                <Route path="/account/influencerprofile" element={<Navigate to="/account/influencer" replace />} />
                <Route path="/account/settings" element={<SettingsPage />} />
                <Route path="/billing" element={<BillingPage />} />
                <Route path="/onboard" element={<OnboardPage />} />
                
                <Route path="/account" element={
                  <Navigate to={`/account/${localStorage.getItem('userType') || 'business'}`} replace />
                } />
                
                {/* 404 route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </ErrorBoundary>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
