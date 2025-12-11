import React, { useState } from 'react';
import { humanizeText } from '../services/geminiService';

const TextHumanizer: React.FC = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const handleHumanize = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult('');
    try {
      const data = await humanizeText(text);
      setResult(data || "Could not generate text.");
    } catch (e) {
      console.error(e);
      alert("Error processing text. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white font-arabic">أنسنة النص (Text Humanizer)</h2>
        <p className="text-slate-400">Transform robotic AI text into natural, human-sounding language.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-400 uppercase tracking-wider">Input Text</label>
          <div className="relative">
            <textarea
              dir="rtl"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="ضع النص هنا..."
              className="w-full h-96 bg-surface border border-slate-700 rounded-2xl p-6 text-lg text-right font-arabic focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none placeholder:text-slate-600 shadow-xl"
            />
            <div className="absolute bottom-4 left-4">
               <button
                onClick={handleHumanize}
                disabled={loading || !text}
                className={`px-6 py-2 rounded-lg font-semibold transition-all flex items-center space-x-2 ${
                  loading || !text
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    : 'bg-secondary hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                }`}
              >
                {loading && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                )}
                <span>{loading ? 'Processing...' : 'Humanize Text'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                 <label className="block text-sm font-medium text-slate-400 uppercase tracking-wider">Humanized Result</label>
                 {result && (
                     <button onClick={copyToClipboard} className="text-xs text-primary hover:text-white transition-colors">
                         Copy to Clipboard
                     </button>
                 )}
            </div>
            
            <div className="relative h-96">
            {result ? (
                <textarea
                dir="rtl"
                readOnly
                value={result}
                className="w-full h-full bg-slate-900 border border-slate-700 rounded-2xl p-6 text-lg text-right font-arabic outline-none resize-none shadow-xl text-emerald-100"
                />
            ) : (
                <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
                <div className="text-center text-slate-600">
                    <p className="mb-2">Humanized text will appear here</p>
                    {loading && <p className="text-sm text-secondary animate-pulse">Adding human touch...</p>}
                </div>
                </div>
            )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default TextHumanizer;