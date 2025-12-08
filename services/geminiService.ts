import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

// Maximum file size in bytes (e.g., 20MB to be safe for base64 inline)
const MAX_FILE_SIZE = 20 * 1024 * 1024;

export const validateFile = (file: File): string | null => {
  if (!file.type.startsWith('video/')) {
    return 'Пожалуйста, загрузите видеофайл.';
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'Размер файла слишком велик. Пожалуйста, используйте видео размером менее 20 МБ.';
  }
  return null;
};

const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:video/mp4;base64,")
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    exerciseName: { type: Type.STRING, description: "Название упражнения на русском языке" },
    score: { type: Type.INTEGER, description: "Оценка техники от 1 до 10" },
    goodPoints: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING }, 
      description: "Что выполнено правильно" 
    },
    mistakes: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING }, 
      description: "Ошибки в технике" 
    },
    recommendations: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING }, 
      description: "Конкретные советы по улучшению" 
    },
    muscleGroups: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING }, 
      description: "Задействованные мышечные группы" 
    },
    safetyLevel: {
      type: Type.STRING,
      enum: ['Safe', 'Caution', 'Dangerous'],
      description: "Уровень безопасности выполнения"
    }
  },
  required: ["exerciseName", "score", "goodPoints", "mistakes", "recommendations", "muscleGroups", "safetyLevel"]
};

export const analyzeVideo = async (file: File): Promise<AnalysisResult> => {
  try {
    if (!process.env.API_KEY) {
      throw new Error("API Key is missing");
    }

    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    const videoPart = await fileToGenerativePart(file);

    const prompt = `
      Проанализируй это видео с выполнением фитнес-упражнения.
      Действуй как профессиональный тренер по фитнесу и биомеханике.
      Твоя задача:
      1. Определить упражнение.
      2. Оценить технику выполнения по 10-балльной шкале.
      3. Отметить плюсы (что сделано хорошо).
      4. Выявить ошибки (если есть).
      5. Дать четкие рекомендации по исправлению.
      6. Указать работающие мышцы.
      7. Оценить безопасность (Safe, Caution, Dangerous).
      
      Отвечай на РУССКОМ языке.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [videoPart, { text: prompt }]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response from AI");
    }

    return JSON.parse(resultText) as AnalysisResult;

  } catch (error) {
    console.error("Analysis Error:", error);
    throw new Error(error instanceof Error ? error.message : "Не удалось проанализировать видео. Попробуйте еще раз.");
  }
};
