
import React, { useState, useCallback } from 'react';
import { Clip } from './types';
import { analyzeVideoForClips } from './services/geminiService';
import Header from './components/Header';
import VideoUpload from './components/VideoUpload';
import Loader from './components/Loader';
import ClipResults from './components/ClipResults';

const App: React.FC = () => {
  const [videoSource, setVideoSource] = useState<File | string | null>(null);
  const [clips, setClips] = useState<Clip[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleVideoSourceChange = (source: File | string | null) => {
    setVideoSource(source);
    setClips(null);
    setError(null);
  };

  const handleAnalyzeClick = useCallback(async (style: string) => {
    if (!videoSource) {
      setError("Please provide a video URL or upload a file.");
      return;
    }

    if (typeof videoSource === 'string') {
        setError("Processing video URLs is not yet supported. Please upload a video file to proceed.");
        return;
    }

    setIsLoading(true);
    setError(null);
    setClips(null);

    try {
      const result = await analyzeVideoForClips(videoSource, style);
      setClips(result);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [videoSource]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        <main className="mt-8">
          <VideoUpload
            onVideoSourceChange={handleVideoSourceChange}
            onAnalyze={handleAnalyzeClick}
            isAnalyzing={isLoading}
            selectedSource={videoSource}
          />

          {isLoading && <Loader />}

          {error && (
            <div className="mt-8 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}

          {clips && clips.length > 0 && <ClipResults clips={clips} />}

          {clips && clips.length === 0 && !isLoading && (
             <div className="mt-8 bg-gray-800/50 border border-gray-700 text-gray-400 px-4 py-3 rounded-lg text-center">
              <p className="font-bold">No Clips Found</p>
              <p>The AI could not identify any distinct moments to clip from this video.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
