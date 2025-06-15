
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from "@/components/ui/checkbox"
import { Link } from 'react-router-dom';

const TermosDeUso = () => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

  const handleAcceptAll = () => {
    setAcceptedTerms(true);
    setAcceptedPrivacy(true);
  };

  const handleTermsChange = (checked: boolean | string) => {
    setAcceptedTerms(checked === true);
  };

  const handlePrivacyChange = (checked: boolean | string) => {
    setAcceptedPrivacy(checked === true);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-20">
      <div className="container mx-auto px-4">
        <Card className="max-w-3xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Termos de Uso e Política de Privacidade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">1. Aceitação dos Termos</h2>
              <p>
                Ao acessar e utilizar este site, você concorda em cumprir estes Termos de Uso e nossa Política de Privacidade. Se você não concordar com algum destes termos, por favor, não utilize o site.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">2. Uso do Site</h2>
              <p>
                Este site é fornecido para seu uso pessoal e não comercial. Você concorda em não modificar, copiar, distribuir, transmitir, exibir, realizar, reproduzir, publicar, licenciar, criar trabalhos derivados, transferir ou vender qualquer informação, software, produtos ou serviços obtidos através deste site.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">3. Política de Privacidade</h2>
              <p>
                Sua privacidade é importante para nós. Nossa Política de Privacidade descreve como coletamos, usamos e protegemos suas informações pessoais. Ao utilizar este site, você concorda com a coleta e uso de suas informações conforme descrito em nossa Política de Privacidade.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">4. Limitação de Responsabilidade</h2>
              <p>
                Em nenhuma circunstância, a empresa será responsável por quaisquer danos diretos, indiretos, incidentais, especiais ou consequenciais decorrentes do uso ou da incapacidade de usar este site.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">5. Alterações nos Termos</h2>
              <p>
                Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação no site. É sua responsabilidade revisar periodicamente estes termos para estar ciente de quaisquer modificações.
              </p>
            </section>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={acceptedTerms}
                  onCheckedChange={handleTermsChange}
                />
                <label htmlFor="terms" className="text-sm">
                  Li e aceito os Termos de Uso
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="privacy" 
                  checked={acceptedPrivacy}
                  onCheckedChange={handlePrivacyChange}
                />
                <label htmlFor="privacy" className="text-sm">
                  Li e aceito a Política de Privacidade
                </label>
              </div>
            </div>

            <div className="flex justify-between">
              <Link to="/">
                <Button variant="ghost">Voltar</Button>
              </Link>
              <Button disabled={!acceptedTerms || !acceptedPrivacy} onClick={handleAcceptAll}>
                Aceitar Termos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermosDeUso;
