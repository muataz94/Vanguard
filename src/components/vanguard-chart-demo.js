const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function hasReducedDataPreference() {
  return Boolean(navigator.connection?.saveData);
}

export function initVanguardChartDemo(frame) {
  const video = frame?.querySelector('[data-vanguard-demo-video]');
  const sourceTemplate = frame?.querySelector('[data-vanguard-video-sources]');
  if (!frame || !video || !sourceTemplate) return () => {};

  const connection = navigator.connection;
  const videoAvailable = frame.dataset.demoMode === 'video';
  let visible = true;
  let sourcesAttached = false;
  let disposed = false;

  const setState = (state) => {
    frame.dataset.playbackState = state;
  };
  const ensureSources = () => {
    if (sourcesAttached || !videoAvailable || reducedMotion.matches || hasReducedDataPreference()) return false;
    const sources = [...sourceTemplate.content.querySelectorAll('source[data-src]')];
    sources.forEach((candidate) => {
      const source = candidate.cloneNode();
      source.src = candidate.dataset.src;
      source.removeAttribute('data-src');
      video.append(source);
    });
    sourcesAttached = sources.length > 0;
    if (sourcesAttached) video.load();
    return sourcesAttached;
  };
  const pause = (state = 'paused') => {
    video.pause();
    setState(state);
  };
  const attemptPlay = async () => {
    if (disposed || !visible || document.hidden || reducedMotion.matches || hasReducedDataPreference() || !videoAvailable) {
      pause(videoAvailable ? 'paused' : 'poster');
      return;
    }
    if (!ensureSources()) {
      setState('poster');
      return;
    }
    try {
      await video.play();
      setState('playing');
    } catch {
      setState('poster');
    }
  };
  const syncPlayback = () => {
    if (!visible || document.hidden || reducedMotion.matches || hasReducedDataPreference()) {
      pause(reducedMotion.matches || hasReducedDataPreference() ? 'poster' : 'paused');
      return;
    }
    void attemptPlay();
  };
  const onVideoPlay = () => setState('playing');
  const onVideoPause = () => {
    if (frame.dataset.playbackState !== 'poster') setState('paused');
  };
  const onVideoError = () => {
    pause('poster');
  };

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    syncPlayback();
  }, { rootMargin: '80px 0px', threshold: .08 });

  observer.observe(frame);
  document.addEventListener('visibilitychange', syncPlayback);
  reducedMotion.addEventListener('change', syncPlayback);
  connection?.addEventListener?.('change', syncPlayback);
  video.addEventListener('play', onVideoPlay);
  video.addEventListener('pause', onVideoPause);
  video.addEventListener('error', onVideoError);
  setState(videoAvailable ? 'paused' : 'poster');
  syncPlayback();

  return () => {
    disposed = true;
    observer.disconnect();
    document.removeEventListener('visibilitychange', syncPlayback);
    reducedMotion.removeEventListener('change', syncPlayback);
    connection?.removeEventListener?.('change', syncPlayback);
    video.removeEventListener('play', onVideoPlay);
    video.removeEventListener('pause', onVideoPause);
    video.removeEventListener('error', onVideoError);
    video.pause();
  };
}
