import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import CharacterTab from './components/CharacterTab';
import ScriptTab from './components/ScriptTab';
import ResultCard from './components/ResultCard';
import { AppState, InputSource, AspectRatio } from './types';
import { generateCharacterPrompts } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    apiKey: process.env.API_KEY || '',
    activeTab: 'character', // Deprecated but kept for type compatibility if needed
    source: InputSource.TEXT,
    textDescription: '',
    referenceImage: null,
    selectedPresets: [],
    rawScript: '',
    aspectRatio: AspectRatio.PORTRAIT,
    duration: 5,
    isKinetic: false,
    useAdvancedSuggestions: false,
    isGenerating: false,
    generatedPrompts: [],
    error: null
  });

  const handleGenerate = async () => {
    setState(prev => ({ ...prev, isGenerating: true, error: null })); // Don't clear prompts immediately if you want to keep old ones visible until new ones arrive, but usually clearing is better.
    
    try {
      if (state.source === InputSource.TEXT && !state.textDescription.trim()) {
         throw new Error("Vui lòng nhập mô tả nhân vật.");
      }
      if (state.source === InputSource.IMAGE && !state.referenceImage) {
         throw new Error("Vui lòng tải lên ảnh tham chiếu.");
      }
      if (!state.rawScript.trim()) {
        throw new Error("Vui lòng nhập kịch bản.");
      }

      const prompts = await generateCharacterPrompts(state);
      
      setState(prev => ({
        ...prev,
        isGenerating: false,
        generatedPrompts: prompts.map((p, i) => ({ id: `prompt-${Date.now()}-${i}`, content: p })),
      }));

    } catch (err: any) {
      setState(prev => ({ ...prev, isGenerating: false, error: err.message }));
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-200 font-sans selection:bg-blue-500/30">
      
      {/* Header */}
      <header className="py-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-[#38bdf8] drop-shadow-sm mb-2">
          Character Consistency Builder
        </h1>
        <p className="text-slate-400 text-sm">
          Giao diện tiếng Việt, kết quả prompt tiếng Anh
        </p>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 pb-12">
        
        {/* Error Banner */}
        {state.error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-700/50 rounded-lg flex items-start gap-3 text-red-200 animate-fade-in mx-auto max-w-4xl">
                <AlertCircle className="shrink-0 mt-0.5" />
                <div>
                    <h4 className="font-bold text-sm">Đã xảy ra lỗi</h4>
                    <p className="text-sm opacity-90">{state.error}</p>
                </div>
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LEFT COLUMN: Inputs */}
            <div className="space-y-6">
                <CharacterTab state={state} setState={setState} />
                <ScriptTab state={state} setState={setState} onGenerate={handleGenerate} />
            </div>

            {/* RIGHT COLUMN: Results */}
            <div className="flex flex-col h-full">
                 <div className="bg-[#1e293b] rounded-t-lg border-t-2 border-t-[#0ea5e9] p-4 border-b border-slate-700/50">
                    <h3 className="text-xl font-semibold text-[#38bdf8]">
                        3. Prompts đã tạo (Tiếng Anh)
                    </h3>
                 </div>
                 <div className="bg-[#0f172a] border border-slate-700/50 border-t-0 rounded-b-lg p-4 min-h-[600px] lg:h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar space-y-4 shadow-inner">
                    {state.generatedPrompts.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4">
                            <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center">
                                <span className="text-2xl opacity-50">✨</span>
                            </div>
                            <p>Kết quả sẽ hiển thị tại đây...</p>
                        </div>
                    ) : (
                        state.generatedPrompts.map((prompt, index) => (
                            <ResultCard key={prompt.id} content={prompt.content} index={index} />
                        ))
                    )}
                 </div>
            </div>
        </div>

      </main>
    </div>
  );
};

export default App;