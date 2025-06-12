
import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import UserFilters, { UserFilters as UserFiltersType } from '@/components/user-management/UserFilters';
import UserTable, { User, UserTag } from '@/components/user-management/UserTable';
import UserFormDialog from '@/components/user-management/UserFormDialog';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileText } from 'lucide-react';
import { toast } from 'sonner';

// Sample data
const SAMPLE_TAGS: UserTag[] = [
  { id: 'verified', name: 'Verified' },
  { id: 'sponsored', name: 'Sponsored' },
  { id: 'top-rated', name: 'Top Rated' },
  { id: 'premium', name: 'Premium' },
  { id: 'trending', name: 'Trending' },
];

const SAMPLE_CATEGORIES = [
  { id: 'fashion', name: 'Fashion' },
  { id: 'beauty', name: 'Beauty' },
  { id: 'tech', name: 'Technology' },
  { id: 'food', name: 'Food & Cooking' },
  { id: 'travel', name: 'Travel' },
  { id: 'fitness', name: 'Fitness' },
  { id: 'gaming', name: 'Gaming' },
  { id: 'lifestyle', name: 'Lifestyle' },
];

const SAMPLE_PLATFORMS = [
  { id: 'instagram', name: 'Instagram' },
  { id: 'youtube', name: 'YouTube' },
  { id: 'tiktok', name: 'TikTok' },
  { id: 'twitter', name: 'Twitter' },
  { id: 'facebook', name: 'Facebook' },
  { id: 'twitch', name: 'Twitch' },
];

const SAMPLE_USERS: User[] = [
  {
    id: '1',
    name: 'Emma Johnson',
    username: 'emmaj',
    email: 'emma@influencer.com',
    joinedDate: '2023-02-10',
    status: 'active',
    profileImage: '',
    tags: [SAMPLE_TAGS[0], SAMPLE_TAGS[2]],
  },
  {
    id: '2',
    name: 'Jack Wilson',
    username: 'jackw',
    email: 'jack@influencer.com',
    joinedDate: '2023-04-15',
    status: 'active',
    profileImage: '',
    tags: [SAMPLE_TAGS[1], SAMPLE_TAGS[4]],
  },
  {
    id: '3',
    name: 'Sophia Chen',
    username: 'sophiac',
    email: 'sophia@influencer.com',
    joinedDate: '2023-06-22',
    status: 'inactive',
    profileImage: '',
    tags: [SAMPLE_TAGS[3]],
  },
  {
    id: '4',
    name: 'Logan Martinez',
    username: 'loganm',
    email: 'logan@influencer.com',
    joinedDate: '2023-08-30',
    status: 'blocked',
    profileImage: '',
    tags: [],
  },
  {
    id: '5',
    name: 'Olivia Taylor',
    username: 'oliviat',
    email: 'olivia@influencer.com',
    joinedDate: '2023-11-12',
    status: 'active',
    profileImage: '',
    tags: [SAMPLE_TAGS[0], SAMPLE_TAGS[1], SAMPLE_TAGS[4]],
  },
];

