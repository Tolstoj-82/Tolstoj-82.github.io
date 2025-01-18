document.addEventListener('DOMContentLoaded', () => {
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