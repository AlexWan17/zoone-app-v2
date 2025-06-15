
import { useState, useEffect } from 'react';
import { Produto, Filial } from '@/types';
import { useToast } from '@/hooks/use-toast';

export interface TemporaryCartItem {
  produto: Produto;
  filial: Filial;
  preco: number;
  quantidade: number;
}

export const useTemporaryCart = () => {
  const [items, setItems] = useState<TemporaryCartItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem('temporary_cart');
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {
        localStorage.removeItem('temporary_cart');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('temporary_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (produto: Produto, filial: Filial, preco: number, quantidade = 1) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.produto.id === produto.id && item.filial.id === filial.id
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantidade += quantidade;
        toast({
          title: "Produto atualizado",
          description: `${produto.nome} - ${updated[existingIndex].quantidade} unidades`,
        });
        return updated;
      }

      toast({
        title: "Produto adicionado",
        description: `${produto.nome} adicionado ao carrinho`,
      });

      return [...prev, { produto, filial, preco, quantidade }];
    });
  };

  const removeItem = (produtoId: string, filialId: string) => {
    setItems(prev => prev.filter(
      item => !(item.produto.id === produtoId && item.filial.id === filialId)
    ));
    toast({
      title: "Produto removido",
      description: "Item removido do carrinho",
    });
  };

  const updateQuantity = (produtoId: string, filialId: string, quantidade: number) => {
    if (quantidade <= 0) {
      removeItem(produtoId, filialId);
      return;
    }

    setItems(prev => prev.map(item => 
      item.produto.id === produtoId && item.filial.id === filialId
        ? { ...item, quantidade }
        : item
    ));
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('temporary_cart');
  };

  const getTotal = () => {
    return items.reduce((total, item) => total + item.preco * item.quantidade, 0);
  };

  const getItemsCount = () => {
    return items.reduce((total, item) => total + item.quantidade, 0);
  };

  const transferToAccount = () => {
    // Esta função será chamada quando o usuário fizer login
    // Os itens serão transferidos para o carrinho da conta
    const tempItems = [...items];
    clearCart();
    return tempItems;
  };

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotal,
    getItemsCount,
    transferToAccount
  };
};
