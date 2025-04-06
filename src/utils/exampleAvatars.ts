
// Collection of pre-generated avatars to display on the index page
// These will be randomly selected and displayed

export interface ExampleAvatar {
  id: string;
  imageUrl: string;
  prompt: string;
}

// Array of example avatars pre-generated from the model
export const exampleAvatars: ExampleAvatar[] = [
  {
    id: "example1",
    imageUrl: "https://storage.googleapis.com/pai-images/ae74b3002bfe4b538493ca7aedb6a300.jpeg",
    prompt: "Cyberpunk female character with neon blue hair and glowing facial implants"
  },
  {
    id: "example2",
    imageUrl: "https://storage.googleapis.com/pai-images/4c7db9edc1ee4d11b3074f9e0c49eebf.jpeg", 
    prompt: "Fantasy warrior with ornate armor and glowing runes"
  },
  {
    id: "example3",
    imageUrl: "https://storage.googleapis.com/pai-images/eab973d63161487c98c278d52bfb47a0.jpeg",
    prompt: "Ethereal elf with flowing white hair and nature elements"
  },
  {
    id: "example4",
    imageUrl: "https://storage.googleapis.com/pai-images/533122b8fe69471e99b339369728a629.jpeg",
    prompt: "Steampunk engineer with brass goggles and mechanical arm"
  },
  {
    id: "example5",
    imageUrl: "https://storage.googleapis.com/pai-images/3c31a5eabc884dd1a582cb888fdd9af9.jpeg",
    prompt: "Futuristic astronaut with holographic visor and space background"
  },
  {
    id: "example6",
    imageUrl: "https://storage.googleapis.com/pai-images/bab9991425584ba883a3b009be4e50b1.jpeg",
    prompt: "Post-apocalyptic survivor with weathered gear and tribal markings"
  },
  {
    id: "example7",
    imageUrl: "https://storage.googleapis.com/pai-images/9f4270ca977a488a9df4c222e4324d57.jpeg",
    prompt: "Mystic oracle with glowing eyes and cosmic patterns"
  },
  {
    id: "example8",
    imageUrl: "https://storage.googleapis.com/pai-images/b7c7e283e4684192a5199a11ed9dcf1d.jpeg",
    prompt: "Neo-samurai with energy blade and modern tech armor"
  },
  {
    id: "example9",
    imageUrl: "https://storage.googleapis.com/pai-images/98548921f95f445c829bcad1d0ea3c6a.jpeg",
    prompt: "Digital nomad with augmented reality glasses and tech implants"
  },
  {
    id: "example10",
    imageUrl: "https://storage.googleapis.com/pai-images/46a633290ec24b3ea739aeda679ff876.jpeg",
    prompt: "Arctic explorer with thermal suit and ice-blue eyes"
  },
  {
    id: "example11",
    imageUrl: "https://storage.googleapis.com/pai-images/37409d1880864d40beff9765e0bb3006.jpeg",
    prompt: "Desert nomad with sand-resistant gear and ritual face paint"
  },
  {
    id: "example12",
    imageUrl: "https://storage.googleapis.com/pai-images/5d4fc8fa25f5413a83b04c11a52378bb.jpeg",
    prompt: "Retro-futuristic robot pilot with vintage helmet design"
  },
  {
    id: "example13",
    imageUrl: "https://storage.googleapis.com/pai-images/8f4485dce60c4e27ac6a327673daccb3.jpeg",
    prompt: "Underwater explorer with bioluminescent features and gill implants"
  },
  {
    id: "example14",
    imageUrl: "https://storage.googleapis.com/pai-images/6daf97779878424ebf709ab74c80aaa7.jpeg",
    prompt: "Neon punk DJ with sound-reactive holographic hair"
  },
  {
    id: "example15",
    imageUrl: "https://storage.googleapis.com/pai-images/f8b548c3d055484a808113c1c9556773.jpeg",
    prompt: "Celestial being with star-speckled skin and cosmic aura"
  },
  {
    id: "example16",
    imageUrl: "https://storage.googleapis.com/pai-images/e3a67a2c4f7f454f8a9081091aeb32f0.jpeg",
    prompt: "Bio-tech engineer with plant-integrated cybernetics"
  },
  {
    id: "example17",
    imageUrl: "https://storage.googleapis.com/pai-images/fd8d1fd5dd4a45ef90b014068744f567.jpeg",
    prompt: "Chrome-plated android with minimalist geometric design"
  },
  {
    id: "example18",
    imageUrl: "https://storage.googleapis.com/pai-images/fa2c21c7ed294d3fb7a13e077b56eebc.jpeg",
    prompt: "Modern ninja with urban camouflage and tech-enhanced weapons"
  },
  {
    id: "example19",
    imageUrl: "https://storage.googleapis.com/pai-images/9388597a60634158832e858a0d91ae5c.jpeg",
    prompt: "Time traveler with era-mixing fashion elements and chronometer gadgets"
  },
  {
    id: "example20",
    imageUrl: "https://storage.googleapis.com/pai-images/a6fbc2f3b39444d3908e94bb3625836c.jpeg",
    prompt: "Virtual reality gamer with full-body haptic suit and neon accents"
  },
];

/**
 * Get a specified number of random example avatars
 * @param count Number of avatars to return
 * @returns Array of randomly selected example avatars
 */
export function getRandomExampleAvatars(count: number = 4): ExampleAvatar[] {
  // Create a copy of the array to avoid modifying the original
  const shuffled = [...exampleAvatars];
  
  // Fisher-Yates shuffle algorithm
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  // Return the first 'count' elements
  return shuffled.slice(0, count);
}
