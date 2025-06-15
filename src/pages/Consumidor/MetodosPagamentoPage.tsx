
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

const MetodosPagamentoPage = () => {
  return (
    <Layout>
      <Card className="max-w-2xl mx-auto mt-8">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Métodos de Pagamento</CardTitle>
          <Button variant="outline" size="sm" disabled>
            <Plus className="w-4 h-4 mr-2" />
            Novo Cartão
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-3">
            Em breve você poderá adicionar, editar ou remover seus métodos de pagamento, inclusive com integração Stripe!
          </p>
          <div className="p-4 text-gray-400 flex flex-col items-center">
            <CreditCard className="w-8 h-8 mb-2" />
            Nenhum método de pagamento cadastrado ainda.
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default MetodosPagamentoPage;
