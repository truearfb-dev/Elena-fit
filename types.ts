export interface AnalysisResult {
  exerciseName: string;
  score: number;
  goodPoints: string[];
  mistakes: string[];
  recommendations: string[];
  muscleGroups: string[];
  safetyLevel: 'Safe' | 'Caution' | 'Dangerous';
}

export interface AppState {
  file: File | null;
  videoUrl: string | null;
  isAnalyzing: boolean;
  result: AnalysisResult | null;
  error: string | null;
}

export enum UploadStatus {
  IDLE,
  UPLOADING,
  ANALYZING,
  SUCCESS,
  ERROR
}