export enum InputSource {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE'
}

export enum AspectRatio {
  PORTRAIT = '9:16',
  LANDSCAPE = '16:9',
  SQUARE = '1:1'
}

export interface StylePreset {
  id: string;
  name: string; // Vietnamese label
  description: string; // Vietnamese description
  promptValue: string; // English value for prompt
}

export interface GeneratedPrompt {
  id: string;
  content: string;
}

export interface AppState {
  apiKey: string;
  activeTab: 'character' | 'script';
  
  // Character Tab
  source: InputSource;
  textDescription: string;
  referenceImage: string | null; // Base64
  selectedPresets: string[]; // IDs
  
  // Script Tab
  rawScript: string;
  aspectRatio: AspectRatio;
  duration: number; // Seconds
  isKinetic: boolean;
  useAdvancedSuggestions: boolean;
  
  // Results
  isGenerating: boolean;
  generatedPrompts: GeneratedPrompt[];
  error: string | null;
}
