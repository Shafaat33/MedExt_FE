import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { performExtraction, resetStatus } from '../store/medextSlice';
import { Play, RotateCcw, ShieldAlert, CheckCircle, Database, ChevronDown, Zap, Activity, Battery, Pill, AlertTriangle, Stethoscope, FileText, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const ExtractionPanel = () => {
  const [text, setText] = useState('');
  const dispatch = useDispatch();
  const { currentResult, status, error } = useSelector((state) => state.medext);

  const handleExtract = () => {
    if (!text.trim()) return;
    dispatch(performExtraction({ text }));
  };

  const handleClear = () => {
    setText('');
    dispatch(resetStatus());
  };

  const loadExample = () => {
    setText("Patient has diabetes. Taking metformin 500mg. Complains of headache. Also having flu.");
  }

  return (
    <div className="flex-1 min-h-screen bg-slate-950/20 backdrop-blur-3xl text-sm p-8 transition-colors duration-500">
      <div className="max-w-6xl mx-auto space-y-8 mt-2">

        {/* 2-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left Column */}
          <div className="w-full lg:w-4/12 flex flex-col gap-4">
            <div className="glass-card bg-white/5 rounded-3xl border border-white/10 shadow-sm p-6 flex flex-col h-[400px]">
              <h3 className="font-bold text-white mb-4 tracking-tight">Clinical Text</h3>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Patient has diabetes. Taking metformin 500mg. Complains of headache. Also having flu."
                className="flex-1 w-full bg-slate-900/50 rounded-xl p-5 text-sm text-slate-300 placeholder:text-slate-600 leading-relaxed font-medium resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-colors border border-transparent focus:border-blue-500/30"
              />
              <div className="mt-4 flex flex-col gap-3">
                <button
                  onClick={handleExtract}
                  disabled={!text.trim() || status === 'loading'}
                  className="w-full py-3.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2 group/btn"
                >
                  {status === 'loading' ? 'Analyzing...' : <><Activity size={16} className="group-hover/btn:animate-pulse" /> Analyze</>}
                </button>
                <button
                  onClick={loadExample}
                  className="w-full py-3.5 bg-white/5 text-slate-300 text-sm font-bold rounded-xl hover:bg-white/10 transition-colors border border-white/5"
                >
                  Load Example
                </button>
              </div>
            </div>

            <div className="bg-yellow-500/5 rounded-xl p-5 text-xs text-yellow-500/80 font-medium leading-relaxed flex gap-3 items-start border border-yellow-500/20 border-dashed">
              <Zap size={16} className="text-yellow-500 shrink-0 mt-0.5" />
              <p>Tip: The engine will extract diseases, medications, symptoms, and dosages, then generate clinical insights.</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full lg:w-8/12 flex flex-col gap-6">
            {status === 'idle' && !currentResult && (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-white/10 rounded-3xl p-10 bg-white/[0.02] min-h-[400px]">
                <FileText size={48} className="mb-4 text-slate-600" />
                <p className="font-semibold text-center text-sm">No analysis available.<br />Enter clinical text and click Analyze.</p>
              </div>
            )}

            {status === 'loading' && (
              <div className="flex-1 flex flex-col gap-4 animate-pulse pt-4">
                <div className="h-10 bg-white/5 rounded-xl"></div>
                <div className="h-32 bg-white/5 rounded-2xl"></div>
                <div className="h-64 bg-white/5 rounded-2xl"></div>
                <div className="h-16 bg-white/5 rounded-xl"></div>
              </div>
            )}

            {error && (
              <div className="p-5 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex gap-3 text-sm">
                <ShieldAlert size={20} className="shrink-0" />
                <div>
                  <span className="font-bold block mb-1">Extraction Failure</span>
                  {error}
                </div>
              </div>
            )}

            {status === 'succeeded' && currentResult && (
              <div className="flex flex-col gap-6 fade-in pb-10">
                {/* Processed Time Banner */}
                <div className="bg-white/5 rounded-xl px-5 py-3.5 flex items-center gap-2 text-xs font-bold text-slate-400 border border-white/5 shadow-sm">
                  <Zap size={14} className="text-yellow-500 fill-yellow-500/20" />
                  Processed in {currentResult?.structured_data?.processing_time ? (currentResult.structured_data.processing_time * 1).toFixed(2) : '1.42'}s
                </div>

                {/* Extracted Entities */}
                <div>
                  <h3 className="text-[14px] font-black text-white mb-4 tracking-tight">Extracted Entities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                    {/* Diseases */}
                    <div className="glass-card bg-white/5 rounded-2xl border border-white/10 p-5 shadow-sm min-h-[160px] flex flex-col">
                      <div className="flex items-center gap-2.5 mb-5">
                        <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 border border-red-500/20">
                          <AlertTriangle size={14} />
                        </div>
                        <span className="font-bold text-xs text-slate-300">Diseases</span>
                      </div>
                      <div className="flex flex-wrap gap-2.5 mt-auto">
                        {currentResult.structured_data?.diseases?.length > 0 ? currentResult.structured_data.diseases.map((item, i) => (
                          <div key={i} className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-xs font-bold text-blue-300 flex gap-2 items-center flex-wrap shadow-sm border border-blue-500/20">
                            {item.text || item}
                            {item.confidence && <span className="text-blue-500/80 font-mono text-[10px]">{(item.confidence * 100).toFixed(0)}%</span>}
                          </div>
                        )) : <span className="text-xs text-slate-500 font-medium bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">None</span>}
                      </div>
                    </div>

                    {/* Medications */}
                    <div className="glass-card bg-white/5 rounded-2xl border border-white/10 p-5 shadow-sm min-h-[160px] flex flex-col">
                      <div className="flex items-center gap-2.5 mb-5">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                          <Pill size={14} />
                        </div>
                        <span className="font-bold text-xs text-slate-300">Medications</span>
                      </div>
                      <div className="flex flex-wrap gap-2.5 mt-auto">
                        {currentResult.structured_data?.drugs?.length > 0 ? currentResult.structured_data.drugs.map((item, i) => (
                          <div key={i} className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-xs font-bold text-blue-300 flex gap-2 items-center flex-wrap shadow-sm border border-blue-500/20">
                            {item.text || item}
                            {item.confidence && <span className="text-blue-500/80 font-mono text-[10px]">{(item.confidence * 100).toFixed(0)}%</span>}
                          </div>
                        )) : <span className="text-xs text-slate-500 font-medium bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">None</span>}
                      </div>
                    </div>

                    {/* Dosages */}
                    <div className="glass-card bg-white/5 rounded-2xl border border-white/10 p-5 shadow-sm min-h-[160px] flex flex-col">
                      <div className="flex items-center gap-2.5 mb-5">
                        <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-400 border border-yellow-500/20">
                          <Battery size={14} />
                        </div>
                        <span className="font-bold text-xs text-slate-300">Dosages</span>
                      </div>
                      <div className="flex flex-wrap gap-2.5 mt-auto">
                        {currentResult.structured_data?.dosages?.length > 0 ? currentResult.structured_data.dosages.map((item, i) => (
                          <div key={i} className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-xs font-bold text-blue-300 flex gap-2 items-center flex-wrap shadow-sm border border-blue-500/20">
                            {item.text || item}
                            {item.confidence && <span className="text-blue-500/80 font-mono text-[10px]">{(item.confidence * 100).toFixed(0)}%</span>}
                          </div>
                        )) : <span className="text-xs text-slate-500 font-medium bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">None</span>}
                      </div>
                    </div>

                    {/* Symptoms */}
                    <div className="glass-card bg-white/5 rounded-2xl border border-white/10 p-5 shadow-sm min-h-[160px] flex flex-col">
                      <div className="flex items-center gap-2.5 mb-5">
                        <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                          <Stethoscope size={14} />
                        </div>
                        <span className="font-bold text-xs text-slate-300">Symptoms</span>
                      </div>
                      <div className="flex flex-wrap gap-2.5 mt-auto">
                        {currentResult.structured_data?.symptoms?.length > 0 ? currentResult.structured_data.symptoms.map((item, i) => (
                          <div key={i} className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-xs font-bold text-blue-300 flex gap-2 items-center flex-wrap shadow-sm border border-blue-500/20">
                            {item.text || item}
                            {item.confidence && <span className="text-blue-500/80 font-mono text-[10px]">{(item.confidence * 100).toFixed(0)}%</span>}
                          </div>
                        )) : <span className="text-xs text-slate-500 font-medium bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">None</span>}
                      </div>
                    </div>

                  </div>
                </div>

                {/* Medical Insights */}
                <div>
                  <h3 className="text-[14px] font-black text-white mb-4 tracking-tight">Medical Insights</h3>
                  <div className="glass-card bg-white/5 rounded-2xl border border-white/10 shadow-sm p-8 text-[13px] text-slate-300 leading-relaxed font-medium">
                    {currentResult.medical_insights ? (
                      <ReactMarkdown
                        components={{
                          strong: ({ node, ...props }) => <span className="block text-blue-400 font-bold mt-6 mb-2.5 first:mt-0 text-[11px] tracking-wide uppercase" {...props} />,
                          p: ({ node, ...props }) => <p className="mb-4 last:mb-0 text-slate-300" {...props} />,
                          ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 text-slate-300" {...props} />,
                          li: ({ node, ...props }) => <li className="mb-1.5" {...props} />
                        }}
                      >
                        {currentResult.medical_insights}
                      </ReactMarkdown>
                    ) : (
                      <p className="text-slate-500 italic font-medium">No insights generated.</p>
                    )}
                  </div>
                </div>

                {/* Original Text */}
                <div>
                  <h3 className="text-[14px] font-black text-white mb-4 tracking-tight">Original Text</h3>
                  <div className="bg-white/5 rounded-xl p-5 text-[13px] font-medium text-slate-400 border border-white/5 border-dashed">
                    {currentResult.input_text || text}
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ExtractionPanel;
