
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import UserTypeSelector from './UserTypeSelector';
import SignInForm from './SignInForm';
import SocialLoginOptions from './SocialLoginOptions';

const SignInCard = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<'business' | 'influencer' | 'admin'>('business');
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

  return (
    <Card className="shadow-lg border border-border">
      <CardHeader>
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to home
        </Link>
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>
          Sign in to your InfluenceConnect account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <UserTypeSelector 
          userType={userType}
          onUserTypeChange={(value) => setUserType(value)}
        />
        
        <SignInForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          isLoading={isLoading}
          onSubmit={handleSignIn}
        />
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <SocialLoginOptions isLoading={isLoading} />
      </CardFooter>
    </Card>
  );
};

export default SignInCard;
