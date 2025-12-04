import { LayoutDashboard, Library, BookOpen, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";

export function Sidebar() {
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Library, label: "Library", path: "/library" },
    { icon: BookOpen, label: "Songbook", path: "/songbook" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0">
      {/* Brand Header */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-400 tracking-tight">
          Delta<span className="text-white">FretFlow</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              ${
                isActive
                  ? "bg-blue-600/20 text-blue-400 font-medium"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }
            `}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer / User Info */}
      <div className="p-4 border-t border-slate-800">
        <div className="text-xs text-slate-500 text-center">
          v1.0.0 &bull; Local-First
        </div>
      </div>
    </aside>
  );
}
