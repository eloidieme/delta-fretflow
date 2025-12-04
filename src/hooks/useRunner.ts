import {metronome} from '@/audio/MetronomeEngine';
import {usePlayerStore} from '@/store/playerStore';
import {useEffect, useRef} from 'react';

import {useIntervalTimer} from './useIntervalTimer';

export function useRunner() {
  // Pull activeDuration and activeTitle from store
  const {status, bpm, setStatus, activeDuration} = usePlayerStore();

  const WARMUP_DURATION = 3;

  // Use a ref to track if we just beeped (for countdown)
  const lastWarmupSecond = useRef<number>(WARMUP_DURATION + 1);

  // -- Audio Helper (same as before) --
  const playTone = (freq: number, type: 'beep'|'chime' = 'beep') => {
    const ctx =
        new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(freq, now);

    if (type === 'beep') {
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.15);
    } else {
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);
      osc.start(now);
      osc.stop(now + 2);
    }
  };

  // -- Timers --
  const warmupTimer = useIntervalTimer(WARMUP_DURATION, () => {
    setStatus('running');
  });

  // KEY CHANGE: Pass activeDuration from store here
  const exerciseTimer = useIntervalTimer(activeDuration, () => {
    setStatus('finished');
    playTone(523.25, 'chime');
  });

  // -- State Machine Effect --
  useEffect(
      () => {
        metronome.setBpm(bpm);

        switch (status) {
          case 'idle':
          case 'finished':
            warmupTimer.reset();
            exerciseTimer.reset();
            metronome.stop();
            lastWarmupSecond.current = WARMUP_DURATION + 1;
            break;

          case 'warmup':
            metronome.stop();
            exerciseTimer.reset();
            warmupTimer.start();
            break;

          case 'running':
            warmupTimer.pause();
            metronome.start();
            exerciseTimer.start();
            break;

          case 'paused':
            warmupTimer.pause();
            exerciseTimer.pause();
            metronome.stop();
            break;
        }
      },
      [
        status, bpm
      ]);  // Note: We don't depend on activeDuration here to avoid resets
           // mid-run

  // -- Audio Countdown Effect --
  useEffect(() => {
    if (status === 'warmup') {
      const currentSecond = Math.ceil(warmupTimer.timeLeft);
      if (currentSecond < lastWarmupSecond.current && currentSecond > 0) {
        playTone(440);
        lastWarmupSecond.current = currentSecond;
      }
    }
  }, [warmupTimer.timeLeft, status]);

  return {
    displayTime: status === 'warmup' ? warmupTimer.timeLeft :
                                       exerciseTimer.timeLeft,
    displayProgress: status === 'warmup' ? warmupTimer.progress :
                                           exerciseTimer.progress,
    isWarmup: status === 'warmup'
  };
}