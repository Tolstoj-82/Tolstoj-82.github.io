(() => {
  const audio = document.getElementById("anthem-audio");
  const playButton = document.querySelector(".anthem-play-button");
  const progress = document.querySelector(".anthem-progress");
  const volume = document.querySelector(".anthem-volume-slider");
  const volumeButton = document.querySelector(".anthem-volume-button");
  if (!audio || !playButton || !progress) return;

  audio.volume = 0.5;
  let lastVolume = 0.5;
  if (volume) volume.value = "50";

  const updateVolumeButton = () => {
    const isMuted = audio.muted || audio.volume === 0;
    volumeButton?.classList.toggle("is-muted", isMuted);
    volumeButton?.setAttribute(
      "aria-label",
      `${isMuted ? "Unmute" : "Mute"} Custom Danish Anthem`,
    );
  };

  const updateButton = () => {
    const isPlaying = !audio.paused;
    playButton.textContent = isPlaying ? "❚❚" : "▶";
    playButton.setAttribute(
      "aria-label",
      `${isPlaying ? "Pause" : "Play"} Custom Danish Anthem`,
    );
  };

  playButton.addEventListener("click", async () => {
    if (!audio.paused) {
      audio.pause();
      return;
    }
    try {
      await audio.play();
    } catch {
      updateButton();
    }
  });

  audio.addEventListener("play", updateButton);
  audio.addEventListener("pause", updateButton);
  audio.addEventListener("ended", updateButton);
  audio.addEventListener("timeupdate", () => {
    if (!Number.isFinite(audio.duration) || audio.duration === 0) return;
    progress.value = String((audio.currentTime / audio.duration) * 100);
  });

  progress.addEventListener("input", () => {
    if (!Number.isFinite(audio.duration) || audio.duration === 0) return;
    audio.currentTime = (Number(progress.value) / 100) * audio.duration;
  });

  volume?.addEventListener("input", () => {
    const nextVolume = Number(volume.value) / 100;
    audio.muted = false;
    audio.volume = nextVolume;
    if (nextVolume > 0) lastVolume = nextVolume;
    updateVolumeButton();
  });

  volumeButton?.addEventListener("click", () => {
    if (audio.muted || audio.volume === 0) {
      audio.muted = false;
      audio.volume = lastVolume || 0.5;
      if (volume) volume.value = String(audio.volume * 100);
    } else {
      lastVolume = audio.volume;
      audio.muted = true;
    }
    updateVolumeButton();
  });

  updateVolumeButton();
})();
