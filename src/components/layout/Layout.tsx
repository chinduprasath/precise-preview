
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart2, Users, MessageSquare, TrendingUp, LayoutList, Settings, ShoppingCart, FileText } from 'lucide-react';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  const menuItems = [
    { name: 'Dashboard', icon: <BarChart2 size={20} />, path: '/' },
    { name: 'Influencers', icon: <Users size={20} />, path: '/influencers' },
    { name: 'Chats', icon: <MessageSquare size={20} />, path: '/chats' },
    { name: 'Reach', icon: <TrendingUp size={20} />, path: '/reach' },
    { name: 'Services', icon: <LayoutList size={20} />, path: '/services' },
    { name: 'Reports', icon: <FileText size={20} />, path: '/reports' },
    { name: 'Checkout', icon: <ShoppingCart size={20} />, path: '/checkout' },
    { name: 'Orders', icon: <ShoppingCart size={20} />, path: '/orders' },
    { name: 'Billing', icon: <FileText size={20} />, path: '/billing' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-60 border-r bg-white flex flex-col">
        <div className="p-4 border-b flex items-center gap-2">
          <svg viewBox="0 0 24 24" width="24" height="24" className="text-blue-500">
            <path fill="currentColor" d="M8.465 11.293c1.133-1.133 3.109-1.133 4.242 0l.707.707 1.414-1.414-.707-.707c-1.889-1.889-4.954-1.889-6.838 0l-2.122 2.121a4.798 4.798 0 0 0-1.414 3.414c0 1.305.512 2.526 1.414 3.414 1.889 1.889 4.954 1.889 6.838 0l2.121-2.121-1.414-1.414-2.121 2.121a3.407 3.407 0 0 1-4.242.004 2.982 2.982 0 0 1-.878-2.118c0-.802.313-1.554.878-2.121l2.122-2.121z"></path>
            <path fill="currentColor" d="M15.535 14.707l-2.121 2.121 1.414 1.414 2.121-2.121c.567-.566.879-1.317.879-2.121s-.312-1.555-.879-2.121c-1.133-1.133-3.109-1.133-4.242 0L10 14.586l1.414 1.414 2.707-2.707c.378-.378 1.037-.377 1.414 0a.996.996 0 0 1 0 1.414z"></path>
          </svg>
          <h1 className="font-bold text-lg">
            <span className="text-blue-500">Influence</span>
            <span className="text-gray-800">Connect</span>
          </h1>
        </div>
        
        <nav className="mt-4 flex-1 overflow-y-auto">
          <ul className="space-y-2 px-3">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-blue-50 text-blue-500 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t flex justify-between">
          <button className="px-4 py-1 rounded bg-gray-200 text-sm">Light Mode</button>
          <button className="px-4 py-1 rounded bg-gray-900 text-white text-sm">Dark Mode</button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
