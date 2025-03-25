
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Building2, User, Shield, ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type UserType = 'business' | 'influencer' | 'admin' | null;

const SignUpPage = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [userType, setUserType] = useState<UserType>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type);
    setStep(2);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically handle signup with an auth provider
    console.log('Signing up as:', userType, { name, email, password });
    
    // Show success message
    toast({
      title: "Account created!",
      description: "Welcome to InfluenceConnect.",
    });
    
    // Redirect to the appropriate dashboard
    switch (userType) {
      case 'business':
        navigate('/dashboard/business');
        break;
      case 'influencer':
        navigate('/dashboard/influencer');
        break;
      case 'admin':
        navigate('/dashboard/admin');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full">
        {step === 1 ? (
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to home
            </Link>
            <h1 className="text-3xl font-bold mb-2">Join InfluenceConnect</h1>
            <p className="text-gray-600 mb-8">Select how you'd like to use our platform</p>
            
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => handleUserTypeSelect('business')}
                className="flex items-center p-6 bg-white border border-gray-200 rounded-xl hover:border-primary hover:shadow-md transition-all text-left"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Business User</h3>
                  <p className="text-gray-500 text-sm">Find influencers and manage campaigns</p>
                </div>
              </button>
              
              <button
                onClick={() => handleUserTypeSelect('influencer')}
                className="flex items-center p-6 bg-white border border-gray-200 rounded-xl hover:border-primary hover:shadow-md transition-all text-left"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Influencer</h3>
                  <p className="text-gray-500 text-sm">Connect with brands and get paid for promotions</p>
                </div>
              </button>
              
              <button
                onClick={() => handleUserTypeSelect('admin')}
                className="flex items-center p-6 bg-white border border-gray-200 rounded-xl hover:border-primary hover:shadow-md transition-all text-left"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Administrator</h3>
                  <p className="text-gray-500 text-sm">Manage platform activities and users</p>
                </div>
              </button>
            </div>
            
            <p className="mt-8 text-gray-600">
              Already have an account?{' '}
              <Link to="/signin" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        ) : (
          <Card className="shadow-lg border-0">
            <CardHeader>
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </button>
              <CardTitle className="text-2xl">Create your account</CardTitle>
              <CardDescription>
                {userType === 'business' && 'Sign up as a Business User'}
                {userType === 'influencer' && 'Sign up as an Influencer'}
                {userType === 'admin' && 'Sign up as an Administrator'}
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSignUp}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Enter your name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter your email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Create a password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                {userType === 'influencer' && (
                  <div className="space-y-2">
                    <Label htmlFor="category">Primary Content Category</Label>
                    <Select>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select your category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fashion">Fashion & Style</SelectItem>
                        <SelectItem value="beauty">Beauty</SelectItem>
                        <SelectItem value="fitness">Fitness & Health</SelectItem>
                        <SelectItem value="travel">Travel</SelectItem>
                        <SelectItem value="food">Food & Cooking</SelectItem>
                        <SelectItem value="tech">Technology</SelectItem>
                        <SelectItem value="gaming">Gaming</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {userType === 'business' && (
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input id="company" placeholder="Enter your company name" />
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col">
                <Button type="submit" className="w-full">
                  Create Account
                </Button>
                <p className="mt-4 text-center text-gray-600 text-sm">
                  By signing up, you agree to our{' '}
                  <a href="#" className="text-primary hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </CardFooter>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SignUpPage;
