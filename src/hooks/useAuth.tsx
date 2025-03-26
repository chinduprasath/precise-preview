
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

type UserType = 'business' | 'influencer' | 'admin';

export const useAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<UserType>('business');
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      // Store the user type in localStorage
      localStorage.setItem('userType', userType);
      
      // Store login details in the database
      const { error: loginDetailsError } = await supabase
        .from('login_details')
        .insert({
          user_id: data.user.id,
          login_type: userType,
          login_method: 'email',
          ip_address: 'client-side', // We don't have access to real IP on client
          user_agent: navigator.userAgent
        });
      
      if (loginDetailsError) {
        console.error('Error storing login details:', loginDetailsError);
      }
      
      // Show success message
      toast({
        title: "Signed in successfully!",
        description: `Welcome back to InfluenceConnect as ${userType}.`,
      });
      
      // Redirect to the appropriate dashboard
      navigate(`/dashboard/${userType}`);
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: "Sign in failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    userType,
    setUserType,
    handleSignIn
  };
};
