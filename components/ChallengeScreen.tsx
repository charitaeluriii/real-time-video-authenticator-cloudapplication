import React from 'react';
import { CameraIcon } from './Icons';

interface ChallengeScreenProps {
  challenge: string;
  onProceed: () => void;
}

const ChallengeScreen: React.FC<ChallengeScreenProps> = ({ challenge, onProceed }) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-blue-500/20 text-center animate-fade-in">
      <h2 className="text-lg font-semibold text-slate-300 mb-4">Liveness Challenge</h2>
      <div className="bg-slate-900/50 p-6 rounded-lg mb-8 border border-slate-700">
        <p className="text-2xl font-bold text-cyan-300">"{challenge}"</p>
      </div>
      <p className="text-slate-400 mb-6">Please prepare to capture a short video of yourself performing this action.</p>
      <button
        onClick={onProceed}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50 shadow-lg"
      >
        <CameraIcon className="w-6 h-6" />
        I'm Ready
      </button>
    </div>
  );
};

export default ChallengeScreen;