    const fogBox = {
      "ffdd6d89a9939f9c2d4cc66e13bfc27059a3256b401bd899d847c8c21c183c7a": "U2luaXN0ZXJGaWxlLmpwZw==", // SinisterFile.jpg
      "235a84784e4e3955df0bb48a3b8c5de46f2d0d5f1d84cd597cb9056b8f3372cb": "RHVtbXlGaWxlLnR4dA=="       // DummyFile.txt
    };

    function getParams() {
      const params = new URLSearchParams(window.location.search);
      return [params.get("k") || "", params.get("f") || "", params.get("o") || "0"];
    }

    async function hashIt(x1, x2, x3) {
      const mix = parseInt(x3) % 2 === 1 ? x1 + x2 : x2 + x1;
      const buffer = new TextEncoder().encode(mix);
      const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
      return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    }

    function getHash(hash) {
      return fogBox[hash] || null;
    }

    function mirrorRabbit(gibberish) {
      try {
        return atob(gibberish);
      } catch {
        return null;
      }
    }

    function releaseTheOtter(filename) {
      const blob = new Blob(["This is the real content of: " + filename], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    document.getElementById("CV").addEventListener("click", async () => {
        alert("yo");
        const [k, f, o] = getParams();
        const hash = await hashIt(k, f, o);
        const encryptedName = getHash(hash);
        const realFileName = encryptedName ? mirrorRabbit(encryptedName) : null;

        if (realFileName) {
            releaseTheOtter(realFileName);
        }
    });