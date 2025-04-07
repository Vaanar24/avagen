
// This file contains utilities for getting example avatars for the landing page

// Sample of AI-generated avatars
const exampleAvatars = [
  { 
    id: 'example1', 
    imageUrl: 'https://via.placeholder.com/512x512/8B5CF6/FFFFFF?text=AI+Avatar+1', 
    prompt: 'a professional profile picture of a person with short hair and glasses'
  },
  { 
    id: 'example2', 
    imageUrl: 'https://via.placeholder.com/512x512/6366F1/FFFFFF?text=AI+Avatar+2', 
    prompt: 'cyberpunk character with neon lights and futuristic background'
  },
  { 
    id: 'example3', 
    imageUrl: 'https://via.placeholder.com/512x512/3B82F6/FFFFFF?text=AI+Avatar+3', 
    prompt: 'fantasy elf character with long hair and pointed ears'
  },
  { 
    id: 'example4', 
    imageUrl: 'https://via.placeholder.com/512x512/06B6D4/FFFFFF?text=AI+Avatar+4', 
    prompt: 'steampunk portrait with goggles and victorian clothing'
  },
  { 
    id: 'example5', 
    imageUrl: 'https://via.placeholder.com/512x512/8B5CF6/FFFFFF?text=AI+Avatar+5', 
    prompt: 'sci-fi astronaut with helmet reflecting space'
  },
  { 
    id: 'example6', 
    imageUrl: 'https://via.placeholder.com/512x512/6366F1/FFFFFF?text=AI+Avatar+6', 
    prompt: 'minimalist portrait with abstract geometric background'
  },
  { 
    id: 'example7', 
    imageUrl: 'https://via.placeholder.com/512x512/3B82F6/FFFFFF?text=AI+Avatar+7', 
    prompt: 'watercolor style portrait with bright colors'
  },
  { 
    id: 'example8', 
    imageUrl: 'https://via.placeholder.com/512x512/06B6D4/FFFFFF?text=AI+Avatar+8', 
    prompt: 'vintage photograph style portrait with sepia tones'
  },
];

/**
 * Get a number of random example avatars
 * @param count Number of avatars to return
 * @returns Array of avatar objects
 */
export const getRandomExampleAvatars = (count: number) => {
  // Shuffle the array and take the first 'count' items
  const shuffled = [...exampleAvatars].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count);
  
  // Add 'animated' to each prompt
  return selected.map(avatar => ({
    ...avatar,
    prompt: `${avatar.prompt}, animated`
  }));
};
