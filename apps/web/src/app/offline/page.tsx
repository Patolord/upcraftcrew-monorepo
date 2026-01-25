"use client";

import { WifiOff, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OfflinePage() {
  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Animated Icon */}
        <div className="relative">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 rounded-full flex items-center justify-center">
            <WifiOff className="w-16 h-16 text-orange-500 dark:text-orange-400 animate-pulse" />
          </div>
          {/* Decorative rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-40 h-40 border-2 border-orange-200 dark:border-orange-800/50 rounded-full animate-ping opacity-20" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-foreground">Você está offline</h1>
          <p className="text-muted-foreground text-lg">
            Parece que você perdeu a conexão com a internet. Verifique sua conexão e tente
            novamente.
          </p>
        </div>

        {/* Status indicator */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          Sem conexão
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleRefresh}
            className="bg-brand hover:bg-brand/90 text-white gap-2"
            size="lg"
          >
            <RefreshCw className="w-4 h-4" />
            Tentar novamente
          </Button>
          <Button onClick={handleGoHome} variant="outline" className="gap-2" size="lg">
            <Home className="w-4 h-4" />
            Ir para o início
          </Button>
        </div>

        {/* Info */}
        <div className="pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Algumas funcionalidades podem estar disponíveis offline.
            <br />
            Os dados serão sincronizados quando você voltar a ficar online.
          </p>
        </div>

        {/* Brand */}
        <div className="pt-4">
          <p className="text-xs text-muted-foreground/60">Up Craft Crew</p>
        </div>
      </div>
    </div>
  );
}
