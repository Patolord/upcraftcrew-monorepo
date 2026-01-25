"use client";

import { useState, useEffect, useCallback } from "react";

interface PushNotificationState {
  isSupported: boolean;
  isSubscribed: boolean;
  subscription: PushSubscription | null;
  permission: NotificationPermission;
  isLoading: boolean;
  error: string | null;
}

interface UsePushNotificationsReturn extends PushNotificationState {
  requestPermission: () => Promise<NotificationPermission>;
  subscribe: () => Promise<PushSubscription | null>;
  unsubscribe: () => Promise<boolean>;
  showNotification: (title: string, options?: NotificationOptions) => void;
}

// VAPID public key - should be set in environment variables
// Generate your own keys using: npx web-push generate-vapid-keys
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushNotifications(): UsePushNotificationsReturn {
  const [state, setState] = useState<PushNotificationState>({
    isSupported: false,
    isSubscribed: false,
    subscription: null,
    permission: "default",
    isLoading: true,
    error: null,
  });

  // Check if push notifications are supported
  useEffect(() => {
    const checkSupport = async () => {
      const isSupported =
        "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;

      if (!isSupported) {
        setState((prev) => ({
          ...prev,
          isSupported: false,
          isLoading: false,
        }));
        return;
      }

      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        const permission = Notification.permission;

        setState({
          isSupported: true,
          isSubscribed: !!subscription,
          subscription,
          permission,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isSupported: true,
          isLoading: false,
          error: error instanceof Error ? error.message : "Erro desconhecido",
        }));
      }
    };

    checkSupport();
  }, []);

  // Request notification permission
  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!state.isSupported) {
      return "denied";
    }

    try {
      const permission = await Notification.requestPermission();
      setState((prev) => ({ ...prev, permission }));
      return permission;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Erro ao solicitar permissão",
      }));
      return "denied";
    }
  }, [state.isSupported]);

  // Subscribe to push notifications
  const subscribe = useCallback(async (): Promise<PushSubscription | null> => {
    if (!state.isSupported) {
      setState((prev) => ({
        ...prev,
        error: "Push notifications não são suportadas neste navegador",
      }));
      return null;
    }

    if (!VAPID_PUBLIC_KEY) {
      setState((prev) => ({
        ...prev,
        error: "VAPID public key não configurada",
      }));
      return null;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Request permission if not granted
      if (state.permission !== "granted") {
        const permission = await requestPermission();
        if (permission !== "granted") {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: "Permissão para notificações negada",
          }));
          return null;
        }
      }

      const registration = await navigator.serviceWorker.ready;

      // Subscribe to push
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      setState((prev) => ({
        ...prev,
        isSubscribed: true,
        subscription,
        isLoading: false,
        error: null,
      }));

      // TODO: Send subscription to your backend server
      // await sendSubscriptionToServer(subscription);

      return subscription;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Erro ao se inscrever",
      }));
      return null;
    }
  }, [state.isSupported, state.permission, requestPermission]);

  // Unsubscribe from push notifications
  const unsubscribe = useCallback(async (): Promise<boolean> => {
    if (!state.subscription) {
      return false;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      await state.subscription.unsubscribe();

      // TODO: Remove subscription from your backend server
      // await removeSubscriptionFromServer(state.subscription);

      setState((prev) => ({
        ...prev,
        isSubscribed: false,
        subscription: null,
        isLoading: false,
        error: null,
      }));

      return true;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Erro ao cancelar inscrição",
      }));
      return false;
    }
  }, [state.subscription]);

  // Show a local notification (useful for testing)
  const showNotification = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (!state.isSupported || state.permission !== "granted") {
        console.warn("Notificações não permitidas ou não suportadas");
        return;
      }

      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, {
          icon: "/icons/icon-192x192.png",
          badge: "/icons/icon-72x72.png",
          vibrate: [100, 50, 100],
          ...options,
        });
      });
    },
    [state.isSupported, state.permission],
  );

  return {
    ...state,
    requestPermission,
    subscribe,
    unsubscribe,
    showNotification,
  };
}

/**
 * Utility function to send subscription to backend
 * This should be called after subscribing to push notifications
 *
 * Example implementation with Convex:
 *
 * ```typescript
 * import { useMutation } from "convex/react";
 * import { api } from "@up-craft-crew-app/backend/convex/_generated/api";
 *
 * const savePushSubscription = useMutation(api.pushNotifications.saveSubscription);
 *
 * const subscription = await subscribe();
 * if (subscription) {
 *   await savePushSubscription({
 *     endpoint: subscription.endpoint,
 *     keys: {
 *       p256dh: arrayBufferToBase64(subscription.getKey('p256dh')),
 *       auth: arrayBufferToBase64(subscription.getKey('auth')),
 *     },
 *   });
 * }
 * ```
 */
export function arrayBufferToBase64(buffer: ArrayBuffer | null): string {
  if (!buffer) return "";
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}
