import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { checkSystemHealth } from '../store/medextSlice';
import { Search, Bell, Menu, Cpu, ChevronDown } from 'lucide-react';

const Header = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const { health } = useSelector((state) => state.medext);

  useEffect(() => {
    dispatch(checkSystemHealth());
  }, [dispatch]);

  return (
    <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#0a0f1e]/40 backdrop-blur-md sticky z-40 mt-1">
      <div className="flex items-center gap-6">
        <button onClick={onMenuClick} className="lg:hidden text-slate-400 hover:text-white transition-colors">
          <Menu size={20} />
        </button>
        <div className="relative group hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search extraction history..."
            className="w-80 h-10 bg-slate-800/20 border border-white/10 rounded-xl pl-10 pr-4 text-xs font-medium focus:outline-none focus:border-blue-500/50 focus:bg-slate-800/40 transition-all duration-300"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-sm shadow-emerald-500/5">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-tighter">
            {health?.status || 'Active'}
          </span>
          <div className="h-3 w-[1px] bg-emerald-500/20 mx-1" />
          <div className="flex items-center gap-1">
            <Cpu size={12} className="text-emerald-400" />
            <span className="text-[10px] font-medium text-emerald-300/80">Llama3.1</span>
          </div>
        </div>

        <div className="h-8 w-[1px] bg-white/5 mx-2" />

        <div className="flex items-center gap-4">
          <button className="relative p-2 text-slate-400 hover:text-white transition-colors bg-white/5 rounded-xl hover:bg-white/10">
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 border-2 border-[#0a0f1e] rounded-full" />
          </button>

          <div className="flex items-center gap-3 pl-2 cursor-pointer group">
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-white leading-none">Shafaat</span>
              <span className="text-[10px] text-slate-500 mt-1 font-semibold uppercase tracking-widest">Medical Admin</span>
            </div>
            <div className="relative">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                alt="Profile"
                className="w-10 h-10 rounded-xl border border-white/10 bg-slate-800 p-0.5 group-hover:border-blue-500/40 transition-all"
              />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-[#0a0f1e] rounded-full" />
            </div>
            <ChevronDown size={14} className="text-slate-500 group-hover:text-white transition-colors" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
