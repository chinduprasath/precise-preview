
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { useTheme } from '@/components/theme-provider';
import { Sun, Moon, Mail, Phone, Bell } from 'lucide-react';

const PreferencesForm = () => {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true
  });

  const handleNotificationChange = (type: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <h3 className="font-medium">Theme Preference</h3>
          <div className="flex items-center gap-4">
            <div 
              className={`flex items-center gap-2 p-3 rounded-md cursor-pointer transition-all ${theme === 'light' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
              onClick={() => setTheme('light')}
            >
              <Sun className="h-4 w-4" />
              <span>Light</span>
            </div>
            
            <div 
              className={`flex items-center gap-2 p-3 rounded-md cursor-pointer transition-all ${theme === 'dark' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
              onClick={() => setTheme('dark')}
            >
              <Moon className="h-4 w-4" />
              <span>Dark</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-border">
          <h3 className="font-medium">Notification Preferences</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="email-notifications" 
                checked={notifications.email}
                onCheckedChange={() => handleNotificationChange('email')}
              />
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="email-notifications">Email Notifications</Label>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="sms-notifications" 
                checked={notifications.sms}
                onCheckedChange={() => handleNotificationChange('sms')}
              />
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="sms-notifications">SMS Notifications</Label>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="push-notifications" 
                checked={notifications.push}
                onCheckedChange={() => handleNotificationChange('push')}
              />
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="push-notifications">Push Notifications</Label>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PreferencesForm;
