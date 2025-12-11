import React, { useState } from 'react';
import { searchWithGrounding } from '../services/geminiService';

const SearchTool: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<{ text: string; sources: any[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const data = await searchWithGrounding(query);
      setResult({ text: data.text || '', sources: data.sources });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 h-full flex flex-col">
       <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Smart Search</h2>
            <p className="text-slate-400">Powered by Gemini 2.5 Flash & Google Search</p>
       </div>

       <form onSubmit={handleSearch} className="relative mb-8">
            <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask anything (e.g., current events, weather)..."
                className="w-full bg-surface border border-slate-700 rounded-full py-4 px-6 pl-14 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-secondary outline-none shadow-lg"
            />
            <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <button 
                type="submit"
                disabled={loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-secondary hover:bg-emerald-600 text-white p-2 rounded-full transition-colors disabled:opacity-50"
            >
                {loading ? (
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                )}
            </button>
       </form>

       {result && (
           <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <div className="bg-surface rounded-2xl p-6 border border-slate-700 shadow-xl mb-6">
                    <div className="prose prose-invert max-w-none">
                         <div dangerouslySetInnerHTML={{ __html: result.text.replace(/\n/g, '<br />') }} />
                    </div>
                </div>

                {result.sources.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Sources</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {result.sources.map((source, idx) => (
                                <a 
                                    key={idx} 
                                    href={source.uri} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="block bg-slate-800 hover:bg-slate-700 p-4 rounded-xl border border-slate-700 transition-colors group"
                                >
                                    <h4 className="text-sm font-medium text-blue-400 group-hover:text-blue-300 truncate mb-1">{source.title}</h4>
                                    <p className="text-xs text-slate-500 truncate">{source.uri}</p>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
           </div>
       )}
    </div>
  );
};

export default SearchTool;