
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Filial, Produto } from '@/types';
import { useToast } from '@/hooks/use-toast';

type CartContextType = {
  items: CartItem[];
  addToCart: (produto: Produto, filial: Filial, preco: number, quantidade?: number) => void;
  removeFromCart: (produtoId: string, filialId: string) => void;
  removeItem: (produtoId: string, filialId: string) => void;
  updateQuantity: (produtoId: string, filialId: string, quantidade: number) => void;
  clearCart: () => void;
  getTotalByFilial: (filialId: string) => number;
  getTotal: () => number;
  getItemsCountByFilial: (filialId: string) => number;
  getItemsCount: () => number;
  getUniqueFiliais: () => Filial[];
  getItemsByFilial: (filialId: string) => CartItem[];
};

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper: filtra itens com produto/filial minimamente válidos (precisa de id)
function filterLooseValidItems(arr: any[]): any[] {
  const result = arr.filter(
    (item) =>
      !!item &&
      typeof item === 'object' &&
      item.produto &&
      typeof item.produto === 'object' &&
      typeof item.produto.id === 'string' &&
      item.filial &&
      typeof item.filial === 'object' &&
      typeof item.filial.id === 'string'
  );
  if (arr.length !== result.length) {
    console.warn("[CartContext] Foram removidos itens inválidos do carrinho (filtro mais tolerante). Itens originais:", arr, "Itens válidos:", result);
  }
  return result;
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  // Load cart from localStorage usando novo filtro
  useEffect(() => {
    const storedCart = localStorage.getItem('zoone_cart');
    if (storedCart) {
      let arr: CartItem[] = [];
      try {
        arr = JSON.parse(storedCart);
      } catch {
        arr = [];
      }
      console.log("[CartContext] Carrinho carregado do localStorage:", arr);
      const validArr = filterLooseValidItems(arr);
      if (arr.length !== validArr.length) {
        toast({
          title: "Carrinho corrigido",
          description: "Itens incompletos removidos do carrinho.",
          variant: "destructive",
        });
      }
      setItems(validArr);
    }
  }, []);

  // Save cart to localStorage, mostrar no log o conteúdo
  useEffect(() => {
    const validArr = filterLooseValidItems(items);
    localStorage.setItem('zoone_cart', JSON.stringify(validArr));
    console.log("[CartContext] Carrinho salvo:", validArr);
  }, [items]);

  const addToCart = (produto: Produto, filial: Filial, preco: number, quantidade = 1) => {
    setItems(prevItems => {
      // Check if item already exists
      const existingItemIndex = prevItems.findIndex(
        item => item.produto.id === produto.id && item.filial.id === filial.id
      );

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantidade: updatedItems[existingItemIndex].quantidade + quantidade
        };
        
        toast({
          title: "Produto atualizado",
          description: `${produto.nome} agora tem ${updatedItems[existingItemIndex].quantidade} unidades no carrinho`,
        });
        
        return updatedItems;
      } else {
        // Add new item
        toast({
          title: "Produto adicionado",
          description: `${produto.nome} adicionado ao carrinho`,
        });
        
        return [...prevItems, { produto, filial, preco, quantidade }];
      }
    });
  };

  const removeFromCart = (produtoId: string, filialId: string) => {
    setItems(prevItems => {
      const filteredItems = prevItems.filter(
        item => !(item.produto.id === produtoId && item.filial.id === filialId)
      );
      
      if (filteredItems.length < prevItems.length) {
        toast({
          title: "Produto removido",
          description: "Item removido do carrinho com sucesso",
        });
      }
      
      return filteredItems;
    });
  };

  // Alias para compatibilidade
  const removeItem = removeFromCart;

  const updateQuantity = (produtoId: string, filialId: string, quantidade: number) => {
    if (quantidade <= 0) {
      removeFromCart(produtoId, filialId);
      return;
    }

    setItems(prevItems => {
      return prevItems.map(item => {
        if (item.produto.id === produtoId && item.filial.id === filialId) {
          return { ...item, quantidade };
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setItems([]);
    toast({
      title: "Carrinho limpo",
      description: "Todos os itens foram removidos do carrinho",
    });
  };

  const getTotalByFilial = (filialId: string) => {
    return items
      .filter(item => item.filial.id === filialId)
      .reduce((total, item) => total + item.preco * item.quantidade, 0);
  };

  const getTotal = () => {
    return items.reduce((total, item) => total + item.preco * item.quantidade, 0);
  };

  const getItemsCountByFilial = (filialId: string) => {
    return items
      .filter(item => item.filial.id === filialId)
      .reduce((total, item) => total + item.quantidade, 0);
  };

  const getItemsCount = () => {
    return items.reduce((total, item) => total + item.quantidade, 0);
  };

  const getUniqueFiliais = () => {
    const filialMap = new Map();
    items.forEach(item => {
      if (!filialMap.has(item.filial.id)) {
        filialMap.set(item.filial.id, item.filial);
      }
    });
    return Array.from(filialMap.values());
  };

  const getItemsByFilial = (filialId: string) => {
    return items.filter(item => item.filial.id === filialId);
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      removeItem,
      updateQuantity,
      clearCart,
      getTotalByFilial,
      getTotal,
      getItemsCountByFilial,
      getItemsCount,
      getUniqueFiliais,
      getItemsByFilial
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// AVISO: Este arquivo está ficando longo. Considere pedir um refactor para dividir sua lógica em hooks ou helpers menores.
