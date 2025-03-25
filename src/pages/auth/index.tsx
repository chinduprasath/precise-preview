
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/components/ui/use-toast';

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  userType: z.enum(["influencer", "user"], {
    required_error: "Please select a user type",
  }),
});

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      userType: "user",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // In a real app, you would send these values to your backend
    console.log(values);
    
    // Simulate a successful login/signup
    toast({
      title: isLogin ? "Login successful" : "Account created",
      description: `Logged in as a ${values.userType}`,
    });
    
    // Store user type in localStorage (in a real app, this would be handled by your auth system)
    localStorage.setItem('userType', values.userType);
    localStorage.setItem('userEmail', values.email);
    
    // Redirect based on user type
    if (values.userType === "influencer") {
      navigate('/profile/influencer');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" width="32" height="32" className="text-blue-500">
                <path fill="currentColor" d="M8.465 11.293c1.133-1.133 3.109-1.133 4.242 0l.707.707 1.414-1.414-.707-.707c-1.889-1.889-4.954-1.889-6.838 0l-2.122 2.121a4.798 4.798 0 0 0-1.414 3.414c0 1.305.512 2.526 1.414 3.414 1.889 1.889 4.954 1.889 6.838 0l2.121-2.121-1.414-1.414-2.121 2.121a3.407 3.407 0 0 1-4.242.004 2.982 2.982 0 0 1-.878-2.118c0-.802.313-1.554.878-2.121l2.122-2.121z"></path>
                <path fill="currentColor" d="M15.535 14.707l-2.121 2.121 1.414 1.414 2.121-2.121c.567-.566.879-1.317.879-2.121s-.312-1.555-.879-2.121c-1.133-1.133-3.109-1.133-4.242 0L10 14.586l1.414 1.414 2.707-2.707c.378-.378 1.037-.377 1.414 0a.996.996 0 0 1 0 1.414z"></path>
              </svg>
              <h1 className="font-bold text-xl">
                <span className="text-blue-500">Influence</span>
                <span className="text-gray-800">Connect</span>
              </h1>
            </div>
          </div>
          <CardTitle className="text-2xl text-center">{isLogin ? "Login" : "Create an Account"}</CardTitle>
          <CardDescription className="text-center">
            {isLogin ? "Enter your credentials to login" : "Fill in the details to create your account"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="userType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>I am a:</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-6"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="influencer" />
                          </FormControl>
                          <FormLabel className="font-normal">Influencer</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="user" />
                          </FormControl>
                          <FormLabel className="font-normal">Business User</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full">
                {isLogin ? "Login" : "Create Account"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            variant="link"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthPage;
