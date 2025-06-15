
import { useState, useEffect } from 'react';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import AddressSearch from '@/components/AddressSearch';
import { cnpjService } from '@/services/cnpjService';
import { CheckCircle, AlertCircle, Building2, Loader2, RefreshCw } from 'lucide-react';
import * as z from 'zod';

interface DadosLojaProps {
  onSalvar: (data: any) => Promise<void>;
  isLoading: boolean;
  initialData?: any;
}

const formSchema = z.object({
  nome_loja: z.string().min(2, {
    message: "Nome da loja deve ter pelo menos 2 caracteres.",
  }),
  nome_responsavel: z.string().min(2, {
    message: "Nome do responsável deve ter pelo menos 2 caracteres.",
  }),
  razao_social: z.string().min(2, {
    message: "Razão social deve ter pelo menos 2 caracteres.",
  }),
  cnpj: z.string().min(14, {
    message: "CNPJ deve ter 14 dígitos.",
  }).max(18),
  email_contato: z.string().email({
    message: "Email inválido.",
  }),
  telefone: z.string().min(10, {
    message: "Telefone deve ter pelo menos 10 dígitos.",
  }),
  endereco_sede: z.string().min(5, {
    message: "Endereço deve ter pelo menos 5 caracteres.",
  }),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  descricao: z.string().optional(),
  website: z.string().url({
    message: "URL inválida.",
  }).optional().or(z.literal('')),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
});

