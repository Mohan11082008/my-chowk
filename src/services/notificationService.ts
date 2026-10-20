// Push Notification Service with Web Notifications API & Web Audio chime

class NotificationService {
  private audioCtx: AudioContext | null = null;

  // Initialize Web Audio chime (synthesized 2-tone gentle chime)
  private playChime() {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      if (!this.audioCtx) {
        this.audioCtx = new AudioCtx();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;
      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(880, now + 0.12); // A5
      osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.28); // D6

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc1.start(now);
      osc1.stop(now + 0.15);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.45);
    } catch {
      // Audio autoplay policy or unavailable
    }
  }

  // Request browser permission for system push notifications
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      return 'denied';
    }
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch {
      return 'denied';
    }
  }

  getPermissionStatus(): NotificationPermission {
    if (!('Notification' in window)) {
      return 'denied';
    }
    return Notification.permission;
  }

  // Trigger both a system push notification (if permitted) and audio feedback
  sendPush(title: string, options?: { body?: string; tag?: string; url?: string }) {
    this.playChime();

    // Browser Push Notification
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        const notif = new Notification(title, {
          body: options?.body,
          icon: '/assets/aistudio/WhatsApp_Image_2026-10-20_at_3.29.08_PM_8c34b5f8.jpeg',
          badge: '/assets/aistudio/WhatsApp_Image_2026-10-20_at_3.29.08_PM_8c34b5f8.jpeg',
          tag: options?.tag,
        });

        notif.onclick = () => {
          window.focus();
          notif.close();
        };
      } catch (err) {
        console.warn('System push notification failed:', err);
      }
    }

    // Dispatch custom DOM event for immediate in-app banner toast
    window.dispatchEvent(
      new CustomEvent('mychowk-notification', {
        detail: {
          title,
          body: options?.body || '',
          timestamp: new Date().toISOString(),
        },
      })
    );
  }
}

export const notificationService = new NotificationService();
