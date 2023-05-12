// MODAL STUFF
const openModalButton = document.getElementById("openModalButton");
const modalOverlay = document.getElementById("modalOverlay");
const closeModalButton = document.getElementById("closeModalButton");
const modalContent = document.getElementById("modalContent");
const modalResizeHandle = document.getElementById("modalResizeHandle");
const container = document.querySelector(".container");

const dropdowns = document.querySelectorAll(".hexSel");

for (let dropdown of dropdowns) {
  for (let i = 1; i <= 255; i++) {
    const hexValue = i.toString(16).padStart(2, "0").toUpperCase();
    const option = document.createElement("option");
    option.value = hexValue;
    option.text = i.toString().padStart(3,"0");
    dropdown.appendChild(option);
  }
}

// Get the necessary elements
const leftDasDelaySelect = document.getElementById('leftDasDelay');
const leftDasArrSelect = document.getElementById('leftDasArr');
const rightDasDelaySelect = document.getElementById('rightDasDelay');
const rightDasArrSelect = document.getElementById('rightDasArr');

const l_leftDasDelayLink = document.getElementById('l_leftDasDelay');
const l_leftDasArrLink = document.getElementById('l_leftDasArr');
const l_rightDasDelayLink = document.getElementById('l_rightDasDelay');
const l_rightDasArrLink = document.getElementById('l_rightDasArr');



// Function to update link text with animation
function updateLinkText(linkElement, selectedOption) {
    const linkText = linkElement.textContent;
    const updatedLinkText = selectedOption + linkText.substring(2);
  
    // Check if the link is either a left link or a right link
    const isLeftLink = linkElement.id.startsWith('l_left');
    const isRightLink = linkElement.id.startsWith('l_right');
  
    // Update the link text immediately
    linkElement.textContent = updatedLinkText;
  
    // Remove the inactive class from the link element
    linkElement.classList.remove('inactive');
  
    // Add animation class to the link element after a small delay, for both left and right links
    if (isLeftLink || isRightLink) {
      setTimeout(() => {
        linkElement.classList.add('link-animation');
      }, 10);
    }
  
    // Remove the animation class after animation completes, for both left and right links
    if (isLeftLink || isRightLink) {
      setTimeout(() => {
        linkElement.classList.remove('link-animation');
      }, 1010);
    }
  
    // Add click event listener to change background color after link is clicked
    linkElement.addEventListener('click', function () {
      linkElement.style.backgroundColor = 'lightgreen';
    });
  }
  
  // Iterate over all the copy links and attach the event listener
  for (let i = 0; i < copyLinks.length; i++) {
    const linkElement = copyLinks[i];
    const selectedOption = linkElement.textContent.substring(0, 2); // Get the initial selected option
  
    // Attach the event listener only if it's not an inactive link
    if (!linkElement.classList.contains('inactive')) {
      updateLinkText(linkElement, selectedOption);
    }
  }






// Add event listeners to the select elements
leftDasDelaySelect.addEventListener('change', function () {
  const selectedOption = leftDasDelaySelect.value;
  updateLinkText(l_leftDasDelayLink, selectedOption);
  rightDasDelaySelect.value = selectedOption; // Sync the value with the right select element
  updateLinkText(l_rightDasDelayLink, selectedOption); // Trigger animation for right link
});

leftDasArrSelect.addEventListener('change', function () {
  const selectedOption = leftDasArrSelect.value;
  updateLinkText(l_leftDasArrLink, selectedOption);
  rightDasArrSelect.value = selectedOption; // Sync the value with the right select element
  updateLinkText(l_rightDasArrLink, selectedOption); // Trigger animation for right link
});



rightDasDelaySelect.addEventListener('change', function () {
  const selectedOption = rightDasDelaySelect.value;
  updateLinkText(l_rightDasDelayLink, selectedOption);
});

rightDasArrSelect.addEventListener('change', function () {
  const selectedOption = rightDasArrSelect.value;
  updateLinkText(l_rightDasArrLink, selectedOption);
});



openModalButton.addEventListener("click", function () {
    if (modalOverlay.style.display === "block") {
      // Modal is open, so close it
      modalOverlay.style.display = "none";
      container.classList.remove("with-modal");
  
      // Reset the container's width
      container.style.width = "auto";
  
      // Update the button text
      openModalButton.textContent = "Show GG Codes";
    } else {
      // Modal is closed, so open it
      modalOverlay.style.display = "block";
      container.classList.add("with-modal");
  
      // Calculate and set the remaining width
      const modalWidth = document.getElementById("modalContent").offsetWidth;
      const containerWidth = container.offsetWidth;
      const remainingWidth = containerWidth - modalWidth;
      container.style.width = `${remainingWidth}px`;
  
      // Update the button text
      openModalButton.textContent = "Hide GG Codes";
    }
});

modalOverlay.addEventListener("click", function (event) {
  if (event.target === closeModalButton) {
    modalOverlay.style.display = "none";
  }
});

let isResizing = false;
let resizeStartX = 0;
let initialWidth = 0;
let initialContainerWidth = container.offsetWidth;

modalResizeHandle.addEventListener("mousedown", function (event) {
  isResizing = true;
  resizeStartX = event.clientX;
  initialWidth = modalContent.offsetWidth;

  document.addEventListener("mousemove", handleResize);
  document.addEventListener("mouseup", stopResize);
});

function handleResize(event) {
  if (!isResizing) return;

  const mouseDiff = resizeStartX - event.clientX;
  const newWidth = initialWidth + mouseDiff;
  modalContent.style.width = `${newWidth}px`;

  // Calculate and set the remaining width
  const modalWidth = modalContent.offsetWidth;
  const remainingWidth = initialContainerWidth - modalWidth;
  container.style.width = `${remainingWidth}px`;
}

function stopResize() {
  isResizing = false;
  document.removeEventListener("mousemove", handleResize);
  document.removeEventListener("mouseup", stopResize);
}