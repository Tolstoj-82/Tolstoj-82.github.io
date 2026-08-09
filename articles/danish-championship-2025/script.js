const articleImages = document.querySelectorAll("img.clickable");
const imageModal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const closeImageModalButton = imageModal?.querySelector(".close");
let imageThatOpenedModal = null;

const gbOpcodes = new Set([
  "adc", "add", "and", "bit", "call", "ccf", "cp", "cpl", "daa", "dec",
  "di", "ei", "halt", "inc", "jp", "jr", "ld", "ldh", "nop", "or", "pop",
  "push", "res", "ret", "reti", "rl", "rla", "rlc", "rr", "rra", "rrc",
  "rst", "sbc", "scf", "set", "sla", "sra", "srl", "stop", "sub", "swap",
  "xor"
]);

document.querySelectorAll("main :not(pre) > code").forEach((code) => {
  const value = code.textContent.trim();
  if (gbOpcodes.has(value.toLowerCase())) {
    code.textContent = value.toLowerCase();
    code.classList.add("inline-opcode");
  }
});

document.querySelectorAll("main pre > code").forEach((code) => {
  const normalized = code.textContent.replace(/^\s+/, "");
  if (normalized === code.textContent) return;
  code.textContent = normalized;
  window.Prism?.highlightElement(code);
});

function closeArticleImageModal() {
  if (!imageModal) return;
  imageModal.style.display = "none";
  imageModal.setAttribute("aria-hidden", "true");
  modalImage.removeAttribute("src");
  imageThatOpenedModal?.focus();
}

articleImages.forEach((image) => {
  image.tabIndex = 0;
  image.setAttribute("role", "button");
  image.setAttribute("aria-label", `Open larger view: ${image.alt}`);
  const open = () => {
    imageThatOpenedModal = image;
    modalImage.src = image.src;
    modalImage.alt = image.alt;
    imageModal.style.display = "flex";
    imageModal.setAttribute("aria-hidden", "false");
    closeImageModalButton.focus();
  };
  image.addEventListener("click", open);
  image.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      open();
    }
  });
});

closeImageModalButton?.addEventListener("click", closeArticleImageModal);
imageModal?.addEventListener("click", (event) => {
  if (event.target === imageModal) closeArticleImageModal();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && imageModal?.getAttribute("aria-hidden") === "false") {
    closeArticleImageModal();
  }
});
