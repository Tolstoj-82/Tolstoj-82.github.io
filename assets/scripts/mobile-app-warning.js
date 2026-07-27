document.addEventListener('DOMContentLoaded', () => {
  const mobileViewport = window.matchMedia('(max-width: 820px)');
  if (!mobileViewport.matches) return;

  const appName = document.body.dataset.mobileWarningApp || 'This application';
  const overlay = document.createElement('div');
  overlay.className = 'mobile-app-warning';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'mobileAppWarningTitle');
  overlay.setAttribute('aria-describedby', 'mobileAppWarningDescription');

  const dialog = document.createElement('div');
  dialog.className = 'mobile-app-warning__dialog';
  const header = document.createElement('div');
  header.className = 'mobile-app-warning__header';
  const icon = document.createElement('span');
  icon.className = 'mobile-app-warning__icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.textContent = '!';
  const title = document.createElement('h2');
  title.id = 'mobileAppWarningTitle';
  title.textContent = 'Desktop recommended';
  header.append(icon, title);

  const body = document.createElement('div');
  body.className = 'mobile-app-warning__body';
  const description = document.createElement('p');
  description.id = 'mobileAppWarningDescription';
  description.textContent =
    `${appName} is designed for a larger screen and may not work reliably ` +
    'on a mobile device. You can continue anyway.';
  const continueButton = document.createElement('button');
  continueButton.className = 'mobile-app-warning__continue';
  continueButton.type = 'button';
  continueButton.textContent = 'Continue anyway';
  body.append(description, continueButton);
  dialog.append(header, body);
  overlay.append(dialog);
  document.body.append(overlay);

  const close = () => {
    overlay.classList.remove('is-visible');
    document.body.style.removeProperty('overflow');
  };

  continueButton.addEventListener('click', close);
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) close();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && overlay.classList.contains('is-visible')) {
      close();
    }
  });

  overlay.classList.add('is-visible');
  document.body.style.overflow = 'hidden';
  continueButton.focus();
});
