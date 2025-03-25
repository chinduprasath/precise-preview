
import React from 'react';
import { Share2, MessageSquare, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileStats from './ProfileStats';
import ProfileContent from './ProfileContent';

const businessInfo = [
  { label: 'Business Name', value: 'ABC company' },
  { label: 'Category', value: 'XYZ Products' },
  { label: 'Ratings', value: '★★★★☆' },
  { label: 'Service Type', value: 'Online & Offline' },
  { label: 'Visit our site', value: 'www.xyz.com' },
  { label: 'Location', value: '[Address]' },
  { label: 'Account Management', value: 'Select' },
];

const UserProfile: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <Card className="p-6">
            <div className="flex flex-col">
              <div className="flex flex-col items-center mb-6">
                <Avatar className="h-24 w-24 mb-4">
                  <img 
                    src="https://picsum.photos/id/1005/200/200" 
                    alt="Profile" 
                    className="object-cover"
                  />
                </Avatar>
                <h1 className="text-2xl font-bold">Username</h1>
                <p className="text-gray-500 mb-4">Username@gmail.com</p>
                
                <div className="flex gap-4">
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </div>
              </div>
              
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Business Info</h2>
                <dl className="space-y-3">
                  {businessInfo.map((item, index) => (
                    <div key={index} className="grid grid-cols-2 gap-4">
                      <dt className="text-gray-600">{item.label}</dt>
                      <dd className="font-medium">
                        {item.label === 'Visit our site' ? (
                          <a 
                            href={`https://${item.value}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-500 hover:underline"
                          >
                            {item.value}
                            <LinkIcon className="h-3 w-3 ml-1" />
                          </a>
                        ) : item.label === 'Account Management' ? (
                          <select className="border rounded px-2 py-1 text-sm w-full">
                            <option>Select</option>
                            <option>Basic</option>
                            <option>Premium</option>
                            <option>Enterprise</option>
                          </select>
                        ) : (
                          item.value
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
              
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Your Activity</h2>
                <div className="text-sm text-right mb-1">
                  <span className="text-gray-500">Weekly</span>
                </div>
                <div className="h-40 relative">
                  <div className="absolute inset-0">
                    <svg viewBox="0 0 400 150" className="w-full h-full">
                      <path
                        d="M0,150 L40,120 L80,130 L120,100 L160,110 L200,70 L240,90 L280,80 L320,90 L360,70 L400,80"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2"
                      />
                      <circle cx="200" cy="70" r="5" fill="#3b82f6" />
                      <line x1="200" y1="0" x2="200" y2="150" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4" />
                    </svg>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span className="text-blue-500 font-medium">Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>
              
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Images</h2>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6].map((img) => (
                    <div key={img} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img 
                        src={`https://picsum.photos/id/${1050 + img}/200/200`} 
                        alt={`Gallery image ${img}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="md:w-2/3">
          <Tabs defaultValue="services" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="data">Data</TabsTrigger>
            </TabsList>
            <TabsContent value="services" className="mt-6">
              <ProfileContent />
            </TabsContent>
            <TabsContent value="data" className="mt-6">
              <ProfileContent />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
