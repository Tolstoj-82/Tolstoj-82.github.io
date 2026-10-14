(() => {
  "use strict";
  let toastTimer;
  const toastQueue = [];
  const dialogs = [];
  function raiseToast() {
    const element = document.getElementById('toast');
    const visible = element.classList.contains('show');
    if (!visible) return;
    const parent = [...dialogs].reverse().find(dialog => dialog.isConnected && dialog.open) || document.body;
    // A popover must be reinserted into the top layer after a newer modal opens.
    if (element.hidePopover && element.matches(':popover-open')) element.hidePopover();
    if (element.parentElement !== parent) parent.append(element);
    if (element.showPopover) element.showPopover();
  }
  new MutationObserver(records => {
    let changed = false;
    for (const record of records) {
      const dialog = record.target;
      if (dialog.tagName !== 'DIALOG') continue;
      const index = dialogs.indexOf(dialog);
      if (index !== -1) dialogs.splice(index, 1);
      if (dialog.open) dialogs.push(dialog);
      changed = true;
    }
    if (changed) raiseToast();
  }).observe(document.body, {subtree:true, attributes:true, attributeFilter:['open']});
  function toast(message, error = false) {
    if (toastQueue.some((item) => item.message === message)) return;
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

    void element.offsetWidth;
    element.classList.add("show");
    raiseToast();
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

  window.QRGenerator["notifications"] = { toast };
})();
