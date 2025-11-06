
import React, { useState } from 'react';
import { Clip } from '../types';

interface ClipCardProps {
  clip: Clip;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const ClipCard: React.FC<ClipCardProps> = ({ clip }) => {
  const [captionLang, setCaptionLang] = useState<'english' | 'arabic'>('english');

  return (
    <div className="bg-gray-800/60 border border-gray-700 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:border-purple-500 hover:shadow-purple-500/10">
      <div className="p-5">
        <h3 className="text-xl font-bold text-purple-300">{clip.title}</h3>
        <p className="text-sm text-gray-400 mt-1 font-mono">
          {formatTime(clip.clip_start)} - {formatTime(clip.clip_end)}
        </p>

        <div className="mt-4">
          <div className="flex border-b border-gray-600">
            <button 
              onClick={() => setCaptionLang('english')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${captionLang === 'english' ? 'text-white bg-gray-700/50' : 'text-gray-400 hover:bg-gray-700/30'}`}
            >
              English
            </button>
            <button 
              onClick={() => setCaptionLang('arabic')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${captionLang === 'arabic' ? 'text-white bg-gray-700/50' : 'text-gray-400 hover:bg-gray-700/30'}`}
            >
              Arabic
            </button>
          </div>
          <p 
            className="mt-3 p-3 bg-gray-900/50 rounded-b-lg text-gray-300 text-sm whitespace-pre-wrap" 
            dir={captionLang === 'arabic' ? 'rtl' : 'ltr'}
          >
            {clip.captions[captionLang]}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {clip.hashtags.map((tag, index) => (
            <span key={index} className="px-2.5 py-1 bg-gray-700 text-purple-300 text-xs font-semibold rounded-full">
              {tag.startsWith('#') ? tag : `#${tag}`}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClipCard;
