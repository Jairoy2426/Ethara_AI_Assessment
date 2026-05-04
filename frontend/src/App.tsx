import { Link, Navigate, Route, Routes, NavLink, useLocation, Outlet } from "react-router-dom";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { AdminRoute } from "./routes/AdminRoute";
import { LoginPage } from "./pages/Login";
import { SignupPage } from "./pages/Signup";
import { DashboardPage } from "./pages/Dashboard";
import { ProjectsPage } from "./pages/Projects";
import { TasksPage } from "./pages/Tasks";
import { AdminPage } from "./pages/Admin";
import { useAuth } from "./context/AuthContext";

const AppLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { to: "/dashboard", label: "OVERVIEW" },
    { to: "/projects", label: "PROJECTS" },
    { to: "/tasks", label: "TASKS" }
  ];

  return (
    <div className="app-container">
      <div className="glowing-bg"></div>
      
      <div className="content-layer h-full flex flex-col">

        <header className="flex items-center justify-between px-8 py-6">
          <Link to="/dashboard" className="flex items-center gap-3">
            <span className="font-display text-2xl font-bold tracking-tight">
              {"}"} TaskNode
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `text-xs font-bold tracking-widest uppercase transition-colors ${
                    isActive ? "text-white" : "text-[var(--text-muted)] hover:text-white"
                  }`
                }
              >
                {item.label} <sup className="text-[10px] opacity-50 ml-0.5">0{navItems.indexOf(item) + 1}</sup>
              </NavLink>
            ))}
            
            {user?.role === "admin" && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `text-xs font-bold tracking-widest uppercase transition-colors ${
                    isActive ? "text-[var(--accent)]" : "text-[var(--text-muted)] hover:text-[var(--accent)]"
                  }`
                }
              >
                ADMIN <sup className="text-[10px] opacity-50 ml-0.5">04</sup>
              </NavLink>
            )}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 mr-4">
              <div className="text-right">
                <div className="text-sm font-bold">{user?.name}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">{user?.role}</div>
              </div>
              <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center font-display font-bold">
                {user?.name?.charAt(0)}
              </div>
            </div>
            <button onClick={logout} className="btn-secondary px-4">
              EXIT
            </button>
          </div>
        </header>


        <main className="flex-1 overflow-y-auto px-4 md:px-8 pb-8 pt-4 custom-scroll">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export const App = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route element={<ProtectedRoute />}>
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>
      </Route>
    </Route>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);
