
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminStatCard from "@/components/admin/AdminStatCard";

const AdminDashboard = () => {
  // MOCK ATÉ TER SQL: Substituir por fetch do backend futuramente!
  const stats = [
    { title: "Usuários Consumidores", value: 1320 },
    { title: "Lojistas", value: 38 },
    { title: "Produtos Tokenizados", value: 89 },
    { title: "Produtos vendidos via Tokens", value: 21, hint: "Este mês" },
    { title: "Acessos Provador Virtual", value: 214 },
  ];

  // Exemplo de proteção Alta: (usar role admin real quando criar tabela)
  // Se não for admin, render redirecionamento fino (ajustar com Supabase depois!)
  // Aqui apenas simula admin pelo email
  const currentUser = { email: "admin@zoone.ai" };
  if (currentUser.email !== "admin@zoone.ai") {
    return (
      <AdminLayout>
        <div className="text-center mt-12 text-red-500 font-bold">
          Você não possui permissão para acessar esta área!
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-8">Dashboard Zoone Admin</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <AdminStatCard key={i} {...s} />
        ))}
      </div>
      <div className="mt-8">
        <h2 className="font-semibold text-lg mb-3">Notificações recentes</h2>
        <div className="bg-white rounded shadow p-4 text-gray-500 text-sm">Nenhuma notificação.</div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
