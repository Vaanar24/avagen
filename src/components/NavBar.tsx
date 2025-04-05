
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut, Home, Image, LogIn, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = ({ className }: { className?: string }) => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={cn("w-full bg-white/50 backdrop-blur-md shadow-md px-4 py-4 fixed top-0 left-0 z-10", className)}>
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-avatar-purple to-avatar-blue flex items-center justify-center">
            <span className="text-white font-bold text-xl">A</span>
            <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-avatar-purple to-avatar-blue opacity-30 blur-sm -z-10"></div>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-avatar-purple to-avatar-blue bg-clip-text text-transparent">
            AvatarDream
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/">
            <Button variant="ghost" className="flex items-center gap-2">
              <Home size={18} />
              Home
            </Button>
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/generator">
                <Button variant="ghost" className="flex items-center gap-2">
                  <Image size={18} />
                  Generate
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                className="flex items-center gap-2 border-destructive text-destructive hover:bg-destructive/10"
                onClick={handleLogout}
              >
                <LogOut size={18} />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" className="flex items-center gap-2">
                  <LogIn size={18} />
                  Login
                </Button>
              </Link>
              
              <Link to="/signup">
                <Button variant="default" className="flex items-center gap-2">
                  <UserPlus size={18} />
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X size={24} className="text-primary" />
          ) : (
            <Menu size={24} className="text-primary" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute left-0 right-0 top-[72px] bg-white/90 backdrop-blur-md shadow-lg px-4 py-5 flex flex-col space-y-3 border-t">
          <Link to="/" onClick={() => setIsMenuOpen(false)}>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Home size={18} />
              Home
            </Button>
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/generator" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <Image size={18} />
                  Generate
                </Button>
              </Link>
              
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2 text-destructive hover:bg-destructive/10"
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
              >
                <LogOut size={18} />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <LogIn size={18} />
                  Login
                </Button>
              </Link>
              
              <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2 text-primary">
                  <UserPlus size={18} />
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
