import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContextProvider';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Minus, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CartPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useCart();
  const { toast } = useToast();

  // LOG para debug: mostrar os itens do carrinho
  React.useEffect(() => {
    console.log("[CartPage] Itens recebidos da Context:", items);
  }, [items]);

  // Validar os itens de forma mais flexível (id presente)
  const validItems = items.filter(
    (item) =>
      !!item.produto &&
      typeof item.produto === 'object' &&
      typeof item.produto.id === 'string' &&
      !!item.filial &&
      typeof item.filial === 'object' &&
      typeof item.filial.id === 'string'
  );

  // If some items are corrupted, inform the user
  React.useEffect(() => {
    if (items.length > 0 && validItems.length !== items.length) {
      toast({
        title: "Itens inválidos removidos do carrinho",
        description: "Alguns itens estavam corrompidos e foram descartados.",
        variant: "destructive",
      });
      console.warn("[CartPage] Havia itens inválidos, veja detalhes acima. Itens válidos:", validItems, "Itens originais:", items);
      // clearCart(); // só use se quiser limpar tudo mesmo!
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length, validItems.length]); // run if item validity changes

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Acesso Restrito</h1>
          <p className="text-gray-600 mb-6">Você precisa estar logado para acessar seu carrinho.</p>
          <Button onClick={() => navigate('/login')}>
            Fazer Login
          </Button>
        </div>
      </Layout>
    );
  }

  const handleCheckout = () => {
    if (validItems.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione produtos ao carrinho antes de prosseguir.",
        variant: "destructive",
      });
      return;
    }
    navigate('/checkout');
  };

  if (validItems.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Seu carrinho está vazio</h1>
            <p className="text-gray-600 mb-6">Adicione produtos ao seu carrinho para continuar.</p>
            <Button onClick={() => navigate('/busca')}>
              Continuar Comprando
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Seu Carrinho
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ul>
              {validItems.map((item) => (
                <li key={`${item.produto?.id}-${item.filial?.id}`} className="mb-4 border-b pb-4">
                  <div className="flex items-center">
                    <img
                      src={item.produto.imagem_url?.[0] || 'https://via.placeholder.com/96'}
                      alt={item.produto.nome}
                      className="w-24 h-24 object-cover rounded mr-4"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">{item.produto.nome}</h3>
                      <p className="text-gray-500 text-sm">{item.filial.nome_filial}</p>
                      <p className="text-primary font-bold">
                        R$ {item.preco.toFixed(2)}
                      </p>
                      <div className="flex items-center mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.produto.id, item.filial.id, item.quantidade - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="mx-2">{item.quantidade}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.produto.id, item.filial.id, item.quantidade + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="ml-2"
                          onClick={() => removeItem(item.produto.id, item.filial.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex justify-between items-center">
              <Button variant="link" onClick={() => navigate('/busca')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continuar Comprando
              </Button>
              <div>
                <div className="text-right">
                  <p className="text-gray-600">Total:</p>
                  <p className="text-2xl font-bold text-primary">
                    R$ {getTotal().toFixed(2)}
                  </p>
                </div>
                <Button className="mt-2" onClick={handleCheckout}>
                  Finalizar Compra
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CartPage;
