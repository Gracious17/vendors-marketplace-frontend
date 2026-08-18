import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const NO_CHROME_PATHS = ['/login', '/register'];

const Layout: React.FC = () => {
  const location = useLocation();
  const hideChrome =
    NO_CHROME_PATHS.includes(location.pathname) ||
    location.pathname.startsWith('/dashboard');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {!hideChrome && <Navbar />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!hideChrome && <Footer />}
    </div>
  );
};

export default Layout;