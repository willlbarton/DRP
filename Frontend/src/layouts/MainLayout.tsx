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

  const goToForm = () => {
    if (currentUser) {
      navigate("/form");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-black text-white fixed top-0 left-0 right-0 z-50 h-20">
        <nav className="container mx-auto h-full flex items-center justify-between">
          <ul className="flex w-full justify-evenly text-lg">
            <li>
              <Link to="/" className="hover:text-gray-300">
                Home
              </Link>
            </li>
            <li>
              <button
                onClick={goToForm}
                className="hover:text-gray-300 focus:outline-none"
              >
                Form
              </button>
            </li>
            {currentUser ? (
              <li>
                <button
                  onClick={handleSignOut}
                  className="hover:text-gray-300 focus:outline-none"
                >
                  Sign out
                </button>
              </li>
            ) : (
              <li>
                <button
                  onClick={() => navigate('/login')}
                  className="hover:text-gray-300 focus:outline-none"
                >
                  Login
                </button>
              </li>
            )}
          </ul>
        </nav>
      </header>
      <main className="flex-grow container mx-auto p-4 pt-20 flex justify-center items-center">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
