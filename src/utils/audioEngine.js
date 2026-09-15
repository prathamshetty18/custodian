/**
 * Custodian Web Audio & Voice Narration Engine
 * Combines:
 * 1. Authentic oral recording playback (/audio/{noteId}.wav) for pre-recorded custodian stories
 * 2. Web Speech API (SpeechSynthesis) for real-time multilingual custodian narration (Kannada, Tulu, Hindi, English)
 * 3. Web Audio API for an acoustic drone (harmonic tanpura drone + periodic bronze temple bell)
 *    giving field recordings authentic living cultural atmosphere.
 */

class CustodianAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.isSpeaking = false;
    this.timer = null;
    this.listeners = new Set();
    this.currentTime = 0;
    this.duration = 26;
    this.osc1 = null;
    this.osc2 = null;
    this.gainNode = null;
    this.audioEl = null;
    this.currentUtterance = null;
    this.activeMode = 'audio'; // 'audio' | 'speech'
    this.currentLang = 'english';
    this.currentNoteId = null;

    // Cache available voices when loaded
    this.voices = [];
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        try {
          this.voices = window.speechSynthesis.getVoices() || [];
        } catch (_e) {
          this.voices = [];
        }
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  initAudioContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  startAmbientDrone() {
    this.initAudioContext();
    if (!this.ctx) return;

    try {
      this.stopAmbientDrone();
      const now = this.ctx.currentTime;
      this.gainNode = this.ctx.createGain();
      // Gentle subtle gain so custodian's voice is prominent and clear
      this.gainNode.gain.setValueAtTime(0.0001, now);
      this.gainNode.gain.exponentialRampToValueAtTime(0.02, now + 1.0);
      this.gainNode.connect(this.ctx.destination);

      // Warm tanpura acoustic drone (D2 fundamental ~ 146.83 Hz)
      this.osc1 = this.ctx.createOscillator();
      this.osc1.type = 'triangle';
      this.osc1.frequency.setValueAtTime(146.83, now);
      this.osc1.connect(this.gainNode);
      this.osc1.start(now);

      // Subtle overtone (A3 ~ 220.0 Hz)
      this.osc2 = this.ctx.createOscillator();
      this.osc2.type = 'sine';
      this.osc2.frequency.setValueAtTime(220.0, now);
      this.osc2.connect(this.gainNode);
      this.osc2.start(now);

      // Trigger soft bronze bell chime
      this.triggerChime(now + 0.3);
    } catch (_e) {
      // Ambient drone initialisation optional
    }
  }

  triggerChime(time) {
    if (!this.ctx) return;
    try {
      const bellOsc = this.ctx.createOscillator();
      const bellGain = this.ctx.createGain();
      bellOsc.type = 'sine';
      bellOsc.frequency.setValueAtTime(587.33, time); // D5
      bellGain.gain.setValueAtTime(0.035, time);
      bellGain.gain.exponentialRampToValueAtTime(0.0001, time + 2.5);
      bellOsc.connect(bellGain);
      bellGain.connect(this.ctx.destination);
      bellOsc.start(time);
      bellOsc.stop(time + 2.6);
    } catch (_e) {
      // Ignored
    }
  }

  stopAmbientDrone() {
    if (this.gainNode && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
        setTimeout(() => {
          if (this.osc1) { try { this.osc1.stop(); } catch (_e) {} this.osc1 = null; }
          if (this.osc2) { try { this.osc2.stop(); } catch (_e) {} this.osc2 = null; }
          this.gainNode = null;
        }, 350);
      } catch (_e) {
        this.gainNode = null;
      }
    }
  }

  findBestVoice(lang) {
    if (!this.voices || this.voices.length === 0) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        this.voices = window.speechSynthesis.getVoices() || [];
      }
    }
    const list = this.voices || [];
    const normalized = (lang || '').toLowerCase();

    // Kannada or Tulu (Tulu is phonetically articulated via Kannada phonology in coastal Karnataka)
    if (normalized === 'kannada' || normalized === 'kn' || normalized === 'tulu' || normalized === 'tu') {
      const knVoice = list.find(v => v.lang && (v.lang.toLowerCase().startsWith('kn') || /kannada/i.test(v.name)));
      if (knVoice) return knVoice;
      const hiVoice = list.find(v => v.lang && (v.lang.toLowerCase().startsWith('hi') || /hindi/i.test(v.name)));
      if (hiVoice) return hiVoice;
      const inVoice = list.find(v => v.lang && /in/i.test(v.lang));
      if (inVoice) return inVoice;
    }

    // Hindi
    if (normalized === 'hindi' || normalized === 'hi') {
      const hiVoice = list.find(v => v.lang && (v.lang.toLowerCase().startsWith('hi') || /hindi/i.test(v.name)));
      if (hiVoice) return hiVoice;
      const inVoice = list.find(v => v.lang && /in/i.test(v.lang));
      if (inVoice) return inVoice;
    }

    // English: Look for Indian English or natural narrator voices
    if (normalized === 'english' || normalized === 'en') {
      const inVoice = list.find(v => 
        (v.lang && (v.lang.toLowerCase() === 'en-in' || v.lang.toLowerCase() === 'en_in')) ||
        /ravi|neerja|prabhat|heera|india/i.test(v.name)
      );
      if (inVoice) return inVoice;

      const naturalVoice = list.find(v => v.lang && v.lang.toLowerCase().startsWith('en') && /natural|online|google/i.test(v.name));
      if (naturalVoice) return naturalVoice;

      const enVoice = list.find(v => v.lang && v.lang.toLowerCase().startsWith('en'));
      if (enVoice) return enVoice;
    }

    return list.find(v => v.default) || list[0] || null;
  }

  /**
   * Main play method
   * Accepts duration or options object { duration, text, lang, noteId, custodianName, preferVoice }
   */
  play(options) {
    let duration = 26;
    let text = '';
    let lang = 'english';
    let noteId = 'field-note-07';

    if (typeof options === 'number') {
      duration = options;
    } else if (options && typeof options === 'object') {
      duration = options.duration || 26;
      text = options.text || '';
      lang = options.lang || 'english';
      noteId = options.noteId || 'field-note-07';
    }

    this.duration = duration;
    this.currentLang = lang;
    this.currentNoteId = noteId;
    this.isPlaying = true;

    // Start subtle ambient drone (tanpura & temple chime)
    this.startAmbientDrone();

    // Check if we can play the pre-recorded voice audio file for English
    const audioUrl = `/audio/${noteId}.wav`;
    const isIndicTab = (lang === 'kannada' || lang === 'tulu' || lang === 'hindi');

    // If on Kannada/Hindi/Tulu tab AND speech synthesis is available, speak the native script!
    if (isIndicTab && typeof window !== 'undefined' && 'speechSynthesis' in window && text) {
      this.playSpeechSynthesis(text, lang);
    } else {
      // Use audio file playback for English or fallback
      this.playAudioFile(audioUrl, text, lang);
    }
  }

  playAudioFile(audioUrl, fallbackText, fallbackLang) {
    this.activeMode = 'audio';
    this.stopSpeechSynthesis();

    if (!this.audioEl || this.audioEl.getAttribute('data-url') !== audioUrl) {
      if (this.audioEl) {
        this.audioEl.pause();
        this.audioEl.src = '';
      }
      this.audioEl = new Audio(audioUrl);
      this.audioEl.setAttribute('data-url', audioUrl);

      this.audioEl.addEventListener('loadedmetadata', () => {
        if (this.audioEl.duration && !isNaN(this.audioEl.duration)) {
          this.duration = Math.round(this.audioEl.duration);
          this.notify(this.currentTime);
        }
      });

      this.audioEl.addEventListener('timeupdate', () => {
        if (this.audioEl && this.isPlaying) {
          this.currentTime = Math.floor(this.audioEl.currentTime);
          this.notify(this.currentTime);

          // Periodic soft bell chime every 12 seconds
          if (this.currentTime > 0 && this.currentTime % 12 === 0 && this.ctx) {
            this.triggerChime(this.ctx.currentTime);
          }
        }
      });

      this.audioEl.addEventListener('ended', () => {
        this.pause();
        this.currentTime = 0;
        this.notify(0);
      });

      this.audioEl.addEventListener('error', () => {
        // Fallback to speech synthesis if audio file cannot be loaded
        this.playSpeechSynthesis(fallbackText, fallbackLang);
      });
    }

    if (this.currentTime > 0 && this.audioEl.currentTime !== this.currentTime) {
      try {
        this.audioEl.currentTime = this.currentTime;
      } catch (_e) {}
    }

    this.audioEl.play().catch(_err => {
      this.playSpeechSynthesis(fallbackText, fallbackLang);
    });

    this.notify(this.currentTime);
  }

  playSpeechSynthesis(text, lang) {
    this.activeMode = 'speech';
    if (this.audioEl) {
      this.audioEl.pause();
    }

    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text) {
      this.startTimer();
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;

      const voice = this.findBestVoice(lang);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        if (lang === 'kannada' || lang === 'tulu' || lang === 'kn' || lang === 'tu') {
          utterance.lang = 'kn-IN';
        } else if (lang === 'hindi' || lang === 'hi') {
          utterance.lang = 'hi-IN';
        } else {
          utterance.lang = 'en-IN';
        }
      }

      // Calm, dignified elder narrator pace
      utterance.rate = 0.88;
      utterance.pitch = 0.92;
      utterance.volume = 1.0;

      utterance.onstart = () => {
        this.isSpeaking = true;
        this.notify(this.currentTime);
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        this.pause();
        this.currentTime = 0;
        this.notify(0);
      };

      utterance.onerror = (e) => {
        if (e.error !== 'canceled' && e.error !== 'interrupted') {
          console.warn("Speech synthesis error:", e);
        }
        this.isSpeaking = false;
      };

      window.speechSynthesis.speak(utterance);
      this.startTimer();
    } catch (_e) {
      this.startTimer();
    }
  }

  startTimer() {
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      // Workaround for Chrome/Edge 15-second speech synthesis pause bug
      if (typeof window !== 'undefined' && window.speechSynthesis && window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }

      if (this.currentTime >= this.duration) {
        this.pause();
        this.currentTime = 0;
        this.notify(0);
        return;
      }
      this.currentTime += 1;
      this.notify(this.currentTime);

      if (this.currentTime > 0 && this.currentTime % 12 === 0 && this.ctx) {
        this.triggerChime(this.ctx.currentTime);
      }
    }, 1000);
  }

  stopSpeechSynthesis() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (_e) {}
    }
    this.isSpeaking = false;
  }

  pause() {
    this.isPlaying = false;
    clearInterval(this.timer);

    if (this.audioEl) {
      try {
        this.audioEl.pause();
      } catch (_e) {}
    }

    this.stopSpeechSynthesis();
    this.stopAmbientDrone();
    this.notify(this.currentTime);
  }

  seek(newTime) {
    this.currentTime = Math.max(0, Math.min(newTime, this.duration));
    if (this.audioEl && this.activeMode === 'audio') {
      try {
        this.audioEl.currentTime = this.currentTime;
      } catch (_e) {}
    }
    this.notify(this.currentTime);
  }

  restart(options) {
    this.seek(0);
    this.play(options);
  }

  notify(time) {
    this.listeners.forEach(cb => {
      try {
        cb(time, this.isPlaying, {
          mode: this.activeMode,
          isSpeaking: this.isSpeaking,
          duration: this.duration,
          lang: this.currentLang
        });
      } catch (e) {
        console.error("Audio subscriber error:", e);
      }
    });
  }

  subscribe(cb) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }
}

export const globalAudio = new CustodianAudioEngine();
