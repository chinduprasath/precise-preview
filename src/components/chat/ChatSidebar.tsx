
import React from 'react';
import { Avatar } from '@/components/ui/avatar';

interface ChatContact {
  id: string;
  name: string;
  message: string;
  avatar: string;
}

const contacts: ChatContact[] = [
  {
    id: '1',
    name: 'Christopher Campbell',
    message: 'In front of the Bar, about which...',
    avatar: 'https://picsum.photos/id/1025/200/200'
  },
  {
    id: '2',
    name: 'Houcine Ncib',
    message: 'In front of the Bar, about which...',
    avatar: 'https://picsum.photos/id/1025/200/200'
  },
  {
    id: '3',
    name: 'Kelly Sikkema',
    message: 'In front of the Bar, about which...',
    avatar: 'https://picsum.photos/id/1025/200/200'
  },
  {
    id: '4',
    name: 'Ethan Hoover',
    message: 'In front of the Bar, about which...',
    avatar: 'https://picsum.photos/id/1025/200/200'
  },
  {
    id: '5',
    name: 'Joseph Pearson',
    message: 'In front of the Bar, about which...',
    avatar: 'https://picsum.photos/id/1025/200/200'
  },
  {
    id: '6',
    name: 'Vicky Hladynets',
    message: 'In front of the Bar, about which...',
    avatar: 'https://picsum.photos/id/1025/200/200'
  },
  {
    id: '7',
    name: 'Jake Nackos',
    message: 'In front of the Bar, about which...',
    avatar: 'https://picsum.photos/id/1025/200/200'
  },
  {
    id: '8',
    name: 'Warren Wong',
    message: 'In front of the Bar, about which...',
    avatar: 'https://picsum.photos/id/1025/200/200'
  },
  {
    id: '9',
    name: 'Ethan Hoover',
    message: 'In front of the Bar, about which...',
    avatar: 'https://picsum.photos/id/1025/200/200'
  },
  {
    id: '10',
    name: 'Joseph Pearson',
    message: 'In front of the Bar, about which...',
    avatar: 'https://picsum.photos/id/1025/200/200'
  }
];

const ChatSidebar = () => {
  return (
    <div className="overflow-y-auto h-full">
      {contacts.map((contact) => (
        <div 
          key={contact.id}
          className="px-4 py-3 hover:bg-gray-100 transition-colors cursor-pointer border-b"
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <img src={contact.avatar} alt={contact.name} className="h-full w-full object-cover" />
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-blue-500">{contact.name}</p>
              <p className="text-gray-500 text-xs truncate">{contact.message}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatSidebar;
