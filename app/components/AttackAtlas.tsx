"use client";

import { useEffect, useRef } from "react";
import Map, { Marker, NavigationControl, type MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Dataset } from "@/lib/types";
import { categoryColor } from "@/lib/categoryColors";
import { useReplayEngine } from "@/lib/useReplayEngine";
import Legend from "@/app/components/Legend";
import Ticker from "@/app/components/Ticker";
import StatsPanel from "@/app/components/StatsPanel";
import Controls from "@/app/components/Controls";
import NavLink from "@/app/components/NavLink";

const DARK_STYLE = {
  version: 8 as const,
  sources: {
    carto: {
      type: "raster" as const,
      tiles: [
        "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
        "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
        "https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
    },
  },
  layers: [{ id: "carto-dark", type: "raster" as const, source: "carto" }],
};

const WORLD_VIEW = { longitude: 15, latitude: 20, zoom: 1.4 };
const PLAYBACK_DURATION_MS = 90_000;

type Props = {
  dataset: Dataset;
};

export default function AttackAtlas({ dataset }: Props) {
  const mapRef = useRef<MapRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => {
      mapRef.current?.resize();
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const { active, ticker, counts, playing, setPlaying, speed, setSpeed } = useReplayEngine(
    dataset.events,
    PLAYBACK_DURATION_MS
  );

  return (
    <div ref={containerRef} className="absolute inset-0">
      <Map
        ref={mapRef}
        initialViewState={WORLD_VIEW}
        mapStyle={DARK_STYLE}
        style={{ width: "100%", height: "100%" }}
        onLoad={() => mapRef.current?.resize()}
        minZoom={0.6}
      >
        <NavigationControl position="top-right" />

        {active.map((e) => (
          <Marker key={e.key} longitude={e.lon} latitude={e.lat} anchor="center">
            <div
              className="attack-pulse"
              style={{
                width: 14,
                height: 14,
                borderRadius: "9999px",
                background: categoryColor(e.category),
                boxShadow: `0 0 8px 2px ${categoryColor(e.category)}`,
                pointerEvents: "none",
              }}
            />
          </Marker>
        ))}
      </Map>

      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="pointer-events-auto rounded-lg bg-black/60 backdrop-blur px-4 py-3 shadow-lg">
            <h1 className="text-lg font-semibold tracking-wide text-slate-100">cyber-atlas</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              community-reported attack sources, replayed
            </p>
          </div>
          <div className="pointer-events-auto flex flex-col items-end gap-3">
            <NavLink href="/trends" label="Trends →" />
            <Legend categories={dataset.categories} />
          </div>
        </div>

        <div className="flex items-end justify-between gap-4">
          <div className="pointer-events-auto flex flex-col gap-3">
            <Controls playing={playing} setPlaying={setPlaying} speed={speed} setSpeed={setSpeed} />
            <StatsPanel counts={counts} categories={dataset.categories} />
          </div>
          <div className="pointer-events-auto">
            <Ticker events={ticker} />
          </div>
        </div>
      </div>
    </div>
  );
}
