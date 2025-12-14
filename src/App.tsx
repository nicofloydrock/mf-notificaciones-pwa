// Entrada del MF Notificaciones: valida config y muestra flujos de suscripción/envío.
import { useState } from "react";
import type { HostConfig } from "./types/hostConfig";
import { usePush } from "./hooks/usePush";
import { ConfigTester } from "./components/ConfigTester";
import copy from "./content/notifications.json";
import "./index.css";

type AppProps = {
  config?: HostConfig;
};

export default function App({ config }: AppProps) {
  const [localConfig, setLocalConfig] = useState<HostConfig | undefined>(config);
  const effectiveConfig = localConfig ?? config;
  const valid = effectiveConfig?.token === "NICORIVERA";
  const { status, error, subscribe, sendPush } = usePush();
  const [delay, setDelay] = useState(10);
  const [body, setBody] = useState("Notificación de prueba desde MF Notificaciones.");
  const userName =
    effectiveConfig?.auth?.user?.name ?? effectiveConfig?.user?.name ?? copy.app.anonymousUser;

  if (!valid) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-6 text-slate-200 sm:px-8">
        <ConfigTester copy={copy.tester} onApply={(cfg) => setLocalConfig(cfg)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6 sm:px-8">
      <header className="glass mx-auto flex max-w-5xl flex-col gap-2 rounded-2xl px-4 py-4 shadow-glow sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
            {copy.header.microfrontLabel}
          </p>
          <h1 className="text-2xl font-semibold text-white">{copy.header.title}</h1>
          <p className="text-xs text-slate-400">
            {copy.header.sessionLabel}: {userName} · {copy.header.tokenLabel}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-white/10 px-3 py-1 text-slate-200">
            {copy.header.remoteLabel}: notificaciones
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1 text-slate-200">
            {copy.header.moduleLabel}: App
          </span>
        </div>
      </header>

      <main className="mx-auto mt-6 flex max-w-5xl flex-col gap-4">
        <section className="glass rounded-2xl border border-white/10 p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                {copy.subscribe.subtitle}
              </p>
              <h2 className="text-xl font-semibold text-white">{copy.subscribe.title}</h2>
              <p className="text-xs text-slate-300">{copy.subscribe.description}</p>
            </div>
            <button
              className="rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-emerald-950 shadow transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={status === "subscribing" || status === "subscribed"}
              onClick={() => subscribe()}
            >
              {status === "subscribed"
                ? copy.subscribe.cta.subscribed
                : status === "subscribing"
                ? copy.subscribe.cta.subscribing
                : copy.subscribe.cta.idle}
            </button>
          </div>
          {error && (
            <div className="mt-3 rounded-lg border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
              {copy.subscribe.errorPrefix}: {error}
            </div>
          )}
        </section>

        <section className="glass rounded-2xl border border-white/10 p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                {copy.send.subtitle}
              </p>
              <h2 className="text-xl font-semibold text-white">{copy.send.title}</h2>
            </div>
            <div className="flex gap-2 text-xs text-slate-200">
              <label className="flex items-center gap-2">
                {copy.send.delayLabel}
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
                {copy.send.sendNow}
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
                {copy.send.sendLater} {delay}s
              </button>
            </div>
            <p className="text-xs text-slate-400">
              {copy.send.targetHint}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
