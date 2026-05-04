import { useEffect, useState } from "react";
import api from "../lib/api";
import type { DashboardResponse } from "../types";
import { Link } from "react-router-dom";

export const DashboardPage = () => {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get<DashboardResponse>("/dashboard");
        setData(response.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <div className="h-full w-full animate-pulse bg-white/5 rounded-3xl" />;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[70vh]">

      <div className="flex-1 flex flex-col justify-center animate-in">
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tighter mb-8">
          Is a Premier<br />
          Task & Team<br />
          Infrastructure<br />
          Pr<span className="inline-flex items-center justify-center w-[0.8em] h-[0.8em] bg-white/10 rounded-3xl border border-white/20 mx-1 align-middle"><span className="w-2 h-2 bg-white rounded-full"></span></span>vider
        </h1>
        
        <div className="max-w-md border-l-2 border-[var(--accent)] pl-6 py-2">
          <p className="text-sm text-[var(--text-muted)] font-medium leading-relaxed">
            Renowned for powering the backbone of productive ecosystems with our state-of-the-art task validation services, real-time sync endpoints, and intuitive interfaces.
          </p>
        </div>
      </div>


      <div className="lg:w-[400px] flex flex-col justify-end gap-4 animate-in delay-200">
        <div className="bento-card-solid relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div className="text-[64px] font-display font-bold leading-none mb-2 text-[var(--accent)]">
            {data?.kpis.total ?? 0}
          </div>
          <div className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
            Active Tasks under management
          </div>
        </div>

        <div className="flex gap-4">
          <div className="bento-card-solid flex-1 relative overflow-hidden">
            <div className="text-4xl font-display font-bold leading-none mb-2">
              {data?.kpis.done ?? 0}
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
              Completed
            </div>
          </div>
          
          <div className="bento-card-solid flex-1 relative overflow-hidden bg-white text-black border-none">
            <div className="text-4xl font-display font-bold leading-none mb-2 text-black">
              {data?.kpis.overdue ?? 0}
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-black/60">
              Overdue / Alert
            </div>
          </div>
        </div>
        

        <div className="h-16 rounded-[2rem] border border-white/10 flex items-center justify-between px-6 bg-white/5 backdrop-blur-md">
          <div className="flex -space-x-3">
             <div className="w-8 h-8 rounded-full bg-[var(--accent)] border-2 border-[var(--main-bg)] flex items-center justify-center">
               <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/></svg>
             </div>
             <div className="w-8 h-8 rounded-full bg-white border-2 border-[var(--main-bg)] flex items-center justify-center">
               <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 2v20M2 12h20" strokeLinecap="round" strokeLinejoin="round"/></svg>
             </div>
             <div className="w-8 h-8 rounded-full bg-[#1c1c1f] border-2 border-[var(--main-bg)] flex items-center justify-center">
               <div className="w-2 h-2 rounded-full bg-white" />
             </div>
          </div>
          <Link to="/projects" className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent)] hover:text-white transition-colors">
            View Metrics ↗
          </Link>
        </div>
      </div>
    </div>
  );
};
