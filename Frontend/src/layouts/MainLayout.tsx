import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { doSignOut } from '@/firebase/auth';
import { useAuth } from '@/contexts/authContexts';

const MainLayout = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleSignOut = async () => {
    await doSignOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-white fixed top-0 left-0 right-0 z-50 h-16">
        <nav className="container mx-auto h-full flex items-center justify-between">
          {/* Left-aligned Home link */}
          <div className="flex">
            <ul className="flex items-center space-x-4">
              <li>
                <Link to="/" className="hover:text-gray-300 text-lg">
                  Home
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Right-aligned Login/Sign out button */}
          <div className="flex">
            <ul className="flex items-center space-x-4">
              {currentUser ? (
                <li>
                  <button
                    onClick={handleSignOut}
                    className="hover:text-gray-300 focus:outline-none text-lg"
                  >
                    Sign out
                  </button>
                </li>
              ) : (
                <li>
                  <button
                    onClick={() => navigate('/login')}
                    className="hover:text-gray-300 focus:outline-none text-lg"
                  >
                    Login
                  </button>
                </li>
              )}
            </ul>
          </div>
        </nav>
      </header>
      <main className="flex-grow container mx-auto p-4 pt-20 flex justify-center">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
