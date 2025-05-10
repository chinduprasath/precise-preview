
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Activity, Check, X, AlertTriangle, Edit } from 'lucide-react';

interface ActivityItem {
  id: string;
  activity: string;
  type: 'update' | 'approval' | 'rejection' | 'warning' | 'edit';
  timestamp: string;
  details?: string;
}

interface ActivityLogProps {
  userId: string;
}

const getMockActivities = (): ActivityItem[] => {
  return [
    {
      id: '1',
      activity: 'Approved campaign #2458',
      type: 'approval',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      details: 'Campaign for Nike launched by influencer @sportstar'
    },
    {
      id: '2',
      activity: 'Updated system settings',
      type: 'update',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    },
    {
      id: '3',
      activity: 'Rejected refund request #1234',
      type: 'rejection',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
      details: 'Refund request from Business Corp did not meet criteria'
    },
    {
      id: '4',
      activity: 'System alert: High server load',
      type: 'warning',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    },
    {
      id: '5',
      activity: 'Edited user profile for @techguru',
      type: 'edit',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      details: 'Updated verification status and payment details'
    }
  ];
};

const ActivityIcon = ({ type }: { type: ActivityItem['type'] }) => {
  switch(type) {
    case 'update':
      return <Activity className="h-4 w-4 text-blue-500" />;
    case 'approval':
      return <Check className="h-4 w-4 text-green-500" />;
    case 'rejection':
      return <X className="h-4 w-4 text-red-500" />;
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    case 'edit':
      return <Edit className="h-4 w-4 text-purple-500" />;
    default:
      return <Activity className="h-4 w-4" />;
  }
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const ActivityLog = ({ userId }: ActivityLogProps) => {
  const [filter, setFilter] = useState<string>('all');
  const activities = getMockActivities();

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === filter);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Activity Log</CardTitle>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Activities</SelectItem>
            <SelectItem value="update">Updates</SelectItem>
            <SelectItem value="approval">Approvals</SelectItem>
            <SelectItem value="rejection">Rejections</SelectItem>
            <SelectItem value="warning">Warnings</SelectItem>
            <SelectItem value="edit">Edits</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((item) => (
              <div key={item.id} className="flex gap-3 py-2 border-b border-border last:border-0">
                <div className="mt-0.5">
                  <ActivityIcon type={item.type} />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                    <p className="font-medium">{item.activity}</p>
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      {formatTimestamp(item.timestamp)}
                    </span>
                  </div>
                  {item.details && (
                    <p className="text-sm text-muted-foreground mt-1">{item.details}</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No activities found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityLog;
