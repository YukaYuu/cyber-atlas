type Props = {
  playing: boolean;
  setPlaying: (v: boolean) => void;
  speed: number;
  setSpeed: (v: number) => void;
};

const SPEEDS = [1, 2, 4];

export default function Controls({ playing, setPlaying, speed, setSpeed }: Props) {
  return (
    <div className="rounded-lg bg-black/60 backdrop-blur px-4 py-3 shadow-lg flex items-center gap-3 text-xs text-slate-200">
      <button
        onClick={() => setPlaying(!playing)}
        className="rounded bg-slate-700 hover:bg-slate-600 px-3 py-1.5 font-medium cursor-pointer"
      >
        {playing ? "Pause" : "Play"}
      </button>
      <div className="flex items-center gap-1">
        {SPEEDS.map((s) => (
          <button
            key={s}
            onClick={() => setSpeed(s)}
            className={`rounded px-2 py-1.5 cursor-pointer ${
              speed === s ? "bg-cyan-600 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  );
}
