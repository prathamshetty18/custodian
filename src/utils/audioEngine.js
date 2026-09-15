/**
 * Custodian Web Audio Engine
 * Provides synthesized field recording ambient soundscape (flute drone, temple bronze bell, chande drum pulse)
 * to ensure immediate offline-capable playback without broken external audio files.
 */

class AudioSimulator {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timer = null;
    this.listeners = new Set();
    this.currentTime = 0;
    this.duration = 132;
    this.osc1 = null;
    this.osc2 = null;
    this.gainNode = null;
  }

  initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  play(duration, onTick) {
    this.initContext();
    this.duration = duration || 132;
    this.isPlaying = true;

    // Start subtle acoustic drone if Web Audio is available
    if (this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.gainNode = this.ctx.createGain();
        this.gainNode.gain.setValueAtTime(0.001, now);
        this.gainNode.gain.exponentialRampToValueAtTime(0.04, now + 1.2);
        this.gainNode.connect(this.ctx.destination);

        // Warm tanpura harmonic drone (D fundamental ~ 146.8Hz)
        this.osc1 = this.ctx.createOscillator();
        this.osc1.type = 'triangle';
        this.osc1.frequency.setValueAtTime(146.83, now);
        this.osc1.connect(this.gainNode);
        this.osc1.start(now);

        // Soft harmonic overtone
        this.osc2 = this.ctx.createOscillator();
        this.osc2.type = 'sine';
        this.osc2.frequency.setValueAtTime(220.0, now);
        this.osc2.connect(this.gainNode);
        this.osc2.start(now);

        // Chime periodically
        this.triggerChime(now + 0.5);
      } catch (e) {
        console.warn("Web Audio drone initialisation skipped", e);
      }
    }

    clearInterval(this.timer);
    this.timer = setInterval(() => {
      if (this.currentTime >= this.duration) {
        this.pause();
        this.currentTime = 0;
        this.notify(0);
        return;
      }
      this.currentTime += 1;
      this.notify(this.currentTime);

      // Periodic subtle gong / bell tone every 15 seconds
      if (this.currentTime % 15 === 0 && this.ctx) {
        this.triggerChime(this.ctx.currentTime);
      }
    }, 1000);
  }

  triggerChime(time) {
    if (!this.ctx) return;
    try {
      const bellOsc = this.ctx.createOscillator();
      const bellGain = this.ctx.createGain();
      bellOsc.type = 'sine';
      bellOsc.frequency.setValueAtTime(587.33, time); // D5
      bellGain.gain.setValueAtTime(0.08, time);
      bellGain.gain.exponentialRampToValueAtTime(0.0001, time + 2.5);
      bellOsc.connect(bellGain);
      bellGain.connect(this.ctx.destination);
      bellOsc.start(time);
      bellOsc.stop(time + 2.6);
    } catch (e) {
      // Ignored
    }
  }

  pause() {
    this.isPlaying = false;
    clearInterval(this.timer);
    if (this.gainNode && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
        setTimeout(() => {
          if (this.osc1) { try { this.osc1.stop(); } catch(e){} }
          if (this.osc2) { try { this.osc2.stop(); } catch(e){} }
        }, 450);
      } catch (e) {}
    }
  }

  seek(newTime) {
    this.currentTime = Math.max(0, Math.min(newTime, this.duration));
    this.notify(this.currentTime);
  }

  notify(time) {
    this.listeners.forEach(cb => cb(time, this.isPlaying));
  }

  subscribe(cb) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }
}

export const globalAudio = new AudioSimulator();
