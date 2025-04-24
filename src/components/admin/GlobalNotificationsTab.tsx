
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Clock, Send } from "lucide-react";

interface NotificationHistory {
  id: string;
  title: string;
  message: string;
  user_type: string;
  scheduled_for: string | null;
  sent_at: string | null;
  status: string;
  created_at: string;
}

export default function GlobalNotificationsTab() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [userType, setUserType] = useState('all');
  const [schedule, setSchedule] = useState<string>('');
  const [notificationHistory, setNotificationHistory] = useState<NotificationHistory[]>([]);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchNotificationHistory();
  }, []);

  const fetchNotificationHistory = async () => {
    const { data, error } = await supabase
      .from('global_notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch notification history');
      return;
    }

    setNotificationHistory(data);
  };

  const handleSendNotification = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSending(true);
    
    try {
      const { error } = await supabase
        .from('global_notifications')
        .insert({
          title,
          message,
          user_type: userType,
          scheduled_for: schedule ? new Date(schedule).toISOString() : null,
          status: schedule ? 'scheduled' : 'sent',
          sent_at: schedule ? null : new Date().toISOString(),
        });

      if (error) throw error;

      toast.success(schedule ? 'Notification scheduled successfully' : 'Notification sent successfully');
      setTitle('');
      setMessage('');
      setUserType('all');
      setSchedule('');
      fetchNotificationHistory();
    } catch (error) {
      toast.error('Failed to send notification');
      console.error('Error sending notification:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Send Global Notification</CardTitle>
          <CardDescription>
            Send notifications to all users or specific user groups
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Notification title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Notification message"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="userType">User Type</Label>
                <Select value={userType} onValueChange={setUserType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select user type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="business">Business Users</SelectItem>
                    <SelectItem value="influencer">Influencers</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="schedule">Schedule (Optional)</Label>
                <Input
                  id="schedule"
                  type="datetime-local"
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                />
              </div>
            </div>

            <Button 
              onClick={handleSendNotification} 
              disabled={isSending || !title.trim() || !message.trim()}
              className="w-full"
            >
              <Send className="mr-2 h-4 w-4" />
              {isSending ? 'Sending...' : schedule ? 'Schedule Notification' : 'Send Notification'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification History</CardTitle>
          <CardDescription>
            View all sent and scheduled notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notificationHistory.map((notification) => (
              <div
                key={notification.id}
                className="border rounded-lg p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{notification.title}</h4>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    notification.status === 'sent' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {notification.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    {notification.scheduled_for 
                      ? `Scheduled for: ${new Date(notification.scheduled_for).toLocaleString()}`
                      : `Sent at: ${new Date(notification.sent_at || notification.created_at).toLocaleString()}`
                    }
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
