
import { toast } from '@/components/ui/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

interface Avatar {
  id: string;
  userId: string;
  prompt: string;
  imageUrl: string;
  timestamp: string;
  generationTime: number;
}

interface GenerateParams {
  prompt: string;
  userId: string;
}

const PLACEHOLDER_IMAGES = [
  'https://via.placeholder.com/512x512/8B5CF6/FFFFFF?text=AI+Avatar+1',
  'https://via.placeholder.com/512x512/6366F1/FFFFFF?text=AI+Avatar+2',
  'https://via.placeholder.com/512x512/3B82F6/FFFFFF?text=AI+Avatar+3',
  'https://via.placeholder.com/512x512/06B6D4/FFFFFF?text=AI+Avatar+4',
  'https://via.placeholder.com/512x512/8B5CF6/FFFFFF?text=AI+Avatar+5',
];

// Hugging Face API constants
const HF_API_URL = "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell";
const HF_TOKEN = "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";

export const generateAvatar = async ({ prompt, userId }: GenerateParams): Promise<Avatar> => {
  try {
    // Start timing the generation process
    const startTime = new Date().getTime();
    
    // Enhance prompt for better results
    const enhancedPrompt = `${prompt}, animated, high quality, detailed`;
    
    // Call Hugging Face API for real image generation
    let imageUrl = '';
    
    try {
      toast({
        title: "Generating avatar",
        description: "This may take a few moments...",
      });
      
      // Call the Hugging Face API
      const response = await fetch(HF_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: enhancedPrompt,
          parameters: {
            width: 1024,
            height: 1024,
            num_inference_steps: 4,
            guidance_scale: 7
          }
        }),
      });

      if (!response.ok) {
        console.error('HF API error:', response.status, response.statusText);
        throw new Error(`API call failed with status: ${response.status}`);
      }
      
      // The response is a binary blob (the image)
      const blob = await response.blob();
      imageUrl = URL.createObjectURL(blob);
      
    } catch (apiError) {
      console.error('Error calling HF API:', apiError);
      
      // Fallback to placeholder images if API fails
      const randomIndex = Math.floor(Math.random() * PLACEHOLDER_IMAGES.length);
      imageUrl = PLACEHOLDER_IMAGES[randomIndex];
      
      toast({
        title: "API error",
        description: "Using placeholder image instead. Please try again later.",
        variant: "destructive",
      });
    }
    
    const endTime = new Date().getTime();
    const generationTime = (endTime - startTime) / 1000;
    
    // Get the session to verify user is logged in
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData.session) {
      // If not logged in, use localStorage as fallback
      console.warn("User not authenticated, using localStorage fallback");
      
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
    }
    
    // User is authenticated, store in Supabase
    // Use type casting to help TypeScript understand the table structure
    const { data: insertedAvatar, error } = await supabase
      .from('avatars')
      .insert({
        prompt,
        image_url: imageUrl,
        generation_time: generationTime,
        user_id: userId
      })
      .select('*')
      .single();
    
    if (error) {
      console.error('Error storing avatar in Supabase:', error);
      throw error;
    }
    
    if (!insertedAvatar) {
      throw new Error('Failed to insert avatar: No data returned');
    }
    
    // Map the database object to our Avatar interface
    const newAvatar: Avatar = {
      id: insertedAvatar.id,
      userId: insertedAvatar.user_id,
      prompt: insertedAvatar.prompt,
      imageUrl: insertedAvatar.image_url,
      timestamp: insertedAvatar.timestamp,
      generationTime: insertedAvatar.generation_time,
    };
    
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

export const getAvatar = async (avatarId: string): Promise<Avatar | undefined> => {
  try {
    // Try from Supabase first
    const { data: avatarData, error } = await supabase
      .from('avatars')
      .select('*')
      .eq('id', avatarId)
      .single();
    
    if (error) {
      // If not found in Supabase, try localStorage
      const avatars = JSON.parse(localStorage.getItem('generatedAvatars') || '[]');
      const localAvatar = avatars.find((avatar: Avatar) => avatar.id === avatarId);
      
      if (localAvatar) return localAvatar;
      return undefined;
    }
    
    if (!avatarData) {
      return undefined;
    }
    
    // Map the database object to our Avatar interface
    return {
      id: avatarData.id,
      userId: avatarData.user_id,
      prompt: avatarData.prompt,
      imageUrl: avatarData.image_url,
      timestamp: avatarData.timestamp,
      generationTime: avatarData.generation_time,
    };
  } catch (error) {
    console.error('Error fetching avatar:', error);
    return undefined;
  }
};

export const getUserAvatars = async (userId: string): Promise<Avatar[]> => {
  try {
    // Try from Supabase first
    const { data: supabaseAvatars, error } = await supabase
      .from('avatars')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });
    
    if (error) {
      console.error('Error fetching from Supabase, falling back to localStorage:', error);
      // Fallback to localStorage
      const avatars = JSON.parse(localStorage.getItem('generatedAvatars') || '[]');
      return avatars
        .filter((avatar: Avatar) => avatar.userId === userId)
        .sort((a: Avatar, b: Avatar) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
    }
    
    if (!supabaseAvatars) {
      return [];
    }
    
    // Map the database objects to our Avatar interface
    return supabaseAvatars.map(avatar => ({
      id: avatar.id,
      userId: avatar.user_id,
      prompt: avatar.prompt,
      imageUrl: avatar.image_url,
      timestamp: avatar.timestamp,
      generationTime: avatar.generation_time,
    }));
  } catch (error) {
    console.error('Error fetching user avatars:', error);
    return [];
  }
};
