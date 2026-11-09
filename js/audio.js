/**
 * AUDIO CONTROLLER
 * Dual-engine ambient soundtrack:
 * 1. Primary: HTML5 Audio playing local assets/audio/ambient.mp3 with gentle volume ramp
 * 2. Fallback: Web Audio API gentle harmonic acoustic chime generator
 * Strictly adheres to mobile browser autoplay policies (plays only after explicit user interaction)
 */

class WeddingAudioController {
  constructor(config) {
    this.config = config || {};
    this.enabled = this.config.enabled ?? true;
    this.audioFile = this.config.file || './assets/audio/ambient.mp3';
    this.targetVolume = this.config.initialVolume ?? 0.55;
    this.isPlaying = false;
    this.audioElement = null;
    this.synthContext = null;
    this.synthInterval = null;
    this.toggleBtn = document.getElementById('music-toggle-btn');
    this.fadeInterval = null;

    if (this.enabled) {
      this.init();
    } else if (this.toggleBtn) {
      this.toggleBtn.style.display = 'none';
    }
  }

  init() {
    this.audioElement = new Audio();
    this.audioElement.src = this.audioFile;
    this.audioElement.loop = true;
    this.audioElement.preload = 'auto';
    this.audioElement.volume = 0;

    // Error fallback to procedural Web Audio synthesizer
    this.audioElement.addEventListener('error', () => {
      console.log('Audio file fallback: using Web Audio acoustic synthesizer');
      this.audioElement = null;
    });

    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => this.toggle());
    }
  }

  play() {
    if (!this.enabled || this.isPlaying) return;

    if (this.audioElement) {
      const playPromise = this.audioElement.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.fadeIn();
            this.isPlaying = true;
            this.updateUI(true);
          })
          .catch((err) => {
            console.log('Audio play prevented or file unavailable, enabling acoustic chime fallback:', err);
            this.startAcousticSynth();
            this.isPlaying = true;
            this.updateUI(true);
          });
      }
    } else {
      this.startAcousticSynth();
      this.isPlaying = true;
      this.updateUI(true);
    }
  }

  pause() {
    if (!this.isPlaying) return;

    if (this.audioElement) {
      this.fadeOut(() => {
        this.audioElement.pause();
        this.isPlaying = false;
        this.updateUI(false);
      });
    } else if (this.synthContext) {
      this.stopAcousticSynth();
      this.isPlaying = false;
      this.updateUI(false);
    }
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  fadeIn() {
    if (!this.audioElement) return;
    clearInterval(this.fadeInterval);
    let vol = 0;
    this.audioElement.volume = 0;
    this.fadeInterval = setInterval(() => {
      vol += 0.05;
      if (vol >= this.targetVolume) {
        this.audioElement.volume = this.targetVolume;
        clearInterval(this.fadeInterval);
      } else {
        this.audioElement.volume = vol;
      }
    }, 80);
  }

  fadeOut(callback) {
    if (!this.audioElement) {
      if (callback) callback();
      return;
    }
    clearInterval(this.fadeInterval);
    let vol = this.audioElement.volume;
    this.fadeInterval = setInterval(() => {
      vol -= 0.08;
      if (vol <= 0.02) {
        this.audioElement.volume = 0;
        clearInterval(this.fadeInterval);
        if (callback) callback();
      } else {
        this.audioElement.volume = vol;
      }
    }, 60);
  }

  startAcousticSynth() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!this.synthContext) {
        this.synthContext = new AudioCtx();
      }
      if (this.synthContext.state === 'suspended') {
        this.synthContext.resume();
      }

      // Gentle pentatonic harp / piano arpeggios in D Lydian
      const notes = [293.66, 369.99, 440.00, 554.37, 587.33, 739.99, 880.00];
      let step = 0;

      const triggerChime = () => {
        if (!this.isPlaying || !this.synthContext) return;
        const note = notes[step % notes.length];
        step = (step + 1 + Math.floor(Math.random() * 2)) % notes.length;

        const osc = this.synthContext.createOscillator();
        const gain = this.synthContext.createGain();
        const filter = this.synthContext.createBiquadFilter();

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, this.synthContext.currentTime);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note, this.synthContext.currentTime);

        const now = this.synthContext.currentTime;
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.12, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.synthContext.destination);

        osc.start(now);
        osc.stop(now + 3.3);
      };

      triggerChime();
      this.synthInterval = setInterval(triggerChime, 1800);
    } catch (e) {
      console.warn('Web Audio synth unavailable:', e);
    }
  }

  stopAcousticSynth() {
    clearInterval(this.synthInterval);
    if (this.synthContext && this.synthContext.state === 'running') {
      this.synthContext.suspend();
    }
  }

  updateUI(isPlaying) {
    if (!this.toggleBtn) return;
    const label = this.toggleBtn.querySelector('.music-label');
    if (isPlaying) {
      this.toggleBtn.classList.add('playing');
      this.toggleBtn.setAttribute('aria-label', 'Pause ambient music');
      if (label) label.textContent = 'Mute';
    } else {
      this.toggleBtn.classList.remove('playing');
      this.toggleBtn.setAttribute('aria-label', 'Play ambient music');
      if (label) label.textContent = 'Music';
    }
  }
}

window.WeddingAudioController = WeddingAudioController;
