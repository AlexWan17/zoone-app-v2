
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Upload, Sparkles, Shirt, Eye } from 'lucide-react';

const VirtualTryOn = () => {
  const [isComingSoon] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Sparkles className="h-16 w-16 text-purple-500 animate-pulse" />
              <div className="absolute -top-2 -right-2">
                <div className="h-6 w-6 bg-yellow-400 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Provador Virtual
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Experimente roupas virtualmente usando tecnologia de Inteligência Artificial. 
            Veja como as peças ficam em você antes de comprar!
          </p>
          
          {isComingSoon && (
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-6 py-3 rounded-full font-semibold">
              <Eye className="h-5 w-5" />
              Em Desenvolvimento
            </div>
          )}
        </div>

        {/* Preview do que está por vir */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="border-2 border-dashed border-gray-300 bg-white/50">
            <CardHeader>
              <Camera className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <CardTitle className="text-center">Foto ou Webcam</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-600">
                Tire uma foto ou use sua webcam para criar seu avatar virtual
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-dashed border-gray-300 bg-white/50">
            <CardHeader>
              <Shirt className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-center">Escolha a Roupa</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-600">
                Selecione qualquer produto do catálogo para experimentar
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-dashed border-gray-300 bg-white/50">
            <CardHeader>
              <Sparkles className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <CardTitle className="text-center">IA em Ação</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-600">
                Nossa IA renderiza a roupa em você com precisão fotorrealística
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Demo placeholder */}
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Preview da Tecnologia</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-4">
                    Área de demonstração do provador virtual
                  </p>
                  <p className="text-gray-400">
                    Em breve você poderá experimentar roupas aqui!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-6">
            Interessado em ser notificado quando o provador virtual estiver disponível?
          </p>
          <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
            Notifique-me quando estiver pronto
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VirtualTryOn;
