document.addEventListener('DOMContentLoaded', () => {
  // Query all elements here once DOM is ready
  const images = document.querySelectorAll('.clickable');
  const imageModal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const closeModal = imageModal ? imageModal.querySelector('.close') : null;

  const accordions = document.querySelectorAll('.accordion');

  const menuBtn = document.querySelector('.menu-btn');
  const closeBtn = document.querySelector('.close-btn');
  const menuContainer = document.querySelector('.menu-container');

  const videoModal = document.getElementById('videoModal');
  const closeBtn2 = videoModal ? videoModal.querySelector('.close') : null;
  const modalVideo = document.getElementById('modalVideo');
  const virtualMicCard = document.getElementById('virtualMicCard');

  // Accordion toggle
  accordions.forEach((accordion) => {
    accordion.addEventListener('click', () => {
      const menu = accordion.nextElementSibling;
      if (menu && menu.classList.contains('menu')) {
        menu.classList.toggle('active');
        accordion.classList.toggle('active');

        const arrow = accordion.querySelector('.arrow');
        if (arrow) {
          arrow.textContent = accordion.classList.contains('active') ? '-' : '+';
        }
      }
    });
  });

  // Image modal open
  images.forEach(image => {
    image.addEventListener('click', () => {
      if (!imageModal) return;
      modalImage.src = image.src;
      imageModal.style.display = 'flex';
    });
  });

  // Image modal close
  if (closeModal) {
    closeModal.addEventListener('click', () => {
      imageModal.style.display = 'none';
    });
  }

  if (imageModal) {
    imageModal.addEventListener('click', (e) => {
      if (e.target === imageModal) {
        imageModal.style.display = 'none';
      }
    });
  }

  // Open image in new tab on modal image click
  if (modalImage) {
    modalImage.addEventListener('click', () => {
      window.open(modalImage.src, '_blank');
    });
  }

  // Menu open/close
  if (menuBtn && closeBtn && menuContainer) {
    const anchorsList = document.getElementById('anchors');

    function generateMenuItems() {
      const headings = document.querySelectorAll('h2[id]');
      headings.forEach(h2 => {
        const id = h2.id;
        let text = h2.textContent || '';
        // Remove anything in brackets () and trim whitespace
        text = text.replace(/\s*\(.*?\)\s*/g, '').trim();

        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${id}`;
        a.textContent = text;
        li.appendChild(a);
        anchorsList.appendChild(li);
      });
    }

    function clearMenuItems() {
      anchorsList.innerHTML = '';
    }

    menuBtn.addEventListener('click', () => {
      generateMenuItems();
      menuContainer.classList.add('active');
    });

    closeBtn.addEventListener('click', () => {
      menuContainer.classList.remove('active');
      clearMenuItems();
    });

    document.addEventListener('click', (e) => {
      if (
        !menuBtn.contains(e.target) &&
        !menuContainer.contains(e.target) &&
        !closeBtn.contains(e.target)
      ) {
        menuContainer.classList.remove('active');
        clearMenuItems();
      }
    });
  }

  // Video modal open/close
  if (virtualMicCard && videoModal && closeBtn2 && modalVideo) {
    virtualMicCard.addEventListener('click', (event) => {
      event.preventDefault();
      videoModal.style.display = 'flex';
      modalVideo.src = modalVideo.src; // Reset video
    });

    closeBtn2.addEventListener('click', () => {
      videoModal.style.display = 'none';
      modalVideo.src = '';
      modalVideo.src = "https://www.youtube.com/embed/KW5O75i4dVs";
    });

    window.addEventListener('click', (event) => {
      if (event.target === videoModal) {
        videoModal.style.display = 'none';
        modalVideo.src = '';
        modalVideo.src = "https://www.youtube.com/embed/KW5O75i4dVs";
      }
    });

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        const modalDisplay = window.getComputedStyle(videoModal).display;
        if (modalDisplay === 'flex') {
          videoModal.style.display = 'none';
          modalVideo.src = '';
          modalVideo.src = "https://www.youtube.com/embed/KW5O75i4dVs";
        }
      }
    });
  }
});
