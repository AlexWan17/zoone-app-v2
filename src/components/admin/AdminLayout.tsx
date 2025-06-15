
import React from "react";

type AdminLayoutProps = {
  children: React.ReactNode;
};

const menu = [
  { label: "Dashboard", path: "/admin/dashboard" },
  { label: "Usuários", path: "/admin/usuarios" },
  { label: "Lojistas", path: "/admin/lojistas" },
  { label: "Produtos", path: "/admin/produtos" },
  { label: "Tokens", path: "/admin/tokens" },
  { label: "Espaços/Mapas", path: "/admin/espacos" },
  { label: "Push/Notificações", path: "/admin/push" },
];

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-primary px-6 py-4 flex items-center">
        <span className="text-xl font-bold text-white">Zoone Admin</span>
      </nav>
      <div className="flex flex-1">
        <aside className="w-56 bg-white border-r px-4 py-6 hidden sm:block">
          <ul>
            {menu.map(m => (
              <li key={m.path}>
                <a
                  href={m.path}
                  className="block px-3 py-2 rounded text-gray-700 hover:bg-primary/10 mb-1 transition-colors font-medium"
                >
                  {m.label}
                </a>
              </li>
            ))}
          </ul>
        </aside>
        <main className="flex-1 px-4 py-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
