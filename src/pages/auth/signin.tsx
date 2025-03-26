
import React from 'react';
import SignInCard from '@/components/auth/SignInCard';

const SignInPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4 py-12 transition-colors duration-300">
      <div className="max-w-md w-full">
        <SignInCard />
      </div>
    </div>
  );
};

export default SignInPage;
