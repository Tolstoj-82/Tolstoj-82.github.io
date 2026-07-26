let player;

function onYouTubeIframeAPIReady() {
  player = new YT.Player('modalVideo');
}

document.addEventListener('DOMContentLoaded', () => {
  const videoModal = document.getElementById('videoModal');
  const closeBtn2 = videoModal ? videoModal.querySelector('.close') : null;
  const virtualMicCard = document.getElementById('virtualMicCard');

  if (virtualMicCard && videoModal && closeBtn2 && player) {
    virtualMicCard.addEventListener('click', (event) => {
      event.preventDefault();
      videoModal.style.display = 'flex';
      player.seekTo(0);        // Start from beginning
      player.playVideo();      // Play video
    });

    closeBtn2.addEventListener('click', () => {
      videoModal.style.display = 'none';
      player.pauseVideo();     // Pause video on close
    });

    window.addEventListener('click', (event) => {
      if (event.target === videoModal) {
        videoModal.style.display = 'none';
        player.pauseVideo();
      }
    });

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        const modalDisplay = window.getComputedStyle(videoModal).display;
        if (modalDisplay === 'flex') {
          videoModal.style.display = 'none';
          player.pauseVideo();
        }
      }
    });
  }
});
