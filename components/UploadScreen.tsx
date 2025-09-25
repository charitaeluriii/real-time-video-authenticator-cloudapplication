
import React, { useState, useCallback, useRef } from 'react';
import { UploadIcon } from './Icons';

interface UploadScreenProps {
  onUploadComplete: (blob: Blob) => void;
  onCancel: () => void;
}

const UploadScreen: React.FC<UploadScreenProps> = ({ onUploadComplete, onCancel }) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File | null) => {
    setError(null);
    if (file) {
      if (file.type.startsWith('video/')) {
        setVideoFile(file);
        setVideoPreview(URL.createObjectURL(file));
      } else {
        setError('Invalid file type. Please upload a video file.');
      }
    }
  }, []);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };
  
  const handleSubmit = () => {
    if (videoFile) {
      onUploadComplete(videoFile);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-blue-500/20 text-center animate-fade-in">
      <h2 className="text-xl font-bold text-white mb-4">Upload Video</h2>
      
      {!videoPreview ? (
        <div 
          className={`relative w-full aspect-video rounded-lg bg-gray-900/50 mb-4 border-2 ${isDragging ? 'border-blue-500' : 'border-dashed border-slate-600'} flex flex-col items-center justify-center text-slate-400 transition-colors`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadIcon className="w-12 h-12 mb-2"/>
          <p className="font-semibold">Drag & drop a video file</p>
          <p className="text-sm">or click to browse</p>
          <input 
            ref={fileInputRef}
            type="file" 
            accept="video/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-900 mb-4 border-2 border-slate-700">
            <video src={videoPreview} controls className="w-full h-full object-cover"></video>
        </div>
      )}

      {error && (
         <p className="text-red-400 text-sm mb-4">{error}</p>
      )}

      {videoFile && (
        <div className="text-left bg-slate-900/50 p-3 rounded-lg mb-4 text-sm">
            <p className="text-white font-medium truncate">{videoFile.name}</p>
            <p className="text-slate-400">{(videoFile.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
      )}

      <div className="flex gap-4">
        <button 
            onClick={onCancel}
            className="w-full bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300"
        >
            Cancel
        </button>
        <button 
          onClick={handleSubmit}
          disabled={!videoFile}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50 shadow-lg disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed disabled:scale-100"
        >
          Verify Video
        </button>
      </div>

    </div>
  );
};

export default UploadScreen;
