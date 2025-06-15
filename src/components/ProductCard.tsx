
import { Link } from 'react-router-dom';
import { Produto, EstoqueFilial } from '@/types';

interface ProductCardProps {
  produto: Produto;
  estoque?: EstoqueFilial;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const ProductCard: React.FC<ProductCardProps> = ({ produto, estoque }) => {
  return (
    <Link to={`/produto/${produto.id}`} className="group block">
      <div className="bg-white rounded-lg shadow overflow-hidden transition-shadow hover:shadow-md h-full flex flex-col">
        <div className="h-48 relative overflow-hidden">
          <img 
            src={(produto.imagem_url && produto.imagem_url[0]) || 'https://via.placeholder.com/300x300?text=Sem+Imagem'} 
            alt={produto.nome} 
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
          {estoque?.quantidade === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-medium">Sem estoque</span>
            </div>
          )}
        </div>
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="font-medium">{produto.nome}</h3>
          <p className="text-gray-500 text-sm line-clamp-2 mt-1 flex-grow">{produto.descricao}</p>
          {estoque && (
            <div className="mt-2">
              <p className="text-primary-700 font-semibold">{formatCurrency(estoque.preco)}</p>
              <p className="text-xs text-gray-500 mt-1">
                {estoque.quantidade > 0 
                  ? `${estoque.quantidade} em estoque` 
                  : 'Indisponível'}
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
