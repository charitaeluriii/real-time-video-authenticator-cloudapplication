
import React, { useState, useEffect } from 'react';
import { SpinnerIcon } from './Icons';

const MESSAGES = [
  "Analyzing your aura...",
  "Calibrating liveness detectors...",
  "Cross-referencing biometric data...",
  "Engaging AI verification core...",
  "Finalizing authenticity check..."
];

const VerifyingScreen: React.FC = () => {
    const [message, setMessage] = useState(MESSAGES[0]);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessage(prevMessage => {
                const currentIndex = MESSAGES.indexOf(prevMessage);
                const nextIndex = (currentIndex + 1) % MESSAGES.length;
                return MESSAGES[nextIndex];
            });
        }, 2000);

        return () => clearInterval(interval);
    }, []);

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-blue-500/20 text-center flex flex-col items-center animate-fade-in">
        <SpinnerIcon className="w-16 h-16 text-blue-400 animate-spin mb-6" />
        <h2 className="text-2xl font-bold text-white mb-2">Verifying</h2>
        <p className="text-slate-300 transition-opacity duration-500">{message}</p>
    </div>
  );
};

export default VerifyingScreen;
