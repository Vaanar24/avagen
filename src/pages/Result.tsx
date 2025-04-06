
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, ArrowLeft, Clock, MessageSquare, Loader2 } from 'lucide-react';
import Navbar from '@/components/NavBar';
import { getAvatar } from '@/services/generatorService';
import { toast } from '@/components/ui/use-toast';

interface Avatar {
  id: string;
  userId: string;
  prompt: string;
  imageUrl: string;
  timestamp: string;
  generationTime: number;
}

const Result = () => {
  const { imageId } = useParams<{ imageId: string }>();
  const [avatar, setAvatar] = useState<Avatar | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAvatar() {
      if (!imageId) {
        navigate('/generator');
        return;
      }

      setIsLoading(true);
      try {
        const fetchedAvatar = await getAvatar(imageId);
        
        if (!fetchedAvatar) {
          toast({
            title: "Avatar not found",
            description: "The requested avatar could not be found",
            variant: "destructive",
          });
          navigate('/generator');
          return;
        }
        
        setAvatar(fetchedAvatar);
        setImageError(false);
      } catch (error) {
        console.error('Error fetching avatar:', error);
        toast({
          title: "Error loading avatar",
          description: "There was a problem loading the avatar",
          variant: "destructive",
        });
        navigate('/generator');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchAvatar();
  }, [imageId, navigate]);

  const handleDownload = () => {
    if (!avatar) return;
    
    toast({
      title: "Download started",
      description: "Your avatar is being downloaded",
    });
    
    try {
      // Create an anchor element and set attributes
      const link = document.createElement('a');
      
      // If the image is a base64 data URL, use it directly
      if (avatar.imageUrl.startsWith('data:')) {
        link.href = avatar.imageUrl;
      } else {
        // For regular URLs, we need to create a proxy or use the URL directly
        link.href = avatar.imageUrl;
      }
      
      link.download = `avatar-${avatar.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => {
        toast({
          title: "Download complete",
          description: "Avatar saved successfully",
        });
      }, 1500);
    } catch (error) {
      console.error('Error downloading avatar:', error);
      toast({
        title: "Download failed",
        description: "There was a problem downloading the avatar",
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    navigate('/generator');
  };

  if (isLoading || !avatar) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Loading avatar...</p>
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(avatar.timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <Button 
            variant="outline" 
            className="mb-6 gap-2"
            onClick={handleBack}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Generator
          </Button>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="order-2 md:order-1">
              <Card className="glass border-0 overflow-hidden">
                {imageError ? (
                  <div className="w-full aspect-square flex items-center justify-center bg-muted/30">
                    <div className="flex flex-col items-center">
                      <Image className="h-16 w-16 text-muted mb-4" />
                      <p className="text-muted">Image could not be loaded</p>
                    </div>
                  </div>
                ) : (
                  <img 
                    src={avatar.imageUrl} 
                    alt={avatar.prompt}
                    className="w-full aspect-square object-cover"
                    onError={(e) => {
                      console.error(`Failed to load result image: ${avatar.id}`);
                      e.currentTarget.src = "/placeholder.svg";
                      setImageError(true);
                    }}
                  />
                )}
              </Card>
              
              <div className="mt-6 flex justify-between">
                <Button 
                  variant="outline" 
                  className="gap-2 flex-1 mr-2"
                  onClick={handleBack}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Create Another
                </Button>
                
                <Button 
                  className="gap-2 bg-gradient-to-r from-avatar-purple to-avatar-blue flex-1 ml-2"
                  onClick={handleDownload}
                  disabled={imageError}
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
            
            <div className="order-1 md:order-2">
              <h1 className="text-2xl md:text-3xl font-bold mb-4">Your Avatar</h1>
              
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 mb-6 border border-border">
                <div className="flex items-start gap-2">
                  <MessageSquare className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                  <p className="text-muted-foreground italic">"{avatar.prompt}"</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-border">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span className="text-muted-foreground">Generation Time</span>
                  </div>
                  <span className="font-semibold">{avatar.generationTime.toFixed(2)}s</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-border">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span className="text-muted-foreground">Created On</span>
                  </div>
                  <span className="font-semibold">{formattedDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Result;
