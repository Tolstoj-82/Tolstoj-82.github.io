document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.getElementById('hamburger-icon');
  const closeButton = document.getElementById('close-icon');
  const menuContainer = document.getElementById('site-menu');
  const accordions = document.querySelectorAll('.accordion');
  const modal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const modalCloseButton = modal?.querySelector('.close');
  let lastFocusedElement = null;

  const setMenuOpen = (isOpen) => {
    menuContainer.classList.toggle('active', isOpen);
    menuContainer.setAttribute('aria-hidden', String(!isOpen));
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');

    if (isOpen) {
      closeButton.focus();
    } else if (menuContainer.contains(document.activeElement)) {
      menuButton.focus();
    }
  };

  menuButton.addEventListener('click', () => {
    setMenuOpen(!menuContainer.classList.contains('active'));
  });

  closeButton.addEventListener('click', () => setMenuOpen(false));

  accordions.forEach((accordion) => {
    accordion.addEventListener('click', () => {
      const submenu = accordion.nextElementSibling;
      if (!submenu?.classList.contains('menu')) return;

      const isOpen = submenu.classList.toggle('active');
      accordion.classList.toggle('active', isOpen);
      accordion.setAttribute('aria-expanded', String(isOpen));

      const arrow = accordion.querySelector('.arrow');
      if (arrow) arrow.textContent = isOpen ? '−' : '+';
    });
  });

  document.addEventListener('click', (event) => {
    if (
      menuContainer.classList.contains('active') &&
      !menuContainer.contains(event.target) &&
      !menuButton.contains(event.target)
    ) {
      setMenuOpen(false);
    }
  });

  document.querySelectorAll('.clickable').forEach((image) => {
    image.addEventListener('click', () => {
      lastFocusedElement = document.activeElement;
      modalImage.src = image.src;
      modal.style.display = 'flex';
      modal.setAttribute('aria-hidden', 'false');
      modalCloseButton?.focus();
    });
  });

  const closeModal = () => {
    if (!modal || modal.style.display === 'none') return;
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    modalImage.removeAttribute('src');
    lastFocusedElement?.focus();
  };

  modalCloseButton?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });
  modalImage?.addEventListener('click', () => {
    if (modalImage.src) window.open(modalImage.src, '_blank', 'noopener');
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    closeModal();
    if (menuContainer.classList.contains('active')) setMenuOpen(false);
  });
});
