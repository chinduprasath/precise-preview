
import React, { useState } from 'react';
import { Paperclip, Send } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatMessage from '@/components/chat/ChatMessage';
import Layout from '@/components/layout/Layout';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isUser: boolean;
}

const ChatsPage = () => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'Christopher Campbell',
      content: 'Hey there! How can I help you today?',
      timestamp: new Date(Date.now() - 3600000),
      isUser: false
    },
    {
      id: '2',
      sender: 'You',
      content: 'I\'m interested in your services. Can you tell me more about your rates?',
      timestamp: new Date(Date.now() - 1800000),
      isUser: true
    },
    {
      id: '3',
      sender: 'Christopher Campbell',
      content: 'Of course! My basic package starts at $500 for a campaign that includes 3 Instagram posts and 2 stories. For more extensive collaborations, we can discuss custom packages.',
      timestamp: new Date(Date.now() - 1200000),
      isUser: false
    }
  ]);

  const handleSendMessage = () => {
    if (currentMessage.trim() === '') return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'You',
      content: currentMessage,
      timestamp: new Date(),
      isUser: true
    };
    
    setMessages([...messages, newMessage]);
    setCurrentMessage('');
    
    // Simulate influencer response after a short delay
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'Christopher Campbell',
        content: 'Thanks for the message! I'll get back to you with more details soon.',
        timestamp: new Date(),
        isUser: false
      };
      setMessages(prev => [...prev, response]);
    }, 2000);
  };

  return (
    <Layout>
      <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
        {/* Chat Sidebar */}
        <div className="w-80 border-r">
          <div className="p-4 border-b">
            <h1 className="text-2xl font-bold">Chats</h1>
            <div className="mt-3">
              <Input 
                type="search"
                placeholder="Search Influencer" 
                className="bg-gray-50"
              />
            </div>
          </div>
          <ChatSidebar />
        </div>
        
        {/* Chat Main Content */}
        <div className="flex-1 flex flex-col">
          <ChatHeader 
            name="Christopher Campbell" 
            status="Last seen 02:55 pm" 
            avatar="https://picsum.photos/id/1025/200/200"
          />
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <ChatMessage 
                  key={message.id}
                  content={message.content}
                  timestamp={message.timestamp}
                  isUser={message.isUser}
                  sender={message.sender}
                />
              ))}
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Paperclip className="h-5 w-5 text-gray-500" />
            </Button>
            <Input
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Type your Message..."
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
            />
            <Button 
              onClick={handleSendMessage}
              variant="ghost" 
              size="icon" 
              className="rounded-full bg-primary/10 hover:bg-primary/20"
            >
              <Send className="h-5 w-5 text-primary" />
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChatsPage;
