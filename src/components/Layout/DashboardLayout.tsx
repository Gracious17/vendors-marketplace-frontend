import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Calendar, User, LogOut, Shield } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

const DashboardLayout: React.FC = () => {
  const { profile, signOut } = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <>
      <header className="bg-paper border-b border-mist sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-carbon" strokeWidth={1.5} />
            <span className="text-lg font-semibold text-carbon">
              VendorHub<span className="text-fiverr-green">.</span>
            </span>
          </Link>

          <div className="flex items-center gap-5">
            {profile?.is_admin && (
              <Link
                to="/dashboard/admin"
                className="hidden sm:inline-flex items-center text-sm font-medium text-graphite hover:text-carbon transition-colors"
              >
                <Shield className="h-4 w-4 mr-1.5" />
                Admin Panel
              </Link>
            )}

            <div className="flex items-center gap-2 min-w-0">
              <div className="h-8 w-8 shrink-0 bg-fiverr-green/10 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-fiverr-green" />
              </div>
              <span className="hidden sm:block text-sm font-medium text-carbon truncate max-w-[10rem]">
                {profile?.name}
              </span>
            </div>

            <button
              onClick={handleSignOut}
              aria-label="Sign out"
              className="flex items-center text-sm font-medium text-graphite hover:text-carbon transition-colors"
            >
              <LogOut className="h-4 w-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <Outlet />
    </>
  );
};

export default DashboardLayout;
