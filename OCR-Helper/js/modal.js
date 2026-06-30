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
