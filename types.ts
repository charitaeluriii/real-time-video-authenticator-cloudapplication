export enum AppStep {
  WELCOME,
  CHALLENGE,
  RECORDING,
  UPLOAD,
  VERIFYING,
  RESULT,
}

export enum InputMode {
  CAMERA = 'camera',
  SCREEN = 'screen',
  UPLOAD = 'upload',
}

export interface VerificationResult {
  success: boolean;
  feedback: string;
  livenessScore: number; // A score from 0.0 to 1.0
}
