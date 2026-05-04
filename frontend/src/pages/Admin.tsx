import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import type { User } from "../types";

export const AdminPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get<User[]>("/users");
        setUsers(res.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto w-full animate-in space-y-12">
      <header>
        <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tighter mb-4">
          Admin <br/><span className="text-[var(--text-muted)]">Console</span>
        </h1>
        <p className="text-sm font-medium text-[var(--text-muted)] max-w-sm">
          System-wide permissions, infrastructure logs, and node operator management.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">

        <div className="md:col-span-2 bento-card-solid relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--accent)]/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
          
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-8">Active Identity</h3>
          
          <div className="flex items-center gap-8 relative z-10">
             <div className="w-24 h-24 rounded-[2rem] bg-[var(--accent)] text-white flex items-center justify-center font-display text-4xl font-bold border border-white/20 shadow-[0_0_50px_rgba(176,136,249,0.3)]">
               {currentUser?.name?.charAt(0)}
             </div>
             <div>
                <h2 className="font-display text-3xl font-bold mb-1">{currentUser?.name}</h2>
                <p className="text-[var(--text-muted)] font-mono text-sm mb-4">{currentUser?.email}</p>
                <div className="flex gap-2">
                   <span className="badge badge-accent shadow-[0_0_15px_rgba(176,136,249,0.2)]">ROOT ACCESS</span>
                </div>
             </div>
          </div>
        </div>


        <div className="bento-card-solid flex flex-col justify-between">
           <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4">Node Telemetry</h3>
           <div className="space-y-4 flex-1 flex flex-col justify-center">
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                 <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Uptime</span>
                 <span className="font-mono text-white text-sm">99.99%</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                 <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Latency</span>
                 <span className="font-mono text-white text-sm">12ms</span>
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Status</span>
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
                    <span className="font-mono text-emerald-500 text-sm">SYNCED</span>
                 </div>
              </div>
           </div>
        </div>
      </div>


      <div className="bento-card-solid p-0 overflow-hidden">
        <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold">Operator Directory</h2>
          <span className="badge badge-outline">{users.length} Active</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5">
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">Identity</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">Access Level</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] text-right">Registration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={3} className="px-8 py-12 text-center text-[var(--text-muted)] font-mono text-sm animate-pulse">Querying nodes...</td></tr>
              ) : (
                users.map(u => (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-white text-black flex items-center justify-center font-bold text-sm">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                           <div className="font-bold text-white mb-0.5">{u.name}</div>
                           <div className="text-xs font-mono text-[var(--text-muted)] opacity-70">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className={`badge ${u.role === 'admin' ? "badge-accent" : "badge-outline"}`}>
                         {u.role}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-xs font-mono text-[var(--text-muted)] text-right">
                      {u.createdAt ? new Date(u.createdAt).toISOString().split('T')[0] : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
