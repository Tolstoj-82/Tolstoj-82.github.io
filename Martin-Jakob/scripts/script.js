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
    menuBtn.addEventListener('click', () => {
      menuContainer.classList.add('active');
    });

    closeBtn.addEventListener('click', () => {
      menuContainer.classList.remove('active');
    });

    document.addEventListener('click', (e) => {
      if (
        !menuBtn.contains(e.target) &&
        !menuContainer.contains(e.target) &&
        !closeBtn.contains(e.target)
      ) {
        menuContainer.classList.remove('active');
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

/*document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('.clickable');
  const modal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const closeModal = modal.querySelector('.close');
  const accordions = document.querySelectorAll('.accordion');

  accordions.forEach((accordion) => {
    accordion.addEventListener('click', () => {
      const menu = accordion.nextElementSibling;
  
      if (menu && menu.classList.contains('menu')) {
        menu.classList.toggle('active');
        accordion.classList.toggle('active');
  
        // Toggle the + and - symbols
        const arrow = accordion.querySelector('.arrow');
        if (arrow) {
          arrow.textContent = accordion.classList.contains('active') ? '-' : '+';
        }
      }
    });
  })

  // Attach click event to all clickable images
  images.forEach(image => {
    image.addEventListener('click', () => {
      modalImage.src = image.src; // Set the modal image to the clicked image
      modal.style.display = 'flex'; // Show the modal
    });
  });

  // Close the modal when the close button is clicked
  closeModal.addEventListener('click', () => {
    modal.style.display = 'none'; // Hide the modal
  });

  // Close the modal when clicking outside the modal-content
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Open the image in a new tab when the modal image is clicked
  modalImage.addEventListener('click', () => {
    window.open(modalImage.src, '_blank'); // Open the image in a new tab
  });
});

const menuBtn = document.querySelector('.menu-btn');
const closeBtn = document.querySelector('.close-btn');
const menuContainer = document.querySelector('.menu-container');

menuBtn.addEventListener('click', () => {
  menuContainer.classList.add('active');
});

closeBtn.addEventListener('click', () => {
  menuContainer.classList.remove('active');
});

// Close menu on clicking outside
document.addEventListener('click', (e) => {
  if (
    !menuBtn.contains(e.target) &&
    !menuContainer.contains(e.target) &&
    !closeBtn.contains(e.target)
  ) {
    menuContainer.classList.remove('active');
  }
});

//----
// Video modal

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('videoModal');
  const closeBtn2 = modal.querySelector('.close');
  const modalVideo = document.getElementById('modalVideo');

  // Open modal only on the specific card:
  const virtualMicCard = document.getElementById('virtualMicCard');

  virtualMicCard.addEventListener('click', (event) => {
    event.preventDefault(); // prevent link navigation
    modal.style.display = 'flex';
    // Reset video to start from beginning
    modalVideo.src = modalVideo.src;
  });

  // Close modal on close button click
  closeBtn2.addEventListener('click', () => {
    modal.style.display = 'none';
    modalVideo.src = '';
    modalVideo.src = "https://www.youtube.com/embed/KW5O75i4dVs";
  });

  // Close modal when clicking outside modal-content
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
      modalVideo.src = '';
      modalVideo.src = "https://www.youtube.com/embed/KW5O75i4dVs";
    }
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      const modalDisplay = window.getComputedStyle(modal).display;
      if (modalDisplay === 'flex') {
        modal.style.display = 'none';
        modalVideo.src = '';
        modalVideo.src = "https://www.youtube.com/embed/KW5O75i4dVs";
      }
    }
  });

});
*/