import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline';

interface Props {
  children: React.ReactNode;
  sidebarOpen: boolean;
  onCloseSidebar: (state: boolean) => void;
  onLogout: () => void;
}

export const Layout: React.FC<Props> = ({ children, sidebarOpen, onCloseSidebar, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', href: '/' },
    { name: 'Scheduler', href: '/scheduler' },
    { name: 'Sessions', href: '/sessions' },
    { name: 'Incubation', href: '/incubation' }
  ];

  const handleLogout = () => {
    onLogout();
    navigate('/signin');
  };

  const isActionPage = location.pathname.includes('/execute') || 
                      location.pathname.includes('/verify-media') ||
                      location.pathname.includes('/store-controls') ||
                      location.pathname.includes('/monitoring');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Fixed Header with Hamburger */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-white shadow-sm">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center">
            <button
              type="button"
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              onClick={() => onCloseSidebar(sidebarOpen ? false : true)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <span className="ml-4 text-xl font-semibold">Settle Plate Monitoring</span>
          </div>
          {isActionPage && (
            <div className="flex items-center space-x-4">
              <Link
                to="/sessions"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Back to Sessions
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      {sidebarOpen && (
        <>
          {/* Background overlay */}
          <div 
            className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 transition-opacity" 
            onClick={() => onCloseSidebar(false)}
          />
          
          {/* Sidebar panel */}
          <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-white shadow-xl z-50">
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
              <span className="text-xl font-semibold">Menu</span>
              <button
                type="button"
                className="rounded-md text-gray-400 hover:text-gray-500"
                onClick={() => onCloseSidebar(false)}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      isActive
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } group flex items-center px-4 py-2 text-base font-medium rounded-md`}
                    onClick={() => onCloseSidebar(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}

      {/* Main content */}
      <div className="flex-1 pt-16">
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
};