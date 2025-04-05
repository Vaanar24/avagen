
import { toast } from '@/components/ui/use-toast';

interface Avatar {
  id: string;
  userId: number;
  prompt: string;
  imageUrl: string;
  timestamp: string;
  generationTime: number;
}

interface GenerateParams {
  prompt: string;
  userId: number;
}

const PLACEHOLDER_IMAGES = [
  'https://via.placeholder.com/512x512/8B5CF6/FFFFFF?text=AI+Avatar+1',
  'https://via.placeholder.com/512x512/6366F1/FFFFFF?text=AI+Avatar+2',
  'https://via.placeholder.com/512x512/3B82F6/FFFFFF?text=AI+Avatar+3',
  'https://via.placeholder.com/512x512/06B6D4/FFFFFF?text=AI+Avatar+4',
  'https://via.placeholder.com/512x512/8B5CF6/FFFFFF?text=AI+Avatar+5',
];

// In a real app, this would connect to an actual AI service
export const generateAvatar = async ({ prompt, userId }: GenerateParams): Promise<Avatar> => {
  try {
    // Simulate API call delay
    const startTime = new Date().getTime();
    
    // Simulate processing time (2-4 seconds)
    const processingTime = 2000 + Math.random() * 2000;
    await new Promise(resolve => setTimeout(resolve, processingTime));
    
    const endTime = new Date().getTime();
    const generationTime = (endTime - startTime) / 1000;
    
    // Randomly select a placeholder image
    const randomIndex = Math.floor(Math.random() * PLACEHOLDER_IMAGES.length);
    const imageUrl = PLACEHOLDER_IMAGES[randomIndex];
    
    // Create a new avatar object
    const newAvatar: Avatar = {
      id: `img_${Date.now()}`,
      userId,
      prompt,
      imageUrl,
      timestamp: new Date().toISOString(),
      generationTime,
    };
    
    // Store in localStorage for persistence
    const existingAvatars = JSON.parse(localStorage.getItem('generatedAvatars') || '[]');
    existingAvatars.push(newAvatar);
    localStorage.setItem('generatedAvatars', JSON.stringify(existingAvatars));
    
    return newAvatar;
  } catch (error) {
    console.error('Avatar generation error:', error);
    toast({
      title: "Generation failed",
      description: "Failed to generate avatar. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
};

export const getAvatar = (avatarId: string): Avatar | undefined => {
  try {
    const avatars = JSON.parse(localStorage.getItem('generatedAvatars') || '[]');
    return avatars.find((avatar: Avatar) => avatar.id === avatarId);
  } catch (error) {
    console.error('Error fetching avatar:', error);
    return undefined;
  }
};

export const getUserAvatars = (userId: number): Avatar[] => {
  try {
    const avatars = JSON.parse(localStorage.getItem('generatedAvatars') || '[]');
    return avatars
      .filter((avatar: Avatar) => avatar.userId === userId)
      .sort((a: Avatar, b: Avatar) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
  } catch (error) {
    console.error('Error fetching user avatars:', error);
    return [];
  }
};
