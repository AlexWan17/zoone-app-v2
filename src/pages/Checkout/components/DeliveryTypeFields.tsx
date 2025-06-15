
import React from 'react';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface Props {
  form: any;
}

export default function DeliveryTypeFields({ form }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Tipo de Entrega</h3>
      <FormField
        control={form.control}
        name="tipoEntrega"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="retirada_filial" id="retirada" />
                  <Label htmlFor="retirada">Retirar na loja (Grátis)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="entrega" id="entrega" />
                  <Label htmlFor="entrega">Entrega no endereço (+ R$ 10,00)</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
