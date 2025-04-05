
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, ArrowLeft, Clock, MessageSquare } from 'lucide-react';
import Navbar from '@/components/NavBar';
import { getAvatar } from '@/services/generatorService';
import { toast } from '@/components/ui/use-toast';

interface Avatar {
  id: string;
  prompt: string;
  imageUrl: string;
  timestamp: string;
  generationTime: number;
}

const Result = () => {
  const { imageId } = useParams<{ imageId: string }>();
  const [avatar, setAvatar] = useState<Avatar | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!imageId) {
      navigate('/generator');
      return;
    }

    const fetchedAvatar = getAvatar(imageId);
    
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
    setIsLoading(false);
  }, [imageId, navigate]);

  const handleDownload = () => {
    if (!avatar) return;
    
    toast({
      title: "Download started",
      description: "Your avatar is being downloaded",
    });
    
    // In a real app, this would trigger a file download
    // For this demo, we'll just simulate the download experience
    setTimeout(() => {
      toast({
        title: "Download complete",
        description: "Avatar saved successfully",
      });
    }, 1500);
  };

  const handleBack = () => {
    navigate('/generator');
  };

  if (isLoading || !avatar) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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
                <img 
                  src={avatar.imageUrl} 
                  alt={avatar.prompt}
                  className="w-full aspect-square object-cover"
                />
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
