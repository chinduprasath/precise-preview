
import React from 'react';
import { MoreVertical } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface ChatHeaderProps {
  name: string;
  status: string;
  avatar: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ name, status, avatar }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
          <img src={avatar} alt={name} className="h-full w-full object-cover" />
        </Avatar>
        <div>
          <h2 className="font-semibold text-blue-500">{name}</h2>
          <p className="text-xs text-gray-500">{status}</p>
        </div>
      </div>
      <Button variant="ghost" size="icon">
        <MoreVertical className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default ChatHeader;
