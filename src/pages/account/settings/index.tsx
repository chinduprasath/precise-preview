import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Eye, EyeOff, User, Lock, Bell, Globe, Shield, LogOut, Instagram, Facebook, Youtube, Twitter, Link } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
const Settings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<string>('business');
  const [showPassword, setShowPassword] = useState(false);
  const [autoScheduling, setAutoScheduling] = useState(false);
  const [socialMediaEditing, setSocialMediaEditing] = useState<{
    [key: string]: boolean;
  }>({
    instagram: false,
    facebook: false,
    youtube: false,
    twitter: false
  });
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    notifications: {
      email: true,
      push: true,
      sms: false,
      browser: true
    },
    privacy: {
      profileVisibility: 'public',
      messagePermission: 'followers',
      dataSharing: true
    },
    socialMedia: {
      instagram: '',
      facebook: '',
      youtube: '',
      twitter: ''
    }
  });
  useEffect(() => {
    const checkUser = async () => {
      const {
        data
      } = await supabase.auth.getSession();
      if (!data.session) {
        navigate('/signin');
        return;
      }
      setUser(data.session.user);

      // Get userType from localStorage
      const storedUserType = localStorage.getItem('userType');
      if (storedUserType) {
        setUserType(storedUserType);
      }

      // Populate form data with user info
      setFormData(prev => ({
        ...prev,
        fullName: data.session.user.email?.split('@')[0] || '',
        email: data.session.user.email || ''
      }));
      setLoading(false);
    };
    checkUser();
  }, [navigate]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSocialMediaChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }));
  };
  const toggleEditMode = (platform: string) => {
    setSocialMediaEditing(prev => ({
      ...prev,
      [platform]: !prev[platform]
    }));
  };
  const handleSaveSocialMedia = (platform: string) => {
    // Here you would save the social media URL to a database
    toast.success(`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL updated successfully`);
    toggleEditMode(platform);
  };
  const handleConnectSocialMedia = (platform: string) => {
    // In a real app, this would initiate the OAuth flow
    toast.success(`Connecting to ${platform}...`);
    // Simulating connection success after a delay
    setTimeout(() => {
      toast.success(`Successfully connected to ${platform}`);
    }, 1500);
  };
  const handleToggleAutoScheduling = (checked: boolean) => {
    setAutoScheduling(checked);
    toast.success(`Auto scheduling ${checked ? 'enabled' : 'disabled'}`);
  };
  const handleNotificationChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [name]: checked
      }
    }));
  };
  const handlePrivacyChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [name]: value
      }
    }));
  };
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile updated successfully');
  };
  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    toast.success('Password updated successfully');
  };
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('userType');
      navigate('/');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
    }
  };
  if (loading) {
    return <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="animate-pulse flex flex-col gap-4">
            <div className="h-12 bg-gray-200 rounded-lg w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded-lg w-full"></div>
          </div>
        </div>
      </div>;
  }
  return <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Account Settings</h1>
            <Button variant="destructive" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>

          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList className="grid grid-cols-4 w-full max-w-md">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="social-media" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Social Media
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your account profile information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Your full name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Your email address" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="userType">Account Type</Label>
                      <Input id="userType" value={userType.charAt(0).toUpperCase() + userType.slice(1)} readOnly disabled />
                    </div>
                    <Button type="submit">Update Profile</Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                
                
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input id="currentPassword" name="currentPassword" type={showPassword ? "text" : "password"} value={formData.currentPassword} onChange={handleInputChange} placeholder="Enter your current password" />
                        <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" name="newPassword" type="password" value={formData.newPassword} onChange={handleInputChange} placeholder="Enter your new password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} placeholder="Confirm your new password" />
                    </div>
                    <Button type="submit">Update Password</Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your account security settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-500">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch id="twoFactor" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sessionTimeout">Session Timeout</Label>
                      <p className="text-sm text-gray-500">
                        Automatically log out after inactivity
                      </p>
                    </div>
                    <Switch id="sessionTimeout" defaultChecked />
                  </div>

                  <div className="pt-2">
                    <Button variant="outline" className="w-full">
                      <Shield className="mr-2 h-4 w-4" />
                      View Account Activity
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Choose how you want to be notified
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailNotifications">Email Notifications</Label>
                      <p className="text-sm text-gray-500">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch id="emailNotifications" checked={formData.notifications.email} onCheckedChange={checked => handleNotificationChange('email', checked)} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="pushNotifications">Push Notifications</Label>
                      <p className="text-sm text-gray-500">
                        Receive push notifications on your devices
                      </p>
                    </div>
                    <Switch id="pushNotifications" checked={formData.notifications.push} onCheckedChange={checked => handleNotificationChange('push', checked)} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="smsNotifications">SMS Notifications</Label>
                      <p className="text-sm text-gray-500">
                        Receive text messages for important updates
                      </p>
                    </div>
                    <Switch id="smsNotifications" checked={formData.notifications.sms} onCheckedChange={checked => handleNotificationChange('sms', checked)} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="browserNotifications">Browser Notifications</Label>
                      <p className="text-sm text-gray-500">
                        Show notifications in your browser
                      </p>
                    </div>
                    <Switch id="browserNotifications" checked={formData.notifications.browser} onCheckedChange={checked => handleNotificationChange('browser', checked)} />
                  </div>
                  
                  <Button className="mt-4">Save Notification Settings</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="social-media" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Social Media Profiles</CardTitle>
                      <CardDescription>
                        Connect your social media accounts
                      </CardDescription>
                    </div>
                    {userType === 'influencer' && <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Auto Scheduling</span>
                        <Switch checked={autoScheduling} onCheckedChange={handleToggleAutoScheduling} aria-label="Toggle auto scheduling" />
                      </div>}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {/* Instagram */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 bg-pink-100 rounded-full">
                        <Instagram className="h-6 w-6 text-pink-500" />
                      </div>
                      <div className="flex-1 flex items-center gap-2">
                        <Input value={formData.socialMedia.instagram} onChange={e => handleSocialMediaChange('instagram', e.target.value)} placeholder="Instagram Profile URL" disabled={!socialMediaEditing.instagram} className="flex-1" />
                        {socialMediaEditing.instagram ? <Button onClick={() => handleSaveSocialMedia('instagram')}>Save</Button> : <Button variant="outline" onClick={() => toggleEditMode('instagram')}>Edit</Button>}
                        {userType === 'influencer' && <Button variant="secondary" onClick={() => handleConnectSocialMedia('instagram')} className="flex items-center gap-1">
                            <Link className="h-4 w-4" />
                            Connect
                          </Button>}
                      </div>
                    </div>
                    
                    {/* Facebook */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                        <Facebook className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1 flex items-center gap-2">
                        <Input value={formData.socialMedia.facebook} onChange={e => handleSocialMediaChange('facebook', e.target.value)} placeholder="Facebook Profile URL" disabled={!socialMediaEditing.facebook} className="flex-1" />
                        {socialMediaEditing.facebook ? <Button onClick={() => handleSaveSocialMedia('facebook')}>Save</Button> : <Button variant="outline" onClick={() => toggleEditMode('facebook')}>Edit</Button>}
                        {userType === 'influencer' && <Button variant="secondary" onClick={() => handleConnectSocialMedia('facebook')} className="flex items-center gap-1">
                            <Link className="h-4 w-4" />
                            Connect
                          </Button>}
                      </div>
                    </div>
                    
                    {/* YouTube */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full">
                        <Youtube className="h-6 w-6 text-red-600" />
                      </div>
                      <div className="flex-1 flex items-center gap-2">
                        <Input value={formData.socialMedia.youtube} onChange={e => handleSocialMediaChange('youtube', e.target.value)} placeholder="YouTube Channel URL" disabled={!socialMediaEditing.youtube} className="flex-1" />
                        {socialMediaEditing.youtube ? <Button onClick={() => handleSaveSocialMedia('youtube')}>Save</Button> : <Button variant="outline" onClick={() => toggleEditMode('youtube')}>Edit</Button>}
                        {userType === 'influencer' && <Button variant="secondary" onClick={() => handleConnectSocialMedia('youtube')} className="flex items-center gap-1">
                            <Link className="h-4 w-4" />
                            Connect
                          </Button>}
                      </div>
                    </div>
                    
                    {/* Twitter */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                        <Twitter className="h-6 w-6 text-blue-400" />
                      </div>
                      <div className="flex-1 flex items-center gap-2">
                        <Input value={formData.socialMedia.twitter} onChange={e => handleSocialMediaChange('twitter', e.target.value)} placeholder="Twitter Profile URL" disabled={!socialMediaEditing.twitter} className="flex-1" />
                        {socialMediaEditing.twitter ? <Button onClick={() => handleSaveSocialMedia('twitter')}>Save</Button> : <Button variant="outline" onClick={() => toggleEditMode('twitter')}>Edit</Button>}
                        {userType === 'influencer' && <Button variant="secondary" onClick={() => handleConnectSocialMedia('twitter')} className="flex items-center gap-1">
                            <Link className="h-4 w-4" />
                            Connect
                          </Button>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>;
};
export default Settings;