import {metronome} from '@/audio/MetronomeEngine';
import {usePlayerStore} from '@/store/playerStore';
import {useEffect, useRef} from 'react';

import {useIntervalTimer} from './useIntervalTimer';

export function useRunner() {
  const {status, bpm, setStatus, activeExerciseId} = usePlayerStore();

  const WARMUP_DURATION = 3;
  const EXERCISE_DURATION = 10;

  // Track the last second we beeped for (to avoid duplicate beeps)
  const lastWarmupSecond = useRef<number>(WARMUP_DURATION + 1);

  // -- Audio Helper --
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
      // Short, dry beep for countdown
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.15);
    } else {
      // Longer, pleasant chime for finish
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

  const exerciseTimer = useIntervalTimer(EXERCISE_DURATION, () => {
    setStatus('finished');
    playTone(523.25, 'chime');  // C5 Chime
  });

  // -- State Machine Effect --
  useEffect(() => {
    metronome.setBpm(bpm);

    switch (status) {
      case 'idle':
      case 'finished':
        warmupTimer.reset();
        exerciseTimer.reset();
        metronome.stop();
        lastWarmupSecond.current =
            WARMUP_DURATION + 1;  // Reset countdown logic
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
  }, [status, bpm]);

  // -- Audio Countdown Effect --
  useEffect(() => {
    if (status === 'warmup') {
      // Logic: If we are at 3.0s, we want to beep "3".
      // If we cross into 2.9s, we don't beep again until 2.0s.
      const currentSecond = Math.ceil(warmupTimer.timeLeft);

      // Only beep if the integer second has changed AND it's not 0
      if (currentSecond < lastWarmupSecond.current && currentSecond > 0) {
        playTone(440);  // A4 (Standard countdown beep)
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