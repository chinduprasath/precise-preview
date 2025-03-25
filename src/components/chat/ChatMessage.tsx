
import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { format } from 'date-fns';

interface ChatMessageProps {
  content: string;
  isUser: boolean;
  timestamp: Date;
  sender: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ content, isUser, timestamp, sender }) => {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex gap-3 max-w-[70%] ${isUser ? 'flex-row-reverse' : ''}`}>
        {!isUser && (
          <Avatar className="h-10 w-10 mt-1">
            <img 
              src="https://picsum.photos/id/1025/200/200" 
              alt={sender} 
              className="h-full w-full object-cover"
            />
          </Avatar>
        )}
        <div>
          <div 
            className={`px-4 py-3 rounded-lg ${
              isUser 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {content}
          </div>
          <div className={`mt-1 text-xs text-gray-500 ${isUser ? 'text-right' : ''}`}>
            {format(timestamp, 'h:mm a')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
