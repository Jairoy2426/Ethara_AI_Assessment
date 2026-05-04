import { FormEvent, useEffect, useMemo, useState } from "react";
import api from "../lib/api";
import type { Project, ProjectMember, Task } from "../types";
import { useAuth } from "../context/AuthContext";

const statuses: Array<Task["status"]> = ["todo", "in_progress", "done"];
const statusLabels: Record<string, string> = {
  todo: "Awaiting Ops",
  in_progress: "Processing",
  done: "Validated"
};

export const TasksPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("medium");
  const [assigneeId, setAssigneeId] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const load = async () => {
      const response = await api.get<Project[]>("/projects");
      setProjects(response.data);
      if (response.data.length > 0) setSelectedProjectId(response.data[0].id);
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    if (!selectedProjectId) return;
    const loadData = async () => {
      const [tasksRes, membersRes] = await Promise.all([
        api.get<Task[]>(`/tasks/${selectedProjectId}`),
        api.get<ProjectMember[]>(`/projects/${selectedProjectId}/members`)
      ]);
      setTasks(tasksRes.data);
      setMembers(membersRes.data);
    };
    loadData();
  }, [selectedProjectId]);

  const grouped = useMemo(() => {
    return statuses.reduce((acc, s) => {
      acc[s] = tasks.filter(t => t.status === s);
      return acc;
    }, {} as Record<string, Task[]>);
  }, [tasks]);

  const onCreate = async (e: FormEvent) => {
    e.preventDefault();
    const res = await api.post<Task>(`/tasks/${selectedProjectId}`, { title, priority, assignedTo: assigneeId || undefined });
    setTasks([res.data, ...tasks]);
    setTitle("");
    setShowForm(false);
  };

  if (loading) return <div className="h-full w-full animate-pulse bg-white/5 rounded-3xl" />;

  return (
    <div className="h-full flex flex-col max-w-[1400px] mx-auto animate-in w-full">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
        <div className="flex flex-col items-start gap-2">
          <select 
            value={selectedProjectId ?? ""} 
            onChange={e => setSelectedProjectId(e.target.value)}
            className="bg-transparent font-display text-5xl md:text-7xl font-bold tracking-tighter border-none focus:ring-0 p-0 cursor-pointer hover:opacity-70 transition-opacity outline-none"
            style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
          >
            {projects.map(p => <option key={p.id} value={p.id} className="bg-[var(--main-bg)] text-xl">{p.name}</option>)}
          </select>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent)] border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-3 py-1 rounded-full">
             {tasks.length} Active Endpoints
          </span>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary shrink-0">
          Inject Request
        </button>
      </header>

      {showForm && (
        <form onSubmit={onCreate} className="bento-card-solid mb-12 animate-in bg-white/5">
          <div className="grid gap-6 md:grid-cols-4 items-end">
            <div className="md:col-span-2 space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Payload Detail</label>
              <input value={title} onChange={e => setTitle(e.target.value)} className="input-base" placeholder="Describe the transaction..." required />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Priority Level</label>
              <select value={priority} onChange={e => setPriority(e.target.value as any)} className="input-base">
                <option value="low">Low (Batch)</option>
                <option value="medium">Medium (Standard)</option>
                <option value="high">High (Real-time)</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary w-full px-0 flex-1">Send</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary px-4">✕</button>
            </div>
          </div>
        </form>
      )}


      <div className="grid gap-6 lg:gap-10 lg:grid-cols-3 flex-1 pb-10">
        {statuses.map(s => (
          <div key={s} className="flex flex-col gap-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${s === 'todo' ? 'bg-white/30' : s === 'in_progress' ? 'bg-[var(--accent)]' : 'bg-white'}`} />
                {statusLabels[s]}
              </h3>
              <span className="font-display font-bold text-xl">{grouped[s]?.length || 0}</span>
            </div>
            
            <div className="space-y-4">
              {grouped[s]?.map((t, i) => <TaskItem key={t.id} task={t} index={i} members={members} onUpdate={async (id, data) => {
                await api.patch(`/tasks/${selectedProjectId}/${id}`, data);
                const res = await api.get<Task[]>(`/tasks/${selectedProjectId}`);
                setTasks(res.data);
              }} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TaskItem = ({ task, index, onUpdate }: any) => {
  return (
    <div 
      className="bento-card-solid p-6 group transition-colors hover:border-white/20"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex justify-between items-start mb-4 gap-4">
         <span className={`badge ${task.priority === 'high' ? 'border-red-500/50 text-red-400 bg-red-500/10' : task.priority === 'medium' ? 'border-white/20 text-white' : 'border-white/10 text-white/50'}`}>
            P-{task.priority.charAt(0).toUpperCase()}
         </span>
         <span className="text-[10px] font-bold text-[var(--text-muted)] font-mono opacity-50">
           #{task.id.slice(-6)}
         </span>
      </div>
      
      <h4 className="font-display text-lg font-bold mb-6 leading-tight">{task.title}</h4>
      
      <div className="flex items-center justify-between">
        <div className="h-8 w-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs border-2 border-[var(--card-bg)] shadow-[0_0_15px_rgba(255,255,255,0.2)]">
          {task.assignee?.name?.charAt(0) || '?'}
        </div>
        
        <select 
          value={task.status} 
          onChange={e => onUpdate(task.id, { status: e.target.value })}
          className="bg-transparent border border-white/10 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 cursor-pointer outline-none"
        >
          {statuses.map(s => <option key={s} value={s} className="bg-[var(--main-bg)]">{statusLabels[s]}</option>)}
        </select>
      </div>
    </div>
  );
}
