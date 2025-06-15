
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ConfiguracoesPage = () => {
  return (
    <Layout>
      <Card className="max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>Configurações da Conta</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Altere dados pessoais, preferências ou configurações de privacidade.</p>
          {/* Em breve: opções configuráveis do usuário */}
        </CardContent>
      </Card>
    </Layout>
  );
};

export default ConfiguracoesPage;
