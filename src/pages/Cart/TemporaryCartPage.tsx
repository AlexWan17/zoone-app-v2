import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTemporaryCart } from '@/hooks/useTemporaryCart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  MapPin,
  UserPlus,
  Heart,
  CreditCard
} from 'lucide-react';
import HeaderImproved from '@/components/HeaderImproved';

const TemporaryCartPage = () => {
  const { items, updateQuantity, removeItem, getTotal, getItemsCount } = useTemporaryCart();
  const navigate = useNavigate();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const total = getTotal();
  const itemsCount = getItemsCount();

  const handleQuantityChange = (produtoId: string, filialId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(produtoId, filialId, newQuantity);
  };

  const handleCheckout = () => {
    // Visitante precisa criar conta/login ANTES de acessar "/checkout"
    setShowLoginPrompt(true);
  };

  const handleCreateAccount = () => {
    navigate('/registrar?redirect=/carrinho-temporario');
  };

  const handleLogin = () => {
    navigate('/login?redirect=/carrinho-temporario');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HeaderImproved />
        
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Seu carrinho está vazio
            </h1>
            <p className="text-gray-600 mb-8">
              Explore nossa seleção de produtos e encontre algo especial
            </p>
            <div className="space-y-4">
              <Link to="/busca">
                <Button className="bg-gradient-to-r from-primary to-primary-dark">
                  Explorar Produtos
                </Button>
              </Link>
              <div className="text-sm text-gray-500">
                <Link to="/registrar" className="text-primary hover:underline">
                  Crie uma conta
                </Link>
                {' '}para salvar seus favoritos e receber recomendações personalizadas
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderImproved />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Seu Carrinho
            </h1>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {itemsCount} {itemsCount === 1 ? 'item' : 'itens'}
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={`${item.produto.id}-${item.filial.id}`} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={(item.produto.imagem_url && item.produto.imagem_url[0]) || 'https://via.placeholder.com/80x80'} 
                          alt={item.produto.nome} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 line-clamp-2">
                          {item.produto.nome}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                          {item.produto.descricao}
                        </p>
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <MapPin className="w-3 h-3 mr-1" />
                          {item.filial.nome_filial}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-2">
                        <button
                          onClick={() => removeItem(item.produto.id, item.filial.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        
                        <div className="text-right">
                          <div className="font-bold text-lg">
                            R$ {(item.preco * item.quantidade).toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-500">
                            R$ {item.preco.toFixed(2)} cada
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuantityChange(item.produto.id, item.filial.id, item.quantidade - 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <Input
                            type="number"
                            value={item.quantidade}
                            onChange={(e) => handleQuantityChange(item.produto.id, item.filial.id, parseInt(e.target.value) || 1)}
                            className="w-16 text-center"
                            min="1"
                          />
                          <button
                            onClick={() => handleQuantityChange(item.produto.id, item.filial.id, item.quantidade + 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>R$ {total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Frete</span>
                    <span>Calculado no checkout</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>R$ {total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-primary to-primary-dark"
                    size="lg"
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Finalizar Compra
                  </Button>
                </CardContent>
              </Card>

              {/* Benefits Card */}
              <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-purple-600" />
                    Crie sua conta
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-700">
                    Cadastre-se e aproveite:
                  </p>
                  <ul className="text-sm space-y-1">
                    <li>✨ Recomendações personalizadas</li>
                    <li>🚚 Acompanhamento de pedidos</li>
                    <li>💝 Lista de favoritos</li>
                    <li>🎁 Ofertas exclusivas</li>
                  </ul>
                  <Button 
                    onClick={handleCreateAccount}
                    variant="outline" 
                    className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Criar Conta Grátis
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Finalizar Compra</h3>
            <p className="text-gray-600 mb-6">
              Para continuar com a compra, você precisa ter uma conta. Isso nos permite processar seu pedido e enviar atualizações.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={handleCreateAccount}
                className="w-full bg-gradient-to-r from-primary to-primary-dark"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Criar Conta (Recomendado)
              </Button>
              <Button 
                onClick={handleLogin}
                variant="outline" 
                className="w-full"
              >
                Já tenho conta
              </Button>
              <Button 
                onClick={() => setShowLoginPrompt(false)}
                variant="ghost" 
                className="w-full"
              >
                Continuar explorando
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemporaryCartPage;
