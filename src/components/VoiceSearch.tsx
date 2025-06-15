
import React, { useState, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface VoiceSearchProps {
  onTranscript: (transcript: string) => void;
}

// Timeout (ms) de silêncio para considerar que o usuário terminou de falar
const SILENCE_TIMEOUT = 1500;

const VoiceSearch = ({ onTranscript }: VoiceSearchProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [partialTranscript, setPartialTranscript] = useState<string>('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const silenceTimeoutRef = useRef<number>();
  const { toast } = useToast();

  React.useEffect(() => {
    // Verifica suporte
    if (
      !window.isSecureContext ||
      (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window))
    ) {
      setIsSupported(false);
      setErrorMsg("Busca por voz somente disponível em HTTPS e navegadores compatíveis.");
      return;
    }
    setErrorMsg(null);

    const SpeechRecognitionConstructor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition: SpeechRecognition = new SpeechRecognitionConstructor();

    recognition.continuous = true; // contínuo, encerraremos via timeout de silêncio
    recognition.interimResults = true; // receber parcials
    recognition.lang = 'pt-BR';
    // Removido: recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setErrorMsg(null);
      setPartialTranscript('');
      console.log("VoiceSearch: iniciou escuta");
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      // Concatena todos os resultados (parciais + final)
      let final = '';
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const res = event.results[i];
        if (res.isFinal) {
          final += res[0].transcript;
        } else {
          interim += res[0].transcript;
        }
      }

      // Mostra parcialmente o interim pro usuário
      setPartialTranscript(final + interim);

      // Inicia/reinicia o timeout para esperar silêncio
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      silenceTimeoutRef.current = window.setTimeout(() => {
        recognition.stop();
      }, SILENCE_TIMEOUT);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Erro no reconhecimento de voz:', event.error);
      setIsListening(false);

      let msg = '';
      if (event.error === "not-allowed") {
        msg = "Permissão negada. Conceda acesso ao microfone.";
      } else if (event.error === "no-speech") {
        msg = "Não foi detectada fala. Tente novamente.";
      } else if (event.error === "aborted") {
        msg = "Busca por voz interrompida.";
      } else {
        msg = "Erro ao reconhecer voz.";
      }
      setErrorMsg(msg);
      toast({
        title: 'Erro na busca por voz',
        description: msg,
        variant: 'destructive',
      });
    };

    recognition.onend = () => {
      setIsListening(false);
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      if (partialTranscript.trim()) {
        onTranscript(partialTranscript.trim());
        toast({
          title: 'Busca por voz',
          description: `Buscando por: "${partialTranscript.trim()}"`,
        });
      }
      setPartialTranscript('');
      console.log("VoiceSearch: reconhecimento encerrado");
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
    };
  // eslint-disable-next-line
  }, [onTranscript, toast]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setErrorMsg(null);
        toast({
          title: 'Busca por voz ativada',
          description: 'Fale agora o que você deseja buscar...',
        });
      } catch (error) {
        console.error('Erro ao iniciar reconhecimento:', error);
        setErrorMsg("Não foi possível ativar a busca por voz.");
        toast({
          title: 'Erro',
          description: 'Não foi possível ativar a busca por voz.',
          variant: 'destructive',
        });
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  if (!isSupported) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        aria-label="Voice search indisponível"
        className="p-1 h-auto text-red-400 pointer-events-none"
        tabIndex={-1}
        title={errorMsg ?? "Busca por voz não suportada"}
      >
        <MicOff size={16} />
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={isListening ? stopListening : startListening}
        aria-label={isListening ? "Interromper busca por voz" : "Ativar busca por voz"}
        className={`p-1 h-auto ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-500 hover:text-primary'}`}
        title={isListening ? "Ouvindo..." : "Busca por voz"}
      >
        {isListening ? <MicOff size={16} /> : <Mic size={16} />}
      </Button>
      {/* Feedback visual durante a fala */}
      {isListening && (
        <span
          className="ml-1 text-xs text-primary-dark bg-primary/10 rounded px-2 py-1 animate-pulse min-w-[60px] max-w-[160px] truncate"
          title={partialTranscript ? partialTranscript : "Ouvindo..."}
        >
          {partialTranscript ? partialTranscript : "Ouvindo..."}
        </span>
      )}
      {errorMsg && (
        <span className="ml-2 text-xs text-red-500" title={errorMsg}>{errorMsg}</span>
      )}
    </div>
  );
};

export default VoiceSearch;

