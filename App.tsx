import React, { useState, useEffect } from 'react';
import { VideoUploader } from './components/VideoUploader';
import { AnalysisResultView } from './components/AnalysisResultView';
import { analyzeVideo } from './services/geminiService';
import { AnalysisResult } from './types';
import { Dumbbell, Loader2, Play, RefreshCw, AlertCircle } from 'lucide-react';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Cleanup object URL on unmount or file change
  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setVideoUrl(URL.createObjectURL(selectedFile));
    setResult(null);
    setError(null);
  };

  const handleAnalysis = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const analysisData = await analyzeVideo(file);
      setResult(analysisData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла непредвиденная ошибка");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetApp = () => {
    setFile(null);
    setVideoUrl(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-dark bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-dark to-dark text-slate-100 selection:bg-primary/30">
      
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-dark/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={resetApp}>
              <div className="bg-primary p-1.5 rounded-lg">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                FitAI Coach
              </span>
            </div>
            <div className="text-sm text-slate-400 hidden sm:block">
              Анализ техники с помощью Gemini 2.5
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Intro Section (only visible if no file selected) */}
        {!file && (
          <div className="text-center mb-12 animate-fadeIn">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Улучшите свою технику <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-300">
                с искусственным интеллектом
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-slate-400 mb-8">
              Загрузите видео своего упражнения, и наш ИИ-тренер проанализирует вашу форму, найдет ошибки и даст персональные рекомендации за считанные секунды.
            </p>
          </div>
        )}

        {/* Upload Section */}
        {!file && (
          <div className="animate-slideUp">
             <VideoUploader onFileSelect={handleFileSelect} isLoading={false} />
          </div>
        )}

        {/* Video Preview & Actions */}
        {file && videoUrl && !result && (
          <div className="max-w-4xl mx-auto animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {/* Video Player */}
              <div className="md:col-span-3 bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-700 relative group">
                <video 
                  src={videoUrl} 
                  controls 
                  className="w-full h-auto max-h-[500px] object-contain"
                />
                <button 
                  onClick={resetApp}
                  className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                  title="Удалить видео"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {/* Action Panel */}
              <div className="md:col-span-2 flex flex-col justify-center space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Видео готово</h3>
                  <p className="text-slate-400 text-sm">
                    Мы проанализируем биомеханику движения, углы суставов и темп выполнения.
                  </p>
                </div>

                {error && (
                   <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">{error}</div>
                  </div>
                )}

                <button
                  onClick={handleAnalysis}
                  disabled={isAnalyzing}
                  className={`
                    w-full py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-[0.98]
                    ${isAnalyzing 
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                      : 'bg-primary hover:bg-emerald-400 text-dark shadow-lg shadow-emerald-500/20'}
                  `}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Анализируем...
                    </>
                  ) : (
                    <>
                      <Play className="w-6 h-6 fill-current" />
                      Начать анализ
                    </>
                  )}
                </button>

                <button 
                  onClick={resetApp}
                  disabled={isAnalyzing}
                  className="text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors"
                >
                  Выбрать другое видео
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex justify-between items-center max-w-4xl mx-auto">
              <button 
                onClick={resetApp}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Новый анализ</span>
              </button>
            </div>
            
            <AnalysisResultView result={result} />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 mt-12 bg-dark">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© 2024 FitAI Coach. Powered by Google Gemini.</p>
          <p className="mt-2 text-xs text-slate-600">
            Внимание: ИИ может совершать ошибки. Всегда консультируйтесь с профессиональным тренером перед выполнением упражнений с большими весами.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;