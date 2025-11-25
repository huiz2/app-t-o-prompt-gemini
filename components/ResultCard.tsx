import React, { useState } from 'react';
import { Copy, CheckCheck } from 'lucide-react';

interface ResultCardProps {
  content: string;
  index: number;
}

const ResultCard: React.FC<ResultCardProps> = ({ content, index }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#1e293b] rounded border border-slate-700 overflow-hidden flex flex-col">
      <div className="bg-[#0f172a] px-3 py-2 border-b border-slate-700 flex justify-between items-center">
        <span className="text-sm font-bold text-[#38bdf8]">
          Kịch bản {index + 1}
        </span>
        <button
          onClick={handleCopy}
          className="text-slate-400 hover:text-white transition-colors"
          title="Sao chép"
        >
          {copied ? <CheckCheck size={16} className="text-green-500" /> : <Copy size={16} />}
        </button>
      </div>
      <div className="p-3 bg-[#0b1120] overflow-x-auto">
        <pre className="text-xs sm:text-sm font-mono text-slate-300 whitespace-pre-wrap leading-relaxed selection:bg-[#0ea5e9] selection:text-white">
            {content}
        </pre>
      </div>
    </div>
  );
};

export default ResultCard;