import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, LayoutDashboard, FileText, Settings, HelpCircle, Database, ImageIcon, X } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile overlay */}
      <div 
        className={`fixed inset-0 bg-[#0a0f1e]/80 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      <aside className={`w-64 border-r border-white/10 flex flex-col h-screen fixed left-0 top-0 z-50 bg-[#0a0f1e]/95 backdrop-blur-xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Activity className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-white leading-none">MedExt<span className="text-cyan-400 self-start text-xs align-super ml-1">AI</span></h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-semibold">Diagnosis System</p>
            </div>
          </div>
          <button className="lg:hidden text-slate-400 hover:text-white transition-colors" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

      <nav className="flex-1 px-4 py-8 space-y-2">
        <NavLink to="/dashboard" onClick={onClose} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={18} />
          <span>Overview</span>
        </NavLink>
        <NavLink to="/extract" onClick={onClose} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <FileText size={18} />
          <span>Extraction</span>
        </NavLink>
        <NavLink to="/image-extract" onClick={onClose} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <ImageIcon size={18} />
          <span>Image Scan</span>
        </NavLink>
        <div className="sidebar-link" onClick={onClose}>
          <Database size={18} />
          <span>Records</span>
        </div>
        <div className="sidebar-link" onClick={onClose}>
          <Settings size={18} />
          <span>Settings</span>
        </div>
      </nav>

      <div className="p-4 mt-auto">
        <div className="glass-card p-4 bg-blue-500/5 border-blue-500/10">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle size={14} className="text-blue-400" />
            <span className="text-xs font-semibold text-blue-100">Help Center</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed mb-3">Learn how to maximize extraction accuracy with our documentation.</p>
          <button className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-medium transition-all duration-200">
            View Docs
          </button>
        </div>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;
