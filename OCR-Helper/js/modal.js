function closeModal() {
  modalOverlay.classList.add("hidden");

  modalInput.style.display = "none";
  modalInput.value = "";

  modalSelect.style.display = "none";
  modalSelect.innerHTML = "";

  modalOk.onclick = null;
  modalCancel.onclick = null;
  modalOverlay.onclick = null;
  document.onkeydown = null;
}

function setupModalDragging() {
  document.querySelectorAll(".modalBox").forEach((box) => {
    const handle = box.querySelector(".modalDragHandle");

    if (!handle) return;

    handle.addEventListener("mousedown", (e) => {
      if (e.button !== 0) return;

      const rect = box.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;

      box.style.position = "fixed";
      box.style.left = `${rect.left}px`;
      box.style.top = `${rect.top}px`;
      box.style.margin = "0";

      const move = (moveEvent) => {
        const maxLeft = window.innerWidth - box.offsetWidth;
        const maxTop = window.innerHeight - box.offsetHeight;

        const left = Math.max(0, Math.min(maxLeft, moveEvent.clientX - offsetX));
        const top = Math.max(0, Math.min(maxTop, moveEvent.clientY - offsetY));

        box.style.left = `${left}px`;
        box.style.top = `${top}px`;
      };

      const stop = () => {
        window.removeEventListener("mousemove", move);
        window.removeEventListener("mouseup", stop);
      };

      window.addEventListener("mousemove", move);
      window.addEventListener("mouseup", stop);
    });
  });
}

setupModalDragging();

function showModal({
  message,
  okText = "OK",
  cancelText = "Cancel",
  showCancel = false,
  input = false,
  defaultValue = "",
  onOk = null,
  onCancel = null,
}) {
  modalMessage.textContent = message;

  modalOk.textContent = okText;

  modalCancel.textContent = cancelText;
  modalCancel.style.display = showCancel ? "" : "none";

  modalInput.style.display = input ? "" : "none";
  modalInput.value = defaultValue;

  modalOverlay.classList.remove("hidden");

  modalOk.onclick = () => {
    const value = input ? modalInput.value : undefined;

    closeModal();

    if (onOk) {
      onOk(value);
    }
  };

  modalCancel.onclick = () => {
    closeModal();

    if (onCancel) {
      onCancel();
    }
  };

  modalOverlay.onclick = (e) => {
    if (e.target !== modalOverlay) return;

    closeModal();

    if (onCancel) {
      onCancel();
    }
  };

  document.onkeydown = (e) => {
    if (e.key !== "Escape") return;

    closeModal();

    if (onCancel) {
      onCancel();
    }
  };

  if (input) {
    modalInput.focus();
    modalInput.select();
  } else {
    modalOk.focus();
  }
}

function showAlert(message, okText = "OK", onClose = null) {
  showModal({
    message,
    okText,
    onOk: onClose,
  });
}

function showConfirm(
  message,
  onOk,
  onCancel = null,
  okText = "OK",
  cancelText = "Cancel",
) {
  showModal({
    message,
    okText,
    cancelText,
    showCancel: true,
    onOk,
    onCancel,
  });
}

function showPrompt(
  message,
  defaultValue = "",
  onOk,
  onCancel = null,
  okText = "OK",
  cancelText = "Cancel",
) {
  showModal({
    message,
    okText,
    cancelText,
    showCancel: true,
    input: true,
    defaultValue,
    onOk,
    onCancel,
  });
}

function showSelect(
  message,
  options,
  onOk,
  onCancel = null,
  okText = "OK",
  cancelText = "Cancel",
) {
  modalMessage.textContent = message;

  modalInput.style.display = "none";

  modalSelect.innerHTML = "";

  options.forEach((option) => {
    const item = document.createElement("option");

    item.value = option.value;
    item.textContent = option.label;

    modalSelect.appendChild(item);
  });

  modalSelect.style.display = "";

  modalOk.textContent = okText;
  modalCancel.textContent = cancelText;
  modalCancel.style.display = "";

  modalOverlay.classList.remove("hidden");

  modalOk.onclick = () => {
    const value = modalSelect.value;

    closeModal();

    if (onOk) {
      onOk(value);
    }
  };

  modalCancel.onclick = () => {
    closeModal();

    if (onCancel) {
      onCancel();
    }
  };

  modalSelect.focus();
}
