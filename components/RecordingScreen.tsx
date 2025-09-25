
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { InputMode } from '../types';

interface RecordingScreenProps {
  mode: InputMode.CAMERA | InputMode.SCREEN;
  onRecordingComplete: (blob: Blob) => void;
  onCancel: () => void;
}

const RECORDING_DURATION_MS = 5000;

const RecordingScreen: React.FC<RecordingScreenProps> = ({ mode, onRecordingComplete, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const startRecording = useCallback(() => {
    if (mediaRecorderRef.current && streamRef.current) {
      const recordedChunks: Blob[] = [];
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.push(event.data);
        }
      };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        onRecordingComplete(blob);
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);

      setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
      }, RECORDING_DURATION_MS);
    }
  }, [onRecordingComplete]);

  const setupMedia = useCallback(async () => {
    try {
      const mediaStreamConstraints: MediaStreamConstraints = { video: true, audio: false };
      const stream = mode === InputMode.CAMERA 
        ? await navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
        : await navigator.mediaDevices.getDisplayMedia(mediaStreamConstraints);

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm' });
      startRecording();
    } catch (err) {
      console.error('Error accessing media:', err);
      const deviceName = mode === InputMode.CAMERA ? 'Camera' : 'Screen recording';
      setPermissionError(`${deviceName} access was denied. Please enable permissions in your browser settings and try again.`);
    }
  }, [startRecording, mode]);

  useEffect(() => {
    setupMedia();

    return () => {
      streamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, [setupMedia]);

  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const next = prev + (100 / (RECORDING_DURATION_MS / 100));
          return Math.min(next, 100);
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isRecording]);

  const title = mode === InputMode.CAMERA ? 'Recording...' : 'Screen Recording...';
  const instruction = mode === InputMode.CAMERA ? 'Stay centered and perform the action.' : 'Perform the action in your shared screen area.';
  const videoClassName = `w-full h-full object-cover ${mode === InputMode.CAMERA ? 'transform scale-x-[-1]' : ''}`;


  return (
    <div className="w-full max-w-md mx-auto bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-blue-500/20 text-center animate-fade-in">
      <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
      <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-900 mb-4 border-2 border-slate-700">
        <video ref={videoRef} autoPlay muted playsInline className={videoClassName}></video>
        {isRecording && <div className="absolute top-4 right-4 w-5 h-5 bg-red-500 rounded-full animate-pulse"></div>}
      </div>

      {permissionError ? (
        <div className="text-red-400 bg-red-900/50 p-4 rounded-lg">
          <p className="font-bold">Permission Error</p>
          <p>{permissionError}</p>
          <button onClick={onCancel} className="mt-4 bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg">
            Back
          </button>
        </div>
      ) : (
        <>
            <div className="w-full bg-slate-700 rounded-full h-2.5 mb-4">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}></div>
            </div>
            <p className="text-slate-300">{instruction}</p>
        </>
      )}
    </div>
  );
};

export default RecordingScreen;
