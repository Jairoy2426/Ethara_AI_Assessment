import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signup(name, email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8 bg-[var(--outer-bg)]">
      <div className="w-full max-w-[500px] app-container relative z-10 flex flex-col p-8 sm:p-12 animate-in shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
        <div className="glowing-bg opacity-50"></div>
        
        <div className="relative z-10">
          <div className="mb-10 text-center">
            <h1 className="font-display text-4xl font-bold tracking-tight mb-2">{"}"} Initialize</h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Register New Node Operator</p>
          </div>

          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Operator Identity</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-base"
                placeholder="Alias or Designation"
                required
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Comm Channel (Email)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-base"
                placeholder="node@infrastructure.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Security Key</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-base font-mono"
                placeholder="Min 8 cycles"
                required
                minLength={8}
              />
            </div>
            {error && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs font-mono text-red-400 animate-in">
                [ERR] {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-base tracking-wider"
            >
              {loading ? "PROVISIONING..." : "DEPLOY OPERATOR"}
            </button>
          </form>

          <p className="mt-8 text-center text-xs font-mono text-[var(--text-muted)]">
            ALREADY PROVISIONED?{" "}
            <Link className="font-bold text-[var(--accent)] hover:text-white transition-colors border-b border-transparent hover:border-white" to="/login">
              AUTHENTICATE
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
