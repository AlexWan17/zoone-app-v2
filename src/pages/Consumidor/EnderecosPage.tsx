
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MapPin } from "lucide-react";

const enderecosMock = []; // No futuro: substituir por integração real

const EnderecosPage = () => {
  return (
    <Layout>
      <Card className="max-w-2xl mx-auto mt-8">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Endereços</CardTitle>
          <Button variant="outline" size="sm" disabled>
            <Plus className="w-4 h-4 mr-2" />
            Novo Endereço
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-3">
            Cadastre ou edite seus endereços de entrega. Funcionalidade completa em breve!
          </p>
          <div className="space-y-4">
            {enderecosMock.length === 0 ? (
              <div className="p-4 text-gray-400 flex flex-col items-center">
                <MapPin className="w-8 h-8 mb-2" />
                Nenhum endereço cadastrado ainda.
              </div>
            ) : (
              <ul>
                {/* Mapeamento de endereços, no futuro */}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default EnderecosPage;
