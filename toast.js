// display a toast
// if it is called because rows are full, it waits 10 seconds before it's called again
// waits for the last toast to disappear, before the next is shown
let toastQueue = [];
let canCall = true;

function displayToast(id) {
  toastQueue.push(id);

  if (toastQueue.length === 1) {
    showNextToast();
  }
}

function showNextToast() {
  if (!toastQueue.length) return;

  let id = toastQueue[0];
  if (id !== 'rowsFull' || canCall) {
    if (id === 'rowsFull') {
      canCall = false;
      setTimeout(() => {
        canCall = true;
      }, 10000);
    }
    var toast = document.getElementById(id);
    toast.classList.add("show");
    setTimeout(function() {
      toast.classList.remove("show");
      toastQueue.shift();
      showNextToast();
    }, 2500);
  }
}
