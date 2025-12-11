import React, { useState } from 'react';
import { ImageAspectRatio } from '../types';
import { generateImage, editImage, analyzeImage, generateVeoVideo } from '../services/geminiService';

enum Tab { GEN = 'GEN', EDIT = 'EDIT', ANALYZE = 'ANALYZE', VEO = 'VEO' }

const MediaStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.GEN);
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<ImageAspectRatio>(ImageAspectRatio.SQUARE);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string[] | string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Veo State
  const [veoKeyCheck, setVeoKeyCheck] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setPreviewUrl(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAction = async () => {
    if (!prompt && activeTab !== Tab.VEO) return; // Veo might take just image
    setLoading(true);
    setOutput(null);

    try {
      if (activeTab === Tab.GEN) {
        const images = await generateImage(prompt, aspectRatio);
        setOutput(images);
      } else if (activeTab === Tab.EDIT && previewUrl) {
        const images = await editImage(previewUrl, prompt);
        setOutput(images);
      } else if (activeTab === Tab.ANALYZE && previewUrl) {
        const text = await analyzeImage(previewUrl, prompt || undefined);
        setOutput(text);
      } else if (activeTab === Tab.VEO) {
        // Veo specific checks
        if (!veoKeyCheck) {
            try {
                const hasKey = await window.aistudio.hasSelectedApiKey();
                if (!hasKey) {
                    await window.aistudio.openSelectKey();
                    // Assume success if no error thrown, or re-check
                    setVeoKeyCheck(true);
                }
            } catch (e) {
                console.warn("API Key selection issues", e);
                // Continue, hoping default env key works or error is handled
            }
        }
        
        // Use aspect ratio mapping loosely or strictly. Veo supports 16:9 or 9:16
        const veoRatio = aspectRatio === ImageAspectRatio.PORTRAIT_9_16 ? '9:16' : '16:9';
        const videoUrl = await generateVeoVideo(prompt, previewUrl, veoRatio);
        setOutput(videoUrl);
      }
    } catch (e: any) {
      alert("Operation failed: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 h-full flex flex-col">
      {/* Tabs */}
      <div className="flex space-x-2 bg-surface p-1 rounded-xl mb-6 w-fit mx-auto border border-slate-700">
        {[
            { id: Tab.GEN, label: 'Generate', icon: '🎨' },
            { id: Tab.EDIT, label: 'Edit', icon: '✏️' },
            { id: Tab.ANALYZE, label: 'Analyze', icon: '👁️' },
            { id: Tab.VEO, label: 'Veo Video', icon: '🎥' }
        ].map(tab => (
            <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as Tab); setOutput(null); setPrompt(''); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${activeTab === tab.id ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
            >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
            </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Controls */}
        <div className="lg:col-span-1 bg-surface rounded-2xl p-6 border border-slate-700 space-y-6 overflow-y-auto">
            
            {/* Aspect Ratio Selector (Gen & Veo) */}
            {(activeTab === Tab.GEN || activeTab === Tab.VEO) && (
                 <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Aspect Ratio</label>
                    <div className="grid grid-cols-4 gap-2">
                        {Object.values(ImageAspectRatio).filter(r => activeTab === Tab.VEO ? (r === '16:9' || r === '9:16') : true).map((r) => (
                            <button
                                key={r}
                                onClick={() => setAspectRatio(r)}
                                className={`text-xs py-1 px-2 rounded border ${aspectRatio === r ? 'bg-primary border-primary text-white' : 'border-slate-600 text-slate-400 hover:border-slate-500'}`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* File Input (Edit, Analyze, Veo) */}
            {(activeTab !== Tab.GEN) && (
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Source Image</label>
                     <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-600 border-dashed rounded-lg cursor-pointer hover:bg-slate-700/50 transition-colors relative overflow-hidden">
                        {previewUrl ? (
                            <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                        ) : (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg className="w-8 h-8 mb-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                <p className="text-xs text-slate-500">Click to upload</p>
                            </div>
                        )}
                        <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                    </label>
                </div>
            )}

            {/* Prompt */}
            <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Prompt</label>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={activeTab === Tab.ANALYZE ? "Describe this image..." : "A futuristic cyberpunk city..."}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-sm focus:ring-1 focus:ring-primary outline-none h-32 resize-none"
                />
            </div>
            
            <button
                onClick={handleAction}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-primary to-indigo-600 rounded-lg font-bold text-white shadow-lg shadow-indigo-500/30 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                {loading ? 'Processing...' : 'Execute'}
            </button>
            
            {activeTab === Tab.VEO && !veoKeyCheck && (
                <p className="text-xs text-slate-500 text-center">
                    Note: Veo requires a paid API key. You will be prompted to select one if not already active.
                </p>
            )}
        </div>

        {/* Display Area */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-center relative overflow-hidden min-h-[400px]">
            {loading ? (
                 <div className="flex flex-col items-center space-y-4">
                     <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                     <p className="text-slate-400 animate-pulse">Generating magic...</p>
                 </div>
            ) : output ? (
                <div className="w-full h-full p-4 flex items-center justify-center overflow-auto">
                    {/* Image Array Output (Gen, Edit) */}
                    {Array.isArray(output) && (
                        <div className="grid grid-cols-1 gap-4 w-full">
                            {output.map((src, i) => (
                                <img key={i} src={src} alt="Generated" className="rounded-lg shadow-2xl max-h-[600px] w-auto mx-auto border border-slate-700" />
                            ))}
                        </div>
                    )}
                    {/* String Output (Analyze) */}
                    {typeof output === 'string' && activeTab === Tab.ANALYZE && (
                        <div className="bg-surface p-6 rounded-xl border border-slate-700 max-w-2xl w-full">
                            <h3 className="text-lg font-bold mb-2 text-white">Analysis Result</h3>
                            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{output}</p>
                        </div>
                    )}
                    {/* Video URL Output (Veo) */}
                    {typeof output === 'string' && activeTab === Tab.VEO && (
                         <video controls autoPlay loop className="max-h-full max-w-full rounded-lg shadow-2xl border border-slate-700">
                             <source src={output} type="video/mp4" />
                             Your browser does not support video.
                         </video>
                    )}
                </div>
            ) : (
                <div className="text-center text-slate-600">
                    <p className="text-6xl mb-4">✨</p>
                    <p>Results will appear here</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default MediaStudio;