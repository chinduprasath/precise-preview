
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface BusinessDetailsProps {
  businessName: string;
  category: string;
  serviceType: string;
  website: string;
  location: string;
}

const BusinessDetails: React.FC<BusinessDetailsProps> = ({
  businessName,
  category,
  serviceType,
  website,
  location
}) => {
  // Format example price in INR
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      {/* Business Info Card */}
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <h2 className="text-lg font-bold mb-3">Business Info</h2>
          <div className="space-y-3">
            <div>
              <p className="text-gray-600 text-sm mb-1">Business Name</p>
              <p className="font-medium">{businessName}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Category</p>
              <p className="font-medium">{category}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Ratings</p>
              <div className="flex text-amber-400">
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4" />
              </div>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Service Type</p>
              <p className="font-medium">{serviceType}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Visit our site</p>
              <p className="font-medium">{website}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Location</p>
              <p className="font-medium">{location}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Price Range</p>
              <p className="font-medium">{formatCurrency(5000)} - {formatCurrency(50000)}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Account Management</p>
              <div className="flex items-center gap-2">
                <select className="border rounded px-2 py-1 bg-gray-100 text-gray-700 text-sm">
                  <option>Select</option>
                  <option>Option 1</option>
                  <option>Option 2</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Chart */}
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold">Your Activity</h2>
            <select className="border rounded px-2 py-1 bg-gray-100 text-gray-700 text-sm">
              <option>Weekly</option>
              <option>Monthly</option>
              <option>Yearly</option>
            </select>
          </div>
          <div className="h-40 relative">
            {/* Simple chart visualization */}
            <svg
              className="w-full h-full"
              viewBox="0 0 300 100"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="activity-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,90 C20,80 40,20 60,40 C80,60 100,80 120,60 C140,40 160,10 180,30 C200,50 220,70 240,50 C260,30 280,10 300,30"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
              />
              <path
                d="M0,90 C20,80 40,20 60,40 C80,60 100,80 120,60 C140,40 160,10 180,30 C200,50 220,70 240,50 C260,30 280,10 300,30 L300,100 L0,100 Z"
                fill="url(#activity-gradient)"
              />
              <circle cx="150" cy="30" r="4" fill="#3b82f6" />
            </svg>
            <div className="absolute bottom-0 w-full flex justify-between text-xs text-gray-500 py-1">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Images Section */}
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <h2 className="text-lg font-bold mb-3">Images</h2>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="overflow-hidden rounded-md bg-gray-100 aspect-square">
                <img
                  src={`https://images.unsplash.com/photo-${1560000000000 + item * 100000}?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80`}
                  alt={`Business image ${item}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessDetails;
