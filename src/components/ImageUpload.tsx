
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  onImagesChange: (urls: string[]) => void;
  initialImages?: string[];
  maxImages?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImagesChange, 
  initialImages = [], 
  maxImages = 5 
}) => {
  const [images, setImages] = useState<string[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (images.length + acceptedFiles.length > maxImages) {
      toast({
        title: "Limite excedido",
        description: `Máximo de ${maxImages} imagens permitidas`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    const uploadPromises = acceptedFiles.map(async (file) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      const filePath = `produtos/${fileName}`;

      const { error, data } = await supabase.storage
        .from('produtos')
        .upload(filePath, file);

      if (error) {
        console.error('Error uploading file:', error);
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('produtos')
        .getPublicUrl(filePath);

      return publicUrl;
    });

    try {
      const uploadedUrls = await Promise.all(uploadPromises);
      const newImages = [...images, ...uploadedUrls];
      setImages(newImages);
      onImagesChange(newImages);
      
      toast({
        title: "Upload concluído",
        description: `${uploadedUrls.length} imagem(ns) carregada(s) com sucesso`,
      });
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "Erro no upload",
        description: "Falha ao carregar as imagens. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  }, [images, maxImages, onImagesChange, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: maxImages - images.length,
    disabled: uploading || images.length >= maxImages
  });

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Produto ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="h-3 w-3" />
              </Button>
              {index === 0 && (
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                  Principal
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length < maxImages && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-gray-300 hover:border-gray-400'
          } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-2">
            {uploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            ) : (
              <Upload className="h-8 w-8 text-gray-400" />
            )}
            <div className="text-sm text-gray-600">
              {uploading ? (
                'Carregando imagens...'
              ) : isDragActive ? (
                'Solte as imagens aqui'
              ) : (
                <>
                  <span className="font-medium">Clique para fazer upload</span> ou arraste e solte
                  <br />
                  <span className="text-xs">PNG, JPG, WEBP até 5MB</span>
                  <br />
                  <span className="text-xs">
                    {images.length}/{maxImages} imagens
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
