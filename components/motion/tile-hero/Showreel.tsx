"use client";

import { useEffect, useRef } from "react";

/**
 * Showreel — a video layer that plays only while its section is on screen,
 * cover-fits its box, is muted/looped/inline, and tears its player down on
 * unmount.
 *
 * `playing` is owned by the parent (typically driven by scroll progress or an
 * IntersectionObserver), so the video is never decoding while its section is
 * scrolled away.
 *
 * Autoplay is muted because every browser blocks audible autoplay outright,
 * and play() is reconciled against `playing` on every change so a single
 * dropped call self-corrects instead of stranding the reel on a frozen frame.
 */
export default function Showreel({
  src,
  playing,
  className,
  style,
  poster,
  title = "Showreel",
  onFail,
}: {
  src: string;
  playing: boolean;
  className?: string;
  style?: React.CSSProperties;
  poster?: string;
  title?: string;
  /** Called if the file can't be played, so the parent can show its fallback. */
  onFail?: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Reconcile playback with intent. A play() promise can reject for two very
  // different reasons: the browser declined the autoplay (transient — the video
  // is fine, it just isn't allowed to start yet), or the media genuinely can't
  // decode. Only the second is a failure. A rejected play() is therefore
  // swallowed and left to the next reconcile; real failure comes through the
  // element's `error` event, which fires `onFail`.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (playing) {
      const p = video.play();
      if (p && typeof p.then === "function") p.catch(() => {});
    } else {
      video.pause();
    }
  }, [playing]);

  return (
    // `position: relative` establishes the positioning context for the video
    // below. Callers position this by WRAPPING it (an absolutely-positioned
    // parent) and passing size via `className`/`style` (e.g. height/width 100%).
    <div
      className={className}
      style={{ position: "relative", overflow: "hidden", ...style }}
      aria-label={title}
    >
      <video
        ref={videoRef}
        // No opacity gate: the video shows its frames as they arrive; whatever
        // sits behind it is the fallback until then and if the file fails.
        style={{ position: "absolute", inset: 0, height: "100%", width: "100%", objectFit: "cover" }}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden
        tabIndex={-1}
        onError={() => onFail?.()}
        // Guard against a src that resolves to an HTML error page (200 but not
        // video): metadata loads but the frame has no dimensions.
        onLoadedMetadata={(e) => {
          if (e.currentTarget.videoWidth === 0) onFail?.();
        }}
      />
    </div>
  );
}