const DadosLoja = ({ onSalvar, isLoading, initialData }: DadosLojaProps) => {
  const [cnpjValidating, setCnpjValidating] = useState(false);
  const [cnpjValid, setCnpjValid] = useState<boolean | null>(null);
  const [addressCoords, setAddressCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [cnpjDataFetched, setCnpjDataFetched] = useState(false);
  const [lastFilledCnpj, setLastFilledCnpj] = useState<string>('');
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome_loja: "",
      nome_responsavel: "",
      razao_social: "",
      cnpj: "",
      email_contato: "",
      telefone: "",
      endereco_sede: "",
      latitude: undefined,
      longitude: undefined,
      descricao: "",
      website: "",
      instagram: "",
      facebook: "",
    },
  });

  // Preencher form com dados iniciais se existirem
  useEffect(() => {
    if (initialData) {
      console.log('Preenchendo form com dados iniciais:', initialData);
      form.reset({
        nome_loja: initialData.nome_loja || "",
        nome_responsavel: initialData.nome_responsavel || "",
        razao_social: initialData.razao_social || "",
        cnpj: initialData.cnpj || "",
        email_contato: initialData.email_contato || "",
        telefone: initialData.telefone || "",
        endereco_sede: initialData.endereco_sede || "",
        latitude: initialData.latitude,
        longitude: initialData.longitude,
        descricao: initialData.descricao_loja || "",
        website: initialData.website || "",
        instagram: initialData.instagram || "",
        facebook: initialData.facebook || "",
      });
    }
  }, [initialData, form]);

  const cnpjValue = form.watch('cnpj');

  const fillFormWithCnpjData = async (cnpjData: any, forceUpdate: boolean = false) => {
    console.log('=== PREENCHENDO FORMULÁRIO COM DADOS DO CNPJ ===');
    console.log('Dados recebidos da API:', cnpjData);
    console.log('Force update:', forceUpdate);
    
    const fieldsUpdated: string[] = [];
    
    // Preenche razão social (sempre atualiza se disponível)
    if (cnpjData.razao_social && (forceUpdate || !form.getValues('razao_social'))) {
      form.setValue('razao_social', cnpjData.razao_social);
      fieldsUpdated.push('Razão Social');
      console.log('✓ Razão social preenchida:', cnpjData.razao_social);
    }
    
    // Preenche nome da loja (prioriza nome fantasia, senão usa razão social)
    const nomeLoja = cnpjData.nome_fantasia || cnpjData.razao_social;
    if (nomeLoja && (forceUpdate || !form.getValues('nome_loja'))) {
      form.setValue('nome_loja', nomeLoja);
      fieldsUpdated.push('Nome da Loja');
      console.log('✓ Nome da loja preenchido:', nomeLoja);
    }
    
    // Preenche email
    if (cnpjData.email && (forceUpdate || !form.getValues('email_contato'))) {
      form.setValue('email_contato', cnpjData.email);
      fieldsUpdated.push('Email');
      console.log('✓ Email preenchido:', cnpjData.email);
    }
    
    // Preenche telefone
    if (cnpjData.telefone && (forceUpdate || !form.getValues('telefone'))) {
      form.setValue('telefone', cnpjData.telefone);
      fieldsUpdated.push('Telefone');
      console.log('✓ Telefone preenchido:', cnpjData.telefone);
    }

    // Monta e preenche endereço completo
    const enderecoCompleto = cnpjService.formatAddress(cnpjData);
    if (enderecoCompleto && (forceUpdate || !form.getValues('endereco_sede'))) {
      form.setValue('endereco_sede', enderecoCompleto);
      fieldsUpdated.push('Endereço');
      console.log('✓ Endereço preenchido:', enderecoCompleto);
    }

    console.log('=== CAMPOS ATUALIZADOS ===', fieldsUpdated);
    
    if (fieldsUpdated.length > 0) {
      toast({
        title: "Dados do CNPJ preenchidos!",
        description: `Campos atualizados: ${fieldsUpdated.join(', ')}`,
      });
    }
    
    setLastFilledCnpj(cnpjData.cnpj);
  };

  // Efeito para validar CNPJ automaticamente
  useEffect(() => {
    const validateCNPJ = async () => {
      if (!cnpjValue || cnpjValue.length < 14) {
        setCnpjValid(null);
        setCnpjDataFetched(false);
        return;
      }

      const cleanedCNPJ = cnpjService.cleanCNPJ(cnpjValue);
      
      if (!cnpjService.isValidCNPJ(cleanedCNPJ)) {
        setCnpjValid(false);
        setCnpjDataFetched(false);
        return;
      }

      // Se já preenchemos dados para esse CNPJ, não fazer novamente
      if (lastFilledCnpj === cleanedCNPJ) {
        setCnpjValid(true);
        setCnpjDataFetched(true);
        return;
      }

      setCnpjValidating(true);
      try {
        console.log('=== INICIANDO VALIDAÇÃO DO CNPJ ===');
        console.log('CNPJ sendo consultado:', cleanedCNPJ);
        
        const cnpjData = await cnpjService.fetchCNPJData(cleanedCNPJ);
        
        console.log('=== RESPOSTA DA API DO CNPJ ===');
        console.log('Dados retornados:', cnpjData);
        
        if (cnpjData) {
          setCnpjValid(true);
          setCnpjDataFetched(true);
          
          // Preencher formulário automaticamente
          await fillFormWithCnpjData(cnpjData, false);
        } else {
          setCnpjValid(false);
          setCnpjDataFetched(false);
          console.log('❌ Nenhum dado retornado para o CNPJ');
        }
      } catch (error) {
        setCnpjValid(false);
        setCnpjDataFetched(false);
        console.error('❌ Erro ao validar CNPJ:', error);
        toast({
          title: "Erro ao validar CNPJ",
          description: error instanceof Error ? error.message : "Erro desconhecido",
          variant: "destructive",
        });
      } finally {
        setCnpjValidating(false);
      }
    };

    const timeoutId = setTimeout(validateCNPJ, 1000);
    return () => clearTimeout(timeoutId);
  }, [cnpjValue, form, toast, lastFilledCnpj]);

  const handleCnpjChange = (value: string) => {
    // Formata automaticamente o CNPJ durante a digitação
    const formatted = cnpjService.formatCNPJ(value);
    form.setValue('cnpj', formatted);
    
    // Reset validation state when CNPJ changes
    if (value !== cnpjValue) {
      setCnpjValid(null);
      setCnpjDataFetched(false);
      setLastFilledCnpj('');
    }
  };

  const handleForceUpdateCnpj = async () => {
    const cnpjValue = form.getValues('cnpj');
    const cleanedCNPJ = cnpjService.cleanCNPJ(cnpjValue);
    
    if (!cnpjService.isValidCNPJ(cleanedCNPJ)) {
      toast({
        title: "CNPJ inválido",
        description: "Digite um CNPJ válido antes de atualizar os dados.",
        variant: "destructive",
      });
      return;
    }

    setCnpjValidating(true);
    try {
      const cnpjData = await cnpjService.fetchCNPJData(cleanedCNPJ);
      if (cnpjData) {
        await fillFormWithCnpjData(cnpjData, true); // Force update = true
      }
    } catch (error) {
      toast({
        title: "Erro ao buscar dados do CNPJ",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setCnpjValidating(false);
    }
  };

  const handleAddressSelect = (address: string, lat: number, lon: number) => {
    form.setValue('endereco_sede', address);
    form.setValue('latitude', lat);
    form.setValue('longitude', lon);
    setAddressCoords({ lat, lon });
    
    toast({
      title: "Endereço selecionado",
      description: "Localização salva com sucesso!",
    });
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('Dados do formulário sendo enviados:', values);
    
    const dataToSave = {
      ...values,
      latitude: addressCoords?.lat || values.latitude,
      longitude: addressCoords?.lon || values.longitude,
    };
    
    console.log('Dados finais para salvar:', dataToSave);
    await onSalvar(dataToSave);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Seção CNPJ com validação */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Dados Empresariais</h3>
            </div>
            {cnpjValid && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleForceUpdateCnpj}
                disabled={cnpjValidating}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${cnpjValidating ? 'animate-spin' : ''}`} />
                Atualizar dados do CNPJ
              </Button>
            )}
          </div>
          
          <FormField
            control={form.control}
            name="cnpj"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CNPJ*</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      placeholder="00.000.000/0000-00" 
                      value={field.value}
                      onChange={(e) => handleCnpjChange(e.target.value)}
                      className="pr-10"
                    />
                    <div className="absolute right-3 top-2.5">
                      {cnpjValidating && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
                      {cnpjValid === true && <CheckCircle className="w-4 h-4 text-green-500" />}
                      {cnpjValid === false && <AlertCircle className="w-4 h-4 text-red-500" />}
                    </div>
                  </div>
                </FormControl>
                {cnpjValid === true && (
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                    CNPJ válido e ativo {cnpjDataFetched && '- Dados preenchidos automaticamente'}
                  </Badge>
                )}
                {cnpjValid === false && (
                  <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                    CNPJ inválido ou não encontrado
                  </Badge>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="nome_loja"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da Loja*</FormLabel>
                <FormControl>
                  <Input placeholder="Nome comercial da loja" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nome_responsavel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Responsável*</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do responsável pela loja" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="razao_social"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Razão Social*</FormLabel>
                <FormControl>
                  <Input placeholder="Razão social da empresa" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email_contato"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email de Contato*</FormLabel>
                <FormControl>
                  <Input placeholder="contato@sualoja.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="telefone"
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
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input placeholder="https://sualoja.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="instagram"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instagram</FormLabel>
                <FormControl>
                  <Input placeholder="@sualoja" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="facebook"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Facebook</FormLabel>
                <FormControl>
                  <Input placeholder="facebook.com/sualoja" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Seção de Endereço com Geolocalização */}
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <FormField
            control={form.control}
            name="endereco_sede"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endereço da Sede*</FormLabel>
                <FormControl>
                  <AddressSearch
                    onAddressSelect={handleAddressSelect}
                    initialAddress={field.value}
                    placeholder="Digite o endereço da sua loja..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição da Loja</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descreva sua loja, produtos e diferenciais..." 
                  className="min-h-32"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isLoading || cnpjValid === false}>
          {isLoading ? "Salvando..." : "Salvar Informações"}
        </Button>
      </form>
    </Form>
  );
};

export default DadosLoja;
