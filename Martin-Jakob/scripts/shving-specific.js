const shaInput = document.getElementById("sha256");
const entrytextInput = document.getElementById("entrytext");
const textInput = document.getElementById("text");
const keyInput = document.getElementById("key");
const modeSelect = document.getElementById("mode");

const queryStringDiv = document.getElementById("querystring");
const jsonOutputDiv = document.getElementById("jsonoutput");

document.querySelector(".accordion").addEventListener("click", function () {
  this.classList.toggle("active");
  const panel = this.nextElementSibling;
  panel.style.display = panel.style.display === "block" ? "none" : "block";
});

async function updateOutputs() {
  const aText = shaInput.value; // raw user input
  const bKey = keyInput.value;
  const text = textInput.value;
  const entrytext = entrytextInput.value;
  const mode = modeSelect.value;

  const sha = aText ? await sha256(aText) : "";
  const vigenereResult = vigenere(text, bKey, mode);
  const entryTextResut = vigenere(entrytext, bKey, mode);

  // Use raw input for "a" and encoded key for "b"
  queryStringDiv.textContent = `https://tolstoj-82.github.io/Martin-Jakob/index.html?a=${aText}&b=${encodeURIComponent(bKey)}`;
  jsonOutputDiv.textContent = sha ? `"${sha}": ["${entryTextResut}", "${vigenereResult}"], ` : "";
}

function copyToClipboard(elementId) {
  const text = document.getElementById(elementId).textContent;
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    const toast = document.getElementById("toast");
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 1500);
  });
}

document.getElementById("copyQuery").addEventListener("click", (e) => {
  e.preventDefault();
  copyToClipboard("querystring");
});

document.getElementById("copyJson").addEventListener("click", (e) => {
  e.preventDefault();
  copyToClipboard("jsonoutput");
});

[shaInput, textInput, keyInput].forEach((input) =>
  input.addEventListener("input", updateOutputs)
);
modeSelect.addEventListener("change", updateOutputs);
