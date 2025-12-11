export enum AppMode {
  ARABIC_DETECTOR = 'ARABIC_DETECTOR',
  HUMANIZE_TEXT = 'HUMANIZE_TEXT',
  LIVE_CONVERSATION = 'LIVE_CONVERSATION',
  IMAGE_STUDIO = 'IMAGE_STUDIO',
  VIDEO_VEO = 'VIDEO_VEO',
  SMART_SEARCH = 'SMART_SEARCH'
}

export enum ImageAspectRatio {
  SQUARE = "1:1",
  PORTRAIT_3_4 = "3:4",
  LANDSCAPE_4_3 = "4:3",
  PORTRAIT_9_16 = "9:16",
  LANDSCAPE_16_9 = "16:9",
  WIDE_21_9 = "21:9",
  STD_2_3 = "2:3",
  STD_3_2 = "3:2"
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  sources?: { uri: string; title: string }[];
}

// Window augmentation for Veo API Key selection
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}
