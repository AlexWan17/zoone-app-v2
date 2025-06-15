
import React from "react";
import Layout from "@/components/LojistaLayout";
import ImportWizard from "@/components/ImportarProdutos/ImportWizard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const ImportarProdutosPage = () => {
  return (
    <Layout title="Importar Produtos em Massa">
      <Card className="max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>Importar Produtos em Massa</CardTitle>
        </CardHeader>
        <CardContent>
          <ImportWizard />
        </CardContent>
      </Card>
    </Layout>
  );
};

export default ImportarProdutosPage;
