
import { useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash2, Plus, UserPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  permissoes: {
    filiais: boolean;
    produtos: boolean;
    pedidos: boolean;
    configuracoes: boolean;
  };
}

const formSchema = z.object({
  nome: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Email inválido.",
  }),
  cargo: z.string().min(1, {
    message: "Cargo é obrigatório.",
  }),
  permissoes: z.object({
    filiais: z.boolean().default(false),
    produtos: z.boolean().default(false),
    pedidos: z.boolean().default(false),
    configuracoes: z.boolean().default(false),
  }),
});

const UsuariosLoja = () => {
  const { toast } = useToast();
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    {
      id: "1",
      nome: "João Silva",
      email: "joao@example.com",
      cargo: "Gerente",
      permissoes: {
        filiais: true,
        produtos: true,
        pedidos: true,
        configuracoes: true,
      }
    },
    {
      id: "2",
      nome: "Maria Souza",
      email: "maria@example.com",
      cargo: "Vendedor",
      permissoes: {
        filiais: false,
        produtos: true,
        pedidos: true,
        configuracoes: false,
      }
    }
  ]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUsuario, setCurrentUsuario] = useState<Usuario | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      email: "",
      cargo: "",
      permissoes: {
        filiais: false,
        produtos: false,
        pedidos: false,
        configuracoes: false,
      }
    },
  });

  const handleAddUsuario = () => {
    setCurrentUsuario(null);
    form.reset({
      nome: "",
      email: "",
      cargo: "",
      permissoes: {
        filiais: false,
        produtos: false,
        pedidos: false,
        configuracoes: false,
      }
    });
    setIsEditing(true);
  };

  const handleEditUsuario = (usuario: Usuario) => {
    setCurrentUsuario(usuario);
    form.reset({
      nome: usuario.nome,
      email: usuario.email,
      cargo: usuario.cargo,
      permissoes: {
        filiais: usuario.permissoes.filiais,
        produtos: usuario.permissoes.produtos,
        pedidos: usuario.permissoes.pedidos,
        configuracoes: usuario.permissoes.configuracoes,
      }
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentUsuario(null);
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const usuarioData: Usuario = {
        id: currentUsuario?.id || Date.now().toString(),
        nome: values.nome,
        email: values.email,
        cargo: values.cargo,
        permissoes: {
          filiais: values.permissoes.filiais,
          produtos: values.permissoes.produtos,
          pedidos: values.permissoes.pedidos,
          configuracoes: values.permissoes.configuracoes,
        },
      };
      
      if (currentUsuario) {
        // Update existing usuario
        setUsuarios(usuarios.map(u => u.id === currentUsuario.id ? usuarioData : u));
        toast({
          title: "Sucesso",
          description: "Usuário atualizado com sucesso!",
        });
      } else {
        // Add new usuario
        setUsuarios([...usuarios, usuarioData]);
        toast({
          title: "Sucesso",
          description: "Usuário adicionado com sucesso!",
        });
      }
      
      setIsEditing(false);
      setCurrentUsuario(null);
    } catch (error) {
      console.error("Error saving usuario:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o usuário.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUsuario = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      setUsuarios(usuarios.filter(u => u.id !== id));
      toast({
        title: "Sucesso",
        description: "Usuário removido com sucesso!",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Usuários da Loja</h2>
        {!isEditing && (
          <Button onClick={handleAddUsuario}>
            <UserPlus className="mr-2 h-4 w-4" />
            Novo Usuário
          </Button>
        )}
      </div>
      
      {isEditing ? (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium mb-4">
            {currentUsuario ? 'Editar Usuário' : 'Novo Usuário'}
          </h3>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo*</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do usuário" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email*</FormLabel>
                      <FormControl>
                        <Input placeholder="email@exemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="cargo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo*</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o cargo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Gerente">Gerente</SelectItem>
                        <SelectItem value="Vendedor">Vendedor</SelectItem>
                        <SelectItem value="Administrador">Administrador</SelectItem>
                        <SelectItem value="Estoquista">Estoquista</SelectItem>
                        <SelectItem value="Atendente">Atendente</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-4">
                <FormLabel>Permissões</FormLabel>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-md p-4">
                  <FormField
                    control={form.control}
                    name="permissoes.filiais"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox 
                            checked={field.value} 
                            onCheckedChange={field.onChange} 
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Gerenciar Filiais
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="permissoes.produtos"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox 
                            checked={field.value} 
                            onCheckedChange={field.onChange} 
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Gerenciar Produtos
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="permissoes.pedidos"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox 
                            checked={field.value} 
                            onCheckedChange={field.onChange} 
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Gerenciar Pedidos
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="permissoes.configuracoes"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox 
                            checked={field.value} 
                            onCheckedChange={field.onChange} 
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Acessar Configurações
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {currentUsuario ? 'Atualizar Usuário' : 'Adicionar Usuário'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      ) : (
        <>
          {usuarios.length > 0 ? (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Permissões</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usuarios.map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell>
                        <div className="font-medium">{usuario.nome}</div>
                        <div className="text-sm text-gray-500">{usuario.email}</div>
                      </TableCell>
                      <TableCell>{usuario.cargo}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {usuario.permissoes.filiais && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Filiais</Badge>
                          )}
                          {usuario.permissoes.produtos && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Produtos</Badge>
                          )}
                          {usuario.permissoes.pedidos && (
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Pedidos</Badge>
                          )}
                          {usuario.permissoes.configuracoes && (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Configurações</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => handleEditUsuario(usuario)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => handleDeleteUsuario(usuario.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <UserPlus className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum usuário cadastrado</h3>
              <p className="text-gray-500 mb-4">Adicione usuários para sua equipe gerenciar a loja.</p>
              <Button onClick={handleAddUsuario}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Usuário
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UsuariosLoja;
