
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OnboardUserForm from '@/components/onboard/OnboardUserForm';
import OnboardUsersList, { OnboardUser } from '@/components/onboard/OnboardUsersList';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

const OnboardPage: React.FC = () => {
  const [users, setUsers] = useState<OnboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('list');
  const { toast } = useToast();

  const fetchOnboardingUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('onboarding_users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Convert the data to match the OnboardUser type by ensuring social_followers is Record<string, number>
      const typedUsers: OnboardUser[] = (data || []).map(user => ({
        ...user,
        social_followers: user.social_followers as Record<string, number> || {}
      }));
      
      setUsers(typedUsers);
    } catch (error: any) {
      console.error('Error fetching onboarding users:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load onboarding users',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOnboardingUsers();
    
    // Set up a subscription for real-time updates
    const subscription = supabase
      .channel('onboarding-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'onboarding_users',
        },
        () => {
          fetchOnboardingUsers();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const handleFormSuccess = () => {
    fetchOnboardingUsers();
    setActiveTab('list');
  };

  return (
    <Layout>
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Onboarding Management</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="list">User List</TabsTrigger>
            <TabsTrigger value="add">Add New User</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list">
            <OnboardUsersList 
              users={users} 
              onRefresh={fetchOnboardingUsers} 
              isLoading={isLoading} 
            />
          </TabsContent>
          
          <TabsContent value="add">
            <OnboardUserForm onSuccess={handleFormSuccess} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default OnboardPage;
