/**
 * AUDIO CONTROLLER
 * Background wedding melody playback with user gesture handling
 */

class WeddingAudioController {
  constructor(config) {
    this.config = config || {};
    this.audio = null;
    this.isPlaying = false;
    this.toggleBtn = document.getElementById('music-toggle-btn');
    this.audioFile = this.config.file || './assets/audio/ambient.mp3';

    if (this.config.enabled) {
      this.init();
    } else if (this.toggleBtn) {
      this.toggleBtn.style.display = 'none';
    }
  }

  init() {
    this.audio = new Audio(this.audioFile);
    this.audio.loop = true;
    this.audio.volume = this.config.initialVolume || 0.6;
    this.audio.preload = 'metadata';

    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggle();
      });
    }

    this.audio.addEventListener('play', () => {
      this.isPlaying = true;
      if (this.toggleBtn) this.toggleBtn.classList.add('playing');
    });

    this.audio.addEventListener('pause', () => {
      this.isPlaying = false;
      if (this.toggleBtn) this.toggleBtn.classList.remove('playing');
    });
  }

  play() {
    if (!this.audio) return;
    this.audio.play().then(() => {
      this.isPlaying = true;
      if (this.toggleBtn) this.toggleBtn.classList.add('playing');
    }).catch((err) => {
      console.log('Autoplay deferred until user interaction', err);
    });
  }

  pause() {
    if (!this.audio) return;
    this.audio.pause();
    this.isPlaying = false;
    if (this.toggleBtn) this.toggleBtn.classList.remove('playing');
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }
}

window.WeddingAudioController = WeddingAudioController;
