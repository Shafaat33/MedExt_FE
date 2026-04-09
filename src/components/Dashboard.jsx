import React from 'react';
import { Zap, Activity, Clock, FileText, ChevronRight, Share2, Printer, Plus } from 'lucide-react';

const Dashboard = () => {

  const stats = [
    { label: 'Total Extractions', value: '1,429', change: '+12%', icon: FileText, color: 'emerald' },
    { label: 'Model Sensitivity', value: '98.4%', change: 'High', icon: Zap, color: 'blue' },
    { label: 'Latency (Avg)', value: '124ms', change: '-4ms', icon: Activity, color: 'purple' },
    { label: 'Uptime', value: '99.99%', change: 'Stable', icon: Clock, color: 'cyan' },
  ];

  return (
    <main className="flex-1 p-8 min-h-screen bg-slate-950/20 backdrop-blur-3xl">
      <div className="max-w-7xl mx-auto py-12">
        <div className="flex justify-between items-start mb-12">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 shadow-md shadow-blue-500/5">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest pl-1">Beta 2.0</span>
              <div className="w-[1px] h-3 bg-blue-500/20 mx-1" />
              <span className="text-[10px] font-medium text-slate-400 tracking-tight">Advanced Medical Extraction</span>
            </div>
            <div>
              <h2 className="text-4xl font-extrabold tracking-tight text-white mb-2 leading-tight">Good morning, Shafaat.</h2>
              <p className="text-lg text-slate-400 font-medium tracking-tight">Welcome back to the MedExt dashboard.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all border-dashed shadow-lg">
              <Share2 size={16} />
              Export Reports
            </button>
            <button className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-xl shadow-blue-500/20 hover:shadow-cyan-500/30 hover:-translate-y-0.5 transition-all">
              <Plus size={18} />
              New Analysis
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="glass-card group p-6 overflow-hidden relative border border-white/5 hover:border-blue-500/20 transition-all duration-300">
              <div className="flex flex-col gap-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl bg-${stat.color}-500/10 border border-${stat.color}-500/20 shadow-lg shadow-${stat.color}-500/10 group-hover:scale-110 transition-transform duration-500`}>
                    <stat.icon size={22} className={`text-${stat.color}-400 group-hover:text-${stat.color}-300`} />
                  </div>
                  <div className="font-bold text-[10px] uppercase tracking-tighter text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full border border-emerald-400/20 flex items-center gap-1">
                    <Zap size={10} className="fill-emerald-400" />
                    {stat.change}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">{stat.label}</span>
                  <div className="text-3xl font-extrabold text-white tracking-tight mt-1">{stat.value}</div>
                </div>
              </div>

              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100/5 -mr-16 -mt-16 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-card p-4 overflow-hidden shadow-2xl shadow-blue-900/10">
              <div className="p-4 flex items-center justify-between border-b border-white/5 mb-6">
                <div className="flex items-center gap-3">
                  <Activity size={20} className="text-blue-400" />
                  <h3 className="text-xl font-bold text-white tracking-tight">Recent Activity</h3>
                </div>
                <button className="text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors underline-offset-4 decoration-blue-500/40">View All</button>
              </div>
              <div className="space-y-4 max-h-[500px] overflow-y-auto px-2 pb-4 scroll-m-2">
                {[1, 2, 3, 4, 5].map((_, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                    <div className="flex items-center justify-between mb-3 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                      <span className="flex items-center gap-2">
                        <Clock size={12} className="text-blue-400" />
                        March 6, 2026 — 11:34 AM
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">Validated</span>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center p-0.5 shrink-0 group-hover:scale-105 transition-transform duration-300">
                        <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=med${i}`} className="w-full h-full rounded-lg" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-white mb-1 tracking-tight">Patient EHR Analysis — Case #78{i}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed font-medium line-clamp-2 italic">"...Patient presents with persistent cough and shortness of breath for 3 days. Elevated BP recorded at 145/90..."</p>
                      </div>
                      <ChevronRight size={18} className="text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all self-center ml-4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="glass-card p-1 shadow-2xl overflow-hidden group">
              <div className="relative p-6 bg-gradient-to-tr from-blue-900/40 to-cyan-800/20 rounded-2xl overflow-hidden border border-white/10">
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6 border border-blue-500/30">
                    <Zap size={24} className="text-blue-400 fill-blue-400/20" />
                  </div>
                  <h3 className="text-2xl font-black text-white leading-tight mb-2 tracking-tighter">Instant Clinical Extraction</h3>
                  <p className="text-sm text-slate-300 font-medium leading-relaxed mb-8 pr-12">Extract entities, ICD-10 codes, and clinical summaries in milliseconds.</p>
                  <button className="flex items-center justify-between w-full p-4 rounded-xl bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-500/20 hover:bg-blue-600 group/btn transition-all">
                    Try Now
                    <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-cyan-400/20 rounded-full blur-[100px] opacity-40 group-hover:scale-110 transition-transform duration-1000" />
              </div>
            </div>

            <div className="glass-card p-6 border-white/5 bg-slate-900/20">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <h3 className="text-lg font-bold text-white tracking-tight">Recent Entities</h3>
                <Printer size={18} className="text-slate-500 hover:text-white cursor-pointer transition-colors" />
              </div>
              <div className="flex flex-wrap gap-2">
                {['Hypertension', 'Lisinopril', 'Chronic Cough', 'Diabetes Type 2', 'Metformin', 'Shortness of Breath', 'Elevated BP'].map((tag, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/10 text-[11px] font-bold text-blue-400 hover:border-blue-500/40 cursor-pointer transition-all">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
