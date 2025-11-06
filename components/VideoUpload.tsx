import React, { useRef, useState } from 'react';
import { VideoIcon } from './icons/VideoIcon';

interface VideoUploadProps {
  onVideoSourceChange: (source: File | string | null) => void;
  onAnalyze: (style: string) => void;
  isAnalyzing: boolean;
  selectedSource: File | string | null;
}

const CLIP_STYLES = ['Cooking', 'Product Review', 'Interview', 'Funny Moments'];

const VideoUpload: React.FC<VideoUploadProps> = ({ onVideoSourceChange, onAnalyze, isAnalyzing, selectedSource }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedStyle, setSelectedStyle] = useState(CLIP_STYLES[0]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onVideoSourceChange(file);
    }
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;
    onVideoSourceChange(url || null);
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const isUrlMode = typeof selectedSource === 'string' && selectedSource !== '';
  const isFileMode = selectedSource instanceof File;

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 shadow-lg">
      <div className="flex flex-col items-center space-y-4">
        
        <div className="w-full space-y-4">
            <div>
                <label htmlFor="video-url" className="block text-sm font-medium text-gray-300 mb-2 text-center">
                    Video URL or Upload
                </label>
                <input
                    id="video-url"
                    type="text"
                    onChange={handleUrlChange}
                    value={isUrlMode ? selectedSource : ''}
                    disabled={isFileMode || isAnalyzing}
                    placeholder="Paste a video link here..."
                    className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 text-gray-200 placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500 transition disabled:opacity-50"
                    aria-describedby="video-source-description"
                />
            </div>

            <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-700" />
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-gray-800 px-2 text-gray-400 text-sm">OR</span>
                </div>
            </div>

            <div>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="video/mp4,video/webm,video/mov"
                    disabled={isUrlMode || isAnalyzing}
                />
                <button
                    onClick={handleUploadClick}
                    disabled={isUrlMode || isAnalyzing}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                >
                    <VideoIcon className="w-6 h-6" />
                    {isFileMode ? 'Change Video File' : 'Upload a Video File'}
                </button>
            </div>
        </div>

        {isFileMode && (
          <p className="text-sm text-gray-400">
            Selected: <span className="font-medium text-gray-200">{selectedSource.name}</span>
          </p>
        )}
        
        <p id="video-source-description" className="text-xs text-gray-500 text-center max-w-md">
            Paste a YouTube video link or upload a video file (MP4, MOV, or WebM).
            <br/>
            <span className="font-semibold text-yellow-400/80">Note: URL processing is not yet implemented. Please upload a file.</span>
        </p>

        <div className="w-full pt-2">
           <label htmlFor="clip-style" className="block text-center text-sm font-medium text-gray-300 mb-2">
                Clip Style
            </label>
            <select
                id="clip-style"
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                disabled={isAnalyzing}
                className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 text-gray-200 focus:ring-purple-500 focus:border-purple-500 transition disabled:opacity-50 appearance-none text-center"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2.5rem',
                }}
            >
                {CLIP_STYLES.map((style) => (
                    <option key={style} value={style}>
                        {style}
                    </option>
                ))}
            </select>
        </div>

        <button
          onClick={() => onAnalyze(selectedStyle)}
          disabled={!selectedSource || isAnalyzing}
          className="w-full sm:w-auto mt-4 px-12 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 shadow-md disabled:shadow-none"
        >
          {isAnalyzing ? 'Analyzing...' : 'Generate Clips'}
        </button>
      </div>
    </div>
  );
};

export default VideoUpload;