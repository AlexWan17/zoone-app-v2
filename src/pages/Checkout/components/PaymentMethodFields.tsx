
import React from 'react';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CreditCard, Smartphone } from "lucide-react";

interface Props {
  form: any;
}

export default function PaymentMethodFields({ form }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Forma de Pagamento</h3>
      <FormField
        control={form.control}
        name="formaPagamento"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pix" id="pix" />
                  <Label htmlFor="pix" className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    PIX (Desconto de 5%)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cartao" id="cartao" />
                  <Label htmlFor="cartao" className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Cartão de Crédito
                  </Label>
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
