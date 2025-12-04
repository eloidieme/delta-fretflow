class MetronomeEngine {
  private audioContext: AudioContext|null = null;
  private isPlaying: boolean = false;
  private current16thNote: number = 0;  // Tracking 16th notes (0-15)
  private nextNoteTime: number = 0.0;   // When the next note is due
  private timerID: number|undefined;    // The setInterval ID

  // Settings
  private bpm: number = 120;
  private scheduleAheadTime: number = 0.1;  // Schedule 0.1s ahead
  private lookahead: number = 25.0;         // How often to look ahead (25ms)

  constructor() {
    // We delay AudioContext creation until user interaction (browser policy)
  }

  // 1. Initialize Audio Context (Must be triggered by user action)
  private initAudio() {
    if (!this.audioContext) {
      this.audioContext =
          new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  // 2. The Scheduler: Moves the "cursor" forward
  private nextNote() {
    const secondsPerBeat = 60.0 / this.bpm;
    // We are scheduling 16th notes (4 per beat)
    this.nextNoteTime += 0.25 * secondsPerBeat;

    this.current16thNote++;
    if (this.current16thNote === 16) {
      this.current16thNote = 0;
    }
  }

  // 3. The Sound Generator: Schedules the beep
  private scheduleNote(beatNumber: number, time: number) {
    if (!this.audioContext) return;

    const osc = this.audioContext.createOscillator();
    const envelope = this.audioContext.createGain();

    osc.connect(envelope);
    envelope.connect(this.audioContext.destination);

    // Sound Logic: High pitch on beat 1, Low on others
    // We only play on quarter notes (every 4th 16th note) for now
    if (beatNumber % 4 === 0) {
      if (beatNumber === 0) {
        osc.frequency.value = 880.0;  // High Click (A5)
      } else {
        osc.frequency.value = 440.0;  // Low Click (A4)
      }

      envelope.gain.value = 1;
      envelope.gain.exponentialRampToValueAtTime(1, time + 0.001);
      envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.02);

      osc.start(time);
      osc.stop(time + 0.03);
    }
  }

  // 4. The Loop: Checks if we need to schedule more notes
  private scheduler() {
    if (!this.audioContext) return;

    // While there are notes that will need to play before the next interval,
    // schedule them and advance the pointer.
    while (this.nextNoteTime <
           this.audioContext.currentTime + this.scheduleAheadTime) {
      this.scheduleNote(this.current16thNote, this.nextNoteTime);
      this.nextNote();
    }
  }

  // -- Public API --

  public start() {
    if (this.isPlaying) return;

    this.initAudio();  // Ensure context exists
    if (!this.audioContext) return;

    this.isPlaying = true;
    this.current16thNote = 0;

    // Set first note to happen a tiny bit in the future
    this.nextNoteTime = this.audioContext.currentTime + 0.1;

    // Start the lookahead loop
    this.timerID = window.setInterval(() => this.scheduler(), this.lookahead);
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerID) {
      window.clearInterval(this.timerID);
    }
  }

  public setBpm(bpm: number) {
    this.bpm = bpm;
  }
}

// Export a singleton instance
export const metronome = new MetronomeEngine();