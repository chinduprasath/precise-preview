
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
        
        try {
          const { data: userProfile, error: profileError } = await supabase
            .from('user_profiles')
            .select('first_name, last_name, email, profile_image_url')
            .eq('id', session.user.id)
            .maybeSingle();
          
          if (profileError) {
            console.error('Error fetching user profile:', profileError);
            
            if (isMounted) {
              setUserData({
                fullName: session.user.user_metadata?.name || 'User',
                email: session.user.email || '',
                avatarUrl: session.user.user_metadata?.avatar_url || ''
              });
            }
          } else if (userProfile && isMounted) {
            setUserData({
              fullName: `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() || 'User',
              email: userProfile.email || session.user.email || '',
              avatarUrl: userProfile.profile_image_url || ''
            });
          }
          
          // Fetch notifications count
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
        } catch (profileErr) {
          console.error("Error in profile fetch:", profileErr);
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
