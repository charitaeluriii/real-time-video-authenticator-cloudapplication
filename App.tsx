import React, { useState, useCallback, useEffect } from 'react';
import { AppStep, VerificationResult, InputMode } from './types';
import { CAMERA_CHALLENGES } from './constants';
import WelcomeScreen from './components/WelcomeScreen';
import ChallengeScreen from './components/ChallengeScreen';
import RecordingScreen from './components/RecordingScreen';
import UploadScreen from './components/UploadScreen';
import VerifyingScreen from './components/VerifyingScreen';
import ResultScreen from './components/ResultScreen';
import { verifyAction } from './services/geminiService';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.WELCOME);
  const [challenge, setChallenge] = useState<string>('');
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<InputMode | null>(null);

  const handleModeSelect = useCallback((mode: InputMode) => {
    setInputMode(mode);
    setChallenge(''); // Reset challenge
    if (mode === InputMode.CAMERA) {
      const randomIndex = Math.floor(Math.random() * CAMERA_CHALLENGES.length);
      setChallenge(CAMERA_CHALLENGES[randomIndex]);
      setStep(AppStep.CHALLENGE);
    } else if (mode === InputMode.SCREEN) {
      setStep(AppStep.RECORDING);
    } else if (mode === InputMode.UPLOAD) {
      setStep(AppStep.UPLOAD);
    }
  }, []);

  const handleRecordingComplete = useCallback((blob: Blob) => {
    setVideoBlob(blob);
    setStep(AppStep.VERIFYING);
  }, []);
  
  const handleVerification = useCallback(async () => {
    if (!videoBlob) return;

    try {
      setError(null);
      const reader = new FileReader();
      reader.readAsDataURL(videoBlob);
      reader.onloadend = async () => {
        const base64data = (reader.result as string).split(',')[1];
        const verificationChallenge = inputMode === InputMode.CAMERA ? challenge : null;
        const verificationResult = await verifyAction(base64data, videoBlob.type, verificationChallenge);
        setResult(verificationResult);
        setStep(AppStep.RESULT);
      };
    } catch (err) {
      console.error(err);
      setError('An error occurred during verification. Please try again.');
      setResult({ success: false, feedback: 'A technical error occurred.', livenessScore: 0 });
      setStep(AppStep.RESULT);
    } finally {
        setVideoBlob(null);
    }
  }, [videoBlob, challenge, inputMode]);

  useEffect(() => {
    if (step === AppStep.VERIFYING) {
      handleVerification();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, handleVerification]);

  const handleRetry = useCallback(() => {
    setStep(AppStep.WELCOME);
    setChallenge('');
    setVideoBlob(null);
    setResult(null);
    setError(null);
    setInputMode(null);
  }, []);

  const renderStep = () => {
    switch (step) {
      case AppStep.WELCOME:
        return <WelcomeScreen onModeSelect={handleModeSelect} />;
      case AppStep.CHALLENGE:
        return <ChallengeScreen challenge={challenge} onProceed={() => setStep(AppStep.RECORDING)} />;
      case AppStep.RECORDING:
        if (inputMode === InputMode.CAMERA || inputMode === InputMode.SCREEN) {
            return <RecordingScreen mode={inputMode} onRecordingComplete={handleRecordingComplete} onCancel={handleRetry}/>;
        }
        return <WelcomeScreen onModeSelect={handleModeSelect} />;
      case AppStep.UPLOAD:
        return <UploadScreen onUploadComplete={handleRecordingComplete} onCancel={handleRetry} />;
      case AppStep.VERIFYING:
        return <VerifyingScreen />;
      case AppStep.RESULT:
        return result && <ResultScreen result={result} error={error} onRetry={handleRetry} />;
      default:
        return <WelcomeScreen onModeSelect={handleModeSelect} />;
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 to-slate-800 font-sans">
      <main className="w-full max-w-md mx-auto">
        {renderStep()}
      </main>
    </div>
  );
};

export default App;