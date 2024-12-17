/*document.addEventListener('scroll', function () {
  const header = document.querySelector('header');
  if (window.scrollY > 50) {
    header.classList.add('small');
  } else {
    header.classList.remove('small');
  }
});*/

document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('.clickable');
  const modal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const closeModal = modal.querySelector('.close');

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
});
