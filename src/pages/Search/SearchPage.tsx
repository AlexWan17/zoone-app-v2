import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import ProductCard from "@/components/ProductCard"
import { api } from '@/services/api';
import { ProdutoEstoque } from '@/types';
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Pagination } from "@/components/ui/pagination"
import VoiceSearch from "@/components/VoiceSearch";

const SearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<ProdutoEstoque[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 12;
  const { toast } = useToast()

  // Extract search term from URL params on initial load
  useEffect(() => {
    const term = searchParams.get('q');
    if (term) {
      setSearchTerm(term);
      handleSearch(term);
    }
    // eslint-disable-next-line
  }, [searchParams]);

  // Função corrigida para buscar produtos por search
  const handleSearch = useCallback(async (term: string) => {
    if (!term) return;
    setLoading(true);
    try {
      // Consideramos que buscarProdutos retorna Produto[], e vamos manter products: ProdutoEstoque[].
      const response = await api.buscarProdutos(term);

      // Map Produto[] => ProdutoEstoque[] with empty estoque if missing
      const produtosEstoque: ProdutoEstoque[] = (response || []).map((produto: any) => ({
        ...produto,
        estoque: produto.estoque || [],   // fallback for compatibility
      }));

      setProducts(produtosEstoque);  // Now type matches
      setTotalPages(Math.ceil((produtosEstoque?.length || 1) / productsPerPage));
      setCurrentPage(1);
    } catch (error: any) {
      toast({
        title: "Erro ao buscar produtos",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Products for current page
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const displayedProducts = products.slice(startIndex, endIndex);

  const handleVoiceTranscript = (transcript: string) => {
    if (transcript) {
      setSearchTerm(transcript);
      handleSearch(transcript);
    }
  };

  return (
    <div className="container mx-auto mt-8 px-4">
      {/* Barra de busca + microfone */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Buscar produtos..."
          className="flex-1 px-4 py-2 rounded border border-gray-300"
        />
        {/* Microfone busca por voz */}
        <VoiceSearch onTranscript={handleVoiceTranscript} />
        <Button
          onClick={() => {
            setSearchParams({ q: searchTerm });
            handleSearch(searchTerm);
          }}
        >
          Buscar
        </Button>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(productsPerPage)].map((_, i) => (
            <Card key={i}>
              <CardContent>
                <Skeleton className="h-40 w-full rounded-md mb-2" />
                <Skeleton className="h-4 w-3/4 mb-1" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayedProducts.map((produto) => (
              <ProductCard key={produto.id} produto={produto} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <Button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="mr-2"
              >Anterior</Button>
              <span className="mx-2">{currentPage} de {totalPages}</span>
              <Button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >Próximo</Button>
            </div>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="text-center">
            Nenhum produto encontrado para "{searchTerm}"
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchPage;
