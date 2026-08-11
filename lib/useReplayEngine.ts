import { useCallback, useEffect, useRef, useState } from "react";
import type { AttackEvent, CategoryId } from "@/lib/types";

const FADE_MS = 4000;
const TICKER_SIZE = 12;

export type ActiveEvent = AttackEvent & { key: string; revealedAt: number };

/**
 * eventsは実際の発生時刻(合成値)でソート済みという前提で、その相対間隔を
 * playbackDurationMs間に圧縮して繰り返し再生する(NICTER Atlasのような
 * 「流れてくる」演出のための時間軸の再マッピング)。
 */
export function useReplayEngine(events: AttackEvent[], playbackDurationMs: number) {
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [active, setActive] = useState<ActiveEvent[]>([]);
  const [ticker, setTicker] = useState<AttackEvent[]>([]);
  const [counts, setCounts] = useState<Partial<Record<CategoryId, number>>>({});
  const [loopCount, setLoopCount] = useState(0);

  const revealedIndexRef = useRef(0);
  const playbackElapsedRef = useRef(0);
  const lastFrameRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const windowStartMs = useRef(0);
  const windowDurationMs = useRef(1);

  useEffect(() => {
    if (events.length === 0) return;
    windowStartMs.current = new Date(events[0].timestamp).getTime();
    const endMs = new Date(events[events.length - 1].timestamp).getTime();
    windowDurationMs.current = Math.max(1, endMs - windowStartMs.current);
  }, [events]);

  const resetLoop = useCallback(() => {
    revealedIndexRef.current = 0;
    playbackElapsedRef.current = 0;
    setActive([]);
    setTicker([]);
    setCounts({});
  }, []);

  useEffect(() => {
    if (!playing || events.length === 0) {
      lastFrameRef.current = null;
      return;
    }

    const tick = (now: number) => {
      if (lastFrameRef.current == null) lastFrameRef.current = now;
      const dt = now - lastFrameRef.current;
      lastFrameRef.current = now;
      playbackElapsedRef.current += dt * speed;

      if (playbackElapsedRef.current >= playbackDurationMs) {
        resetLoop();
        setLoopCount((c) => c + 1);
      }

      const progress = playbackElapsedRef.current / playbackDurationMs;
      const virtualTimeMs = windowStartMs.current + progress * windowDurationMs.current;

      const newlyRevealed: AttackEvent[] = [];
      while (
        revealedIndexRef.current < events.length &&
        new Date(events[revealedIndexRef.current].timestamp).getTime() <= virtualTimeMs
      ) {
        newlyRevealed.push(events[revealedIndexRef.current]);
        revealedIndexRef.current += 1;
      }

      const nowReal = performance.now();
      if (newlyRevealed.length > 0) {
        setActive((prev) => [
          ...prev.filter((e) => nowReal - e.revealedAt < FADE_MS),
          ...newlyRevealed.map((e) => ({
            ...e,
            key: `${e.ip}-${e.timestamp}-${nowReal}-${Math.random()}`,
            revealedAt: nowReal,
          })),
        ]);
        setTicker((prev) => [...newlyRevealed, ...prev].slice(0, TICKER_SIZE));
        setCounts((prev) => {
          const next = { ...prev };
          for (const e of newlyRevealed) next[e.category] = (next[e.category] ?? 0) + 1;
          return next;
        });
      } else {
        setActive((prev) => {
          const filtered = prev.filter((e) => nowReal - e.revealedAt < FADE_MS);
          return filtered.length === prev.length ? prev : filtered;
        });
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      lastFrameRef.current = null;
    };
  }, [playing, speed, events, playbackDurationMs, resetLoop]);

  return { active, ticker, counts, loopCount, playing, setPlaying, speed, setSpeed };
}

export { FADE_MS };
