
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Navbar from '@/components/NavBar';
import { Image, User, Sparkles, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getRandomExampleAvatars } from '@/utils/exampleAvatars';
import { toast } from '@/components/ui/use-toast';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const [exampleImages, setExampleImages] = useState<Array<{id: string; imageUrl: string; prompt: string;}>>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  
  useEffect(() => {
    // Get random example avatars when the component mounts
    // Force new random selection on each render 
    setExampleImages(getRandomExampleAvatars(4));
    setImagesLoaded(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-8 pb-20 md:pt-16 md:pb-32 flex flex-col items-center text-center">
          <div className="relative mb-6">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-avatar-purple to-avatar-blue bg-clip-text text-transparent mb-2 animate-fade-in">
              Avatar Dream Weaver
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Create stunning AI-generated avatars with simple text prompts
            </p>
            <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-32 bg-gradient-to-r from-avatar-purple/20 to-avatar-blue/20 blur-3xl rounded-full animate-pulse-slow"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 my-12 max-w-4xl w-full">
            {imagesLoaded ? (
              exampleImages.map((avatar, index) => (
                <div 
                  key={`${avatar.id}-${index}`} 
                  className="aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-avatar-purple/80 to-avatar-blue/80 relative group animate-fade-in"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-avatar-purple/30 to-avatar-blue/30 animate-float" style={{ animationDelay: `${index * 0.3}s` }}></div>
                  <img 
                    src={avatar.imageUrl} 
                    alt={`AI-generated avatar: ${avatar.prompt}`}
                    className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity transform hover:scale-105 duration-500 animate-entrance"
                    style={{ animationDelay: `${0.3 + index * 0.15}s` }}
                    onError={(e) => {
                      console.error(`Failed to load image: ${avatar.imageUrl}`);
                      e.currentTarget.src = "/placeholder.svg"; // Fallback to placeholder
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                    <p className="text-white text-xs p-2 truncate w-full text-center">
                      {avatar.prompt}
                    </p>
                  </div>
                  <div className="absolute -inset-px border-2 border-transparent hover:border-white/40 transition-all duration-500 rounded-2xl animate-pulse-slow" style={{ animationDelay: `${index * 0.2}s` }}></div>
                </div>
              ))
            ) : (
              // Loading placeholders
              Array(4).fill(0).map((_, index) => (
                <div 
                  key={`loading-${index}`} 
                  className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-avatar-purple/30 to-avatar-blue/30 animate-pulse"
                  style={{ animationDelay: `${index * 0.15}s` }}
                ></div>
              ))
            )}
          </div>
          
          <div className="space-x-4 animate-fade-in" style={{ animationDelay: "0.8s" }}>
            {isAuthenticated ? (
              <Link to="/generator">
                <Button size="lg" className="gap-2 text-lg px-8 py-6 bg-gradient-to-r from-avatar-purple to-avatar-blue hover:opacity-90 transition-opacity transform hover:scale-105 duration-300">
                  <Sparkles className="w-5 h-5" />
                  Generate Avatar
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/signup">
                  <Button size="lg" className="gap-2 text-lg px-8 py-6 bg-gradient-to-r from-avatar-purple to-avatar-blue hover:opacity-90 transition-opacity transform hover:scale-105 duration-300">
                    <User className="w-5 h-5" />
                    Get Started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="gap-2 text-lg px-8 py-6 transform hover:scale-105 duration-300">
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>
        </section>
        
        {/* Features Section */}
        <section className="bg-gradient-to-b from-background to-secondary/30 py-20">
          <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
            <div className="glass rounded-2xl p-8 flex flex-col items-center text-center transition-transform hover:scale-105 duration-300 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <div className="w-16 h-16 rounded-full bg-avatar-purple/20 flex items-center justify-center mb-4">
                <Zap className="w-8 h-8 text-avatar-purple animate-pulse-slow" />
              </div>
              <h3 className="text-xl font-bold mb-2">Fast Generation</h3>
              <p className="text-muted-foreground">Create beautiful avatars in seconds with our lightning fast AI model</p>
            </div>
            
            <div className="glass rounded-2xl p-8 flex flex-col items-center text-center transition-transform hover:scale-105 duration-300 animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <div className="w-16 h-16 rounded-full bg-avatar-indigo/20 flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-avatar-indigo animate-float" />
              </div>
              <h3 className="text-xl font-bold mb-2">Creative Control</h3>
              <p className="text-muted-foreground">Customize every aspect of your avatar with detailed text prompts</p>
            </div>
            
            <div className="glass rounded-2xl p-8 flex flex-col items-center text-center transition-transform hover:scale-105 duration-300 animate-fade-in" style={{ animationDelay: "0.7s" }}>
              <div className="w-16 h-16 rounded-full bg-avatar-blue/20 flex items-center justify-center mb-4">
                <Image className="w-8 h-8 text-avatar-blue animate-spin-slow" />
              </div>
              <h3 className="text-xl font-bold mb-2">High Quality</h3>
              <p className="text-muted-foreground">Get high resolution avatars perfect for social media and profiles</p>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm py-6 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">&copy; {new Date().getFullYear()} AvatarDream. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
