
import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import ProductCard from "@/components/ProductCard";
import { Produto, EstoqueFilial } from "@/types";

interface LandingProductCarouselProps {
  title: string;
  produtos: Array<{ produto: Produto; estoque: EstoqueFilial; }>;
  loading?: boolean;
  emptyMessage?: string;
}

const LandingProductCarousel: React.FC<LandingProductCarouselProps> = ({ title, produtos, loading, emptyMessage }) => {
  if (loading) {
    return (
      <div className="py-8 flex justify-center items-center">
        <span className="animate-pulse text-gray-500">Carregando {title}...</span>
      </div>
    );
  }
  if (produtos.length === 0) {
    return (
      <div className="py-6 text-center text-gray-400">{emptyMessage || "Nenhum produto encontrado"}</div>
    );
  }

  return (
    <section className="mb-10">
      <h2 className="text-lg font-bold mb-2 px-2">{title}</h2>
      <Carousel className="w-full">
        <CarouselContent className="gap-4">
          {produtos.map(({ produto, estoque }, idx) => (
            <CarouselItem key={produto.id} className="basis-4/5 sm:basis-1/3 md:basis-1/4 xl:basis-1/6">
              <ProductCard produto={produto} estoque={estoque} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
};

export default LandingProductCarousel;
