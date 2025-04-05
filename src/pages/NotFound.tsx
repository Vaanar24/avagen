
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/NavBar";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-4 pt-24">
        <div className="text-center max-w-md">
          <div className="relative mb-8">
            <h1 className="text-8xl font-bold bg-gradient-to-r from-avatar-purple to-avatar-blue bg-clip-text text-transparent">
              404
            </h1>
            <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-r from-avatar-purple/20 to-avatar-blue/20 blur-3xl rounded-full"></div>
          </div>
          
          <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
          <p className="text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <Button 
            className="gap-2 bg-gradient-to-r from-avatar-purple to-avatar-blue"
            onClick={() => navigate('/')}
          >
            <Home className="h-4 w-4" />
            Return to Home
          </Button>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
