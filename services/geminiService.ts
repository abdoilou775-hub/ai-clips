import { GoogleGenAI, Type } from "@google/genai";
import { Clip } from '../types';

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      clip_start: {
        type: Type.NUMBER,
        description: "The start time of the clip in seconds.",
      },
      clip_end: {
        type: Type.NUMBER,
        description: "The end time of the clip in seconds.",
      },
      captions: {
        type: Type.OBJECT,
        properties: {
          english: {
            type: Type.STRING,
            description: "The generated English caption for the clip.",
          },
          arabic: {
            type: Type.STRING,
            description: "The generated Arabic caption for the clip.",
          },
        },
        required: ["english", "arabic"],
      },
      title: {
        type: Type.STRING,
        description: "A catchy, viral-ready title for the clip.",
      },
      hashtags: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING,
        },
        description: "An array of relevant hashtags.",
      },
    },
    required: ["clip_start", "clip_end", "captions", "title", "hashtags"],
  },
};


export const analyzeVideoForClips = async (videoFile: File, clipStyle: string): Promise<Clip[]> => {
  if (!process.env.API_KEY) {
    throw new Error("API key is missing. Please set the API_KEY environment variable.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const videoPart = await fileToGenerativePart(videoFile);
  
  const userPrompt = `Input Video: ${videoFile.name}
Clip Style: ${clipStyle}

You are SmartClip, an AI video assistant that analyzes ${videoFile.name} and creates short, viral-ready clips.
Follow these rules:
1. Detect engaging highlights between 15–45 seconds.
2. For Cooking style → prioritize close-up shots of food and hands.
3. For Product Review → focus on product showcases and emotional reactions.
4. For Interview → highlight key statements and emotional moments.
5. For Funny Moments → highlight laughter, jokes, and unexpected funny situations.
6. Generate captions in English and Arabic.
Return results as JSON with: clip_start, clip_end, title, captions, hashtags.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-pro',
    contents: [{ parts: [
        {text: userPrompt},
        videoPart
    ]}],
    config: {
        thinkingConfig: { thinkingBudget: 32768 },
        responseMimeType: "application/json",
        responseSchema: schema,
    }
  });

  const jsonText = response.text.trim();
  try {
    const clips: Clip[] = JSON.parse(jsonText);
    return clips;
  } catch (e) {
    console.error("Failed to parse JSON response:", jsonText);
    throw new Error("The AI returned an invalid format. Please try again.");
  }
};