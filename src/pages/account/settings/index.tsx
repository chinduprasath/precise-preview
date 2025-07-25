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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, User, Lock, Bell, Globe, Shield, LogOut, Instagram, Facebook, Youtube, Twitter, Link, X, Info, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
const Settings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<string>('business');
  const [showPassword, setShowPassword] = useState(false);
  const [autoScheduling, setAutoScheduling] = useState(false);
  const [socialMediaModal, setSocialMediaModal] = useState<{
    isOpen: boolean;
    platform: string;
  }>({
    isOpen: false,
    platform: ''
  });
  
  const [modalFormData, setModalFormData] = useState({
    url: '',
    preferredDays: [] as string[],
    fromTime: '',
    toTime: ''
  });
  
  const [socialMediaSettings, setSocialMediaSettings] = useState<{
    [key: string]: {
      url: string;
      preferredDays: string[];
      fromTime: string;
      toTime: string;
    }
  }>({
    instagram: { url: '', preferredDays: [], fromTime: '', toTime: '' },
    facebook: { url: '', preferredDays: [], fromTime: '', toTime: '' },
    youtube: { url: '', preferredDays: [], fromTime: '', toTime: '' },
    twitter: { url: '', preferredDays: [], fromTime: '', toTime: '' }
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
  // Modal functions
  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? '00' : '30';
    const ampm = hour < 12 ? 'AM' : 'PM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minute} ${ampm}`;
  });

  const dayOptions = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const openEditModal = (platform: string) => {
    const settings = socialMediaSettings[platform];
    setModalFormData({
      url: settings.url,
      preferredDays: settings.preferredDays,
      fromTime: settings.fromTime,
      toTime: settings.toTime
    });
    setSocialMediaModal({ isOpen: true, platform });
  };

  const closeModal = () => {
    setSocialMediaModal({ isOpen: false, platform: '' });
    setModalFormData({ url: '', preferredDays: [], fromTime: '', toTime: '' });
  };

  const handleModalSave = () => {
    setSocialMediaSettings(prev => ({
      ...prev,
      [socialMediaModal.platform]: {
        url: modalFormData.url,
        preferredDays: modalFormData.preferredDays,
        fromTime: modalFormData.fromTime,
        toTime: modalFormData.toTime
      }
    }));
    toast.success(`${socialMediaModal.platform.charAt(0).toUpperCase() + socialMediaModal.platform.slice(1)} settings updated successfully`);
    closeModal();
  };

  const handleDayToggle = (day: string) => {
    setModalFormData(prev => ({
      ...prev,
      preferredDays: prev.preferredDays.includes(day)
        ? prev.preferredDays.filter(d => d !== day)
        : [...prev.preferredDays, day]
    }));
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
                  <div className="space-y-6">
                    {/* Instagram */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-pink-100 rounded-full">
                          <Instagram className="h-6 w-6 text-pink-500" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">Instagram</h3>
                          <Input 
                            value={socialMediaSettings.instagram.url || 'No URL set yet'} 
                            readOnly 
                            className="mt-1 bg-gray-50" 
                            placeholder="No URL / Timing set yet"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => openEditModal('instagram')}>
                            Edit
                          </Button>
                          {userType === 'influencer' && (
                            <Button variant="secondary" onClick={() => handleConnectSocialMedia('instagram')} className="flex items-center gap-1">
                              <Link className="h-4 w-4" />
                              Connect
                            </Button>
                          )}
                        </div>
                      </div>
                      {(socialMediaSettings.instagram.preferredDays.length > 0 || socialMediaSettings.instagram.fromTime) && (
                        <div className="flex flex-wrap gap-2">
                          {socialMediaSettings.instagram.preferredDays.map(day => (
                            <Badge key={day} variant="secondary">{day.slice(0, 3)}</Badge>
                          ))}
                          {socialMediaSettings.instagram.fromTime && socialMediaSettings.instagram.toTime && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {socialMediaSettings.instagram.fromTime} - {socialMediaSettings.instagram.toTime}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Facebook */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                          <Facebook className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">Facebook</h3>
                          <Input 
                            value={socialMediaSettings.facebook.url || 'No URL set yet'} 
                            readOnly 
                            className="mt-1 bg-gray-50" 
                            placeholder="No URL / Timing set yet"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => openEditModal('facebook')}>
                            Edit
                          </Button>
                          {userType === 'influencer' && (
                            <Button variant="secondary" onClick={() => handleConnectSocialMedia('facebook')} className="flex items-center gap-1">
                              <Link className="h-4 w-4" />
                              Connect
                            </Button>
                          )}
                        </div>
                      </div>
                      {(socialMediaSettings.facebook.preferredDays.length > 0 || socialMediaSettings.facebook.fromTime) && (
                        <div className="flex flex-wrap gap-2">
                          {socialMediaSettings.facebook.preferredDays.map(day => (
                            <Badge key={day} variant="secondary">{day.slice(0, 3)}</Badge>
                          ))}
                          {socialMediaSettings.facebook.fromTime && socialMediaSettings.facebook.toTime && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {socialMediaSettings.facebook.fromTime} - {socialMediaSettings.facebook.toTime}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* YouTube */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full">
                          <Youtube className="h-6 w-6 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">YouTube</h3>
                          <Input 
                            value={socialMediaSettings.youtube.url || 'No URL set yet'} 
                            readOnly 
                            className="mt-1 bg-gray-50" 
                            placeholder="No URL / Timing set yet"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => openEditModal('youtube')}>
                            Edit
                          </Button>
                          {userType === 'influencer' && (
                            <Button variant="secondary" onClick={() => handleConnectSocialMedia('youtube')} className="flex items-center gap-1">
                              <Link className="h-4 w-4" />
                              Connect
                            </Button>
                          )}
                        </div>
                      </div>
                      {(socialMediaSettings.youtube.preferredDays.length > 0 || socialMediaSettings.youtube.fromTime) && (
                        <div className="flex flex-wrap gap-2">
                          {socialMediaSettings.youtube.preferredDays.map(day => (
                            <Badge key={day} variant="secondary">{day.slice(0, 3)}</Badge>
                          ))}
                          {socialMediaSettings.youtube.fromTime && socialMediaSettings.youtube.toTime && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {socialMediaSettings.youtube.fromTime} - {socialMediaSettings.youtube.toTime}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Twitter */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                          <Twitter className="h-6 w-6 text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">Twitter</h3>
                          <Input 
                            value={socialMediaSettings.twitter.url || 'No URL set yet'} 
                            readOnly 
                            className="mt-1 bg-gray-50" 
                            placeholder="No URL / Timing set yet"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => openEditModal('twitter')}>
                            Edit
                          </Button>
                          {userType === 'influencer' && (
                            <Button variant="secondary" onClick={() => handleConnectSocialMedia('twitter')} className="flex items-center gap-1">
                              <Link className="h-4 w-4" />
                              Connect
                            </Button>
                          )}
                        </div>
                      </div>
                      {(socialMediaSettings.twitter.preferredDays.length > 0 || socialMediaSettings.twitter.fromTime) && (
                        <div className="flex flex-wrap gap-2">
                          {socialMediaSettings.twitter.preferredDays.map(day => (
                            <Badge key={day} variant="secondary">{day.slice(0, 3)}</Badge>
                          ))}
                          {socialMediaSettings.twitter.fromTime && socialMediaSettings.twitter.toTime && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {socialMediaSettings.twitter.fromTime} - {socialMediaSettings.twitter.toTime}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Edit Social Media Modal */}
              <Dialog open={socialMediaModal.isOpen} onOpenChange={closeModal}>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      Edit Social Media Settings 
                      <span className="capitalize">({socialMediaModal.platform})</span>
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    {/* Profile URL */}
                    <div className="space-y-2">
                      <Label htmlFor="profileUrl">Profile URL</Label>
                      <Input
                        id="profileUrl"
                        value={modalFormData.url}
                        onChange={(e) => setModalFormData(prev => ({ ...prev, url: e.target.value }))}
                        placeholder={`Enter your ${socialMediaModal.platform} Profile URL`}
                      />
                    </div>
                    
                    {/* Preferred Days */}
                    <div className="space-y-3">
                      <Label>Preferred Days</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {dayOptions.map(day => (
                          <div key={day} className="flex items-center space-x-2">
                            <Checkbox
                              id={day}
                              checked={modalFormData.preferredDays.includes(day)}
                              onCheckedChange={() => handleDayToggle(day)}
                            />
                            <Label htmlFor={day} className="text-sm">{day}</Label>
                          </div>
                        ))}
                      </div>
                      {modalFormData.preferredDays.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {modalFormData.preferredDays.map(day => (
                            <Badge key={day} variant="secondary">{day.slice(0, 3)}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Preferred Time */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Label>Preferred Time</Label>
                        <Info className="h-4 w-4 text-gray-400" />
                        <span className="text-xs text-gray-500">Used for Auto Scheduling (IST)</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="fromTime" className="text-sm">From Time</Label>
                          <Select value={modalFormData.fromTime} onValueChange={(value) => setModalFormData(prev => ({ ...prev, fromTime: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                            <SelectContent>
                              {timeOptions.map(time => (
                                <SelectItem key={time} value={time}>{time}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="toTime" className="text-sm">To Time</Label>
                          <Select value={modalFormData.toTime} onValueChange={(value) => setModalFormData(prev => ({ ...prev, toTime: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                            <SelectContent>
                              {timeOptions.map(time => (
                                <SelectItem key={time} value={time}>{time}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      {modalFormData.fromTime && modalFormData.toTime && (
                        <Badge variant="outline" className="flex items-center gap-1 w-fit">
                          <Clock className="h-3 w-3" />
                          {modalFormData.fromTime} - {modalFormData.toTime}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={closeModal}>
                      Cancel
                    </Button>
                    <Button onClick={handleModalSave}>
                      Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>;
};
export default Settings;