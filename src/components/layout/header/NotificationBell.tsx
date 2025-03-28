
import React from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NotificationBellProps {
  count: number;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ count }) => {
  return (
    <Link to="/notifications" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-300 relative">
      <Bell className="h-5 w-5 text-gray-600" />
      {count > 0 && (
        <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
          {count}
        </span>
      )}
    </Link>
  );
};

export default NotificationBell;
