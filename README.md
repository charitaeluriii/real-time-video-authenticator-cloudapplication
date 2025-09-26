# Aura Authenticator: Technical Report

## 1. Project Overview

**Aura Authenticator** is a modern, AI-powered liveness verification application designed to ensure that a user is physically present and real during an authentication process. It mitigates spoofing attacks (e.g., using a pre-recorded video or a photo) by issuing a random, real-time challenge that the user must perform. The application captures this performance via video and uses the Google Gemini multimodal AI model to verify the action and assess the user's liveness.

### Key Features:
- **Challenge-Response Mechanism**: Presents users with a random action to perform (e.g., "Smile widely," "Raise your left hand").
- **Multiple Input Modes**: Supports verification via live camera, screen recording (for scenarios like video calls), and video file upload.
- **AI-Powered Verification**: Leverages the Google Gemini API for intelligent analysis of video content.
- **Liveness Scoring**: Provides a confidence score (0.0 to 1.0) indicating how likely the subject is a live person, adding a crucial layer of security.
- **Responsive & Modern UI**: A clean, intuitive, and responsive user interface built with React and Tailwind CSS.

---

## 2. Tech Stack

The application is built using a modern, efficient, and scalable frontend technology stack.

| Category          | Technology / Service                               | Purpose                                                                                             |
| ----------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **Frontend UI**       | [React](https://react.dev/) (with TypeScript)      | A component-based JavaScript library for building user interfaces. TypeScript adds static typing for robustness. |
| **Styling**       | [Tailwind CSS](https://tailwindcss.com/)           | A utility-first CSS framework for rapidly building custom, modern designs directly in the markup.       |
| **AI / Machine Learning** | [Google Gemini API](https://ai.google.dev/docs/gemini_api_overview) | Powers the core video analysis. The `gemini-2.5-flash` model is used for its multimodal capabilities and fast response times. |
| **Web APIs**        | `getUserMedia`, `getDisplayMedia`, `FileReader` | Native browser APIs used for accessing the camera, recording the screen, and handling file uploads. |
| **Module Loading**  | ES Modules (via `importmap`)                       | Enables modern, browser-native module loading without a complex build step in this development environment. |

---

## 3. Cloud Service Provider & Integration

The primary cloud service provider for this application is **Google Cloud**, as the core functionality is dependent on the Google Gemini API.

### Google Gemini API Integration:
- **Service**: The application communicates directly with the Google Gemini API endpoint.
- **Model**: It specifically uses the `gemini-2.5-flash` model, which is optimized for multimodal inputs (video + text prompt) and can return structured JSON data, making it ideal for this verification task.
- **Authentication**: API access is secured via an API key. This key is managed as an environment variable (`process.env.API_KEY`) and should never be exposed on the client-side in a production environment.
- **Data Flow**:
    1. The client-side application captures a video and converts it to a Base64 encoded string.
    2. An HTTPS request is made to the Gemini API, sending the video data, the challenge text, and a JSON schema for the desired response.
    3. The Gemini service processes the video, performs the verification and liveness analysis, and returns a JSON object containing the `success` status, `feedback` text, and a `livenessScore`.

---

## 4. System Architecture & Deployment

The application follows a client-server architecture where the client is a rich single-page application (SPA) and the "server" is the Google Gemini cloud service.

### Architecture Flow:
```
[User's Browser] <--> [React Application]
      |
      | 1. User selects input mode (Camera/Screen/Upload)
      | 2. App presents a random challenge
      | 3. User records or uploads a video
      |
      | 4. Video is Base64 encoded
      v
[HTTPS API Call]
      |
      | 5. (video_data, challenge_prompt) sent to Google Cloud
      v
[Google Gemini API (`gemini-2.5-flash`)]
      |
      | 6. AI analyzes video against the prompt
      | 7. AI assesses liveness and generates a score
      | 8. AI returns a structured JSON response
      v
[HTTPS API Response]
      |
      | 9. JSON data { success, feedback, livenessScore } received
      v
[React Application]
      |
      | 10. UI is updated to show the final result
      v
[User's Browser]
```

### Recommended Deployment Strategy:
For a production-grade deployment, the following setup is recommended:

1.  **Frontend Hosting**:
    *   **Service**: [Vercel](https://vercel.com/)
    *   **Reasoning**: These services provide a seamless CI/CD pipeline integrated with Git, automatic builds, global content delivery network (CDN) for low latency, and easy management of environment variables.

2.  **API Key Security (Crucial)**:
    *   The `API_KEY` for the Gemini API must **not** be stored in the frontend code.
    *   **Solution**: A "Backend For Frontend" (BFF) pattern should be implemented using a serverless function (e.g., Vercel Functions, Netlify Functions, AWS Lambda).
    *   **New Flow**:
        1. The React app sends the video data to its own serverless function endpoint.
        2. The serverless function, which securely stores the `API_KEY` as an environment variable, then makes the call to the Google Gemini API.
        3. The function receives the response from Gemini and forwards it back to the React app.
    *   **Benefit**: This prevents the API key from ever being exposed to the user's browser, securing the application from unauthorized API usage.

---

## 5. Liveness & Security Analysis

The addition of the `livenessScore` is a critical security enhancement.

-   **Beyond Simple Verification**: A simple check for the challenge action can be fooled by a high-quality video of someone else performing the action. The liveness score directly counters this by having the AI look for subtle cues that indicate a recording.
-   **Spoof Detection Cues**: The AI is prompted to look for:
    -   **Digital Artifacts**: Moiré patterns, pixelation, or screen borders.
    -   **Reflections**: Glare from an overhead light on a monitor.
    -   **Unnatural Depth & Motion**: The flatness of a video playing on a screen.
-   **Risk Mitigation**: By displaying a low or medium confidence score, the system can flag a verification for manual review or require the user to try again in a different environment, even if the primary action was performed correctly. This significantly raises the barrier for attackers.
