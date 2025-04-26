
import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Search, Send, Paperclip, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Influencer {
  id: string;
  name: string;
  lastMessage: string;
  avatar: string;
  lastSeen?: string;
}

const mockInfluencers: Influencer[] = [
  { id: '1', name: 'Christopher Campbell', lastMessage: 'In front of the Bar, about whic...', avatar: 'https://picsum.photos/id/1005/200/200' },
  { id: '2', name: 'Houcine Ncib', lastMessage: 'In front of the Bar, about whic...', avatar: 'https://picsum.photos/id/1005/200/200' },
  { id: '3', name: 'Kelly Sikkema', lastMessage: 'In front of the Bar, about whic...', avatar: 'https://picsum.photos/id/1005/200/200' },
  { id: '4', name: 'Ethan Hoover', lastMessage: 'In front of the Bar, about whic...', avatar: 'https://picsum.photos/id/1005/200/200' },
  { id: '5', name: 'Joseph Pearson', lastMessage: 'In front of the Bar, about whic...', avatar: 'https://picsum.photos/id/1005/200/200' },
  { id: '6', name: 'Vicky Hladynets', lastMessage: 'In front of the Bar, about whic...', avatar: 'https://picsum.photos/id/1005/200/200' },
  { id: '7', name: 'Jake Nackos', lastMessage: 'In front of the Bar, about whic...', avatar: 'https://picsum.photos/id/1005/200/200' },
  { id: '8', name: 'Warren Wong', lastMessage: 'In front of the Bar, about whic...', avatar: 'https://picsum.photos/id/1005/200/200' },
  { id: '9', name: 'Ethan Hoover', lastMessage: 'In front of the Bar, about whic...', avatar: 'https://picsum.photos/id/1005/200/200' },
  { id: '10', name: 'Joseph Pearson', lastMessage: 'In front of the Bar, about whic...', avatar: 'https://picsum.photos/id/1005/200/200' },
];

const ChatHeader: React.FC<{ influencer: Influencer | null }> = ({ influencer }) => {
  if (!influencer) return null;
  
  return (
    <div className="flex items-center justify-between p-4 border-b border-border">
      <div className="flex items-center gap-3">
        <Avatar>
          <img src={influencer.avatar} alt={influencer.name} className="h-full w-full object-cover" />
        </Avatar>
        <div>
          <h3 className="font-medium text-foreground">{influencer.name}</h3>
          <p className="text-sm text-muted-foreground">Last seen 02:55 pm</p>
        </div>
      </div>
      <button className="p-2 rounded-full hover:bg-secondary">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-vertical text-foreground"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
      </button>
    </div>
  );
};

const ChatMessage = () => {
  // Empty component for now as we don't have actual messages in the screenshot
  return null;
};

const ChatInput = () => {
  return (
    <div className="p-4 border-t border-border flex items-center gap-3">
      <Button variant="ghost" size="icon" className="rounded-full">
        <Paperclip className="h-5 w-5 text-muted-foreground" />
      </Button>
      <div className="flex-1 relative">
        <Input 
          placeholder="Type your Message..." 
          className="pl-4 pr-10 py-3 rounded-full border-border"
        />
      </div>
      <Button variant="ghost" size="icon" className="rounded-full">
        <Mic className="h-5 w-5 text-muted-foreground" />
      </Button>
      <Button size="icon" className="rounded-full bg-primary text-white">
        <Send className="h-5 w-5" />
      </Button>
    </div>
  );
};

const ChatListItem: React.FC<{ 
  influencer: Influencer; 
  isActive: boolean; 
  onClick: () => void;
}> = ({ influencer, isActive, onClick }) => {
  return (
    <div 
      className={`p-3 flex items-center gap-3 cursor-pointer border-b border-border ${isActive ? 'bg-secondary' : 'hover:bg-secondary/50'}`}
      onClick={onClick}
    >
      <Avatar>
        <img src={influencer.avatar} alt={influencer.name} className="h-full w-full object-cover" />
      </Avatar>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-primary">{influencer.name}</h4>
        <p className="text-sm text-muted-foreground truncate">{influencer.lastMessage}</p>
      </div>
    </div>
  );
};

const ChatsPage = () => {
  const [activeInfluencer, setActiveInfluencer] = useState<Influencer | null>(mockInfluencers[0]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredInfluencers = mockInfluencers.filter(influencer => 
    influencer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-auto flex">
          {/* Left side - Chat list */}
          <div className="w-80 border-r border-border bg-card overflow-y-auto flex flex-col">
            <div className="p-4 border-b border-border">
              <h1 className="text-2xl font-bold mb-4 text-foreground">Chats</h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search Influencer"
                  className="pl-10 pr-4 py-2 w-full rounded-md border-border"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredInfluencers.map(influencer => (
                <ChatListItem 
                  key={influencer.id} 
                  influencer={influencer} 
                  isActive={activeInfluencer?.id === influencer.id}
                  onClick={() => setActiveInfluencer(influencer)}
                />
              ))}
            </div>
          </div>
          
          {/* Right side - Chat window */}
          <div className="flex-1 flex flex-col bg-card">
            <ChatHeader influencer={activeInfluencer} />
            <div className="flex-1 overflow-y-auto p-4 bg-background">
              <ChatMessage />
            </div>
            <ChatInput />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatsPage;
