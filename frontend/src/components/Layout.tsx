import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50/30">
      <nav className="bg-white/90 backdrop-blur-lg border-b border-primary-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <Link to="/" className="flex items-center space-x-2 md:space-x-3 group">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-lg md:text-xl">E</span>
              </div>
              <span className="text-xl md:text-2xl font-bold text-gradient">
                EventFlow
              </span>
            </Link>

            <div className="flex items-center space-x-2 md:space-x-4">
              <Link
                to="/events"
                className="hidden sm:block px-3 py-2 text-sm md:text-base font-medium text-dark-700 hover:text-primary-600 transition-colors rounded-lg hover:bg-primary-50"
              >
                Events
              </Link>

              {isAuthenticated ? (
                <>
                  {user?.role === 'organizer' && (
                    <Link
                      to="/dashboard"
                      className="hidden sm:block px-3 py-2 text-sm md:text-base font-medium text-dark-700 hover:text-primary-600 transition-colors rounded-lg hover:bg-primary-50"
                    >
                      Dashboard
                    </Link>
                  )}
                  <Link
                    to="/orders"
                    className="hidden sm:block px-3 py-2 text-sm md:text-base font-medium text-dark-700 hover:text-primary-600 transition-colors rounded-lg hover:bg-primary-50"
                  >
                    My Orders
                  </Link>
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <span className="hidden md:block text-sm text-dark-600 font-medium">{user?.name}</span>
                    <Button
                      onClick={handleLogout}
                      variant="default"
                      size="sm"
                    >
                      <span className="hidden sm:inline">Logout</span>
                      <span className="sm:hidden">Out</span>
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-2 md:space-x-3">
                  <Link to="/login">
                    <Button variant="ghost" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="default" size="sm">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)]">{children}</main>
    </div>
  );
}
