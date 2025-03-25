
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const LandingHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Check if user is logged in
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setIsLoggedIn(true);
        // Get user type from localStorage
        const storedUserType = localStorage.getItem('userType');
        setUserType(storedUserType);
      } else {
        setIsLoggedIn(false);
        setUserType(null);
      }
    };
    
    checkUser();
    
    // Set up auth state change listener
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setIsLoggedIn(true);
        const storedUserType = localStorage.getItem('userType');
        setUserType(storedUserType);
      } else if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
        setUserType(null);
      }
    });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      data.subscription.unsubscribe();
    };
  }, []);

  const handleSignInClick = async (e: React.MouseEvent) => {
    // Check if user is already logged in with Supabase
    const { data } = await supabase.auth.getSession();
    
    if (data.session) {
      e.preventDefault();
      
      // Use stored user type if available, otherwise default to business
      const userType = localStorage.getItem('userType') || 'business';
      navigate(`/dashboard/${userType}`);
    }
  };
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('userType');
      setIsLoggedIn(false);
      setUserType(null);
      navigate('/');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
    }
  };
  
  const goToDashboard = () => {
    if (userType) {
      navigate(`/dashboard/${userType}`);
    } else {
      navigate('/dashboard/business');
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="font-bold text-2xl text-primary">InfluenceConnect</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#about" className="text-gray-700 hover:text-primary font-medium">About</a>
          <a href="#pricing" className="text-gray-700 hover:text-primary font-medium">Pricing</a>
          <a href="#contact" className="text-gray-700 hover:text-primary font-medium">Contact</a>
        </nav>
        
        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <Button variant="outline" onClick={goToDashboard}>Dashboard</Button>
              <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/signin" onClick={handleSignInClick}>
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-700"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col space-y-4">
            <a 
              href="#about" 
              className="text-gray-700 hover:text-primary font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </a>
            <a 
              href="#pricing" 
              className="text-gray-700 hover:text-primary font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </a>
            <a 
              href="#contact" 
              className="text-gray-700 hover:text-primary font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </a>
            
            <div className="flex flex-col space-y-3 pt-3 border-t">
              {isLoggedIn ? (
                <>
                  <Button variant="outline" onClick={() => {
                    setIsMenuOpen(false);
                    goToDashboard();
                  }}>
                    Dashboard
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }} className="flex items-center justify-center gap-2">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/signin" onClick={(e) => {
                    setIsMenuOpen(false);
                    handleSignInClick(e);
                  }}>
                    <Button variant="outline" className="w-full">Sign In</Button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingHeader;
