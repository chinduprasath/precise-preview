import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Filter, Search, UserCheck, UserX, User, Check } from 'lucide-react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  ToggleGroup, 
  ToggleGroupItem 
} from '@/components/ui/toggle-group';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Types for onboarding data
type OnboardingStatus = 'pending' | 'approved' | 'rejected' | 'completed';
type UserType = 'influencer' | 'business' | 'admin';

interface OnboardingUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: UserType;
  status: OnboardingStatus;
  createdAt: string;
  company?: string;
  category?: string;
}

const OnboardPage = () => {
  const [users, setUsers] = useState<OnboardingUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<OnboardingUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<OnboardingStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<UserType | 'all'>('all');
  const [newUserOpen, setNewUserOpen] = useState<boolean>(false);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    userType: 'influencer' as UserType,
    company: '',
    category: '',
  });
  
  const navigate = useNavigate();

  // Check if user is admin
  useEffect(() => {
    const checkAdminAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/signin');
        return;
      }
      
      // Check if user has admin type in metadata
      const userType = session.user?.user_metadata?.user_type;
      if (userType !== 'admin') {
        navigate('/dashboard/business');
        toast.error('You do not have access to this page');
      }
    };
    
    checkAdminAccess();
  }, [navigate]);

  // Fetch users data
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch user profiles
        const { data: profiles, error } = await supabase
          .from('user_profiles')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        // Transform profiles to onboarding users format
        const transformedUsers: OnboardingUser[] = profiles.map(profile => {
          // Safely access settings properties with proper type checking
          const settings = profile.settings as Record<string, any> || {};
          
          return {
            id: profile.id,
            firstName: profile.first_name,
            lastName: profile.last_name,
            email: profile.email,
            userType: profile.role as UserType,
            status: (settings.onboarding_status as OnboardingStatus) || 'pending',
            createdAt: profile.created_at,
            company: profile.role === 'business' ? 
              (settings.company as string || '') : undefined,
            category: profile.role === 'influencer' ? 
              (settings.category as string || '') : undefined
          };
        });
        
        setUsers(transformedUsers);
        setFilteredUsers(transformedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = [...users];
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(user => 
        user.firstName.toLowerCase().includes(query) || 
        user.lastName.toLowerCase().includes(query) || 
        user.email.toLowerCase().includes(query) ||
        (user.company && user.company.toLowerCase().includes(query))
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(user => user.status === statusFilter);
    }
    
    // Apply type filter
    if (typeFilter !== 'all') {
      result = result.filter(user => user.userType === typeFilter);
    }
    
    setFilteredUsers(result);
  }, [users, searchQuery, statusFilter, typeFilter]);

  // Handle adding new user
  const handleAddUser = async () => {
    try {
      // Validation
      if (!newUser.email || !newUser.firstName || !newUser.lastName) {
        toast.error('Please fill in all required fields');
        return;
      }
      
      // Create the user
      const { data, error } = await supabase.auth.signUp({
        email: newUser.email,
        password: Math.random().toString(36).slice(-10), // Generate random password
        options: {
          data: {
            first_name: newUser.firstName,
            last_name: newUser.lastName,
            user_type: newUser.userType,
            company: newUser.company,
            category: newUser.category
          }
        }
      });
      
      if (error) throw error;
      
      toast.success('User added successfully');
      setNewUserOpen(false);
      
      // Reset form
      setNewUser({
        firstName: '',
        lastName: '',
        email: '',
        userType: 'influencer',
        company: '',
        category: '',
      });
      
      // Refresh user list
      // In a real app, we'd add the new user to the list instead of reloading
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error: any) {
      console.error('Error adding user:', error);
      toast.error(error.message || 'Failed to add user');
    }
  };

  // Handle status update
  const updateUserStatus = async (userId: string, status: OnboardingStatus) => {
    try {
      // First, get the existing settings object to preserve other settings
      const { data: existingProfile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('settings')
        .eq('id', userId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Merge the existing settings with the new onboarding status
      const updatedSettings = {
        ...(existingProfile.settings as Record<string, any> || {}),
        onboarding_status: status
      };
      
      // Update the settings object with the merged data
      const { error } = await supabase
        .from('user_profiles')
        .update({
          settings: updatedSettings
        })
        .eq('id', userId);
        
      if (error) throw error;
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? {...user, status} : user
        )
      );
      
      toast.success(`User status updated to ${status}`);
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  // Render status badge with appropriate color
  const renderStatusBadge = (status: OnboardingStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Completed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Onboarding Management</h1>
          
          <Dialog open={newUserOpen} onOpenChange={setNewUserOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                <span>Add User</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user account in the system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
                    <Input
                      id="firstName"
                      value={newUser.firstName}
                      onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
                    <Input
                      id="lastName"
                      value={newUser.lastName}
                      onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    placeholder="john.doe@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">User Type</label>
                  <ToggleGroup 
                    type="single" 
                    value={newUser.userType} 
                    onValueChange={(value) => value && setNewUser({...newUser, userType: value as UserType})}
                    className="justify-start"
                  >
                    <ToggleGroupItem value="influencer" aria-label="Influencer">
                      Influencer
                    </ToggleGroupItem>
                    <ToggleGroupItem value="business" aria-label="Business">
                      Business
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
                
                {newUser.userType === 'business' && (
                  <div className="space-y-2">
                    <label htmlFor="company" className="text-sm font-medium">Company Name</label>
                    <Input
                      id="company"
                      value={newUser.company}
                      onChange={(e) => setNewUser({...newUser, company: e.target.value})}
                      placeholder="Acme Inc."
                    />
                  </div>
                )}
                
                {newUser.userType === 'influencer' && (
                  <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium">Category</label>
                    <Input
                      id="category"
                      value={newUser.category}
                      onChange={(e) => setNewUser({...newUser, category: e.target.value})}
                      placeholder="Lifestyle, Fashion, etc."
                    />
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setNewUserOpen(false)}>Cancel</Button>
                <Button onClick={handleAddUser}>Add User</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Users</CardTitle>
            <CardDescription>Manage user onboarding status and details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-6 flex-col md:flex-row gap-4">
              <div className="relative w-full md:w-1/3">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search users..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Filter size={16} />
                      <span>Filter</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Filter Users</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="text-xs font-normal text-gray-500">User Type</DropdownMenuLabel>
                      <DropdownMenuItem 
                        className={typeFilter === 'all' ? 'bg-accent text-accent-foreground' : ''}
                        onClick={() => setTypeFilter('all')}
                      >
                        <User className="mr-2 h-4 w-4" />
                        <span>All Users</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className={typeFilter === 'influencer' ? 'bg-accent text-accent-foreground' : ''}
                        onClick={() => setTypeFilter('influencer')}
                      >
                        <User className="mr-2 h-4 w-4" />
                        <span>Influencers</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className={typeFilter === 'business' ? 'bg-accent text-accent-foreground' : ''}
                        onClick={() => setTypeFilter('business')}
                      >
                        <User className="mr-2 h-4 w-4" />
                        <span>Businesses</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="text-xs font-normal text-gray-500">Status</DropdownMenuLabel>
                      <DropdownMenuItem 
                        className={statusFilter === 'all' ? 'bg-accent text-accent-foreground' : ''}
                        onClick={() => setStatusFilter('all')}
                      >
                        All Statuses
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className={statusFilter === 'pending' ? 'bg-accent text-accent-foreground' : ''}
                        onClick={() => setStatusFilter('pending')}
                      >
                        Pending
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className={statusFilter === 'approved' ? 'bg-accent text-accent-foreground' : ''}
                        onClick={() => setStatusFilter('approved')}
                      >
                        Approved
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className={statusFilter === 'rejected' ? 'bg-accent text-accent-foreground' : ''}
                        onClick={() => setStatusFilter('rejected')}
                      >
                        Rejected
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className={statusFilter === 'completed' ? 'bg-accent text-accent-foreground' : ''}
                        onClick={() => setStatusFilter('completed')}
                      >
                        Completed
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        Loading users...
                      </TableCell>
                    </TableRow>
                  ) : filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="font-medium">{user.firstName} {user.lastName}</div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={user.userType === 'influencer' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'}>
                            {user.userType === 'influencer' ? 'Influencer' : 'Business'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.userType === 'business' && user.company ? (
                            <span className="text-sm text-gray-600">{user.company}</span>
                          ) : user.userType === 'influencer' && user.category ? (
                            <span className="text-sm text-gray-600">{user.category}</span>
                          ) : (
                            <span className="text-sm text-gray-400">No details</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {renderStatusBadge(user.status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => updateUserStatus(user.id, 'approved')}
                              disabled={user.status === 'approved'}
                              title="Approve"
                            >
                              <UserCheck className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => updateUserStatus(user.id, 'rejected')}
                              disabled={user.status === 'rejected'}
                              title="Reject"
                            >
                              <UserX className="h-4 w-4 text-red-600" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => updateUserStatus(user.id, 'completed')}
                              disabled={user.status === 'completed'}
                              title="Mark as Completed"
                            >
                              <Check className="h-4 w-4 text-blue-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default OnboardPage;
