/**
 * Web Audio API synthesizer for authentic BMW TwinPower Turbo V8 engine sound & Electric Whistle
 */
class EngineSoundSimulator {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.oscillators = [];
    this.gainNodes = [];
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playEngineRev(isElectric = false) {
    this.init();
    if (!this.ctx) return;

    if (isElectric) {
      this.playElectricWhistle();
    } else {
      this.playV8Rumble();
    }
  }

  playV8Rumble() {
    const now = this.ctx.currentTime;
    
    // Master Gain
    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(0.01, now);
    masterGain.gain.exponentialRampToValueAtTime(0.35, now + 0.15);
    masterGain.gain.exponentialRampToValueAtTime(0.5, now + 0.6);
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);
    masterGain.connect(this.ctx.destination);

    // Fundamental Low End Oscillator (V8 low idle pulse)
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(45, now);
    osc1.frequency.exponentialRampToValueAtTime(140, now + 0.6); // rev up
    osc1.frequency.exponentialRampToValueAtTime(180, now + 0.9);
    osc1.frequency.exponentialRampToValueAtTime(48, now + 2.0);  // settle down

    // Exhaust Growl Sub-Oscillator
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(90, now);
    osc2.frequency.exponentialRampToValueAtTime(280, now + 0.6);
    osc2.frequency.exponentialRampToValueAtTime(360, now + 0.9);
    osc2.frequency.exponentialRampToValueAtTime(96, now + 2.0);

    // Distortion / Low Pass Filter to make it throaty
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, now);
    filter.frequency.exponentialRampToValueAtTime(900, now + 0.6);
    filter.frequency.exponentialRampToValueAtTime(350, now + 2.0);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(masterGain);

    osc1.start(now);
    osc2.start(now);

    osc1.stop(now + 2.2);
    osc2.stop(now + 2.2);
  }

  playElectricWhistle() {
    const now = this.ctx.currentTime;

    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(0.01, now);
    masterGain.gain.exponentialRampToValueAtTime(0.2, now + 0.2);
    masterGain.gain.exponentialRampToValueAtTime(0.3, now + 0.8);
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);
    masterGain.connect(this.ctx.destination);

    // Dual pure sine wave for futuristic Hans Zimmer IconicSounds electric swoop
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(220, now);
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.8);
    osc1.frequency.exponentialRampToValueAtTime(440, now + 1.8);

    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(440, now);
    osc2.frequency.exponentialRampToValueAtTime(1760, now + 0.8);
    osc2.frequency.exponentialRampToValueAtTime(880, now + 1.8);

    osc1.connect(masterGain);
    osc2.connect(masterGain);

    osc1.start(now);
    osc2.start(now);

    osc1.stop(now + 2.0);
    osc2.stop(now + 2.0);
  }
}

export const soundEngine = new EngineSoundSimulator();

