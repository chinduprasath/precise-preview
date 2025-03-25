
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import InfluencersPage from "./pages/influencers";
import InfluencerDetailPage from "./pages/influencers/detail";
import ChatsPage from "./pages/chats";
import ReachPage from "./pages/reach";
import ServicesPage from "./pages/services";
import OrdersPage from "./pages/orders";
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
import NotFound from "./pages/NotFound";
import { BillingPage } from "./pages/billing";

// Create a new QueryClient instance
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
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
            <Route path="/reports" element={<ReportsPage />} />
            
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
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
