import { GoogleGenAI, Type } from "@google/genai";
import { VerificationResult } from "../types";
import { GEMINI_MODEL } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const verificationSchema = {
    type: Type.OBJECT,
    properties: {
        success: {
            type: Type.BOOLEAN,
            description: "True if the user successfully performed the action OR if liveness is confirmed (in anonymous mode), false otherwise.",
        },
        feedback: {
            type: Type.STRING,
            description: "A brief, user-friendly explanation of the reasoning. e.g., 'User successfully smiled.', 'Liveness confirmed.', or 'Signs of a recorded video were detected.'",
        },
        livenessScore: {
            type: Type.NUMBER,
            description: "A score from 0.0 to 1.0 indicating the confidence that the video shows a live person. 1.0 is highest confidence. Consider factors like screen reflections, unnatural movements, or artifacts that might suggest a recording of a screen.",
        },
    },
    required: ["success", "feedback", "livenessScore"],
};


export async function verifyAction(videoBase64: string, mimeType: string, challenge: string | null): Promise<VerificationResult> {
    try {
        const promptWithoutChallenge = `You are a highly advanced AI-powered liveness detection system. Your task is to critically assess the provided video for signs of liveness.
Determine if the video contains a real, live person and is not a recording of a screen, a deepfake, or any other form of spoofing.
Look for natural movements, blinking, subtle facial expressions, and lighting consistency. Also, analyze for screen glare, reflections, digital artifacts, or unnatural motion.
Based on this, provide a liveness score from 0.0 (very likely a spoof) to 1.0 (very likely a live person).
The 'success' field in your response should be true if you are confident the person is live, and false otherwise.
The 'feedback' field should state your conclusion, e.g., 'Liveness confirmed.' or 'Signs of a recorded video were detected.'

Your response MUST be a JSON object that conforms to the specified schema. Do not include any other text or markdown formatting.`;

        const promptWithChallenge = `You are a highly advanced AI-powered liveness detection system. Your task is to verify if a user has performed a specific action shown in a video and to assess the liveness of the subject.

The user was given the following challenge:
"${challenge}"

First, analyze the provided video to determine if the user successfully and clearly performed this action. The 'success' field should reflect this.

Second, critically assess the video for any signs of spoofing. Look for screen glare, reflections, digital artifacts, unnatural movements, or poor lighting that might indicate the video is a recording of another screen or a pre-recorded video. Based on this, provide a liveness score from 0.0 (very likely a spoof) to 1.0 (very likely a live person).

Your response MUST be a JSON object that conforms to the specified schema. Do not include any other text or markdown formatting.`;
        
        const prompt = challenge ? promptWithChallenge : promptWithoutChallenge;

        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: videoBase64,
                            mimeType: mimeType,
                        },
                    },
                    { text: prompt },
                ],
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: verificationSchema,
            },
        });

        const jsonText = response.text.trim();
        const parsedResult = JSON.parse(jsonText);

        if (typeof parsedResult.success === 'boolean' && typeof parsedResult.feedback === 'string' && typeof parsedResult.livenessScore === 'number') {
            return {
                ...parsedResult,
                // Clamp the score to be between 0 and 1
                livenessScore: Math.max(0, Math.min(1, parsedResult.livenessScore))
            };
        } else {
            console.error("Parsed JSON does not match VerificationResult type:", parsedResult);
            throw new Error("Invalid JSON structure from API.");
        }

    } catch (error) {
        console.error("Error during Gemini API call:", error);
        return {
            success: false,
            feedback: "We couldn't verify your action due to a technical issue. Please try again.",
            livenessScore: 0,
        };
    }
}