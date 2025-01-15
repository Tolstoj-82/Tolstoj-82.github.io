document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('.clickable');
  const modal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const closeModal = modal.querySelector('.close');
  const accordions = document.querySelectorAll('.accordion');

  // Accordions
  accordions.forEach((accordion) => {
    accordion.addEventListener('click', () => {
        const menu = accordion.nextElementSibling;

        if (menu && menu.classList.contains('menu')) {
            menu.classList.toggle('active');
            accordion.classList.toggle('active');
        }
    });
  });

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