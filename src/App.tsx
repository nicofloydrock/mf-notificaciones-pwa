import { useState } from "react";
import type { HostConfig } from "./types/hostConfig";
import { usePush } from "./hooks/usePush";
import "./index.css";

type AppProps = {
  config?: HostConfig;
};

export default function App({ config }: AppProps) {
  const valid = config?.token === "NICORIVERA";
  const { status, error, subscribe, sendPush } = usePush();
  const [delay, setDelay] = useState(10);
  const [body, setBody] = useState("Notificación de prueba desde MF Notificaciones.");

  if (!valid) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-6 text-center text-slate-200 sm:px-8">
        Config no recibida o token inválido.
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6 sm:px-8">
      <header className="glass mx-auto flex max-w-5xl flex-col gap-2 rounded-2xl px-4 py-4 shadow-glow sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
            Microfront Notificaciones
          </p>
          <h1 className="text-2xl font-semibold text-white">Pruebas Web Push</h1>
          <p className="text-xs text-slate-400">
            Sesión: {config?.user?.name ?? "Operador"} · Token válido
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-white/10 px-3 py-1 text-slate-200">
            remote: notificaciones
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1 text-slate-200">
            expose: App
          </span>
        </div>
      </header>

      <main className="mx-auto mt-6 flex max-w-5xl flex-col gap-4">
        <section className="glass rounded-2xl border border-white/10 p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                Suscripción
              </p>
              <h2 className="text-xl font-semibold text-white">
                Suscribirse a Push (VAPID)
              </h2>
              <p className="text-xs text-slate-300">
                Requiere HTTPS, permisos de notificación y VAPID_PUBLIC_KEY.
              </p>
            </div>
            <button
              className="rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-emerald-950 shadow transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={status === "subscribing" || status === "subscribed"}
              onClick={() => subscribe()}
            >
              {status === "subscribed"
                ? "Suscrito"
                : status === "subscribing"
                ? "Suscribiendo..."
                : "Suscribirse"}
            </button>
          </div>
          {error && (
            <div className="mt-3 rounded-lg border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
              {error}
            </div>
          )}
        </section>

        <section className="glass rounded-2xl border border-white/10 p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                Envío de prueba
              </p>
              <h2 className="text-xl font-semibold text-white">
                Enviar push (delay opcional)
              </h2>
            </div>
            <div className="flex gap-2 text-xs text-slate-200">
              <label className="flex items-center gap-2">
                Delay (s):
                <input
                  type="number"
                  min={0}
                  className="w-20 rounded border border-white/10 bg-white/5 px-2 py-1 text-xs text-white"
                  value={delay}
                  onChange={(e) => setDelay(Number(e.target.value))}
                />
              </label>
            </div>
          </div>

          <div className="mt-3 space-y-3">
            <textarea
              className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-white outline-none focus:border-white/30"
              rows={3}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              <button
                className="rounded-lg bg-sky-500 px-3 py-2 text-xs font-semibold text-sky-950 shadow transition hover:-translate-y-0.5 disabled:opacity-60"
                disabled={status !== "subscribed"}
                onClick={() =>
                  sendPush(body, 0, "agente").catch((err) => console.error(err))
                }
              >
                Enviar ahora (agente)
              </button>
              <button
                className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs text-slate-200 transition hover:-translate-y-0.5 hover:border-white/40 disabled:opacity-60"
                disabled={status !== "subscribed"}
                onClick={() =>
                  sendPush(body, delay, "agente").catch((err) =>
                    console.error(err),
                  )
                }
              >
                Enviar en {delay}s
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Usa target=agente para abrir el shell en esa pestaña al tocar la
              notificación.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
