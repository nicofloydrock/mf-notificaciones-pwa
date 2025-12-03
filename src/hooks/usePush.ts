import { useState } from "react";
import { resolveApiBase, VAPID_PUBLIC_KEY } from "../utils/env";
import { urlBase64ToUint8Array } from "../utils/base64";

type PushState = "idle" | "subscribing" | "subscribed" | "error";

export function usePush() {
  const [status, setStatus] = useState<PushState>("idle");
  const [error, setError] = useState<string | null>(null);
  const apiBase = resolveApiBase();

  const subscribe = async () => {
    setStatus("subscribing");
    setError(null);
    try {
      if (!("Notification" in window) || !("serviceWorker" in navigator)) {
        throw new Error("Push no soportado en este navegador.");
      }
      const perm = await Notification.requestPermission();
      if (perm !== "granted") throw new Error("Permiso de notificación denegado.");

      const reg = await navigator.serviceWorker.ready;
      const existing = await reg.pushManager.getSubscription();
      if (existing) {
        setStatus("subscribed");
        return;
      }
      if (!VAPID_PUBLIC_KEY) throw new Error("Falta VITE_VAPID_PUBLIC_KEY en el MF.");
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      const res = await fetch(`${apiBase}/push/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub),
      });
      if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
      setStatus("subscribed");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      setStatus("error");
    }
  };

  const sendPush = async (body: string, delaySeconds = 0, target = "agente") => {
    const res = await fetch(`${apiBase}/push/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body, target, delaySeconds }),
    });
    if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
    return true;
  };

  return { status, error, subscribe, sendPush };
}
