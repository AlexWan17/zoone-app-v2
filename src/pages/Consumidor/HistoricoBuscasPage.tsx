
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";

const HistoricoBuscasPage = () => {
  return (
    <Layout>
      <Card className="max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>Histórico de Buscas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-3">
            Veja aqui os últimos produtos e buscas realizadas.
          </p>
          <div className="p-4 text-gray-400 flex flex-col items-center">
            <Search className="w-8 h-8 mb-2" />
            Nenhum histórico registrado ainda.
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default HistoricoBuscasPage;
