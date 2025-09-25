
import React from 'react';
import { InputMode } from '../types';
import { ShieldCheckIcon, CameraIcon, ScreenRecordIcon, UploadIcon } from './Icons';

interface WelcomeScreenProps {
  onModeSelect: (mode: InputMode) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onModeSelect }) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-blue-500/20 text-center flex flex-col items-center animate-fade-in">
      <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center border-2 border-blue-500/30 mb-6">
        <ShieldCheckIcon className="w-10 h-10 text-blue-400" />
      </div>
      <h1 className="text-3xl font-bold text-white mb-2">Aura Authenticator</h1>
      <p className="text-slate-300 mb-8">Choose your verification method.</p>
      
      <div className="space-y-4 w-full">
        <button
          onClick={() => onModeSelect(InputMode.CAMERA)}
          className="w-full flex items-center text-left p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50 shadow-lg border border-slate-600"
        >
          <CameraIcon className="w-8 h-8 mr-4 text-cyan-300" />
          <div>
            <span className="font-bold text-white">Use Camera</span>
            <p className="text-sm text-slate-400">Perform the liveness check live.</p>
          </div>
        </button>
        <button
          onClick={() => onModeSelect(InputMode.SCREEN)}
          className="w-full flex items-center text-left p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50 shadow-lg border border-slate-600"
        >
          <ScreenRecordIcon className="w-8 h-8 mr-4 text-cyan-300" />
          <div>
            <span className="font-bold text-white">Record Screen</span>
            <p className="text-sm text-slate-400">Verify from a meeting or video call.</p>
          </div>
        </button>
        <button
          onClick={() => onModeSelect(InputMode.UPLOAD)}
          className="w-full flex items-center text-left p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50 shadow-lg border border-slate-600"
        >
          <UploadIcon className="w-8 h-8 mr-4 text-cyan-300" />
          <div>
            <span className="font-bold text-white">Upload Video</span>
            <p className="text-sm text-slate-400">Use a pre-existing video file.</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
