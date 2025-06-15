import { useState, useEffect } from 'react';
import { api } from '@/services/api';

export const useFrete = () => {
  const [regrasFrete, setRegrasFrete] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchRegrasFrete() {
      setIsLoading(true);
      try {
        const data = await api.getRegrasFrete();
        setRegrasFrete(data);
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRegrasFrete();
  }, []);

  // Exemplo de uso corrigido:
  async function buscarRegrasFrete() {
    return await api.getRegrasFrete();
  }
  async function buscarRegrasFretePorFilial(filialId: string) {
    return await api.getRegrasFreteByFilialId(filialId);
  }

  return {
    regrasFrete,
    isLoading,
    error,
    buscarRegrasFrete,
    buscarRegrasFretePorFilial
  };
};
