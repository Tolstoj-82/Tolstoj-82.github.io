async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function vigenere(text, key, mode = "encode") {
  if (!key.length) return "";

  if (mode === "encode") {
    const output = [];
    for (let i = 0; i < text.length; i++) {
      const keyChar = key[i % key.length];
      const shift = keyChar.charCodeAt(0);
      const textCharCode = text.charCodeAt(i);
      const newCharCode = textCharCode + shift;
      output.push(newCharCode);
    }
    return output.join(",");
  } else if (mode === "decode") {
    const numbers = text
      .split(",")
      .map((n) => parseInt(n.trim(), 10))
      .filter((n) => !isNaN(n));

    let output = "";
    for (let i = 0; i < numbers.length; i++) {
      const keyChar = key[i % key.length];
      const shift = keyChar.charCodeAt(0);
      const originalCharCode = numbers[i] - shift;
      output += String.fromCharCode(originalCharCode);
    }
    return output;
  }
}