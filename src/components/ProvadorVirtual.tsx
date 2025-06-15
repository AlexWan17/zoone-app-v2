
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Camera, User, Shirt } from 'lucide-react';

const ProvadorVirtual = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-primary to-primary-dark rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-dark mb-4">
            Provador Virtual com IA
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experimente roupas e acessórios virtualmente antes de comprar
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Tecnologia em Desenvolvimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-primary/10 to-primary-dark/10 rounded-xl p-8 text-center">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <User className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-dark mb-2">Avatar 3D</h3>
                  <p className="text-sm text-gray-600">
                    Criação de avatar personalizado baseado em suas medidas
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <Shirt className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-dark mb-2">Simulação Real</h3>
                  <p className="text-sm text-gray-600">
                    Visualização realista de como as roupas ficam em você
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-dark mb-2">IA Avançada</h3>
                  <p className="text-sm text-gray-600">
                    Inteligência artificial para recomendações personalizadas
                  </p>
                </div>
              </div>
              
              <div className="bg-white/70 rounded-xl p-6 border-2 border-dashed border-primary/30">
                <h2 className="text-2xl font-bold text-primary mb-4">🚀 Em Breve</h2>
                <p className="text-gray-600 mb-4">
                  Nossa equipe está desenvolvendo uma experiência revolucionária de provador virtual. 
                  Em breve você poderá experimentar qualquer produto antes de comprar!
                </p>
                <Button 
                  variant="outline" 
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                >
                  Receber Novidades
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProvadorVirtual;
