
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface Props {
  form: any;
}

const fields = [
  { name: 'nomeCompleto', label: 'Nome Completo', type: 'text', placeholder: 'Nome Completo' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'Email' },
  { name: 'telefone', label: 'Telefone', type: 'text', placeholder: '(11) 99999-9999' },
];

export default function PersonalDataFields({ form }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Dados Pessoais</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map(field => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: f }) => (
              <FormItem className={field.name === 'telefone' ? 'md:col-span-2' : ''}>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Input placeholder={field.placeholder} type={field.type} {...f} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
    </div>
  );
}
