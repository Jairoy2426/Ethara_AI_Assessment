import { FormEvent, useEffect, useState } from "react";
import api from "../lib/api";
import type { Project } from "../types";
import { useAuth } from "../context/AuthContext";

export const ProjectsPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const canCreate = user?.role === "admin";

  const load = async () => {
    const response = await api.get<Project[]>("/projects");
    setProjects(response.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const onCreate = async (event: FormEvent) => {
    event.preventDefault();
    const response = await api.post<Project>("/projects", { name, description });
    setProjects([response.data, ...projects]);
    setName("");
    setDescription("");
    setShowForm(false);
  };

  if (loading) {
    return <div className="h-full w-full animate-pulse bg-white/5 rounded-3xl" />;
  }

  return (
    <div className="max-w-5xl mx-auto w-full animate-in">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tighter mb-4">
            Network <br/><span className="text-[var(--text-muted)]">Projects</span>
          </h1>
          <p className="text-sm font-medium text-[var(--text-muted)] max-w-sm">
            Manage your decentralized nodes, infrastructure clusters, and team assignments in one unified interface.
          </p>
        </div>
        {canCreate && (
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            Initialize Cluster
          </button>
        )}
      </header>

      {showForm && (
        <form onSubmit={onCreate} className="bento-card-solid mb-8 animate-in border border-[var(--accent)]/30 shadow-[0_0_30px_rgba(176,136,249,0.1)]">
          <h3 className="text-xl font-display font-bold mb-6">New Cluster Details</h3>
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Cluster Name</label>
              <input value={name} onChange={e => setName(e.target.value)} className="input-base" placeholder="e.g. Validator Node Alpha" required />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Network Description</label>
              <input value={description} onChange={e => setDescription(e.target.value)} className="input-base" placeholder="Brief overview" />
            </div>
          </div>
          <div className="flex gap-4">
            <button type="submit" className="btn-primary">Deploy</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Abort</button>
          </div>
        </form>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.length === 0 ? (
          <div className="col-span-full py-20 text-center">
             <div className="text-[var(--text-muted)] font-display text-2xl">No active networks detected.</div>
          </div>
        ) : (
          projects.map((p, i) => <ProjectCard key={p.id} project={p} index={i} onAdded={load} />)
        )}
      </div>
    </div>
  );
};

const ProjectCard = ({ project, index, onAdded }: any) => {
  const progress = project.totalTasks ? Math.round((project.doneTasks / project.totalTasks) * 100) : 0;
  
  return (
    <div className="bento-card-solid flex flex-col group animate-in relative overflow-hidden" style={{ animationDelay: `${index * 100}ms` }}>

      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full border border-white/5 group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
      <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full border border-[var(--accent)]/20 group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

      <div className="mb-8 relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="h-12 w-12 rounded-full bg-white text-black flex items-center justify-center">
             <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span className={`badge ${project.memberRole === 'admin' ? "badge-accent" : "badge-outline"}`}>
            {project.memberRole}
          </span>
        </div>
        <h3 className="font-display font-bold text-2xl mb-2">{project.name}</h3>
        <p className="text-sm text-[var(--text-muted)]">{project.description || "Unspecified protocol"}</p>
      </div>

      <div className="mt-auto relative z-10">
        <div className="flex items-end justify-between mb-3">
          <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Health Sync</div>
          <div className="font-display font-bold text-xl">{progress}%</div>
        </div>
        <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden mb-6">
          <div className="h-full bg-[var(--accent)]" style={{ width: `${progress}%` }} />
        </div>
        
        <MemberInvite projectId={project.id} onAdded={onAdded} />
      </div>
    </div>
  );
};

const MemberInvite = ({ projectId, onAdded }: any) => {
  const [email, setEmail] = useState("");
  const [expanded, setExpanded] = useState(false);
  
  if (!expanded) return (
    <button onClick={() => setExpanded(true)} className="w-full py-3 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-widest text-white hover:bg-white/5 transition-colors">
      Add Node Operator
    </button>
  );

  return (
    <form onSubmit={async (e) => {
      e.preventDefault();
      await api.post(`/projects/${projectId}/members`, { email, role: 'member' });
      setEmail("");
      setExpanded(false);
      onAdded();
    }} className="flex flex-col gap-2 animate-in">
      <input value={email} onChange={e => setEmail(e.target.value)} className="input-base py-3 text-xs" placeholder="operator@domain.com" type="email" required />
      <div className="flex gap-2">
        <button type="submit" className="btn-primary py-2 flex-1 text-xs">Verify & Add</button>
        <button type="button" onClick={() => setExpanded(false)} className="btn-secondary py-2 px-4 text-xs">✕</button>
      </div>
    </form>
  );
}
