
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
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
import { useAuth } from '@/hooks/useAuth';

const SignInCard = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    userType,
    setUserType,
    handleSignIn
  } = useAuth();

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
