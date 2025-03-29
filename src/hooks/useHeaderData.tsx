
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useHeaderData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({
    fullName: 'User',
    email: '',
    avatarUrl: ''
  });
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    
    const fetchUserData = async () => {
      if (!isMounted) return;
      
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log('No active session found');
          setIsLoading(false);
          return;
        }
        
        // Get user information directly from session metadata
        if (isMounted) {
          const firstName = session.user?.user_metadata?.first_name || '';
          const lastName = session.user?.user_metadata?.last_name || '';
          const fullName = `${firstName} ${lastName}`.trim() || 'User';
          
          setUserData({
            fullName: fullName,
            email: session.user.email || '',
            avatarUrl: session.user.user_metadata?.avatar_url || ''
          });
        }
        
        // Fetch notifications count
        if (session.user && session.user.id && isMounted) {
          try {
            const { count, error: notifError } = await supabase
              .from('notifications')
              .select('*', { count: 'exact', head: true })
              .eq('user_id', session.user.id)
              .eq('is_read', false);
              
            if (!notifError && count !== null && isMounted) {
              setNotificationCount(count);
            }
          } catch (notifErr) {
            console.error("Error fetching notifications:", notifErr);
          }
        }
      } catch (error) {
        console.error('Error in fetchUserData:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchUserData();
    
    // Set up auth state subscription with proper cleanup
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        fetchUserData();
      } else if (event === 'SIGNED_OUT' && isMounted) {
        setUserData({
          fullName: 'Guest',
          email: '',
          avatarUrl: ''
        });
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    isLoading,
    userData,
    notificationCount
  };
};