const InfluencersManagementPage = () => {
  const [users, setUsers] = useState<User[]>(SAMPLE_USERS);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(SAMPLE_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFilters, setCurrentFilters] = useState<UserFiltersType>({
    dateRange: undefined,
    status: 'all',
    tags: [],
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(query, currentFilters);
  };

  const handleFilterChange = (filters: UserFiltersType) => {
    setCurrentFilters(filters);
    applyFilters(searchQuery, filters);
  };

  const applyFilters = (query: string, filters: UserFiltersType) => {
    let result = [...users];
    
    // Apply search query
    if (query) {
      const lowerQuery = query.toLowerCase();
      result = result.filter(
        user => 
          user.name.toLowerCase().includes(lowerQuery) ||
          user.username.toLowerCase().includes(lowerQuery) ||
          user.email.toLowerCase().includes(lowerQuery)
      );
    }
    
    // Apply status filter
    if (filters.status !== 'all') {
      result = result.filter(user => user.status === filters.status);
    }
    
    // Apply tag filters
    if (filters.tags.length > 0) {
      result = result.filter(user => 
        user.tags.some(tag => filters.tags.includes(tag.id))
      );
    }
    
    // Apply date range filter
    if (filters.dateRange?.from) {
      const fromDate = new Date(filters.dateRange.from);
      result = result.filter(user => new Date(user.joinedDate) >= fromDate);
    }
    
    if (filters.dateRange?.to) {
      const toDate = new Date(filters.dateRange.to);
      toDate.setHours(23, 59, 59, 999); // End of day
      result = result.filter(user => new Date(user.joinedDate) <= toDate);
    }
    
    setFilteredUsers(result);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    applyFilters(searchQuery, currentFilters);
    logUserAction('delete', userId);
  };

  const handleBlockUser = (userId: string, duration: string, reason?: string) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, status: 'blocked' as const } : user
    );
    setUsers(updatedUsers);
    applyFilters(searchQuery, currentFilters);
    logUserAction('block', userId, { duration, reason });
  };

  const handleTagsChange = (userId: string, tags: UserTag[]) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, tags } : user
    );
    setUsers(updatedUsers);
    applyFilters(searchQuery, currentFilters);
    logUserAction('update_tags', userId);
  };

  const handleFormSubmit = (data: any) => {
    if (editingUser) {
      // Update existing user
      const updatedUsers = users.map(user => 
        user.id === editingUser.id 
          ? { 
              ...user, 
              name: data.fullName,
              username: data.username,
              email: data.email,
              status: data.accountStatus as 'active' | 'inactive' | 'blocked',
              tags: SAMPLE_TAGS.filter(tag => data.tags.includes(tag.id)),
            } 
          : user
      );
      setUsers(updatedUsers);
      applyFilters(searchQuery, currentFilters);
      logUserAction('edit', editingUser.id);
      toast.success(`Influencer ${data.fullName} updated successfully`);
    } else {
      // Create new user
      const newUser: User = {
        id: (users.length + 1).toString(),
        name: data.fullName,
        username: data.username,
        email: data.email,
        joinedDate: new Date().toISOString().split('T')[0],
        status: data.accountStatus as 'active' | 'inactive' | 'blocked',
        tags: SAMPLE_TAGS.filter(tag => data.tags.includes(tag.id)),
      };
      
      setUsers([...users, newUser]);
      applyFilters(searchQuery, currentFilters);
      logUserAction('add', newUser.id);
      toast.success(`Influencer ${data.fullName} created successfully`);
    }
    
    setEditingUser(null);
    setIsFormOpen(false);
  };

  const handleExport = () => {
    // Create CSV content
    const headers = ['Name', 'Username', 'Email', 'Status', 'Joined Date', 'Tags'];
    const csvContent = [
      headers.join(','),
      ...filteredUsers.map(user => [
        `"${user.name}"`,
        `"${user.username}"`,
        `"${user.email}"`,
        user.status,
        user.joinedDate,
        `"${user.tags.map(tag => tag.name).join(', ')}"`
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `influencers-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    toast.success('Influencers data exported successfully');
  };

  const logUserAction = (action: string, userId: string, additionalData?: any) => {
    // In a real implementation, this would log to the database
    console.log(`Admin action: ${action} on influencer ${userId}`, {
      timestamp: new Date().toISOString(),
      adminName: 'Current Admin', // This would be the actual admin name
      additionalData
    });
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Influencer Management</h1>
            <p className="text-muted-foreground">
              Manage and monitor influencers on the platform
            </p>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Influencer
          </Button>
        </div>

        <UserFilters 
          onSearch={handleSearch} 
          onFilterChange={handleFilterChange}
          availableTags={SAMPLE_TAGS}
          onExport={handleExport}
        />

        <UserTable 
          users={filteredUsers}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          onBlock={handleBlockUser}
          onTagsChange={handleTagsChange}
          availableTags={SAMPLE_TAGS}
        />

        <UserFormDialog 
          open={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingUser(null);
          }}
          onSubmit={handleFormSubmit}
          userType="influencer"
          availableTags={SAMPLE_TAGS}
          categories={SAMPLE_CATEGORIES}
          platforms={SAMPLE_PLATFORMS}
          editing={!!editingUser}
          initialData={editingUser ? {
            fullName: editingUser.name,
            username: editingUser.username,
            email: editingUser.email,
            accountStatus: editingUser.status,
            tags: editingUser.tags.map(tag => tag.id),
          } : undefined}
        />
      </div>
    </Layout>
  );
};

export default InfluencersManagementPage;
