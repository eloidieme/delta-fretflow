import {useCallback, useEffect, useRef, useState} from 'react';

export function useIntervalTimer(
    initialDurationSeconds: number, onComplete?: () => void) {
  const [timeLeft, setTimeLeft] = useState(initialDurationSeconds);
  const [isRunning, setIsRunning] = useState(false);

  const timerRef = useRef<number|undefined>(undefined);
  const onCompleteRef = useRef(onComplete);

  // Keep callback fresh
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Reset when configuration changes
  useEffect(() => {
    setTimeLeft(initialDurationSeconds);
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [initialDurationSeconds]);

  // -- 1. The Tick Logic (Pure) --
  useEffect(() => {
    if (!isRunning) return;

    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        // Just calculate the number, don't do side effects here!
        const newVal = prev - 0.1;
        return newVal <= 0 ? 0 : newVal;
      });
    }, 100);

    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  // -- 2. The Completion Monitor (Side Effects) --
  useEffect(() => {
    // If time hit 0 AND we were running, then we are finished.
    if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (timerRef.current) clearInterval(timerRef.current);

      // Fire the callback safely
      if (onCompleteRef.current) onCompleteRef.current();
    }
  }, [timeLeft, isRunning]);

  // -- Actions --
  const start = useCallback(() => {
    if (timeLeft > 0) setIsRunning(true);
  }, [timeLeft]);

  const pause = useCallback(() => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(initialDurationSeconds);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [initialDurationSeconds]);

  const progress =
      ((initialDurationSeconds - timeLeft) / initialDurationSeconds) * 100;

  return {
    timeLeft: Math.max(0, timeLeft),
    progress,
    isRunning,
    start,
    pause,
    reset
  };
}