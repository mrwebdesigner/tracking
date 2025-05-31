// Type definitions for ml5.js
declare namespace ml5 {
  interface HandPoseOptions {
    maxHands: number;
    flipped: boolean;
    runtime: string;
    modelType: string;
    detectorModelUrl: string;
    landmarkModelUrl: string;
  }

  function handPose(options?: Partial<HandPoseOptions>): HandPose;

  interface HandPose {
    detectStart(video: any, callback: (results: Hand[]) => void): void;
    detectStop(): void;
  }

  interface Hand {
    keypoints: Keypoint[];
  }

  interface Keypoint {
    x: number;
    y: number;
  }

  export function faceMesh(options: {
    maxFaces: number;
    refineLandmarks: boolean;
    flipHorizontal: boolean;
  }): ml5.faceMesh {
    throw new Error("Function not implemented.");
  }
}

declare const VIDEO: "video";
declare const AUDIO: "audio";
