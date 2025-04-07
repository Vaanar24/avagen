
// This file contains utilities for getting example avatars for the landing page

// Sample of AI-generated avatars
const exampleAvatars = [
  { 
    id: 'example1', 
    imageUrl: '/placeholder.svg', 
    prompt: 'a professional profile picture of a person with short hair and glasses'
  },
  { 
    id: 'example2', 
    imageUrl: '/placeholder.svg', 
    prompt: 'cyberpunk character with neon lights and futuristic background'
  },
  { 
    id: 'example3', 
    imageUrl: '/placeholder.svg', 
    prompt: 'fantasy elf character with long hair and pointed ears'
  },
  { 
    id: 'example4', 
    imageUrl: '/placeholder.svg', 
    prompt: 'steampunk portrait with goggles and victorian clothing'
  },
  { 
    id: 'example5', 
    imageUrl: '/placeholder.svg', 
    prompt: 'sci-fi astronaut with helmet reflecting space'
  },
  { 
    id: 'example6', 
    imageUrl: '/placeholder.svg', 
    prompt: 'minimalist portrait with abstract geometric background'
  },
  { 
    id: 'example7', 
    imageUrl: '/placeholder.svg', 
    prompt: 'watercolor style portrait with bright colors'
  },
  { 
    id: 'example8', 
    imageUrl: '/placeholder.svg', 
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
  
  return selected;
};
