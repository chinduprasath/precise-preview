
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 900 },
];

const pieData = [
  { name: 'Instagram', value: 65, color: '#E1306C' },
  { name: 'Facebook', value: 25, color: '#4267B2' },
  { name: 'Twitter', value: 10, color: '#1DA1F2' },
];

const BusinessDataTab = () => {
  return (
    <div className="space-y-6">
      <Card className="border border-gray-200">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4">Performance Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-4">Audience Demographics</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-4">Top Metrics</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-500">Engagement Rate</span>
                  <span className="text-sm font-medium">4.2%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: '42%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-500">Click-through Rate</span>
                  <span className="text-sm font-medium">2.8%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '28%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-500">Conversion Rate</span>
                  <span className="text-sm font-medium">1.5%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-500">Bounce Rate</span>
                  <span className="text-sm font-medium">35%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '35%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-gray-200">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4">Campaign Results</h3>
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Facebook Campaign</h4>
                <p className="text-sm text-gray-500">145K Impressions • 4.2% Engagement</p>
              </div>
              <div className="text-right">
                <p className="font-medium">$1,245</p>
                <p className="text-sm text-green-600">+12%</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Instagram Campaign</h4>
                <p className="text-sm text-gray-500">267K Impressions • 5.8% Engagement</p>
              </div>
              <div className="text-right">
                <p className="font-medium">$2,156</p>
                <p className="text-sm text-green-600">+24%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessDataTab;
