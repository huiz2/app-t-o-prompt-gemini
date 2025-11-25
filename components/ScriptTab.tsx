import React from 'react';
import { AppState, AspectRatio } from '../types';
import { DEFAULT_SCRIPT_PLACEHOLDER } from '../constants';
import { Sparkles } from 'lucide-react';

interface ScriptTabProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  onGenerate: () => void;
}

const ScriptTab: React.FC<ScriptTabProps> = ({ state, setState, onGenerate }) => {
  return (
    <div className="bg-[#1e293b] rounded-lg border-t-2 border-t-[#0ea5e9] shadow-lg p-6 flex flex-col gap-6">
      <h2 className="text-xl font-semibold text-[#38bdf8]">
        2. Kịch bản & Cảnh
      </h2>

      {/* Script Input */}
      <div className="space-y-2">
        <label className="text-base font-medium text-slate-300 block">Ô nhập Kịch bản:</label>
        <textarea
          value={state.rawScript}
          onChange={(e) => setState(s => ({ ...s, rawScript: e.target.value }))}
          placeholder={DEFAULT_SCRIPT_PLACEHOLDER}
          className="w-full h-48 bg-[#0f172a] border border-slate-700 rounded-md p-4 text-slate-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono text-sm leading-relaxed resize-none"
        />
        <p className="text-xs text-slate-500 italic">
          * Tự tách dòng khi bắt đầu bằng "1.", "2." hoặc "_"
        </p>
      </div>

      {/* Compact Scene Settings */}
      <div className="border-t border-slate-700 pt-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
             {/* Aspect Ratio */}
            <div>
                 <label className="text-xs text-slate-400 block mb-1">Tỉ lệ khung hình</label>
                 <select 
                    value={state.aspectRatio}
                    onChange={(e) => setState(s => ({ ...s, aspectRatio: e.target.value as AspectRatio }))}
                    className="w-full bg-[#0f172a] border border-slate-700 text-slate-300 text-xs rounded p-2 focus:outline-none"
                 >
                    <option value={AspectRatio.PORTRAIT}>9:16 (Portrait)</option>
                    <option value={AspectRatio.LANDSCAPE}>16:9 (Landscape)</option>
                    <option value={AspectRatio.SQUARE}>1:1 (Square)</option>
                 </select>
            </div>
            
            {/* Duration */}
            <div>
                 <label className="text-xs text-slate-400 block mb-1">Độ dài: {state.duration}s</label>
                 <input 
                    type="range" min="2" max="10" step="1"
                    value={state.duration}
                    onChange={(e) => setState(s => ({...s, duration: Number(e.target.value)}))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                 />
            </div>
        </div>

        {/* Checkboxes */}
        <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
                <input 
                    type="checkbox" 
                    checked={!state.isKinetic}
                    onChange={() => setState(s => ({...s, isKinetic: !s.isKinetic}))}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs text-slate-300">Nhịp chuyển động: Calm/Steady (bỏ chọn để Kinetic)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
                <input 
                    type="checkbox" 
                    checked={state.useAdvancedSuggestions}
                    onChange={(e) => setState(s => ({...s, useAdvancedSuggestions: e.target.checked}))}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs text-slate-300">Nâng cao kịch bản (Camera/Lighting suggestions)</span>
            </label>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={onGenerate}
        disabled={state.isGenerating || !state.apiKey}
        className={`mt-2 w-full py-3 rounded-md font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 ${
            state.isGenerating
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : !state.apiKey ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-[#0ea5e9] hover:bg-[#0284c7] text-white'
        }`}
      >
        {state.isGenerating ? (
            <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Đang xử lý...
            </>
        ) : !state.apiKey ? (
             "Missing API Key"
        ) : (
            <>
                <Sparkles size={16} />
                TẠO PROMPTS (CONSISTENCY CHECK)
            </>
        )}
      </button>

    </div>
  );
};

export default ScriptTab;