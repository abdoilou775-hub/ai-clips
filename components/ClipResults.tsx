
import React from 'react';
import { Clip } from '../types';
import ClipCard from './ClipCard';

interface ClipResultsProps {
  clips: Clip[];
}

const ClipResults: React.FC<ClipResultsProps> = ({ clips }) => {
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">Generated Clips</h2>
      <div className="space-y-6">
        {clips.map((clip, index) => (
          <ClipCard key={index} clip={clip} />
        ))}
      </div>
    </div>
  );
};

export default ClipResults;
