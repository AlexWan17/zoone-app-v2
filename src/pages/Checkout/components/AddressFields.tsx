
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { formatFieldLabel } from '../utils/fieldLabel';

interface Props {
  form: any;
}

const addressFields = [
  'endereco', 'numero', 'complemento', 'bairro', 'cidade', 'estado', 'cep'
];

export default function AddressFields({ form }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Endereço de Entrega</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addressFields.map((fieldName) => (
          <FormField
            control={form.control}
            name={fieldName}
            key={fieldName}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{formatFieldLabel(fieldName)}</FormLabel>
                <FormControl>
                  <Input placeholder={formatFieldLabel(fieldName)} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
    </div>
  )
}
