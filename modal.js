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
    option.text = i.toString();
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
    const isGravityLink = linkElement.id.startsWith('s_G');
  
    // Update the link text immediately
    linkElement.textContent = updatedLinkText;
  
    // Remove the inactive class from the link element
    linkElement.classList.remove('inactive');
  
    // Add animation class to the link element after a small delay, for both left, right, and gravity links
    if (isLeftLink || isRightLink || isGravityLink) {
        setTimeout(() => {
            linkElement.classList.add('link-animation');
        }, 10);
    }
  
    // Remove the animation class after animation completes, for both left, right, and gravity links
    if (isLeftLink || isRightLink || isGravityLink) {
        setTimeout(() => {
            linkElement.classList.remove('link-animation');
        }, 1010);
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



// GENERATE STUFF FOR THE GRAVITY TABLES
// Get the container element where the selects will be added
const gravityTablesContainer = document.getElementById('gravityTablesContainer');
const ggCodeInput = document.getElementById('ggCode');

// Define the number of levels
const numLevels = 20;

// Create a table element
const gravityTableTable = document.createElement('table');

// Define the column names
const columnNames = ['Level', 'Speed [1/G]', 'Code', 'Original', 'To Bottom'];

// Create the header row
const headerRow = gravityTableTable.insertRow();
columnNames.forEach(columnName => {
  const headerCell = document.createElement('th');
  headerCell.textContent = columnName;
  headerRow.appendChild(headerCell);
});

for (let i = 0; i <= numLevels; i++) {
    const row = document.createElement('tr');
    const text = document.createTextNode(i);
    const textCell = document.createElement('td');
    textCell.appendChild(text);

    // Create a new select element
    const select = document.createElement('select');
    select.classList.add('hexSel');
    select.id = `s_L${i}`;

    // Create options ranging from 0 to 255
    for (let j = 0; j <= 255; j++) {
        const option = document.createElement('option');
        option.value = j.toString(16).padStart(2, "0").toUpperCase();
        option.textContent = j + 1;
        select.appendChild(option);
    }

    // Set the preselected value based on the specified values
    const preselectedValues = [53, 49, 45, 41, 37, 33, 28, 22, 17, 11, 10, 9, 8, 7, 6, 6, 5, 5, 4, 4, 3];
    select.value = (preselectedValues[i] - 1).toString(16).padStart(2, "0").toUpperCase();

    // Create a new cell for the select
    const selectCell = document.createElement('td');
    selectCell.appendChild(select);

    // Create a new cell for the original value
    const originalValueCell = document.createElement('td');
    const oriValue = preselectedValues[i];
    const originalValueText = document.createTextNode(`${oriValue}`);
    originalValueCell.appendChild(originalValueText);

    // Create a new cell for the speed
    const speedCell = document.createElement('td');
    const value = parseInt(select.options[select.selectedIndex].textContent);
    var timeToBottom = Math.round(1000 * 18 * (1 / 59.7) * value);
    if(timeToBottom >= 1000) timeToBottom = Math.round(timeToBottom/100)/10 + " s";
    else timeToBottom += " ms";
    const speedText = document.createTextNode(timeToBottom);
    speedCell.appendChild(speedText);

    // Create a new cell for the link
    const linkCell = document.createElement('td');

    // Create the link text content
    const hexValue = (6 + i).toString(16).padStart(2, "0").toUpperCase();
    const linkText = `XXB-${hexValue}E`;

    // Create the link
    const link = document.createElement('a');
    link.href = '#';
    link.classList.add('copyLink', 'inactive');
    link.textContent = linkText;
    link.id = `s_G${i}`;

    // Add event listener to the select element
    select.addEventListener('change', function () {
        // Get the selected option value
        const selectedOption = select.value;

        // Update the link text with the selected option value
        updateLinkText(link, selectedOption);

        // Fill in the input text with the link value
        ggCodeInput.value = link.textContent;

        // Update the speed value
        const updatedValue = parseInt(select.options[select.selectedIndex].textContent);
        var updatedTimeToBottom = Math.round(1000 * 17 * (1 / 59.7) * updatedValue);
        if(updatedTimeToBottom >= 1000) updatedTimeToBottom = Math.round(updatedTimeToBottom/100)/10 + " s";
        else updatedTimeToBottom += " ms";
        speedText.textContent = updatedTimeToBottom;
    });

    // Append the link to the cell
    linkCell.appendChild(link);

    // Append the text, select, original value, speed, and link cells to the row
    row.appendChild(textCell);
    row.appendChild(selectCell);
    row.appendChild(linkCell);
    row.appendChild(originalValueCell);
    row.appendChild(speedCell);


    // Append the row to the table
    gravityTableTable.appendChild(row);
}

// Append the table to the gravityTablesContainer element
gravityTablesContainer.appendChild(gravityTableTable);





/*
// GENERATE STUFF FOR THE GRAVITY TABLES
// Get the container element where the selects will be added
const gravityTablesContainer = document.getElementById('gravityTablesContainer');
const ggCodeInput = document.getElementById('ggCode');

// Define the number of levels
const numLevels = 20;

// Create a table element
const gravityTableTable = document.createElement('table');

for (let i = 0; i <= numLevels; i++) {
    const row = document.createElement('tr');
    const text = document.createTextNode(`Level ${i}`);
    const textCell = document.createElement('td');
    textCell.appendChild(text);

    // Create a new select element
    const select = document.createElement('select');
    select.classList.add('hexSel');
    select.id = `s_L${i}`;

    // Create options ranging from 0 to 255
    for (let j = 0; j <= 255; j++) {
        const option = document.createElement('option');
        option.value = j.toString(16).padStart(2, "0").toUpperCase();
        option.textContent = j + 1;
        select.appendChild(option);
    }

    // Set the preselected value based on the specified values
    const preselectedValues = [53, 49, 45, 41, 37, 33, 28, 22, 17, 11, 10, 9, 8, 7, 6, 6, 5, 5, 4, 4, 3];
    select.value = (preselectedValues[i] - 1).toString(16).padStart(2, "0").toUpperCase();

    // Create a new cell for the select
    const selectCell = document.createElement('td');
    selectCell.appendChild(select);

    // Create a new cell for the link
    const linkCell = document.createElement('td');

    // Create the link text content
    const hexValue = (6 + i).toString(16).padStart(2, "0").toUpperCase();
    const linkText = `XXB-${hexValue}E`;

    // Create the link
    const link = document.createElement('a');
    link.href = '#';
    link.classList.add('copyLink', 'inactive');
    link.textContent = linkText;
    link.id = `s_G${i}`;

    // Add event listener to the select element
    select.addEventListener('change', function () {
        // Get the selected option value
        const selectedOption = select.value;

        // Update the link text with the selected option value
        updateLinkText(link, selectedOption);

        // Fill in the input text with the link value
        ggCodeInput.value = link.textContent;
    });

    // Append the link to the cell
    linkCell.appendChild(link);

    // Append the text, select, and link cells to the row
    row.appendChild(textCell);
    row.appendChild(selectCell);
    row.appendChild(linkCell);

    // Append the row to the table
    gravityTableTable.appendChild(row);
}

// Append the table to the gravityTablesContainer element
gravityTablesContainer.appendChild(gravityTableTable);
*/