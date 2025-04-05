
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import Navbar from '@/components/NavBar';
import { generateAvatar, getUserAvatars } from '@/services/generatorService';
import { toast } from '@/components/ui/use-toast';

interface Avatar {
  id: string;
  userId: string;
  prompt: string;
  imageUrl: string;
  timestamp: string;
  generationTime: number;
}

const Generator = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [recentAvatars, setRecentAvatars] = useState<Avatar[]>([]);
  const [isLoadingAvatars, setIsLoadingAvatars] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserAvatars() {
      if (user) {
        setIsLoadingAvatars(true);
        try {
          const avatars = await getUserAvatars(user.id);
          setRecentAvatars(avatars.slice(0, 4));
        } catch (error) {
          console.error('Failed to load avatars:', error);
          toast({
            title: "Failed to load avatars",
            description: "There was a problem loading your recent avatars.",
            variant: "destructive",
          });
        } finally {
          setIsLoadingAvatars(false);
        }
      }
    }
    
    fetchUserAvatars();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!prompt.trim() || !user) return;
    
    setIsGenerating(true);
    toast({
      title: "Processing prompt",
      description: "Creating your custom avatar...",
    });
    
    try {
      const result = await generateAvatar({
        prompt: prompt.trim(),
        userId: user.id,
      });
      
      toast({
        title: "Avatar created",
        description: "Your new avatar is ready!",
      });
      
      // Update the recent avatars list with the new avatar
      setRecentAvatars(prev => [result, ...prev].slice(0, 4));
      
      navigate(`/result/${result.id}`);
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Generation failed",
        description: "There was a problem creating your avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-avatar-purple to-avatar-blue bg-clip-text text-transparent mb-2">
              Create Your Avatar
            </h1>
            <p className="text-lg text-muted-foreground">
              Describe your perfect avatar and our AI will bring it to life
            </p>
          </div>
          
          <Card className="glass border-0 overflow-hidden mb-12">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <Input
                    placeholder="E.g., A futuristic cyberpunk avatar with neon lights and silver hair"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="bg-white/50 backdrop-blur-sm rounded-lg pr-32 h-14 text-lg"
                    disabled={isGenerating}
                  />
                  <Button 
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 bg-gradient-to-r from-avatar-purple to-avatar-blue gap-2"
                    disabled={isGenerating || !prompt.trim()}
                  >
                    {isGenerating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                    {isGenerating ? 'Generating...' : 'Generate'}
                  </Button>
                </div>
                
                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-muted rounded-lg bg-white/30">
                  {isGenerating ? (
                    <div className="flex flex-col items-center">
                      <div className="relative w-32 h-32 mb-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-avatar-purple to-avatar-blue rounded-full opacity-20 animate-pulse"></div>
                        <div className="absolute inset-2 bg-gradient-to-r from-avatar-indigo to-avatar-cyan rounded-full opacity-40 animate-pulse delay-300"></div>
                        <div className="absolute inset-4 bg-gradient-to-r from-avatar-blue to-avatar-purple rounded-full opacity-60 animate-pulse delay-700"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Loader2 className="h-12 w-12 text-primary animate-spin" />
                        </div>
                      </div>
                      <p className="text-muted-foreground text-lg">Creating your avatar...</p>
                      <p className="text-sm text-muted-foreground mt-1">This may take up to 15 seconds</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground text-lg">Enter a prompt and click Generate</p>
                      <p className="text-sm text-muted-foreground mt-1">Be as descriptive as possible for best results</p>
                    </div>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
          
          {isLoadingAvatars ? (
            <div className="flex justify-center my-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : recentAvatars.length > 0 ? (
            <div className="mt-12">
              <h2 className="text-2xl font-semibold mb-6">Your Recent Avatars</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {recentAvatars.map((avatar) => (
                  <div 
                    key={avatar.id} 
                    className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                    onClick={() => navigate(`/result/${avatar.id}`)}
                  >
                    <img 
                      src={avatar.imageUrl} 
                      alt={avatar.prompt} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default Generator;
