
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProdutosReservadosPage = () => {
  return (
    <Layout>
      <Card className="max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>Produtos Reservados</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Confira aqui os produtos que você reservou em nossas lojas parceiras.</p>
          {/* Em breve: Listagem de reservas reais do usuário */}
        </CardContent>
      </Card>
    </Layout>
  );
};

export default ProdutosReservadosPage;
