import { GoogleGenAI } from "@google/genai";
import { AppState, InputSource, StylePreset } from '../types';
import { STYLE_PRESETS, IDENTITY_ANCHOR_TEMPLATE } from '../constants';

const splitScripts = (rawText: string): string[] => {
  // Split by newlines that start with digit+dot or underscore
  const lines = rawText.split(/\n(?=\d+\.|_)/);
  return lines.map(line => line.trim()).filter(line => line.length > 0 && line !== '_');
};

const getActiveStylePrompt = (selectedIds: string[]): string => {
  const presets = STYLE_PRESETS.filter(p => selectedIds.includes(p.id));
  // If multiple, join them. If conflicting, the prompt logic (later preset overrides) is handled by order here.
  return presets.map(p => p.promptValue).join(', ');
};

export const generateCharacterPrompts = async (state: AppState): Promise<string[]> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelId = state.source === InputSource.IMAGE ? "gemini-2.5-flash" : "gemini-2.5-flash"; // Flash handles both well

  const scripts = splitScripts(state.rawScript);
  if (scripts.length === 0) {
    throw new Error("Vui lòng nhập ít nhất một kịch bản.");
  }

  const styleContext = getActiveStylePrompt(state.selectedPresets);
  const motionType = state.isKinetic ? "Kinetic, readable movement" : "Calm, steady";
  const continuityContext = `
    CONTINUITY RULES:
    - Keep hair color & style consistent.
    - Do not change outfit layers/colors.
    - Preserve unique cues (freckles, eye color).
    - Consistent age/gender.
    - No cartoon/anime unless requested.
  `;

  // Construct the System/User prompt
  let promptText = `
    Role: Expert Prompt Engineer for Video Generation.
    Goal: Create "ONE-BLOCK PROMPTS" (English) for consistency across multiple scenes based on a character reference and scripts.
    
    INPUT DATA:
    1. Source Type: ${state.source}
    2. Style Presets: ${styleContext || "Cinematic default"}
    3. Technical: Aspect Ratio ${state.aspectRatio}, Duration ${state.duration}s, Motion: ${motionType}
    4. Advanced Suggestions Enabled: ${state.useAdvancedSuggestions}
    5. Continuity Rules: ${continuityContext}
    
    ${state.source === InputSource.TEXT ? `CHARACTER DESCRIPTION: ${state.textDescription}` : `CHARACTER REFERENCE: See attached image.`}

    SCRIPTS TO PROCESS (${scripts.length} scenes):
    ${scripts.map((s, i) => `SCENE ${i + 1}: ${s}`).join('\n')}

    -----------------------------------
    
    OUTPUT REQUIREMENTS:
    1. Analyze the character deeply to create a unique CHARACTER-ID (e.g., "Name_Archetype_001").
    2. Extract DETAILED anchors. ${IDENTITY_ANCHOR_TEMPLATE}
    3. Output ONE formatted block per scene. 
    4. LANGUAGE: Result must be 100% ENGLISH.
    5. FORMAT: NO JSON. STRICTLY use the following line-by-line format for each scene:

    TASK: cinematic video, SAME CHARACTER across all shots
    CHARACTER-ID: <id>
    IDENTITY ANCHOR: <detailed face/hair/eyes/skin/body specs>
    OUTFIT ANCHOR: <detailed outer/inner/bottom/shoes/accessories>
    STYLE: <style keywords>
    SCENE: <environment + weather + props>
    ACTION: <concise action summary>
    CAMERA: <angle + movement + shot size>
    LIGHTING: <key/fill/rim/tone>
    DURATION: ${state.duration}s | ASPECT: ${state.aspectRatio} | MOTION: ${motionType}
    CONTINUITY RULES: keep hair color/style; keep outfit layers; preserve unique cues; keep age/gender consistent
    NEGATIVE: no wardrobe swap; no face/age morph; no cartoon/anime unless requested
    OUTPUT NOTES: maintain CHARACTER-ID face+hair+outfit across all frames
    ${state.useAdvancedSuggestions ? "(If Advanced on) ADVANCED SUGGESTIONS: <2-4 concise English lines about camera/lighting>" : ""}

    -----------------------------------
    Start output immediately. Separate scenes with "---".
  `;

  const parts: any[] = [{ text: promptText }];

  if (state.source === InputSource.IMAGE && state.referenceImage) {
     // Remove data URL prefix if present for Gemini API
     const base64Data = state.referenceImage.split(',')[1] || state.referenceImage;
     parts.push({
        inlineData: {
            mimeType: "image/jpeg", // Assuming JPEG for simplicity/compatibility or detect from header
            data: base64Data
        }
     });
  }

  try {
    const response = await ai.models.generateContent({
        model: modelId,
        contents: { parts: parts },
        config: {
            temperature: 0.7, // Creativity balanced with instruction following
            // No JSON schema, we want plain text blocks
        }
    });

    const fullText = response.text || "";
    // Split the result back into blocks based on the separator requested
    return fullText.split('---').map(s => s.trim()).filter(s => s.length > 10);

  } catch (err: any) {
      console.error("Gemini Error:", err);
      throw new Error("Lỗi khi kết nối với AI: " + (err.message || "Unknown error"));
  }
};
