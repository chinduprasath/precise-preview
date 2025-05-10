
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import AdminProfileOverview from '@/components/admin/profile/AdminProfileOverview';
import ProfileDetailsForm from '@/components/admin/profile/ProfileDetailsForm';
import SecuritySettingsForm from '@/components/admin/profile/SecuritySettingsForm';
import PreferencesForm from '@/components/admin/profile/PreferencesForm';
import ActivityLog from '@/components/admin/profile/ActivityLog';

export type AdminProfile = {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  phone?: string;
  role: string;
  designation?: string;
  last_login?: string;
  linkedin_url?: string;
  twitter_url?: string;
  github_url?: string;
}

const AdminProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkUserAndLoadProfile = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const session = sessionData.session;
        
        if (!session) {
          navigate('/signin');
          return;
        }

        const userType = localStorage.getItem('userType');
        if (userType && userType !== 'admin') {
          navigate(`/account/${userType}`);
          return;
        }

        // For demo purposes, we'll create a mock profile
        // In a real application, you would fetch this from your database
        const mockProfile: AdminProfile = {
          id: session.user.id,
          full_name: 'Admin User',
          email: session.user.email || 'admin@example.com',
          role: 'Super Admin',
          designation: 'Platform Administrator',
          avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          phone: '+1 (555) 123-4567',
          last_login: new Date().toISOString(),
          linkedin_url: 'https://linkedin.com/in/adminuser',
          twitter_url: 'https://twitter.com/adminuser',
          github_url: 'https://github.com/adminuser'
        };
        
        setProfile(mockProfile);
      } catch (error: any) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred while loading your profile",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    checkUserAndLoadProfile();
  }, [navigate, toast]);

  const handleProfileUpdate = (updatedData: Partial<AdminProfile>) => {
    if (profile) {
      const updatedProfile = { ...profile, ...updatedData };
      setProfile(updatedProfile);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated",
        variant: "default"
      });
      
      // In a real application, you would save this to your database
      console.log('Updated profile:', updatedProfile);
    }
  };

  const handlePasswordChange = (currentPassword: string, newPassword: string) => {
    // In a real application, you would update the password via Supabase Auth
    toast({
      title: "Password Updated",
      description: "Your password has been successfully changed",
      variant: "default"
    });
    
    console.log('Password change requested');
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('userType');
      navigate('/landing');
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
        variant: "default"
      });
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Admin Profile</h1>
        
        <div className="space-y-6">
          {profile && (
            <>
              <AdminProfileOverview profile={profile} onUpdate={handleProfileUpdate} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <ProfileDetailsForm profile={profile} onUpdate={handleProfileUpdate} />
                  <PreferencesForm />
                </div>
                
                <div className="space-y-6">
                  <SecuritySettingsForm onPasswordChange={handlePasswordChange} />
                  <ActivityLog userId={profile.id} />
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 mt-8">
                <button 
                  className="px-4 py-2 bg-destructive text-white rounded-md hover:bg-destructive/90"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminProfilePage;
