function closeModal() {
  modalOverlay.classList.add("hidden");
  modalMessage.closest(".modalBox")?.classList.remove("importSummaryModalBox");

  modalInput.style.display = "none";
  modalInput.value = "";

  modalSelect.style.display = "none";
  modalSelect.innerHTML = "";

  modalChoices.style.display = "none";
  modalChoices.innerHTML = "";

  modalOk.onclick = null;
  modalOk.disabled = false;
  modalCancel.onclick = null;
  modalOverlay.onclick = null;
  document.onkeydown = null;
}

function bindModalKeys({ onConfirm, onCancel = null, allowEnter = true }) {
  document.onkeydown = (e) => {
    if (e.isComposing) return;

    if (e.key === "Escape") {
      e.preventDefault();
      closeModal();

      if (onCancel) {
        onCancel();
      }

      return;
    }

    if (!allowEnter || e.key !== "Enter") return;

    e.preventDefault();

    if (onConfirm) {
      onConfirm();
    }
  };
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
  modalSelect.style.display = "none";
  modalChoices.style.display = "none";
  modalChoices.innerHTML = "";
  modalOk.style.display = "";

  modalOverlay.classList.remove("hidden");

  const confirm = () => {
    const value = input ? modalInput.value : undefined;

    closeModal();

    if (onOk) {
      onOk(value);
    }
  };

  modalOk.onclick = confirm;

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

  bindModalKeys({
    onConfirm: confirm,
    onCancel,
  });

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

function showConfirmContent(
  content,
  onOk,
  onCancel = null,
  okText = "OK",
  cancelText = "Cancel",
) {
  const modalBox = modalMessage.closest(".modalBox");

  modalBox?.classList.toggle(
    "importSummaryModalBox",
    content.classList.contains("importSummary"),
  );

  modalMessage.replaceChildren(content);

  modalInput.style.display = "none";
  modalSelect.style.display = "none";
  modalSelect.innerHTML = "";
  modalChoices.style.display = "none";
  modalChoices.innerHTML = "";

  modalOk.style.display = "";
  modalOk.textContent = okText;
  modalOk.disabled = false;
  modalCancel.textContent = cancelText;
  modalCancel.style.display = "";

  modalOverlay.classList.remove("hidden");

  const confirm = () => {
    closeModal();

    if (onOk) {
      onOk();
    }
  };

  modalOk.onclick = confirm;

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

  bindModalKeys({
    onConfirm: confirm,
    onCancel,
  });

  modalOk.focus();
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
  modalChoices.style.display = "none";
  modalChoices.innerHTML = "";
  modalOk.style.display = "";

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

  const confirm = () => {
    const value = modalSelect.value;

    closeModal();

    if (onOk) {
      onOk(value);
    }
  };

  modalOk.onclick = confirm;

  modalCancel.onclick = () => {
    closeModal();

    if (onCancel) {
      onCancel();
    }
  };

  bindModalKeys({
    onConfirm: confirm,
    onCancel,
  });

  modalSelect.focus();
}

function showChoiceList(
  message,
  options,
  onOk,
  onCancel = null,
  cancelText = "Cancel",
) {
  modalMessage.textContent = message;

  modalInput.style.display = "none";
  modalSelect.style.display = "none";
  modalSelect.innerHTML = "";

  modalChoices.innerHTML = "";

  options.forEach((option) => {
    const item = document.createElement("button");

    item.type = "button";
    item.className = "modalChoiceButton";

    if (option.variant) {
      item.classList.add(`modalChoiceButton-${option.variant}`);
    }

    item.textContent = option.label;

    item.onclick = () => {
      closeModal();

      if (onOk) {
        onOk(option.value);
      }
    };

    modalChoices.appendChild(item);
  });

  modalChoices.style.display = "";
  modalOk.style.display = "none";
  modalCancel.textContent = cancelText;
  modalCancel.style.display = "";

  modalOverlay.classList.remove("hidden");

  const confirmFocusedChoice = () => {
    const activeChoice = modalChoices.contains(document.activeElement)
      ? document.activeElement
      : modalChoices.querySelector(".modalChoiceButton");

    activeChoice?.click();
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

  bindModalKeys({
    onConfirm: confirmFocusedChoice,
    onCancel,
  });

  const firstChoice = modalChoices.querySelector(".modalChoiceButton");

  if (firstChoice) {
    firstChoice.focus();
  }
}

function showCheckboxList(
  message,
  options,
  onOk,
  onCancel = null,
  okText = "Download",
  cancelText = "Cancel",
) {
  modalMessage.textContent = message;

  modalInput.style.display = "none";
  modalSelect.style.display = "none";
  modalSelect.innerHTML = "";
  modalChoices.innerHTML = "";

  const tools = document.createElement("div");
  tools.className = "modalSelectionTools";

  const count = document.createElement("span");
  count.className = "modalSelectionCount";

  const selectAllButton = document.createElement("button");
  selectAllButton.type = "button";
  selectAllButton.className = "modalSelectionToolButton";
  selectAllButton.textContent = "All";

  const selectNoneButton = document.createElement("button");
  selectNoneButton.type = "button";
  selectNoneButton.className = "modalSelectionToolButton";
  selectNoneButton.textContent = "None";

  tools.append(count, selectAllButton, selectNoneButton);
  modalChoices.appendChild(tools);

  const list = document.createElement("div");
  list.className = "modalSelectionList";
  modalChoices.appendChild(list);

  const selected = new Set(options.map((option) => option.value));
  const buttons = options.map((option) => {
    const item = document.createElement("button");

    item.type = "button";
    item.className = "modalSelectionItem selected";
    item.dataset.value = option.value;

    const label = document.createElement("span");
    label.textContent = option.label;

    const state = document.createElement("span");
    state.className = "modalSelectionState";

    item.append(label, state);

    item.onclick = () => {
      if (selected.has(option.value)) {
        selected.delete(option.value);
      } else {
        selected.add(option.value);
      }

      updateSelectionUI();
    };

    list.appendChild(item);

    return item;
  });

  const updateSelectionUI = () => {
    buttons.forEach((button) => {
      button.classList.toggle("selected", selected.has(button.dataset.value));
    });

    count.textContent = `${selected.size}/${options.length} selected`;
    modalOk.disabled = selected.size === 0;
  };

  selectAllButton.onclick = () => {
    options.forEach((option) => selected.add(option.value));
    updateSelectionUI();
  };

  selectNoneButton.onclick = () => {
    selected.clear();
    updateSelectionUI();
  };

  modalChoices.style.display = "";
  modalOk.style.display = "";
  modalOk.textContent = okText;
  modalOk.disabled = false;
  modalCancel.textContent = cancelText;
  modalCancel.style.display = "";

  modalOverlay.classList.remove("hidden");

  const confirm = () => {
    const values = [...selected];

    if (values.length === 0) return;

    closeModal();

    if (onOk) {
      onOk(values);
    }
  };

  modalOk.onclick = confirm;

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

  bindModalKeys({
    onConfirm: confirm,
    onCancel,
  });

  updateSelectionUI();
  buttons[0]?.focus();
}
