
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListPlus } from "lucide-react";

const ListaDesejosPage = () => {
  return (
    <Layout>
      <Card className="max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>Lista de Desejos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-3">
            Adicione produtos à sua lista de desejos para acompanhar ofertas.
          </p>
          <div className="p-4 text-gray-400 flex flex-col items-center">
            <ListPlus className="w-8 h-8 mb-2" />
            Nenhuma desejo/adicionado ainda.
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default ListaDesejosPage;
