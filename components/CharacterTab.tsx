import React from 'react';
import { InputSource, AppState } from '../types';
import { STYLE_PRESETS } from '../constants';

interface CharacterTabProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const CharacterTab: React.FC<CharacterTabProps> = ({ state, setState }) => {
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setState(prev => ({ ...prev, referenceImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const togglePreset = (id: string) => {
    setState(prev => {
      const current = prev.selectedPresets;
      if (current.includes(id)) {
        return { ...prev, selectedPresets: current.filter(p => p !== id) };
      } else {
        return { ...prev, selectedPresets: [...current, id] };
      }
    });
  };

  return (
    <div className="bg-[#1e293b] rounded-lg border-t-2 border-t-[#0ea5e9] shadow-lg p-6">
      <h2 className="text-xl font-semibold text-[#38bdf8] mb-6">
        1. Tham chiếu nhân vật
      </h2>

      {/* Source Selection */}
      <div className="space-y-6">
        <div className="space-y-2">
            <label className="text-base font-medium text-slate-300 block mb-2">Nguồn:</label>
            <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                        type="radio" 
                        name="source" 
                        checked={state.source === InputSource.TEXT}
                        onChange={() => setState(s => ({ ...s, source: InputSource.TEXT }))}
                        className="w-4 h-4 text-blue-500 border-slate-600 focus:ring-blue-500 bg-slate-900"
                    />
                    <span className={`text-sm ${state.source === InputSource.TEXT ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'}`}>
                        Mô tả bằng văn bản
                    </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                        type="radio" 
                        name="source" 
                        checked={state.source === InputSource.IMAGE}
                        onChange={() => setState(s => ({ ...s, source: InputSource.IMAGE }))}
                        className="w-4 h-4 text-blue-500 border-slate-600 focus:ring-blue-500 bg-slate-900"
                    />
                    <span className={`text-sm ${state.source === InputSource.IMAGE ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'}`}>
                        Tải 1 ảnh
                    </span>
                </label>
            </div>
        </div>

        {/* Dynamic Input Area */}
        <div>
          {state.source === InputSource.TEXT ? (
            <textarea
              value={state.textDescription}
              onChange={(e) => setState(s => ({ ...s, textDescription: e.target.value }))}
              placeholder="Giới tính, độ tuổi ước lượng, khuôn mặt, tóc, mắt, dáng, dấu hiệu nổi bật..."
              className="w-full h-24 bg-[#0f172a] border border-slate-700 rounded-md p-3 text-sm text-slate-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none placeholder-slate-600"
            />
          ) : (
            <div className="flex items-center justify-between gap-4 p-4 bg-[#0f172a] rounded-md border border-slate-700">
                <div className="flex items-center gap-3">
                    <label className="cursor-pointer bg-[#0ea5e9] hover:bg-[#0284c7] text-white text-xs font-bold py-2 px-4 rounded shadow-sm transition-colors">
                        Choose File
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                    </label>
                    <span className="text-xs text-slate-500 truncate max-w-[150px]">
                        {state.referenceImage ? "Image loaded" : "No file chosen"}
                    </span>
                </div>
                {state.referenceImage && (
                    <div className="w-12 h-12 rounded border border-slate-600 overflow-hidden bg-black shrink-0">
                        <img src={state.referenceImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                )}
            </div>
          )}
        </div>

        {/* Style Presets */}
        <div className="space-y-3">
            <label className="text-base font-medium text-slate-300 block">Phong cách nhân vật (presets):</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {STYLE_PRESETS.map((preset) => {
                const isSelected = state.selectedPresets.includes(preset.id);
                return (
                <button
                    key={preset.id}
                    onClick={() => togglePreset(preset.id)}
                    className={`py-2 px-3 rounded text-xs font-medium text-left transition-all border ${
                    isSelected
                        ? 'bg-[#0ea5e9] border-[#0ea5e9] text-white shadow-md'
                        : 'bg-[#334155] border-[#334155] text-slate-300 hover:bg-[#475569]'
                    }`}
                >
                    {preset.name}
                </button>
                );
            })}
            </div>
        </div>
        
        {/* Continuity Checkboxes (Visual mostly based on screenshot requirement) */}
        <div className="pt-2">
            <h4 className="text-sm font-semibold text-slate-400 mb-2">Quy tắc đồng nhất (mặc định bật):</h4>
            <div className="grid grid-cols-1 gap-1">
                {[
                    "Giữ nguyên kiểu tóc & màu tóc",
                    "Không đổi trang phục chính (layering & màu)",
                    "Giữ đặc điểm nổi bật (freckles/side bangs/eye color...)",
                    "Không thay đổi độ tuổi/giới tính/phong cách khuôn mặt",
                    "Không chuyển sang phong cách hoạt hình trừ khi yêu cầu"
                ].map((rule, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-400">
                        <span className="text-[#0ea5e9] font-bold">✓</span>
                        {rule}
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default CharacterTab;