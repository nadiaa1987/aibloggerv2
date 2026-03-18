import axios from 'axios';

const POLLINATIONS_API_URL = 'https://gen.pollinations.ai/v1/chat/completions';
const IMAGE_API_URL = 'https://gen.pollinations.ai/image/';

export const generateText = async (prompt: string, systemPrompt?: string) => {
  try {
    const payload: any = {
      messages: [
        { role: 'system', content: systemPrompt || 'You are a helpful assistant.' },
        { role: 'user', content: prompt }
      ],
      model: 'openai', // Default GPT-4o
      seed: Math.floor(Math.random() * 1000000),
      // Ask for JSON if the system prompt mentions it
      response_format: systemPrompt?.toLowerCase().includes('json') ? { type: "json_object" } : undefined,
    };

    const headers: any = {
      'Content-Type': 'application/json'
    };

    if (process.env.NEXT_PUBLIC_POLLINATIONS_API_KEY) {
      headers['Authorization'] = `Bearer ${process.env.NEXT_PUBLIC_POLLINATIONS_API_KEY}`;
    }

    const response = await axios.post(POLLINATIONS_API_URL, payload, {
      headers: headers
    });

    // Handle both direct content or OpenAI format
    if (response.data.choices && response.data.choices[0].message) {
      return response.data.choices[0].message.content;
    }
    return response.data;
  } catch (error) {
    console.error('Error generating text with Pollinations:', error);
    throw error;
  }
};

export const generateImageUrl = (prompt: string, width = 1024, height = 768) => {
  const encodedPrompt = encodeURIComponent(prompt);
  let url = `${IMAGE_API_URL}${encodedPrompt}?width=${width}&height=${height}&seed=${Math.floor(Math.random() * 1000000)}&nologo=true&model=flux`;
  
  if (process.env.NEXT_PUBLIC_POLLINATIONS_API_KEY) {
    url += `&key=${process.env.NEXT_PUBLIC_POLLINATIONS_API_KEY}`;
  }
  
  return url;
};
