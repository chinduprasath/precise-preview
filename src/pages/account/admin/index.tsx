import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { CheckCircle, ChevronDown, ChevronRight, Clock, Edit2, Key, LogOut, Save, UserCog, RotateCcw, Trash2, UserCircle, FileEdit, Bell, Trash } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { toast as sonnerToast } from 'sonner';
import { useTheme } from '@/components/theme-provider';

type AdminProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar_url?: string;
  phone?: string;
  designation?: string;
  social_profiles?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  last_login?: string;
  preferences?: {
    theme?: string;
    notifications?: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
};

type ActivityLog = {
  id: string;
  activity: string;
  timestamp: string;
  details?: string;
  type: 'update' | 'create' | 'delete' | 'login' | 'other';
};

const AdminProfilePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [editedProfile, setEditedProfile] = useState<AdminProfile | null>(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<ActivityLog[]>([]);
  const [selectedLogType, setSelectedLogType] = useState<string>('all');

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const session = sessionData.session;
        
        if (!session) {
          navigate('/signin');
          return;
        }

        const userType = localStorage.getItem('userType');
        if (userType !== 'admin') {
          navigate(`/account/${userType || 'business'}`);
          return;
        }

        // In a real app, you would fetch the admin profile from the database
        // For demonstration purposes, using mock data
        const mockAdminProfile: AdminProfile = {
          id: session.user.id,
          name: session.user.user_metadata?.full_name || 'Admin User',
          email: session.user.email || 'admin@example.com',
          role: 'Super Admin',
          avatar_url: session.user.user_metadata?.avatar_url,
          phone: '+1 (555) 123-4567',
          designation: 'System Administrator',
          social_profiles: {
            linkedin: 'https://linkedin.com/in/admin',
            twitter: 'https://twitter.com/admin',
            github: 'https://github.com/admin'
          },
          last_login: new Date().toISOString(),
          preferences: {
            theme: localStorage.getItem('theme') || 'system',
            notifications: {
              email: true,
              sms: false,
              push: true
            }
          }
        };

        setAdminProfile(mockAdminProfile);
        setEditedProfile(mockAdminProfile);

        // Mock activity logs
        const mockActivityLogs: ActivityLog[] = [
          {
            id: '1',
            activity: 'Updated system settings',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            details: 'Changed email notification settings',
            type: 'update'
          },
          {
            id: '2',
            activity: 'Created new business account',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            details: 'Business: Acme Corp',
            type: 'create'
          },
          {
            id: '3',
            activity: 'Deleted inactive user',
            timestamp: new Date(Date.now() - 172800000).toISOString(),
            details: 'User: john.doe@example.com',
            type: 'delete'
          },
          {
            id: '4',
            activity: 'System login',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            type: 'login'
          },
          {
            id: '5',
            activity: 'Approved influencer application',
            timestamp: new Date(Date.now() - 259200000).toISOString(),
            details: 'Influencer: @travelguru',
            type: 'update'
          }
        ];

        setActivityLogs(mockActivityLogs);
        setFilteredLogs(mockActivityLogs);
      } catch (error: any) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred while loading profile",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [navigate, toast]);

  useEffect(() => {
    if (activityLogs.length > 0) {
      if (selectedLogType === 'all') {
        setFilteredLogs(activityLogs);
      } else {
        setFilteredLogs(activityLogs.filter(log => log.type === selectedLogType));
      }
    }
  }, [selectedLogType, activityLogs]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!editedProfile) return;
    
    if (name.includes('.')) {
      const [parentKey, childKey] = name.split('.');
      setEditedProfile({
        ...editedProfile,
        [parentKey]: {
          ...(editedProfile[parentKey as keyof AdminProfile] as Record<string, any>),
          [childKey]: value
        }
      });
    } else {
      setEditedProfile({
        ...editedProfile,
        [name]: value
      });
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };

  const handleSocialProfileChange = (platform: string, value: string) => {
    if (!editedProfile) return;
    
    setEditedProfile({
      ...editedProfile,
      social_profiles: {
        ...editedProfile.social_profiles,
        [platform]: value
      }
    });
  };

  const handleNotificationChange = (type: string, checked: boolean) => {
    if (!editedProfile || !editedProfile.preferences) return;
    
    setEditedProfile({
      ...editedProfile,
      preferences: {
        ...editedProfile.preferences,
        notifications: {
          ...editedProfile.preferences.notifications,
          [type]: checked
        }
      }
    });
  };

  const handleThemeChange = (theme: string) => {
    if (!editedProfile || !editedProfile.preferences) return;
    
    setEditedProfile({
      ...editedProfile,
      preferences: {
        ...editedProfile.preferences,
        theme
      }
    });
    
    // Fix: Convert string to Theme type
    setTheme(theme as "light" | "dark" | "system");
    localStorage.setItem('theme', theme);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      // In a real app, you would update the profile in the database
      setTimeout(() => {
        setAdminProfile(editedProfile);
        setSaving(false);
        sonnerToast.success('Profile updated successfully');
      }, 1000);
    } catch (error) {
      console.error('Error saving profile:', error);
      sonnerToast.error('Failed to update profile');
      setSaving(false);
    }
  };

  const handleResetChanges = () => {
    setEditedProfile(adminProfile);
    sonnerToast.info('Changes discarded');
  };

  const handleSavePassword = async () => {
    setSaving(true);
    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error('New passwords do not match');
      }
      
      if (passwordData.newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      // In a real app, you would update the password in Supabase Auth
      setTimeout(() => {
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setSaving(false);
        sonnerToast.success('Password changed successfully');
      }, 1000);
    } catch (error: any) {
      console.error('Error changing password:', error);
      sonnerToast.error(error.message || 'Failed to change password');
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('userType');
      navigate('/signin');
      sonnerToast.success('Logged out successfully');
    } catch (error) {
      console.error('Error during logout:', error);
      sonnerToast.error('Failed to log out');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!editedProfile) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-2xl font-bold mb-2">Profile Not Found</h1>
          <p className="text-muted-foreground mb-4">Unable to load admin profile information.</p>
          <Button onClick={() => navigate('/')}>Return to Dashboard</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-6xl mx-auto py-6 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Profile</h1>
            <p className="text-muted-foreground">View and manage your admin account settings</p>
          </div>
          <div className="flex space-x-2 mt-4 md:mt-0">
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>

        {/* Profile Overview Card */}
        <Card className="shadow-md">
          <CardHeader className="pb-4">
            <CardTitle>Profile Overview</CardTitle>
            <CardDescription>Your admin account information</CardDescription>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex flex-col items-center gap-3">
                <Avatar className="h-24 w-24 border-2 border-border">
                  {editedProfile.avatar_url ? (
                    <AvatarImage src={editedProfile.avatar_url} alt={editedProfile.name} />
                  ) : (
                    <AvatarFallback className="text-xl bg-primary text-white">
                      {editedProfile.name.charAt(0).toUpperCase() + (editedProfile.name.split(' ')[1]?.charAt(0).toUpperCase() || '')}
                    </AvatarFallback>
                  )}
                </Avatar>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Edit2 className="h-3 w-3" />
                  Change Photo
                </Button>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                  <p className="font-medium">{editedProfile.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="font-medium">{editedProfile.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Role</p>
                  <div className="flex items-center gap-2">
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-medium">
                      {editedProfile.role}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Last Login</p>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <p className="text-sm">
                      {editedProfile.last_login
                        ? new Date(editedProfile.last_login).toLocaleString()
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="profile">Profile Details</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
          </TabsList>
          
          {/* Profile Details Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <UserCircle className="h-5 w-5" />
                  Profile Details
                </CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={editedProfile.name} 
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={editedProfile.email} 
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      value={editedProfile.phone || ''} 
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="designation">Designation / Role Title</Label>
                    <Input 
                      id="designation" 
                      name="designation" 
                      value={editedProfile.designation || ''} 
                      onChange={handleInputChange}
                      placeholder="e.g. System Administrator"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Social Profiles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn Profile</Label>
                      <Input 
                        id="linkedin" 
                        value={editedProfile.social_profiles?.linkedin || ''} 
                        onChange={(e) => handleSocialProfileChange('linkedin', e.target.value)}
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="twitter">Twitter Profile</Label>
                      <Input 
                        id="twitter" 
                        value={editedProfile.social_profiles?.twitter || ''} 
                        onChange={(e) => handleSocialProfileChange('twitter', e.target.value)}
                        placeholder="https://twitter.com/username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="github">GitHub Profile</Label>
                      <Input 
                        id="github" 
                        value={editedProfile.social_profiles?.github || ''} 
                        onChange={(e) => handleSocialProfileChange('github', e.target.value)}
                        placeholder="https://github.com/username"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleResetChanges} className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Reset Changes
                </Button>
                <Button onClick={handleSaveProfile} disabled={saving} className="flex items-center gap-2">
                  {saving ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-b-transparent" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Change Password
                </CardTitle>
                <CardDescription>Update your account password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input 
                      id="currentPassword" 
                      name="currentPassword" 
                      type="password" 
                      value={passwordData.currentPassword} 
                      onChange={handlePasswordChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input 
                      id="newPassword" 
                      name="newPassword" 
                      type="password" 
                      value={passwordData.newPassword} 
                      onChange={handlePasswordChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input 
                      id="confirmPassword" 
                      name="confirmPassword" 
                      type="password" 
                      value={passwordData.confirmPassword} 
                      onChange={handlePasswordChange} 
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button 
                  onClick={handleSavePassword} 
                  disabled={saving || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                  className="flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-b-transparent" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Update Password
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <UserCog className="h-5 w-5" />
                  Two-Factor Authentication
                </CardTitle>
                <CardDescription>Add an extra layer of security to your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">Two-Factor Authentication (2FA)</p>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account by requiring a verification code in addition to your password.
                    </p>
                  </div>
                  <Switch id="2fa" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">Theme Preferences</CardTitle>
                <CardDescription>Choose your preferred theme mode</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <Button
                    variant={editedProfile.preferences?.theme === 'light' ? 'default' : 'outline'}
                    className="flex flex-col items-center justify-center h-24 w-full"
                    onClick={() => handleThemeChange('light')}
                  >
                    <div className="h-12 w-12 rounded-full bg-gray-100 border border-gray-200 mb-2"></div>
                    <span>Light</span>
                  </Button>
                  
                  <Button
                    variant={editedProfile.preferences?.theme === 'dark' ? 'default' : 'outline'}
                    className="flex flex-col items-center justify-center h-24 w-full"
                    onClick={() => handleThemeChange('dark')}
                  >
                    <div className="h-12 w-12 rounded-full bg-gray-800 border border-gray-700 mb-2"></div>
                    <span>Dark</span>
                  </Button>
                  
                  <Button
                    variant={editedProfile.preferences?.theme === 'system' ? 'default' : 'outline'}
                    className="flex flex-col items-center justify-center h-24 w-full"
                    onClick={() => handleThemeChange('system')}
                  >
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-gray-100 to-gray-800 mb-2"></div>
                    <span>System</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch 
                      id="emailNotifications" 
                      checked={editedProfile.preferences?.notifications?.email || false}
                      onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">SMS Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive notifications via text message</p>
                    </div>
                    <Switch 
                      id="smsNotifications" 
                      checked={editedProfile.preferences?.notifications?.sms || false}
                      onCheckedChange={(checked) => handleNotificationChange('sms', checked)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive push notifications in-app</p>
                    </div>
                    <Switch 
                      id="pushNotifications" 
                      checked={editedProfile.preferences?.notifications?.push || false}
                      onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button onClick={handleSaveProfile} disabled={saving}>
                  Save Preferences
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Activity Log Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <FileEdit className="h-5 w-5" />
                  Activity Log
                </CardTitle>
                <CardDescription>Review your recent account activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedLogType === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedLogType('all')}
                    >
                      All
                    </Button>
                    <Button
                      variant={selectedLogType === 'update' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedLogType('update')}
                    >
                      Updates
                    </Button>
                    <Button
                      variant={selectedLogType === 'create' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedLogType('create')}
                    >
                      Creations
                    </Button>
                    <Button
                      variant={selectedLogType === 'delete' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedLogType('delete')}
                    >
                      Deletions
                    </Button>
                    <Button
                      variant={selectedLogType === 'login' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedLogType('login')}
                    >
                      Logins
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {filteredLogs.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No activity logs found</p>
                      </div>
                    ) : (
                      filteredLogs.map((log) => (
                        <div key={log.id} className="flex items-start gap-4 p-4 rounded-md bg-muted/40">
                          <div className={`p-2 rounded-full ${
                            log.type === 'create' ? 'bg-green-100 text-green-600' :
                            log.type === 'update' ? 'bg-blue-100 text-blue-600' :
                            log.type === 'delete' ? 'bg-red-100 text-red-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {log.type === 'create' ? <CheckCircle className="h-5 w-5" /> :
                             log.type === 'update' ? <Edit2 className="h-5 w-5" /> :
                             log.type === 'delete' ? <Trash2 className="h-5 w-5" /> :
                             log.type === 'login' ? <UserCircle className="h-5 w-5" /> :
                             <FileEdit className="h-5 w-5" />
                            }
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:justify-between mb-1">
                              <h4 className="font-medium">{log.activity}</h4>
                              <span className="text-xs text-muted-foreground">
                                {new Date(log.timestamp).toLocaleString()}
                              </span>
                            </div>
                            {log.details && (
                              <p className="text-sm text-muted-foreground">{log.details}</p>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <ChevronDown className="h-4 w-4" />
                  Load More
                </Button>
                <Button variant="destructive" size="sm" className="flex items-center gap-1">
                  <Trash className="h-4 w-4" />
                  Clear History
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminProfilePage;
