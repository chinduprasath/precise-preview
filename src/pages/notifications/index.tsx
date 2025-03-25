
import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { 
  BadgeIndianRupee, 
  Bell, 
  Calendar, 
  Check, 
  Clock, 
  MessageSquare, 
  Star, 
  ThumbsUp, 
  X 
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'message' | 'payment' | 'request' | 'system' | 'schedule';
}

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New Request Received',
      description: 'Alex from Fashion Brand wants to collaborate for a Instagram post',
      time: '10 minutes ago',
      read: false,
      type: 'request'
    },
    {
      id: '2',
      title: 'Payment Received',
      description: 'You have received ₹8,500 for your recent campaign',
      time: '2 hours ago',
      read: false,
      type: 'payment'
    },
    {
      id: '3',
      title: 'New Message',
      description: 'Sarah sent you a message regarding the upcoming campaign',
      time: '3 hours ago',
      read: true,
      type: 'message'
    },
    {
      id: '4',
      title: 'Campaign Reminder',
      description: 'Your scheduled campaign for Beauty Products is due tomorrow',
      time: '5 hours ago',
      read: true,
      type: 'schedule'
    },
    {
      id: '5',
      title: 'System Update',
      description: 'We have updated our terms of service. Please review them',
      time: '1 day ago',
      read: true,
      type: 'system'
    },
    {
      id: '6',
      title: 'Request Approved',
      description: 'Your collaboration request with TechGadgets has been approved',
      time: '2 days ago',
      read: true,
      type: 'request'
    }
  ]);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'payment':
        return <BadgeIndianRupee className="h-5 w-5 text-green-500" />;
      case 'request':
        return <ThumbsUp className="h-5 w-5 text-purple-500" />;
      case 'system':
        return <Bell className="h-5 w-5 text-gray-500" />;
      case 'schedule':
        return <Calendar className="h-5 w-5 text-orange-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const unreadNotifications = notifications.filter(notification => !notification.read);
  const allNotifications = notifications;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Notifications</h1>
              <Button variant="outline" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            </div>

            <Tabs defaultValue="unread" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="unread">
                  Unread <span className="ml-2 bg-primary text-white rounded-full px-2 py-0.5 text-xs">{unreadNotifications.length}</span>
                </TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>
              
              <TabsContent value="unread" className="mt-0">
                {unreadNotifications.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <Bell className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No unread notifications</h3>
                    <p className="mt-1 text-gray-500">You're all caught up!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {unreadNotifications.map(notification => (
                      <div key={notification.id} className="bg-white p-4 rounded-lg border-l-4 border-primary shadow-sm">
                        <div className="flex justify-between">
                          <div className="flex space-x-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div>
                              <h3 className="font-medium">{notification.title}</h3>
                              <p className="text-sm text-gray-600">{notification.description}</p>
                              <div className="flex items-center mt-1">
                                <Clock className="h-3 w-3 text-gray-400 mr-1" />
                                <span className="text-xs text-gray-500">{notification.time}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => deleteNotification(notification.id)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="all" className="mt-0">
                {allNotifications.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <Bell className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No notifications</h3>
                    <p className="mt-1 text-gray-500">You don't have any notifications yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allNotifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={cn(
                          "bg-white p-4 rounded-lg shadow-sm",
                          notification.read ? "border border-gray-200" : "border-l-4 border-primary"
                        )}
                      >
                        <div className="flex justify-between">
                          <div className="flex space-x-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div>
                              <h3 className={cn("font-medium", notification.read ? "text-gray-700" : "text-gray-900")}>{notification.title}</h3>
                              <p className="text-sm text-gray-600">{notification.description}</p>
                              <div className="flex items-center mt-1">
                                <Clock className="h-3 w-3 text-gray-400 mr-1" />
                                <span className="text-xs text-gray-500">{notification.time}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            {!notification.read && (
                              <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" onClick={() => deleteNotification(notification.id)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NotificationsPage;
