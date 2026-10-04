/**
 * Minimal spring animator for a set of numeric values.
 *
 * Unlike a CSS transition, a spring keeps its velocity when the target changes mid-flight, so
 * interrupted motion (e.g. moving the pointer between links quickly) continues smoothly instead of
 * restarting. Defaults are a slightly under-damped spring (about 4% overshoot, settles in ~0.45s).
 */
export interface SpringOptions {
  stiffness?: number;
  damping?: number;
}

const EPSILON = 0.005;
const SUBSTEP = 1 / 240;

export function createSpring<K extends string>(
  initial: Record<K, number>,
  onUpdate: (values: Record<K, number>) => void,
  { stiffness = 259, damping = 23.2 }: SpringOptions = {},
) {
  const keys = Object.keys(initial) as K[];
  const cur = { ...initial };
  const target = { ...initial };
  const vel = Object.fromEntries(keys.map((k) => [k, 0])) as Record<K, number>;
  let raf = 0;
  let last = 0;

  const tick = (now: number) => {
    let remaining = Math.min((now - last) / 1000, 1 / 20); // cap long frames (e.g. after a tab switch)
    last = now;
    while (remaining > 0) {
      const dt = Math.min(SUBSTEP, remaining);
      remaining -= dt;
      for (const k of keys) {
        vel[k] += (stiffness * (target[k] - cur[k]) - damping * vel[k]) * dt;
        cur[k] += vel[k] * dt;
      }
    }
    const moving = keys.some((k) => Math.abs(target[k] - cur[k]) > EPSILON || Math.abs(vel[k]) > EPSILON * 4);
    if (!moving) {
      for (const k of keys) {
        cur[k] = target[k];
        vel[k] = 0;
      }
    }
    onUpdate(cur);
    raf = moving ? requestAnimationFrame(tick) : 0;
  };

  return {
    /** Animate toward new target values (velocity carries over from whatever is happening now). */
    to(next: Partial<Record<K, number>>) {
      Object.assign(target, next);
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    },
    /** Set values immediately with no animation. */
    jump(next: Partial<Record<K, number>>) {
      Object.assign(target, next);
      Object.assign(cur, next);
      for (const k of keys) vel[k] = 0;
      cancelAnimationFrame(raf);
      raf = 0;
      onUpdate(cur);
    },
    stop() {
      cancelAnimationFrame(raf);
      raf = 0;
    },
  };
}
