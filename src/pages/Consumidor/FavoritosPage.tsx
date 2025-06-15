
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

const FavoritosPage = () => {
  return (
    <Layout>
      <Card className="max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>Favoritos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-3">
            Aqui você verá produtos, lojas ou categorias marcados como favoritos.
          </p>
          <div className="p-4 text-gray-400 flex flex-col items-center">
            <Heart className="w-8 h-8 mb-2" />
            Nenhum favorito adicionado ainda.
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default FavoritosPage;
