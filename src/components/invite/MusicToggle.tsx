import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

/** Missing/unplayable public music fails silently; playback follows interaction. */
export function MusicToggle({ start, url }: { start: boolean; url?: string | undefined }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!url) return;
    const audio = new Audio(url);
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;
    const onError = () => {
      setPlaying(false);
      setFailed(true);
    };
    audio.addEventListener("error", onError);
    return () => {
      audio.pause();
      audio.removeEventListener("error", onError);
      audio.removeAttribute("src");
      audio.load();
      audioRef.current = null;
    };
  }, [url]);

  useEffect(() => {
    if (!start || !audioRef.current) return;
    const audio = audioRef.current;
    let cancelled = false;
    void audio
      .play()
      .then(() => {
        if (!cancelled) setPlaying(true);
      })
      .catch(() => {
        // A browser may still block playback; leave an explicit Play button.
        if (!cancelled) setPlaying(false);
      });
    return () => {
      cancelled = true;
    };
  }, [start, url]);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      void audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setFailed(true));
    }
  }

  if (!url || failed) return null;
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={playing ? "Pause music" : "Play music"}
      className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-4 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 bg-ivory/85 text-gold-deep shadow-[var(--shadow-paper)] backdrop-blur transition-colors hover:bg-cream"
    >
      {playing ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
    </button>
  );
}
