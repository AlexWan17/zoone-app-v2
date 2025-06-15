
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Filial } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Search } from 'lucide-react';

interface FilialFormModalProps {
  filial: Filial | null;
  onClose: () => void;
  onSave: (filial: Filial) => void;
}

const formSchema = z.object({
  id: z.string().optional(),
  nome_filial: z.string().min(2, {
    message: "Nome da filial deve ter pelo menos 2 caracteres.",
  }),
  endereco: z.string().min(5, {
    message: "Endereço deve ser válido.",
  }),
  telefone_filial: z.string().min(10, {
    message: "Telefone deve ter pelo menos 10 dígitos.",
  }),
  email_filial: z.string().email({
    message: "Email inválido.",
  }),
  latitude: z.number(),
  longitude: z.number(),
});

const FilialFormModal = ({ filial, onClose, onSave }: FilialFormModalProps) => {
  const { toast } = useToast();
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: filial?.id || undefined,
      nome_filial: filial?.nome_filial || "",
      endereco: filial?.endereco || "",
      telefone_filial: filial?.telefone_filial || "",
      email_filial: filial?.email_filial || "",
      latitude: filial?.latitude || -23.5505, // Default to São Paulo coordinates
      longitude: filial?.longitude || -46.6333,
    },
  });

  const handleGetCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          form.setValue('latitude', position.coords.latitude);
          form.setValue('longitude', position.coords.longitude);
          
          toast({
            title: "Localização obtida",
            description: "Coordenadas de GPS atualizadas com sucesso.",
          });
          
          setIsGettingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Erro",
            description: "Não foi possível obter sua localização. Verifique as permissões do navegador.",
            variant: "destructive",
          });
          setIsGettingLocation(false);
        }
      );
    } else {
      toast({
        title: "Erro",
        description: "Geolocalização não é suportada neste navegador.",
        variant: "destructive",
      });
      setIsGettingLocation(false);
    }
  };

  const handleSearchAddress = async () => {
    const address = form.getValues('endereco');
    
    if (!address || address.length < 5) {
      toast({
        title: "Endereço inválido",
        description: "Por favor, digite um endereço válido.",
        variant: "destructive",
      });
      return;
    }

    setIsSearchingAddress(true);
    
    try {
      // Using OpenStreetMap Nominatim API for geocoding
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        form.setValue('latitude', parseFloat(lat));
        form.setValue('longitude', parseFloat(lon));
        
        toast({
          title: "Localização encontrada",
          description: "Coordenadas do endereço obtidas com sucesso.",
        });
      } else {
        toast({
          title: "Endereço não encontrado",
          description: "Não foi possível encontrar coordenadas para este endereço.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error geocoding address:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao buscar as coordenadas do endereço.",
        variant: "destructive",
      });
    } finally {
      setIsSearchingAddress(false);
    }
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const filialData: Filial = {
      id: values.id || "",
      lojista_id: filial?.lojista_id || "1",
      nome_filial: values.nome_filial,
      endereco: values.endereco,
      latitude: values.latitude,
      longitude: values.longitude,
      telefone_filial: values.telefone_filial,
      email_filial: values.email_filial,
      criado_em: filial?.criado_em || new Date().toISOString(),
      atualizado_em: new Date().toISOString(),
    };
    
    onSave(filialData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">
            {filial ? 'Editar Filial' : 'Nova Filial'}
          </h2>
        </div>
        
        <div className="p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="nome_filial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Filial*</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Loja Centro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endereco"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço Completo*</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input placeholder="Rua, número, bairro, cidade - UF" {...field} />
                      </FormControl>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon" 
                        onClick={handleSearchAddress}
                        disabled={isSearchingAddress}
                      >
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Digite o endereço e clique no ícone de busca para obter as coordenadas.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude*</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.000001" 
                          placeholder="-23.5505" 
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude*</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.000001" 
                          placeholder="-46.6333" 
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleGetCurrentLocation}
                  disabled={isGettingLocation}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  {isGettingLocation ? 'Obtendo localização...' : 'Usar Minha Localização Atual'}
                </Button>
                <p className="text-xs text-gray-500 mt-1">
                  Use esta opção se estiver fisicamente no local da filial.
                </p>
              </div>
              
              <FormField
                control={form.control}
                name="telefone_filial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone*</FormLabel>
                    <FormControl>
                      <Input placeholder="(00) 00000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email_filial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email*</FormLabel>
                    <FormControl>
                      <Input placeholder="filial@minhaloja.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {filial ? 'Atualizar' : 'Adicionar'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default FilialFormModal;
