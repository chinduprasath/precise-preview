
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { Check, X, RefreshCw, UserPlus } from 'lucide-react';

export interface OnboardUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  user_type: 'influencer' | 'business' | 'admin';
  company: string | null;
  category: string | null;
  social_followers: Record<string, number> | null;
  status: string;
  created_at: string;
}

interface OnboardUsersListProps {
  users: OnboardUser[];
  onRefresh: () => void;
  isLoading: boolean;
}

const OnboardUsersList: React.FC<OnboardUsersListProps> = ({ 
  users, 
  onRefresh,
  isLoading
}) => {
  const { toast } = useToast();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const formatSocialFollowers = (socialFollowers: Record<string, number> | null) => {
    if (!socialFollowers) return 'None';
    
    return Object.entries(socialFollowers)
      .filter(([_, count]) => count > 0)
      .map(([platform, count]) => `${platform}: ${count.toLocaleString()}`)
      .join(', ');
  };

  const handleStatusChange = async (userId: string, newStatus: 'approved' | 'rejected') => {
    setProcessingId(userId);
    
    try {
      const { error } = await supabase
        .from('onboarding_users')
        .update({ status: newStatus })
        .eq('id', userId);
      
      if (error) throw error;
      
      if (newStatus === 'approved') {
        // Get the user details
        const { data: userData, error: userError } = await supabase
          .from('onboarding_users')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (userError) throw userError;
        
        // Create auth user - this would typically be done through a Supabase function
        // For now, we'll just update the display
        toast({
          title: "User Approved",
          description: "User account would be created in a real implementation.",
        });
      }
      
      toast({
        title: `User ${newStatus === 'approved' ? 'Approved' : 'Rejected'}`,
        description: `The user has been ${newStatus}.`,
      });
      
      onRefresh();
    } catch (error: any) {
      console.error('Error updating user status:', error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${newStatus} user.`,
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Onboarding Users</CardTitle>
          <CardDescription>
            Review and approve new user registrations
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <UserPlus className="h-8 w-8" />
                      <p>No users in onboarding queue</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      {user.first_name} {user.last_name}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {user.user_type.charAt(0).toUpperCase() + user.user_type.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.user_type === 'business' && user.company && (
                        <span className="text-sm">Company: {user.company}</span>
                      )}
                      {user.user_type === 'influencer' && (
                        <div className="text-sm">
                          {user.category && <span>Category: {user.category}</span>}
                          {user.social_followers && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {formatSocialFollowers(user.social_followers)}
                            </div>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeVariant(user.status)}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {user.status === 'pending' && (
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 border-green-500 text-green-500 hover:bg-green-50"
                            onClick={() => handleStatusChange(user.id, 'approved')}
                            disabled={isLoading || processingId === user.id}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 border-red-500 text-red-500 hover:bg-red-50"
                            onClick={() => handleStatusChange(user.id, 'rejected')}
                            disabled={isLoading || processingId === user.id}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                      {user.status !== 'pending' && (
                        <span className="text-sm text-muted-foreground">
                          {user.status === 'approved' ? 'Approved' : 'Rejected'}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default OnboardUsersList;
