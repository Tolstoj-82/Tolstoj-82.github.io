(() => {
"use strict";
let toastTimer;
const toastQueue = [];
function toast(message, error = false) {
  if (toastQueue.some(item => item.message === message)) return;
  toastQueue.push({ message, error });
  if (toastQueue.length === 1) showNextToast();
}
function showNextToast() {
  if (!toastQueue.length) return;
  const { message, error } = toastQueue[0];
  const element = document.getElementById("toast");
  document.getElementById("toastMessage").textContent = message;
  element.classList.remove("show");
  element.classList.toggle("error", error === true || error === "error");
  element.classList.toggle("warning", error === "warning");
  if (element.showPopover && !element.matches(":popover-open"))
    element.showPopover();
  void element.offsetWidth;
  element.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(hideToast, 3500);
}
function hideToast() {
  const element = document.getElementById("toast");
  element.classList.remove("show");
  if (element.hidePopover && element.matches(":popover-open"))
    element.hidePopover();
  clearTimeout(toastTimer);
  toastQueue.shift();
  if (toastQueue.length) toastTimer = setTimeout(showNextToast, 150);
}
document.getElementById("toastClose").addEventListener("click", hideToast);

window.QRGenerator["notifications"] = {toast};
})();
