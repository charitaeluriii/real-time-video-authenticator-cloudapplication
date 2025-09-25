import React from 'react';
import { VerificationResult } from '../types';
import { CheckCircleIcon, XCircleIcon, AlertTriangleIcon } from './Icons';

interface ResultScreenProps {
  result: VerificationResult;
  error: string | null;
  onRetry: () => void;
}

const LivenessScoreDisplay: React.FC<{ score: number }> = ({ score }) => {
    const percentage = Math.round(score * 100);
    const circumference = 2 * Math.PI * 45; // 2 * pi * r
    const offset = circumference - (percentage / 100) * circumference;

    let colorClass = 'text-green-400';
    let ringColorClass = 'stroke-green-500';
    let confidenceText = 'High Confidence';
    let alert = false;

    if (percentage < 75) {
        colorClass = 'text-yellow-400';
        ringColorClass = 'stroke-yellow-500';
        confidenceText = 'Medium Confidence';
        alert = true;
    }
    if (percentage < 40) {
        colorClass = 'text-red-400';
        ringColorClass = 'stroke-red-500';
        confidenceText = 'Low Confidence';
    }

    return (
        <div className="my-6 flex flex-col items-center">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Liveness Confidence</h3>
            <div className="relative w-28 h-28">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                        className="stroke-slate-700"
                        strokeWidth="10"
                        cx="50"
                        cy="50"
                        r="45"
                        fill="transparent"
                    />
                    {/* Progress circle */}
                    <circle
                        className={`${ringColorClass} transition-all duration-1000 ease-out`}
                        strokeWidth="10"
                        strokeLinecap="round"
                        cx="50"
                        cy="50"
                        r="45"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        transform="rotate(-90 50 50)"
                    />
                </svg>
                <div className={`absolute inset-0 flex flex-col items-center justify-center ${colorClass}`}>
                    <span className="text-3xl font-bold">{percentage}</span>
                </div>
            </div>
            <div className={`mt-3 flex items-center gap-2 ${colorClass}`}>
                {alert && <AlertTriangleIcon className="w-5 h-5" />}
                <p className="font-semibold">{confidenceText}</p>
            </div>
        </div>
    );
};


const ResultScreen: React.FC<ResultScreenProps> = ({ result, error, onRetry }) => {
  const isSuccess = result.success && !error;

  return (
    <div className={`bg-slate-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-2xl border ${isSuccess ? 'border-green-500/30' : 'border-red-500/30'} text-center flex flex-col items-center animate-fade-in`}>
      <div className={`w-20 h-20 rounded-full flex items-center justify-center border-2 mb-4 ${isSuccess ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
        {isSuccess ? (
          <CheckCircleIcon className="w-12 h-12 text-green-400" />
        ) : (
          <XCircleIcon className="w-12 h-12 text-red-400" />
        )}
      </div>
      <h2 className={`text-3xl font-bold mb-2 ${isSuccess ? 'text-green-300' : 'text-red-300'}`}>
        {isSuccess ? 'Verification Successful' : 'Verification Failed'}
      </h2>
      <div className="bg-slate-900/50 w-full p-4 rounded-lg my-2 border border-slate-700 min-h-[60px]">
        <p className="text-slate-300">
            {error ? error : result.feedback}
        </p>
      </div>

      <LivenessScoreDisplay score={result.livenessScore} />
      
      <button
        onClick={onRetry}
        className="w-full bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-slate-500/50 shadow-lg"
      >
        Try Again
      </button>
    </div>
  );
};

export default ResultScreen;
