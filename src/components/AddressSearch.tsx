
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Check, X } from 'lucide-react';

interface AddressSearchResult {
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    road?: string;
    house_number?: string;
    neighbourhood?: string;
    city?: string;
    state?: string;
    postcode?: string;
  };
}

interface AddressSearchProps {
  onAddressSelect: (address: string, lat: number, lon: number) => void;
  initialAddress?: string;
  placeholder?: string;
}

const AddressSearch = ({ onAddressSelect, initialAddress = '', placeholder = 'Digite o endereço...' }: AddressSearchProps) => {
  const [searchTerm, setSearchTerm] = useState(initialAddress);
  const [results, setResults] = useState<AddressSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedResult, setSelectedResult] = useState<AddressSearchResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  const searchAddress = async (query: string) => {
    if (!query || query.length < 3) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    try {
      // Usando Nominatim (OpenStreetMap) - gratuito
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', Brasil')}&limit=5&addressdetails=1`
      );
      
      if (response.ok) {
        const data: AddressSearchResult[] = await response.json();
        setResults(data);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Erro ao buscar endereço:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchAddress(searchTerm);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleResultSelect = (result: AddressSearchResult) => {
    setSelectedResult(result);
    setSearchTerm(result.display_name);
    setShowResults(false);
    onAddressSelect(result.display_name, parseFloat(result.lat), parseFloat(result.lon));
  };

  const handleConfirm = () => {
    if (selectedResult) {
      onAddressSelect(
        selectedResult.display_name, 
        parseFloat(selectedResult.lat), 
        parseFloat(selectedResult.lon)
      );
    }
  };

  const handleClear = () => {
    setSelectedResult(null);
    setSearchTerm('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className="relative space-y-2">
      <div className="relative">
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-10"
        />
        <div className="absolute right-2 top-2">
          {isLoading ? (
            <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full" />
          ) : (
            <Search className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      {/* Resultados da busca */}
      {showResults && results.length > 0 && (
        <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {results.map((result, index) => (
            <button
              key={index}
              onClick={() => handleResultSelect(result)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {result.display_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Lat: {parseFloat(result.lat).toFixed(6)}, Lon: {parseFloat(result.lon).toFixed(6)}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Endereço selecionado */}
      {selectedResult && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                  <MapPin className="w-3 h-3 mr-1" />
                  Localização encontrada
                </Badge>
              </div>
              <p className="text-sm text-gray-900 font-medium">
                {selectedResult.display_name}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Coordenadas: {parseFloat(selectedResult.lat).toFixed(6)}, {parseFloat(selectedResult.lon).toFixed(6)}
              </p>
            </div>
            <div className="flex space-x-1 ml-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleConfirm}
                className="bg-green-100 border-green-300 text-green-800 hover:bg-green-200"
              >
                <Check className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleClear}
                className="bg-red-100 border-red-300 text-red-800 hover:bg-red-200"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressSearch;
