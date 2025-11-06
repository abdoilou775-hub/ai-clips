
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        SmartClip
      </h1>
      <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-400">
        Upload a video, and our AI will analyze it to find the most engaging, viral-ready moments for you.
      </p>
    </header>
  );
};

export default Header;
