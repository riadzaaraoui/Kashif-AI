import React, { useState } from 'react';
import { detectArabicText } from '../services/geminiService';

const ArabicDetector: React.FC = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await detectArabicText(text);
      setResult(data);
    } catch (e) {
      console.error(e);
      alert("Error analyzing text. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white font-arabic">كاشف النص (Text Detector)</h2>
        <p className="text-slate-400">Paste Arabic text below to detect if it was written by AI or a Human.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="relative">
            <textarea
              dir="rtl"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="ضع النص العربي هنا للتحليل..."
              className="w-full h-80 bg-surface border border-slate-700 rounded-2xl p-6 text-lg text-right font-arabic focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none placeholder:text-slate-600 shadow-xl"
            />
            <div className="absolute bottom-4 left-4">
               <button
                onClick={handleAnalyze}
                disabled={loading || !text}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  loading || !text
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    : 'bg-primary hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                }`}
              >
                {loading ? 'Analyzing...' : 'Analyze Text'}
              </button>
            </div>
          </div>
        </div>

        {/* Output Section */}
        <div className="relative h-80 md:h-auto">
          {result ? (
            <div className="h-full bg-surface border border-slate-700 rounded-2xl p-6 space-y-6 animate-fade-in overflow-y-auto shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                <span className="text-slate-400">Verdict</span>
                <span className={`text-xl font-bold ${result.is_ai_generated ? 'text-red-400' : 'text-green-400'}`}>
                  {result.is_ai_generated ? '🤖 AI Generated' : '👤 Human Written'}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Confidence Score</span>
                  <span>{result.confidence_score}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${result.is_ai_generated ? 'bg-red-500' : 'bg-green-500'}`} 
                    style={{ width: `${result.confidence_score}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-slate-300">Analysis (English)</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{result.reasoning_en}</p>
              </div>

              <div className="space-y-2" dir="rtl">
                <h4 className="font-semibold text-slate-300 font-arabic">تحليل (Arabic)</h4>
                <p className="text-slate-400 text-sm leading-relaxed font-arabic">{result.reasoning_ar}</p>
              </div>
              
              <div className="pt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300">
                  Dialect: {result.detected_dialect}
                </span>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/50">
              <div className="text-center text-slate-600">
                <p className="mb-2">Analysis results will appear here</p>
                {loading && (
                   <svg className="animate-spin h-8 w-8 text-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArabicDetector;