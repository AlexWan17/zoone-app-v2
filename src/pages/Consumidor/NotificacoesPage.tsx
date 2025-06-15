
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";

const NotificacoesPage = () => {
  return (
    <Layout>
      <Card className="max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>Notificações</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-3">
            Gerencie notificações por push, e-mail ou SMS.
          </p>
          <div className="p-4 text-gray-400 flex flex-col items-center">
            <Bell className="w-8 h-8 mb-2" />
            Nenhuma notificação recebida ainda.
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default NotificacoesPage;
