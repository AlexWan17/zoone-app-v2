
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

const AjudaPage = () => {
  return (
    <Layout>
      <Card className="max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>Central de Ajuda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-3 text-gray-600">
            <p>
              Precisa de suporte? Acesse perguntas frequentes, tutoriais ou entre em contato:
            </p>
            <ul className="list-disc ml-4 mt-2 text-sm">
              <li>FAQ: Sua dúvida pode estar aqui!</li>
              <li>E-mail: suporte@zoone.com</li>
              <li>Whatsapp: (11) 9 9999-9999</li>
            </ul>
          </div>
          <div className="p-4 text-gray-400 flex flex-col items-center">
            <HelpCircle className="w-8 h-8 mb-2" />
            Dúvida? Conte com a gente!
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default AjudaPage;
