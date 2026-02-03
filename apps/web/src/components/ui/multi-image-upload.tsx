"use client";

import { useState, useRef, useCallback } from "react";
import { ImageKitProvider, upload } from "@imagekit/react";
import { env } from "@up-craft-crew-app/env/web";
import { Button } from "@/components/ui/button";
import {
  Loader2Icon,
  UploadIcon,
  XIcon,
  ImageIcon,
  AlertCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MultiImageUploadProps {
  value?: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  className?: string;
  disabled?: boolean;
  maxImages?: number;
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

export function MultiImageUpload({
  value = [],
  onChange,
  folder = "uploads",
  className,
  disabled = false,
  maxImages = 10,
}: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const imageKitConfigured = isImageKitConfigured();
  const images = value || [];

  const uploadSingleFile = useCallback(
    async (file: File): Promise<string | null> => {
      if (!imageKitConfigured) {
        throw new Error("ImageKit não está configurado.");
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        throw new Error(`${file.name}: não é uma imagem válida`);
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error(`${file.name}: excede 10MB`);
      }

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

      return uploadResponse.url || null;
    },
    [folder, imageKitConfigured],
  );

  const handleMultipleUpload = useCallback(
    async (files: File[]) => {
      if (!files.length) return;

      if (!imageKitConfigured) {
        setError("ImageKit não está configurado. Adicione as variáveis de ambiente.");
        return;
      }

      // Calculate how many we can upload
      const availableSlots = maxImages - images.length;
      if (availableSlots <= 0) {
        setError(`Máximo de ${maxImages} imagens permitido`);
        return;
      }

      // Limit files to available slots
      const filesToUpload = files.slice(0, availableSlots);
      if (files.length > availableSlots) {
        setError(
          `Apenas ${availableSlots} imagem(ns) pode(m) ser adicionada(s). ${files.length - availableSlots} ignorada(s).`,
        );
      } else {
        setError(null);
      }

      setIsUploading(true);
      setUploadProgress({ current: 0, total: filesToUpload.length });

      const uploadedUrls: string[] = [];
      const errors: string[] = [];

      for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i];
        setUploadProgress({ current: i + 1, total: filesToUpload.length });

        try {
          const url = await uploadSingleFile(file);
          if (url) {
            uploadedUrls.push(url);
          }
        } catch (err) {
          console.error("Upload error:", err);
          errors.push(err instanceof Error ? err.message : `Erro ao enviar ${file.name}`);
        }
      }

      if (uploadedUrls.length > 0) {
        const newImages = [...images, ...uploadedUrls];
        onChange(newImages);
        setCurrentIndex(newImages.length - 1);
      }

      if (errors.length > 0) {
        setError(errors.join("; "));
      }

      setIsUploading(false);
      setUploadProgress({ current: 0, total: 0 });
    },
    [images, maxImages, onChange, uploadSingleFile, imageKitConfigured],
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleMultipleUpload(Array.from(files));
    }
    // Reset input value to allow uploading the same file again
    if (inputRef.current) {
      inputRef.current.value = "";
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

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        handleMultipleUpload(Array.from(files));
      }
    },
    [disabled, handleMultipleUpload],
  );

  const handleRemove = (indexToRemove: number) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);
    onChange(newImages);

    // Adjust current index if necessary
    if (currentIndex >= newImages.length && newImages.length > 0) {
      setCurrentIndex(newImages.length - 1);
    } else if (newImages.length === 0) {
      setCurrentIndex(0);
    }
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
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
        {images.length > 0 ? (
          <div className="space-y-3">
            {/* Image Carousel */}
            <div className="relative group">
              <div className="relative aspect-video rounded-lg overflow-hidden border border-base-300 bg-base-200">
                <img
                  src={images[currentIndex]}
                  alt={`Imagem ${currentIndex + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={goToPrevious}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                    >
                      <ChevronLeftIcon className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={goToNext}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                    >
                      <ChevronRightIcon className="h-5 w-5" />
                    </button>
                  </>
                )}

                {/* Remove Button */}
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => handleRemove(currentIndex)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <XIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Image Counter and Dots */}
            <div className="flex items-center justify-center gap-2">
              {images.length > 1 && (
                <>
                  <div className="flex items-center gap-1.5">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setCurrentIndex(index)}
                        className={cn(
                          "w-2 h-2 rounded-full transition-colors",
                          index === currentIndex
                            ? "bg-orange-500"
                            : "bg-base-300 hover:bg-base-400",
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-base-content/60 ml-2">
                    {currentIndex + 1} / {images.length}
                  </span>
                </>
              )}
            </div>

            {/* Add More Button */}
            {!disabled && images.length < maxImages && (
              <div className="relative">
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  disabled={disabled || isUploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={disabled || isUploading}
                  className="w-full gap-2"
                >
                  {isUploading ? (
                    <>
                      <Loader2Icon className="h-4 w-4 animate-spin" />
                      Enviando {uploadProgress.current}/{uploadProgress.total}...
                    </>
                  ) : (
                    <>
                      <PlusIcon className="h-4 w-4" />
                      Adicionar mais fotos ({images.length}/{maxImages})
                    </>
                  )}
                </Button>
              </div>
            )}
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
              multiple
              onChange={handleFileChange}
              disabled={disabled || isUploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />

            <div className="flex flex-col items-center justify-center text-center gap-3">
              {isUploading ? (
                <>
                  <Loader2Icon className="h-10 w-10 text-orange-500 animate-spin" />
                  <p className="text-sm text-base-content/70">
                    Enviando {uploadProgress.current}/{uploadProgress.total}...
                  </p>
                </>
              ) : (
                <>
                  <div className="p-3 rounded-full bg-base-200">
                    <ImageIcon className="h-8 w-8 text-base-content/50" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-base-content">
                      Arraste imagens ou clique para selecionar
                    </p>
                    <p className="text-xs text-base-content/50 mt-1">
                      PNG, JPG ou WEBP (máx. 10MB cada, até {maxImages} imagens)
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
                    Selecionar arquivos
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
