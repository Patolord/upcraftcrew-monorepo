"use client";

import { useState, useRef, useCallback } from "react";
import { ImageKitProvider, upload } from "@imagekit/react";
import { env } from "@up-craft-crew-app/env/web";
import { Button } from "@/components/ui/button";
import { Loader2Icon, UploadIcon, XIcon, ImageIcon, AlertCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string | undefined) => void;
  folder?: string;
  className?: string;
  disabled?: boolean;
}

interface AuthResponse {
  token: string;
  expire: number;
  signature: string;
}

const authenticator = async (): Promise<AuthResponse> => {
  const response = await fetch("/api/imagekit/auth");
  if (!response.ok) {
    throw new Error("Failed to authenticate with ImageKit");
  }
  return response.json();
};

// Check if ImageKit is configured
const isImageKitConfigured = () => {
  return !!(env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY && env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT);
};

export function ImageUpload({
  value,
  onChange,
  folder = "uploads",
  className,
  disabled = false,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const imageKitConfigured = isImageKitConfigured();

  const handleUpload = useCallback(
    async (file: File) => {
      if (!file) return;

      if (!imageKitConfigured) {
        setError("ImageKit não está configurado. Adicione as variáveis de ambiente.");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Por favor, selecione apenas arquivos de imagem");
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("A imagem deve ter no máximo 10MB");
        return;
      }

      setIsUploading(true);
      setError(null);

      try {
        const authParams = await authenticator();

        const uploadResponse = await upload({
          file,
          fileName: `${Date.now()}-${file.name}`,
          folder,
          publicKey: env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
          signature: authParams.signature,
          expire: authParams.expire,
          token: authParams.token,
        });

        if (uploadResponse.url) {
          onChange(uploadResponse.url);
        }
      } catch (err) {
        console.error("Upload error:", err);
        setError("Erro ao fazer upload da imagem. Tente novamente.");
      } finally {
        setIsUploading(false);
      }
    },
    [folder, onChange, imageKitConfigured],
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (disabled) return;

      const file = e.dataTransfer.files?.[0];
      if (file) {
        handleUpload(file);
      }
    },
    [disabled, handleUpload],
  );

  const handleRemove = () => {
    onChange(undefined);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  // Show warning if ImageKit is not configured
  if (!imageKitConfigured) {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="border-2 border-dashed border-yellow-500/50 rounded-lg p-6 bg-yellow-500/5">
          <div className="flex flex-col items-center justify-center text-center gap-3">
            <div className="p-3 rounded-full bg-yellow-500/10">
              <AlertCircleIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-base-content">
                Upload de imagem não configurado
              </p>
              <p className="text-xs text-base-content/50 mt-1">
                Configure as variáveis NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY e
                NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT no .env.local
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ImageKitProvider urlEndpoint={env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!}>
      <div className={cn("space-y-2", className)}>
        {value ? (
          <div className="relative group">
            <div className="relative aspect-video rounded-lg overflow-hidden border border-base-300 bg-base-200">
              <img src={value} alt="Uploaded image" className="w-full h-full object-cover" />
              {!disabled && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleRemove}
                    className="gap-2"
                  >
                    <XIcon className="h-4 w-4" />
                    Remover
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={cn(
              "relative border-2 border-dashed rounded-lg p-6 transition-colors",
              dragActive
                ? "border-orange-500 bg-orange-500/10"
                : "border-base-300 hover:border-base-400",
              disabled && "opacity-50 cursor-not-allowed",
            )}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={disabled || isUploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />

            <div className="flex flex-col items-center justify-center text-center gap-3">
              {isUploading ? (
                <>
                  <Loader2Icon className="h-10 w-10 text-orange-500 animate-spin" />
                  <p className="text-sm text-base-content/70">Fazendo upload...</p>
                </>
              ) : (
                <>
                  <div className="p-3 rounded-full bg-base-200">
                    <ImageIcon className="h-8 w-8 text-base-content/50" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-base-content">
                      Arraste uma imagem ou clique para selecionar
                    </p>
                    <p className="text-xs text-base-content/50 mt-1">
                      PNG, JPG ou WEBP (máx. 10MB)
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={disabled}
                    className="gap-2 mt-2"
                  >
                    <UploadIcon className="h-4 w-4" />
                    Selecionar arquivo
                  </Button>
                </>
              )}
            </div>
          </div>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </ImageKitProvider>
  );
}
