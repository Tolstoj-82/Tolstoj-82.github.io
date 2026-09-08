(() => {
  const pageCount = 20;
  const modal = document.getElementById("manual-modal");
  const openButton = document.querySelector(".manual-preview-button");
  const closeButton = modal.querySelector(".manual-modal-close");
  const backdrop = modal.querySelector(".manual-modal-backdrop");
  const stage = modal.querySelector(".manual-page-stage");
  const image = modal.querySelector(".manual-page-image");
  const counter = modal.querySelector(".manual-page-counter");
  const previous = modal.querySelector(".manual-page-previous");
  const next = modal.querySelector(".manual-page-next");
  let page = 1;
  let lastWheelAt = 0;

  function showPage(nextPage) {
    page = Math.max(1, Math.min(pageCount, nextPage));
    image.src = `manual-pages/page-${String(page).padStart(2, "0")}.jpg`;
    image.alt = `Chris & Triss manual page ${page} of ${pageCount}`;
    counter.textContent = `Page ${page} of ${pageCount}`;
    previous.disabled = page === 1;
    next.disabled = page === pageCount;
  }

  function openModal() {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    showPage(1);
    stage.focus();
  }

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    openButton.focus();
  }

  openButton.addEventListener("click", openModal);
  closeButton.addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);
  previous.addEventListener("click", () => showPage(page - 1));
  next.addEventListener("click", () => showPage(page + 1));
  stage.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
      const now = Date.now();
      if (now - lastWheelAt < 240 || Math.abs(event.deltaY) < 8) return;
      lastWheelAt = now;
      showPage(page + (event.deltaY > 0 ? 1 : -1));
    },
    { passive: false },
  );
  document.addEventListener("keydown", (event) => {
    if (!modal.classList.contains("open")) return;
    if (event.key === "Escape") closeModal();
    if (["ArrowRight", "ArrowDown", "PageDown"].includes(event.key)) {
      event.preventDefault();
      showPage(page + 1);
    }
    if (["ArrowLeft", "ArrowUp", "PageUp"].includes(event.key)) {
      event.preventDefault();
      showPage(page - 1);
    }
  });

  showPage(1);
})();
