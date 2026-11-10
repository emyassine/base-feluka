<template>
  <div class="yt-player" :class="{ 'has-message': !!message }">
    <div class="yt-player__media" :style="{ aspectRatio: aspectRatio }">
      <div :id="playerId" class="yt-player__frame"></div>
    </div>
    <div v-if="message" class="yt-player__message" :class="`yt-player__message--${type}`">
      <component :is="messageIcon" class="yt-player__message-icon" aria-hidden="true" />
      <span class="yt-player__message-text">{{ message }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-vue-next';

defineOptions({ name: 'YoutubePlayer' });

type YTPlayer = {
  destroy: () => void;
  getAvailableAudioTracks?: () => Array<{ id: string; languageCode?: string; displayName?: string }>;
  setAudioTrack?: (id: string) => void;
};

const props = withDefaults(
  defineProps<{
    videoId: string;
    width?: number | string;
    height?: number | string;
    aspectRatio?: string;
    preferredAudio?: string;
    message?: string;
    type?: 'info' | 'warning' | 'danger' | 'success';
  }>(),
  {
    width: '100%',
    height: '100%',
    aspectRatio: '16 / 9',
    preferredAudio: '',
    message: '',
    type: 'info',
  }
);

const playerId = `yt-player-${Math.random().toString(36).slice(2, 10)}`;
const player = ref<YTPlayer | null>(null);
let audioRetryTimer: number | null = null;
const messageIcon = computed(() => {
  switch (props.type) {
    case 'success':
      return CheckCircle;
    case 'warning':
      return AlertTriangle;
    case 'danger':
      return XCircle;
    default:
      return Info;
  }
});

function ensureApi(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if ((window as any).YT && (window as any).YT.Player) return Promise.resolve();

  return new Promise(resolve => {
    const existing = document.querySelector('script[data-yt-iframe-api]');
    if (existing) {
      (window as any).onYouTubeIframeAPIReady = () => resolve();
      return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    tag.async = true;
    tag.defer = true;
    tag.setAttribute('data-yt-iframe-api', 'true');
    document.head.appendChild(tag);

    (window as any).onYouTubeIframeAPIReady = () => resolve();
  });
}

function pickAudioTrack(p: YTPlayer) {
  if (!props.preferredAudio || !p.getAvailableAudioTracks || !p.setAudioTrack) return;
  const tracks = p.getAvailableAudioTracks();
  if (!tracks || !tracks.length) return;

  const preferred = props.preferredAudio.toLowerCase();
  const match = tracks.find(t => {
    const lang = (t.languageCode || '').toLowerCase();
    const name = (t.displayName || '').toLowerCase();
    return lang === preferred || name.includes(preferred);
  });

  if (match) p.setAudioTrack(match.id);
}

function scheduleAudioPick(p: YTPlayer, attempts = 8) {
  if (!props.preferredAudio) return;
  if (attempts <= 0) return;
  pickAudioTrack(p);
  audioRetryTimer = window.setTimeout(() => scheduleAudioPick(p, attempts - 1), 350);
}

async function mountPlayer() {
  if (typeof window === 'undefined') return;
  if (!props.videoId) return;

  await ensureApi();

  const YT = (window as any).YT;
  if (!YT || !YT.Player) return;

  player.value = new YT.Player(playerId, {
    width: props.width,
    height: props.height,
    videoId: props.videoId,
    playerVars: {
      rel: 0,
      modestbranding: 1,
      playsinline: 1,
    },
    events: {
      onReady: () => {
        if (player.value) scheduleAudioPick(player.value);
      },
      onStateChange: () => {
        if (player.value) scheduleAudioPick(player.value);
      },
    },
  });
}

onMounted(() => {
  void mountPlayer();
});

onBeforeUnmount(() => {
  if (audioRetryTimer) {
    window.clearTimeout(audioRetryTimer);
    audioRetryTimer = null;
  }
  if (player.value) player.value.destroy();
});
</script>

<style scoped>
.yt-player {
  width: 100%;
  max-width: 100%;
  position: relative;
}

.yt-player__media {
  width: 100%;
  background: color-mix(in srgb, var(--vp-c-bg-soft) 90%, transparent);
  border-radius: 12px;
  overflow: hidden;
}

.yt-player__frame {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
}

.yt-player__message {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  font-size: 13px;
  line-height: 1.45;
  letter-spacing: -0.01em;
}

.yt-player__message-icon {
  width: 16px;
  height: 16px;
  flex: none;
}

.yt-player__message-text {
  flex: 1;
  font-size: 13px;
  line-height: 1.45;
  letter-spacing: -0.01em;
}

.yt-player.has-message .yt-player__media {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.yt-player.has-message .yt-player__message {
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}

.yt-player__message--info {
  background: var(--info-100);
  color: var(--info-950) !important;
}

.yt-player__message--success {
  background: var(--success-100);
  color: var(--success-950) !important;
}

.yt-player__message--warning {
  background: var(--warning-100);
  color: var(--warning-950) !important;
}

.yt-player__message--danger {
  background: var(--danger-100);
  color: var(--danger-950) !important;
}
</style>
