document.addEventListener("DOMContentLoaded", () => {
  if (new URLSearchParams(location.search).get("section") === "articles") {
    window.addEventListener("load", () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.getElementById("articles-section")?.scrollIntoView({
            block: "start",
          });
        });
      });
    });
  }

  if (location.protocol === "file:") {
    document
      .querySelectorAll('a[href="#top"], a.site-footer-logo[href="index.html"]')
      .forEach((link) => {
        link.addEventListener("click", (event) => {
          event.preventDefault();
          document.getElementById("top")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        });
      });
  }

  const konamiSequence = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
  ];
  let konamiPosition = 0;
  const hadoukenSequences = ["hadouken", "hadooken"];
  const hadoukenSequenceLength = Math.max(
    ...hadoukenSequences.map((sequence) => sequence.length),
  );
  let hadookenBuffer = "";
  const rocketFestivalSequence = "rocketfest";
  let rocketFestivalBuffer = "";
  let buranAudioContext;
  const buranClearSound = new Audio("assets/music/tetra-clear.mp3");
  buranClearSound.preload = "none";
  buranClearSound.volume = 0.72;

  const playBuranRocketSound = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    buranAudioContext ||= new AudioContext();
    const context = buranAudioContext;
    const duration = 4.25;
    const buffer = context.createBuffer(
      1,
      Math.ceil(context.sampleRate * duration),
      context.sampleRate,
    );
    const noise = buffer.getChannelData(0);
    let previous = 0;
    for (let index = 0; index < noise.length; index += 1) {
      const white = Math.random() * 2 - 1;
      previous = previous * 0.96 + white * 0.04;
      noise[index] = previous * 2.4;
    }

    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    source.buffer = buffer;
    filter.type = "lowpass";
    filter.frequency.value = 850;
    filter.Q.value = 0.7;
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.1, context.currentTime + 0.2);
    gain.gain.setValueAtTime(0.1, context.currentTime + duration - 0.45);
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      context.currentTime + duration,
    );
    source.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);
    context.resume().then(() => source.start());
  };

  const buranMessages = [
    "BOOM!",
    "Tris... Tris... Tris!",
    "Sheesh!",
    "Awesome!",
  ];
  const buranRockets = [
    {
      name: "Shuttle",
      src: "assets/images/buran.png",
      width: 229,
      height: 460,
      logicalHeight: 66,
      flames: ["left", "middle", "right"],
    },
    {
      name: "Soyuz",
      src: "assets/images/soyuz.png",
      width: 96,
      height: 335,
      logicalHeight: 56,
      flames: ["single"],
    },
    {
      name: "Titan II GLV",
      src: "assets/images/titan-ii-glv.png",
      width: 48,
      height: 228,
      logicalHeight: 38,
      flames: ["single"],
    },
    {
      name: "Missile",
      src: "assets/images/missile.png",
      width: 60,
      height: 167,
      logicalHeight: 28,
      flames: ["single"],
    },
  ];
  const pickRandom = (items) =>
    items[Math.floor(Math.random() * items.length)];
  const shuffled = (items) => {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
    }
    return result;
  };

  const showBuranMessage = () => {
    const sheesh = document.createElement("div");
    sheesh.className = "buran-sheesh";
    sheesh.textContent = pickRandom(buranMessages);
    sheesh.setAttribute("aria-hidden", "true");
    sheesh.addEventListener("animationend", () => sheesh.remove(), {
      once: true,
    });
    document.body.append(sheesh);
  };

  const getRocketMetrics = (rocket, scale = 1) => {
    const baseHeight = Math.min(window.innerHeight * 0.3, 300) * scale;
    const pixelSize = baseHeight / buranRockets[0].logicalHeight;
    const rocketHeight =
      rocket.flames.length === 1
        ? rocket.logicalHeight * pixelSize
        : baseHeight;

    return {
      baseHeight,
      rocketHeight,
      shuttleWidth: rocketHeight * (rocket.width / rocket.height),
    };
  };

  const launchRocket = (
    rocket = pickRandom(buranRockets),
    center = null,
    scale = 1,
    showCompletionMessage = true,
    playLaunchSound = true,
    playCompletionSound = true,
  ) => {
    const useSingleEngineRocket = rocket.flames.length === 1;
    const buran = document.createElement("div");
    buran.className = "buran-easter-egg";
    buran.dataset.rocket = rocket.name;
    if (useSingleEngineRocket) {
      buran.classList.add("buran-easter-egg--single-engine");
    }
    buran.setAttribute("aria-hidden", "true");
    const shuttle = document.createElement("img");
    shuttle.src = rocket.src;
    shuttle.alt = "";
    const thruster = document.createElement("span");
    thruster.className = "buran-thruster";
    rocket.flames.forEach((position) => {
      const flame = document.createElement("span");
      flame.className = `buran-flame buran-flame--${position}`;
      thruster.append(flame);
    });
    buran.append(shuttle, thruster);

    const { baseHeight, rocketHeight, shuttleWidth } = getRocketMetrics(
      rocket,
      scale,
    );
    if (useSingleEngineRocket) {
      const buranWidthAtThisScale =
        baseHeight * (buranRockets[0].width / buranRockets[0].height);
      buran.style.setProperty(
        "--buran-single-flame-width",
        `${buranWidthAtThisScale * 0.72 * 0.32}px`,
      );
      buran.style.setProperty(
        "--buran-single-flame-height",
        `${baseHeight * 0.32}px`,
      );
    }

    const margin = 16;
    const halfWidth = shuttleWidth / 2;
    const minCenter = margin + halfWidth;
    const maxCenter = Math.max(
      minCenter,
      window.innerWidth - margin - halfWidth,
    );
    const launchCenter =
      center ?? minCenter + Math.random() * (maxCenter - minCenter);
    buran.style.setProperty("--buran-left", `${launchCenter}px`);
    buran.style.setProperty("--buran-height", `${rocketHeight}px`);
    buran.style.setProperty("--buran-width", `${shuttleWidth}px`);
    buran.addEventListener("animationend", (animationEvent) => {
      if (animationEvent.target !== buran) return;
      buran.remove();
      if (playCompletionSound) {
        buranClearSound.currentTime = 0;
        buranClearSound.play().catch(() => {});
      }
      if (showCompletionMessage) {
        showBuranMessage();
      }
    });
    document.body.append(buran);
    if (playLaunchSound) {
      playBuranRocketSound();
    }
  };

  const launchRocketFestival = () => {
    const rockets = shuffled(buranRockets);
    const margin = 16;
    const minimumGap = 12;
    const availableWidth = Math.max(1, window.innerWidth - margin * 2);
    const naturalWidths = rockets.map(
      (rocket) => getRocketMetrics(rocket).shuttleWidth,
    );
    const naturalRocketWidth = naturalWidths.reduce(
      (total, width) => total + width,
      0,
    );
    const festivalScale = Math.min(
      1,
      (availableWidth - minimumGap * (rockets.length - 1)) /
        naturalRocketWidth,
    );
    const safeScale = Math.max(0.2, festivalScale);
    const widths = rockets.map(
      (rocket) => getRocketMetrics(rocket, safeScale).shuttleWidth,
    );
    const rocketWidth = widths.reduce((total, width) => total + width, 0);
    const gap = Math.max(
      2,
      (availableWidth - rocketWidth) / (rockets.length + 1),
    );
    let cursor = margin + gap;
    let delay = 0;

    rockets.forEach((rocket, index) => {
      const center = cursor + widths[index] / 2;
      const showCompletionMessage = index === rockets.length - 1;
      const playLaunchSound = index === 0;
      const playCompletionSound = index === rockets.length - 1;
      window.setTimeout(
        () =>
          launchRocket(
            rocket,
            center,
            safeScale,
            showCompletionMessage,
            playLaunchSound,
            playCompletionSound,
          ),
        delay,
      );
      cursor += widths[index] + gap;
      delay += 90 + Math.random() * 130;
    });
  };

  document.addEventListener("rocketfestival", launchRocketFestival);

  document.addEventListener("keydown", (event) => {
    const key =
      event.key.length === 1 ? event.key.toLocaleLowerCase() : event.key;
    if (/^[a-z]$/.test(key)) {
      hadookenBuffer = `${hadookenBuffer}${key}`.slice(
        -hadoukenSequenceLength,
      );
      rocketFestivalBuffer = `${rocketFestivalBuffer}${key}`.slice(
        -rocketFestivalSequence.length,
      );
      if (hadoukenSequences.includes(hadookenBuffer)) {
        document.body.classList.toggle("hadooken-mode");
        hadookenBuffer = "";
      }
      if (rocketFestivalBuffer === rocketFestivalSequence) {
        document.dispatchEvent(new Event("rocketfestival"));
        rocketFestivalBuffer = "";
      }
    } else if (!key.startsWith("Arrow")) {
      hadookenBuffer = "";
      rocketFestivalBuffer = "";
    }

    if (key === konamiSequence[konamiPosition]) {
      if (konamiPosition >= 1 && key.startsWith("Arrow")) {
        event.preventDefault();
      }
      konamiPosition += 1;
      if (konamiPosition < konamiSequence.length) return;

      konamiPosition = 0;
      launchRocket();
      return;
    }

    konamiPosition = key === konamiSequence[0] ? 1 : 0;
  });

  document
    .querySelectorAll('a[href^="apps/"], a[href^="games/chris-and-triss/"]')
    .forEach((link) => {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    });

  const menuButton = document.getElementById("hamburger-icon");
  const closeButton = document.getElementById("close-icon");
  const menuContainer = document.getElementById("site-menu");
  const accordions = document.querySelectorAll(".accordion");
  const modal = document.getElementById("imageModal");
  const modalImage = document.getElementById("modalImage");
  const modalCloseButton = modal?.querySelector(".close");
  const introPortrait = document.getElementById("intro-portrait");
  const introRotateButton = document.getElementById("intro-rotate-button");
  const introAudioButton = document.getElementById("intro-audio-button");
  const introAudio = document.getElementById("intro-audio");
  const introQuartet = document.getElementById("intro-quartet");
  const introSingers = Array.from(
    introQuartet?.querySelectorAll(".intro-singer") || [],
  );
  const introLetterOverlays = Array.from(
    introPortrait?.querySelectorAll(".intro-letter-overlays img") || [],
  );
  let lastFocusedElement = null;

  introRotateButton?.addEventListener("click", () => {
    if (introAudioStarting || (introAudio && !introAudio.paused)) return;
    const isRotated = introPortrait.classList.toggle("is-rotated");
    introRotateButton.setAttribute("aria-pressed", String(isRotated));
  });
  introPortrait?.addEventListener("pointerleave", (event) => {
    if (event.pointerType !== "mouse") return;
    const focusedControl = introPortrait.querySelector(":focus");
    focusedControl?.blur();
  });

  const introQuartetOutline = introQuartet?.cloneNode(true);
  introQuartetOutline?.removeAttribute("id");
  introQuartetOutline?.classList.add("intro-quartet--outline");
  introQuartetOutline?.setAttribute("aria-hidden", "true");
  introQuartetOutline
    ?.querySelectorAll("[role], [aria-label]")
    .forEach((element) => {
      element.removeAttribute("role");
      element.removeAttribute("aria-label");
    });
  introQuartet?.before(introQuartetOutline);
  const introOutlineSingers = Array.from(
    introQuartetOutline?.querySelectorAll(".intro-singer") || [],
  );
  const introBands = [
    [20, 180],
    [180, 500],
    [500, 2000],
    [2000, 8000],
  ];
  const introCueTimes = [0.05, 0.88, 1.56, 2.28, 3.04, 3.74, 4.52];
  const introCueDurations = [0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 1.2];
  const introEnergy = [0, 0, 0, 0];
  let introAudioContext;
  let introAnalyser;
  let introAudioSource;
  let introFrequencyData;
  let introAnalysisAvailable = false;
  let introAnimationFrame;
  let introLetterFrame;
  let introTransitionTimer;
  let introRotationTimer;
  let introOverlayTimer;
  let introOverlayCleanupTimer;
  let introAudioStarting = false;

  const setIntroAudioPlaying = (isPlaying) => {
    if (!introPortrait || !introAudioButton) return;
    introPortrait.classList.toggle("is-audio-playing", isPlaying);
    introAudioButton.classList.toggle("is-stop", isPlaying);
    introAudioButton.setAttribute("aria-pressed", String(isPlaying));
    introAudioButton.setAttribute(
      "aria-label",
      isPlaying ? "Stop Tolstoj's song" : "Play Tolstoj's song",
    );
    const icon = introAudioButton.querySelector("span");
    if (icon) icon.textContent = isPlaying ? "■" : "▶";
  };

  const clearIntroPerformanceTimers = () => {
    clearTimeout(introRotationTimer);
    clearTimeout(introOverlayTimer);
    clearTimeout(introOverlayCleanupTimer);
    cancelAnimationFrame(introLetterFrame);
    introLetterFrame = undefined;
    introPortrait?.classList.remove(
      "is-intro-overlay",
      "is-overlay-dismissing",
      "is-overlay-dismissed",
    );
    introLetterOverlays.forEach((overlay) =>
      overlay.classList.remove("is-visible"),
    );
    if (introRotateButton) introRotateButton.disabled = false;
  };

  const updateIntroLetterCues = () => {
    introLetterOverlays.forEach((overlay, index) => {
      overlay.classList.toggle(
        "is-visible",
        introAudio.currentTime >= introCueTimes[index] &&
          introAudio.currentTime <
            introCueTimes[index] + introCueDurations[index],
      );
    });
    if (!introAudio.paused && introAudio.currentTime < 7) {
      introLetterFrame = requestAnimationFrame(updateIntroLetterCues);
    }
  };

  const startIntroLogoSequence = () => {
    clearIntroPerformanceTimers();
    introPortrait.classList.add("is-resetting-logo");
    introPortrait.classList.remove("is-rotated");
    introRotateButton.setAttribute("aria-pressed", "false");
    requestAnimationFrame(() => {
      introPortrait.classList.remove("is-resetting-logo");
    });
    introPortrait.classList.add("is-intro-overlay");
    introRotateButton.disabled = true;
    updateIntroLetterCues();

    introRotationTimer = setTimeout(() => {
      introPortrait.classList.add("is-rotated");
      introRotateButton.setAttribute("aria-pressed", "true");
    }, 7000);
    introOverlayTimer = setTimeout(() => {
      introPortrait.classList.remove("is-intro-overlay");
      introPortrait.classList.add("is-overlay-dismissing");
      introOverlayCleanupTimer = setTimeout(() => {
        introPortrait.classList.remove("is-overlay-dismissing");
        introPortrait.classList.add("is-overlay-dismissed");
      }, 1350);
    }, 8000);
  };

  const setupIntroAudioGraph = () => {
    if (introAudioContext) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    try {
      introAudioContext = new AudioContext();
      introAnalyser = introAudioContext.createAnalyser();
      introAnalyser.fftSize = 2048;
      introAnalyser.smoothingTimeConstant = 0.68;
      introFrequencyData = new Uint8Array(introAnalyser.frequencyBinCount);
      if (location.protocol !== "file:") {
        introAudioSource =
          introAudioContext.createMediaElementSource(introAudio);
        introAudioSource.connect(introAnalyser);
        introAnalyser.connect(introAudioContext.destination);
        introAnalysisAvailable = true;
      }
    } catch (error) {
      introAnalysisAvailable = false;
      console.warn("Portrait audio analysis is unavailable.", error);
    }
  };

  const getIntroBandEnergy = (lowFrequency, highFrequency) => {
    const nyquist = introAudioContext.sampleRate / 2;
    const firstBin = Math.max(
      1,
      Math.floor((lowFrequency / nyquist) * introFrequencyData.length),
    );
    const lastBin = Math.min(
      introFrequencyData.length - 1,
      Math.ceil((highFrequency / nyquist) * introFrequencyData.length),
    );
    let total = 0;
    let peak = 0;
    let count = 0;
    for (let index = firstBin; index <= lastBin; index += 1) {
      const value = introFrequencyData[index] / 255;
      total += value * value;
      peak = Math.max(peak, value);
      count += 1;
    }
    if (!count) return 0;
    return Math.min(1, Math.sqrt(total / count) * 1.65 + peak * 0.28);
  };

  const animateIntroSingers = () => {
    const time = performance.now() / 1000;
    if (introAnalysisAvailable) {
      introAnalyser.getByteFrequencyData(introFrequencyData);
    }
    const hasAnalysis =
      introAnalysisAvailable && introFrequencyData.some((value) => value > 3);
    introSingers.forEach((singer, index) => {
      const measured = hasAnalysis
        ? getIntroBandEnergy(...introBands[index])
        : 0.28 +
          Math.max(0, Math.sin(time * (2.35 + index * 0.18) + index * 0.8)) *
            0.48;
      const release = measured > introEnergy[index] ? 0.48 : 0.14;
      introEnergy[index] += (measured - introEnergy[index]) * release;
      const energy = Math.max(0, Math.min(1, introEnergy[index]));
      singer.style.setProperty(
        "--lift",
        `${(-energy * (6.5 + index * 0.55)).toFixed(2)}px`,
      );
      singer.style.setProperty(
        "--drift",
        `${(
          Math.sin(time * (1.15 + index * 0.07) + index * 1.4) *
          energy *
          0.8
        ).toFixed(2)}px`,
      );
      singer.style.setProperty("--mouth", `${(1 + energy * 4.5).toFixed(2)}px`);
      if (introOutlineSingers[index]) {
        introOutlineSingers[index].style.cssText = singer.style.cssText;
      }
    });
    introAnimationFrame = requestAnimationFrame(animateIntroSingers);
  };

  const resetIntroSingers = () => {
    cancelAnimationFrame(introAnimationFrame);
    introAnimationFrame = undefined;
    introEnergy.fill(0);
    introSingers.forEach((singer, index) => {
      singer.style.setProperty("--lift", "0px");
      singer.style.setProperty("--drift", "0px");
      singer.style.setProperty("--mouth", "1px");
      if (introOutlineSingers[index]) {
        introOutlineSingers[index].style.cssText = singer.style.cssText;
      }
    });
  };

  const showIntroSingers = () => {
    clearTimeout(introTransitionTimer);
    introQuartet?.classList.add("is-visible");
    introQuartetOutline?.classList.add("is-visible");
    introQuartet?.setAttribute("aria-hidden", "false");
    return new Promise((resolve) => {
      introTransitionTimer = setTimeout(resolve, 480);
    });
  };

  const hideIntroSingers = () => {
    clearTimeout(introTransitionTimer);
    introQuartet?.classList.remove("is-visible");
    introQuartetOutline?.classList.remove("is-visible");
    introQuartet?.setAttribute("aria-hidden", "true");
    introTransitionTimer = setTimeout(resetIntroSingers, 480);
  };

  const stopIntroPerformance = () => {
    introAudio.pause();
    introAudio.currentTime = 0;
    introAudio.volume = 1;
    clearIntroPerformanceTimers();
    setIntroAudioPlaying(false);
    hideIntroSingers();
  };

  introAudioButton?.addEventListener("click", async () => {
    if (!introAudio || introAudioStarting) return;
    if (!introAudio.paused) {
      stopIntroPerformance();
      return;
    }
    introAudioStarting = true;
    introAudioButton.disabled = true;
    introRotateButton.disabled = true;
    introPortrait.classList.add("is-intro-overlay");
    setIntroAudioPlaying(true);
    try {
      setupIntroAudioGraph();
      await introAudioContext?.resume();
      introAudio.volume = 0;
      await introAudio.play();
      await showIntroSingers();
      introAudio.currentTime = 0;
      introAudio.volume = 1;
      startIntroLogoSequence();
      if (!introAnimationFrame) animateIntroSingers();
    } catch {
      introAudio.pause();
      introAudio.currentTime = 0;
      introAudio.volume = 1;
      clearIntroPerformanceTimers();
      setIntroAudioPlaying(false);
      hideIntroSingers();
    } finally {
      introAudioStarting = false;
      introAudioButton.disabled = false;
    }
  });
  introAudio?.addEventListener("ended", () => {
    clearIntroPerformanceTimers();
    setIntroAudioPlaying(false);
    hideIntroSingers();
  });

  const setMenuOpen = (isOpen) => {
    if (!menuContainer || !menuButton || !closeButton) return;
    menuContainer.classList.toggle("active", isOpen);
    document.body.classList.toggle("menu-open", isOpen);
    menuContainer.setAttribute("aria-hidden", String(!isOpen));
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");

    if (isOpen) {
      closeButton.focus();
    } else if (menuContainer.contains(document.activeElement)) {
      menuButton.focus();
    }
  };

  if (menuContainer) {
    const closePersistentMenuOnMobile =
      menuContainer.hasAttribute("data-persistent") &&
      window.matchMedia("(max-width: 999px)").matches;
    if (closePersistentMenuOnMobile) {
      setMenuOpen(false);
    } else {
      document.body.classList.toggle(
        "menu-open",
        menuContainer.classList.contains("active"),
      );
    }
  }

  menuButton?.addEventListener("click", () => {
    setMenuOpen(!menuContainer.classList.contains("active"));
  });

  closeButton?.addEventListener("click", () => setMenuOpen(false));

  accordions.forEach((accordion) => {
    accordion.addEventListener("click", () => {
      const submenu = accordion.nextElementSibling;
      if (!submenu?.classList.contains("menu")) return;

      const isOpen = submenu.classList.toggle("active");
      accordion.classList.toggle("active", isOpen);
      accordion.setAttribute("aria-expanded", String(isOpen));

      const arrow = accordion.querySelector(".arrow");
      if (arrow) arrow.textContent = isOpen ? "−" : "+";
    });
  });

  document.addEventListener("click", (event) => {
    if (
      menuContainer &&
      menuButton &&
      !menuContainer.hasAttribute("data-persistent") &&
      menuContainer.classList.contains("active") &&
      !menuContainer.contains(event.target) &&
      !menuButton.contains(event.target)
    ) {
      setMenuOpen(false);
    }
  });

  document.querySelectorAll(".clickable").forEach((image) => {
    image.addEventListener("click", () => {
      if (!modal || !modalImage) return;
      lastFocusedElement = document.activeElement;
      modalImage.src = image.src;
      modal.style.display = "flex";
      modal.setAttribute("aria-hidden", "false");
      modalCloseButton?.focus();
    });
  });

  document.querySelectorAll(".grid-item-clickable").forEach((card) => {
    const media = Array.from(card.children).find((child) =>
      child.matches("img, .project-card-art"),
    );
    const description = Array.from(card.children).find((child) =>
      child.matches("p"),
    );
    if (!media || !description?.textContent.trim()) return;

    const mediaStage = document.createElement("div");
    mediaStage.className = "card-media";
    card.insertBefore(mediaStage, media);
    mediaStage.append(media, description);
    addMobileCardInfo(card, mediaStage);
  });

  function addMobileCardInfo(card, container) {
    if (!card || !container || card.querySelector(".mobile-card-info")) return;
    const button = document.createElement("button");
    button.className = "mobile-card-info";
    button.type = "button";
    button.textContent = "i";
    button.setAttribute("aria-label", "Show card information");
    button.setAttribute("aria-pressed", "false");
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const willOpen = !card.classList.contains("show-mobile-description");
      document
        .querySelectorAll(".show-mobile-description")
        .forEach((openCard) => {
          openCard.classList.remove("show-mobile-description");
          openCard
            .querySelector(".mobile-card-info")
            ?.setAttribute("aria-pressed", "false");
        });
      card.classList.toggle("show-mobile-description", willOpen);
      button.setAttribute("aria-pressed", String(willOpen));
      button.setAttribute(
        "aria-label",
        willOpen ? "Hide card information" : "Show card information",
      );
    });
    container.append(button);
  }

  document.addEventListener("click", (event) => {
    if (event.target.closest(".show-mobile-description")) return;
    document.querySelectorAll(".show-mobile-description").forEach((card) => {
      card.classList.remove("show-mobile-description");
      card
        .querySelector(".mobile-card-info")
        ?.setAttribute("aria-pressed", "false");
    });
  });

  const expandablePanels = [];
  const createDirectoryDivider = () => {
    const divider = document.createElement("hr");
    divider.className = "directory-divider";
    divider.setAttribute("aria-hidden", "true");
    return divider;
  };
  const getDirectoryFirstRowSize = () => {
    if (window.innerWidth <= 480) return 2;
    if (window.innerWidth <= 700) return 3;
    if (window.innerWidth <= 900) return 4;
    return 5;
  };
  const getStandardGridFirstRowSize = () => {
    const availableWidth = Math.max(0, Math.min(1000, window.innerWidth - 40));
    return Math.max(1, Math.floor((availableWidth + 20) / 270));
  };

  document.querySelectorAll(".grid.accordion-panel").forEach((panel) => {
    const items = Array.from(panel.children);
    if (items.length < 2) return;

    const showMoreButton = document.createElement("button");
    showMoreButton.className = "accordion-show-more";
    showMoreButton.type = "button";
    showMoreButton.textContent = "Show all";
    showMoreButton.setAttribute("aria-expanded", "false");
    panel.append(showMoreButton);

    let collapseFrame;
    const collapseToFirstRow = () => {
      cancelAnimationFrame(collapseFrame);
      collapseFrame = requestAnimationFrame(() => {
        const firstRowSize = getStandardGridFirstRowSize();
        const hasMore = firstRowSize < items.length;

        items.forEach((item, index) => {
          item.hidden = hasMore && index >= firstRowSize;
        });

        showMoreButton.hidden = !hasMore;
        showMoreButton.textContent = "Show all";
        showMoreButton.setAttribute("aria-expanded", "false");
      });
    };

    showMoreButton.addEventListener("click", () => {
      const hiddenItems = items.filter((item) => item.hidden);
      hiddenItems.forEach((item, index) => {
        item.hidden = false;
        item.classList.remove("accordion-reveal-item");
        item.style.animationDelay = `${Math.min(index * 45, 270)}ms`;
        item.classList.add("accordion-reveal-item");
        item.addEventListener(
          "animationend",
          () => {
            item.classList.remove("accordion-reveal-item");
            item.style.removeProperty("animation-delay");
          },
          { once: true },
        );
      });
      showMoreButton.setAttribute("aria-expanded", "true");
      showMoreButton.hidden = true;
    });

    collapseToFirstRow();
    expandablePanels.push({
      panel,
      items,
      button: showMoreButton,
      collapseToFirstRow,
    });
  });

  expandablePanels
    .filter(({ panel }) =>
      ["projects-panel", "games-patches-panel", "articles-panel"].includes(
        panel.id,
      ),
    )
    .forEach(({ panel, items, button, collapseToFirstRow }) => {
      const controls = document.createElement("div");
      controls.className = "directory-controls";

      const search = document.createElement("input");
      search.className = "directory-search";
      search.type = "search";
      search.id = `${panel.id}-search`;
      search.name = `${panel.id}-search`;
      search.placeholder = {
        "projects-panel": "Search tools…",
        "games-patches-panel": "Search games and patches…",
        "articles-panel": "Search articles…",
      }[panel.id];
      search.setAttribute("aria-label", search.placeholder);

      const resultCount = document.createElement("span");
      resultCount.className = "directory-result-count";
      resultCount.setAttribute("aria-live", "polite");
      controls.append(search, resultCount, createDirectoryDivider());
      panel.prepend(controls);

      search.addEventListener("input", () => {
        const query = search.value.trim().toLocaleLowerCase();
        if (!query) {
          resultCount.textContent = "";
          collapseToFirstRow();
          return;
        }

        let matches = 0;
        items.forEach((item) => {
          const isMatch = item.textContent.toLocaleLowerCase().includes(query);
          item.hidden = !isMatch;
          if (isMatch) matches += 1;
        });
        button.hidden = true;
        resultCount.textContent = `${matches} result${matches === 1 ? "" : "s"}`;
      });
    });

  let panelResizeTimer;
  window.addEventListener("resize", () => {
    window.clearTimeout(panelResizeTimer);
    panelResizeTimer = window.setTimeout(() => {
      expandablePanels.forEach(({ button, collapseToFirstRow }) => {
        if (button.getAttribute("aria-expanded") === "false") {
          collapseToFirstRow();
        }
      });
    }, 120);
  });

  document.querySelectorAll(".section-accordion").forEach((button) => {
    const panel = document.getElementById(button.getAttribute("aria-controls"));
    if (!panel) return;

    button.addEventListener("click", () => {
      const isOpen = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!isOpen));
      panel.hidden = isOpen;

      const icon = button.querySelector(".section-accordion-icon");
      if (icon) icon.textContent = isOpen ? "+" : "−";
    });
  });

  const gamesPanel = document.getElementById("games-patches-panel");
  const gameModal = document.getElementById("gameModal");
  const gameModalCloseButton = gameModal?.querySelector(".close");
  const gameModalImage = document.getElementById("gameModalImage");
  const gameModalTitle = document.getElementById("gameModalTitle");
  const gameModalDescription = document.getElementById("gameModalDescription");
  const gameModalDownload = document.getElementById("gameModalDownload");
  const gameModalUnavailable = document.getElementById("gameModalUnavailable");
  let lastGameTrigger = null;

  const createGameCard = (entry) => {
    const card = document.createElement("button");
    card.className = "person-card game-directory-card";
    card.type = "button";
    card.dataset.gameName = entry.name;
    card.dataset.gameImage = entry.image;
    card.dataset.gameDescription = entry.description;
    card.dataset.gameLink = entry.link || "";

    const media = document.createElement("span");
    media.className = "person-photo-wrap";

    const image = document.createElement("img");
    image.className = "person-photo";
    image.src = entry.image;
    image.alt = entry.name;
    image.loading = "lazy";
    image.decoding = "async";

    const overlay = document.createElement("span");
    overlay.className = "person-summary";
    const name = document.createElement("span");
    name.className = "person-name";
    name.textContent = entry.name;
    const description = document.createElement("span");
    description.className = "person-details";
    description.textContent = entry.description;
    overlay.append(name, description);
    media.append(image, overlay);
    card.append(media);
    return card;
  };

  const setupGamesDirectory = (entries) => {
    if (!gamesPanel) return;
    const firstRowSize = getDirectoryFirstRowSize();
    const controls = document.createElement("div");
    controls.className = "directory-controls";
    const search = document.createElement("input");
    search.className = "directory-search";
    search.type = "search";
    search.id = "games-patches-search";
    search.name = "games-patches-search";
    search.placeholder = "Search games and patches…";
    search.setAttribute("aria-label", search.placeholder);
    const resultCount = document.createElement("span");
    resultCount.className = "directory-result-count";
    resultCount.setAttribute("aria-live", "polite");
    controls.append(search, resultCount, createDirectoryDivider());
    gamesPanel.append(controls);

    const renderGames = (visibleEntries, showAll = false) => {
      Array.from(gamesPanel.children).forEach((child) => {
        if (child !== controls) child.remove();
      });
      const entriesToRender = showAll
        ? visibleEntries
        : visibleEntries.slice(0, firstRowSize);
      gamesPanel.append(...entriesToRender.map(createGameCard));

      if (visibleEntries.length > firstRowSize && !showAll) {
        const showAllButton = document.createElement("button");
        showAllButton.className = "accordion-show-more";
        showAllButton.type = "button";
        showAllButton.textContent = "Show all";
        showAllButton.setAttribute("aria-expanded", "false");
        showAllButton.addEventListener("click", () => {
          renderGames(visibleEntries, true);
          Array.from(gamesPanel.querySelectorAll(".game-directory-card"))
            .slice(firstRowSize)
            .forEach((card, index) => {
              card.classList.add("accordion-reveal-item");
              card.style.animationDelay = `${Math.min(index * 45, 270)}ms`;
            });
        });
        gamesPanel.append(showAllButton);
      }

      resultCount.textContent = search.value
        ? `${visibleEntries.length} result${visibleEntries.length === 1 ? "" : "s"}`
        : "";
    };

    search.addEventListener("input", () => {
      const query = search.value.trim().toLocaleLowerCase();
      const matches = entries.filter((entry) =>
        `${entry.name} ${entry.description}`
          .toLocaleLowerCase()
          .includes(query),
      );
      renderGames(matches);
    });
    renderGames(entries);
  };

  const loadGamesDirectory = async () => {
    if (!gamesPanel) return;
    const loadFallbackGames = () => {
      const fallback = document.getElementById("games-patches-static-fallback");
      const entries = Array.from(
        fallback?.querySelectorAll(".game-directory-card") || [],
      ).map((card) => ({
        image: card.dataset.gameImage,
        name: card.dataset.gameName,
        description: card.dataset.gameDescription,
        link: card.dataset.gameLink || null,
      }));
      if (entries.length) setupGamesDirectory(entries);
      else gamesPanel.textContent = "Game and patch data could not be loaded.";
    };

    if (location.protocol === "file:") {
      loadFallbackGames();
      return;
    }

    try {
      const response = await fetch("assets/data/games-patches.json");
      if (!response.ok) {
        throw new Error(`Game data returned ${response.status}`);
      }
      setupGamesDirectory(await response.json());
    } catch (error) {
      loadFallbackGames();
      console.warn("Using the embedded games and patches data.", error);
    }
  };

  const closeGameModal = () => {
    if (!gameModal || gameModal.style.display === "none") return;
    gameModal.style.display = "none";
    gameModal.setAttribute("aria-hidden", "true");
    gameModalImage?.removeAttribute("src");
    lastGameTrigger?.focus();
  };

  gamesPanel?.addEventListener("click", (event) => {
    const card = event.target.closest(".game-directory-card");
    if (
      !card ||
      !gameModal ||
      !gameModalImage ||
      !gameModalTitle ||
      !gameModalDescription ||
      !gameModalDownload ||
      !gameModalUnavailable
    )
      return;
    lastGameTrigger = card;
    gameModalImage.src = card.dataset.gameImage;
    gameModalImage.alt = card.dataset.gameName;
    gameModalTitle.textContent = card.dataset.gameName;
    gameModalDescription.textContent = card.dataset.gameDescription;
    const hasDownload = Boolean(card.dataset.gameLink);
    gameModalDownload.hidden = !hasDownload;
    gameModalUnavailable.hidden = hasDownload;
    if (hasDownload) gameModalDownload.href = card.dataset.gameLink;
    else gameModalDownload.removeAttribute("href");
    gameModal.style.display = "flex";
    gameModal.setAttribute("aria-hidden", "false");
    gameModalCloseButton?.focus();
  });

  gameModalCloseButton?.addEventListener("click", closeGameModal);
  gameModal?.addEventListener("click", (event) => {
    if (event.target === gameModal) closeGameModal();
  });
  loadGamesDirectory();

  const impressumModal = document.getElementById("impressumModal");
  const openImpressumButton = document.getElementById("openImpressum");
  const closeImpressumButton = impressumModal?.querySelector(".close");

  const closeImpressum = () => {
    if (!impressumModal || impressumModal.style.display === "none") return;
    impressumModal.style.display = "none";
    impressumModal.setAttribute("aria-hidden", "true");
    openImpressumButton?.focus();
  };

  openImpressumButton?.addEventListener("click", () => {
    if (!impressumModal) return;
    impressumModal.style.display = "flex";
    impressumModal.setAttribute("aria-hidden", "false");
    closeImpressumButton?.focus();
  });

  closeImpressumButton?.addEventListener("click", closeImpressum);
  impressumModal?.addEventListener("click", (event) => {
    if (event.target === impressumModal) closeImpressum();
  });

  const maintenanceModal = document.getElementById("maintenanceModal");
  const maintenanceCloseButton = maintenanceModal?.querySelector(".close");
  const maintenanceDismissButton = maintenanceModal?.querySelector(
    ".maintenance-modal-dismiss",
  );
  const maintenanceStorageKey = "maintenance-notice-dismissed-date";

  const closeMaintenanceModal = () => {
    if (!maintenanceModal || maintenanceModal.style.display === "none") return;
    maintenanceModal.style.display = "none";
    maintenanceModal.setAttribute("aria-hidden", "true");
    try {
      localStorage.setItem(maintenanceStorageKey, "dismissed");
    } catch (error) {
      // The notice still closes when storage is unavailable.
    }
  };

  maintenanceCloseButton?.addEventListener("click", closeMaintenanceModal);
  maintenanceDismissButton?.addEventListener("click", closeMaintenanceModal);
  maintenanceModal?.addEventListener("click", (event) => {
    if (event.target === maintenanceModal) closeMaintenanceModal();
  });
  let maintenanceDismissed = false;
  try {
    // Any existing value counts, including dates stored by the previous
    // once-per-day implementation.
    maintenanceDismissed = Boolean(localStorage.getItem(maintenanceStorageKey));
  } catch (error) {
    // Show the notice normally when storage is unavailable.
  }
  if (maintenanceModal && !maintenanceDismissed) {
    maintenanceModal.style.display = "flex";
    maintenanceModal.setAttribute("aria-hidden", "false");
    maintenanceDismissButton?.focus();
  }

  const personModal = document.getElementById("personModal");
  const personModalCloseButton = personModal?.querySelector(".close");
  const personModalImage = document.getElementById("personModalImage");
  const personModalTitle = document.getElementById("personModalTitle");
  const personModalDetails = document.getElementById("personModalDetails");
  const personModalAchievements = document.getElementById(
    "personModalAchievements",
  );
  const achievementLabels = {
    gold: "Gold medal",
    silver: "Silver medal",
    bronze: "Bronze medal",
    wr: "World record",
    "former-wr": "Former world record",
    vip: "VIP",
  };
  let lastPersonTrigger = null;
  const trophyIcon = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 3h10v3h3a1 1 0 0 1 1 1v2c0 3.1-2.5 5.7-5.6 6A6 6 0 0 1 13 17.9V20h3v2H8v-2h3v-2.1A6 6 0 0 1 8.6 15 6 6 0 0 1 3 9V7a1 1 0 0 1 1-1h3V3Zm0 5H5v1a4 4 0 0 0 3 3.9A6 6 0 0 1 7 9.5V8Zm10 0v1.5a6 6 0 0 1-1 3.4A4 4 0 0 0 19 9V8h-2Z"/>
    </svg>
  `;

  const addAchievementBadges = (card, achievements = []) => {
    const validAchievements = achievements.filter(
      ({ type }) => achievementLabels[type],
    );
    if (!validAchievements.length) return;

    const container = document.createElement("button");
    container.className = "person-achievements";
    container.type = "button";
    const tooltip = document.createElement("span");
    tooltip.className = "achievement-tooltip";

    const groupedAchievements = new Map();
    validAchievements.forEach((achievement) => {
      const group = groupedAchievements.get(achievement.type) || [];
      group.push(achievement);
      groupedAchievements.set(achievement.type, group);
    });

    groupedAchievements.forEach((achievements, type) => {
      const group = document.createElement("span");
      group.className = "achievement-tooltip-group";
      const category = document.createElement("strong");
      category.textContent =
        achievements.length > 1 || achievements[0].event
          ? `${achievementLabels[type]}:`
          : achievementLabels[type];
      group.append(category);

      if (achievements.length === 1) {
        if (achievements[0].event) {
          group.append(document.createTextNode(` ${achievements[0].event}`));
        }
      } else {
        const eventList = document.createElement("ul");
        eventList.className = "achievement-tooltip-events";
        achievements.forEach(({ event }) => {
          const item = document.createElement("li");
          item.textContent = event || "Event not specified";
          eventList.append(item);
        });
        group.append(eventList);
      }
      tooltip.append(group);
    });

    const tooltipText = Array.from(groupedAchievements.entries())
      .map(([type, achievements]) => {
        const events = achievements
          .map(({ event }) => event || "Event not specified")
          .join(", ");
        return `${achievementLabels[type]}: ${events}`;
      })
      .join("; ");
    container.setAttribute("aria-label", `Achievements: ${tooltipText}`);
    container.setAttribute("aria-expanded", "false");
    container.append(tooltip);

    const priority = ["gold", "silver", "bronze", "wr", "vip", "former-wr"];
    const primaryType = priority.find((type) =>
      validAchievements.some((achievement) => achievement.type === type),
    );
    const primaryAchievement = validAchievements.find(
      ({ type }) => type === primaryType,
    );
    const badge = document.createElement("span");
    const description = primaryAchievement.event
      ? `${achievementLabels[primaryType]}: ${primaryAchievement.event}`
      : achievementLabels[primaryType];
    badge.className = `person-achievement person-achievement--${primaryType}`;
    badge.setAttribute("role", "img");
    badge.setAttribute("aria-label", description);
    badge.innerHTML = ["gold", "silver", "bronze"].includes(primaryType)
      ? trophyIcon
      : primaryType === "former-wr"
        ? "FWR"
        : primaryType.toUpperCase();
    container.append(badge);
    container.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const willOpen = !container.classList.contains(
        "show-achievement-tooltip",
      );
      document
        .querySelectorAll(".person-achievements.show-achievement-tooltip")
        .forEach((openBadge) => {
          openBadge.classList.remove("show-achievement-tooltip");
          openBadge.setAttribute("aria-expanded", "false");
        });
      container.classList.toggle("show-achievement-tooltip", willOpen);
      container.setAttribute("aria-expanded", String(willOpen));
    });

    card.querySelector(".person-photo-wrap")?.append(container);
  };

  document.addEventListener("click", (event) => {
    if (event.target.closest(".person-achievements")) return;
    document
      .querySelectorAll(".person-achievements.show-achievement-tooltip")
      .forEach((badge) => {
        badge.classList.remove("show-achievement-tooltip");
        badge.setAttribute("aria-expanded", "false");
      });
  });

  document
    .querySelectorAll(".person-card[data-achievement], .person-card[data-vip]")
    .forEach((card) => {
      const achievements = [];
      if (card.dataset.achievement) {
        achievements.push({
          type: card.dataset.achievement,
          event: card.dataset.achievementEvent,
        });
      }
      if (card.dataset.vip === "true") {
        achievements.push({
          type: "vip",
          event: card.dataset.vipEvent,
        });
      }
      addAchievementBadges(card, achievements);
    });

  const closePersonModal = () => {
    if (!personModal || personModal.style.display === "none") return;
    personModal.style.display = "none";
    personModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    lastPersonTrigger?.focus();
  };

  const peoplePanel = document.getElementById("people-panel");
  const peopleCount = document.getElementById("people-count");
  const peopleRankingsLink = document.getElementById("people-rankings-link");

  peoplePanel?.addEventListener("click", (event) => {
    if (event.target.closest(".person-flags")) return;
    const card = event.target.closest(".person-card");
    if (
      !card ||
      !personModal ||
      !personModalImage ||
      !personModalTitle ||
      !personModalDetails ||
      !personModalAchievements
    )
      return;

    lastPersonTrigger = card;
    personModalImage.src = card.dataset.personImage;
    personModalImage.alt = card.dataset.personName;
    personModalTitle.textContent = card.dataset.personName;
    personModalDetails.textContent = card.dataset.personDetails;
    personModalAchievements.replaceChildren();
    const achievements = JSON.parse(card.dataset.personAchievements || "[]");
    achievements.forEach(({ type, event: achievementEvent }) => {
      const item = document.createElement("li");
      const label = achievementLabels[type] || type;
      item.textContent = achievementEvent
        ? `${label}: ${achievementEvent}`
        : label;
      personModalAchievements.append(item);
    });
    personModalAchievements.hidden = achievements.length === 0;
    personModal.style.display = "flex";
    personModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    personModalCloseButton?.focus();
  });

  peoplePanel?.addEventListener("keydown", (event) => {
    const card = event.target.closest(".person-card");
    if (
      !card ||
      event.target.closest(".person-flags") ||
      !["Enter", " "].includes(event.key)
    )
      return;
    event.preventDefault();
    card.click();
  });

  const createPersonCard = (player, countries) => {
    const card = document.createElement("div");
    card.className = "person-card";
    card.classList.toggle(
      "person-card--highlighted",
      Boolean(player.highlighted),
    );
    card.setAttribute("role", "button");
    card.tabIndex = 0;
    card.dataset.personName = player.name;
    const portraitFile = window.PLAYER_IMAGE_FILES?.[player.id];
    card.dataset.personImage = portraitFile
      ? `assets/images/people/${portraitFile}`
      : "assets/images/people/default.svg";
    card.dataset.personDetails = player.details || player.summary || "";
    card.dataset.personAchievements = JSON.stringify(player.achievements || []);

    const photoWrap = document.createElement("span");
    photoWrap.className = "person-photo-wrap";

    const portrait = document.createElement("img");
    portrait.className = "person-photo";
    portrait.src = card.dataset.personImage;
    portrait.alt = player.name;
    portrait.loading = "lazy";
    portrait.decoding = "async";
    portrait.addEventListener(
      "error",
      () => {
        const fallbackImage = "assets/images/people/default.svg";
        portrait.src = fallbackImage;
        card.dataset.personImage = fallbackImage;
      },
      { once: true },
    );

    const summary = document.createElement("span");
    summary.className = "person-summary";

    const name = document.createElement("span");
    name.className = "person-name";
    name.textContent = player.name;

    const details = document.createElement("span");
    details.className = "person-details";
    details.textContent = player.summary || "More information coming soon.";
    summary.append(name, details);

    const countryCodes = [
      player.country || "unknown",
      player.secondaryCountry,
    ].filter(Boolean);
    let activeCountry = 0;
    const flagControl = document.createElement("button");
    flagControl.className = "person-flags";
    flagControl.type = "button";
    if (countryCodes.length > 1) {
      flagControl.classList.add("person-flags--multiple");
    }

    const flags = countryCodes.map((countryCode) => {
      const countryName = countries[countryCode] || "Unknown";
      const flag = document.createElement("img");
      flag.className = "person-flag";
      flag.src = `assets/images/flags/${countryCode}.svg`;
      flag.alt =
        countryCode === "unknown"
          ? "Unknown country"
          : `Flag of ${countryName}`;
      flag.loading = "lazy";
      flag.decoding = "async";
      flag.addEventListener(
        "error",
        () => {
          flag.src = "assets/images/flags/unknown.svg";
          flag.alt = "Unknown country";
        },
        { once: true },
      );
      return flag;
    });

    const showCountry = (index) => {
      activeCountry = index;
      const countryCode = countryCodes[activeCountry] || "unknown";
      const countryName = countries[countryCode] || "Unknown";
      flags.forEach((flag, flagIndex) => {
        flag.classList.toggle(
          "person-flag--active",
          flagIndex === activeCountry,
        );
      });
      flagControl.title =
        countryCodes.length > 1
          ? `${countryName} — click to show ${
              countries[
                countryCodes[(activeCountry + 1) % countryCodes.length]
              ] || "the other country"
            }`
          : countryName;
      flagControl.setAttribute("aria-label", flagControl.title);
    };

    flagControl.addEventListener("click", (event) => {
      event.stopPropagation();
      if (countryCodes.length < 2) return;
      showCountry((activeCountry + 1) % countryCodes.length);
    });
    flagControl.append(...flags);
    showCountry(0);

    photoWrap.append(portrait, summary, flagControl);
    card.append(photoWrap);
    addAchievementBadges(card, player.achievements || []);
    return card;
  };

  let multiFilterSequence = 0;
  const createMultiFilter = (label, options, { searchable = false } = {}) => {
    multiFilterSequence += 1;
    const filterId = `multi-filter-${multiFilterSequence}`;
    const filter = document.createElement("div");
    filter.className = "multi-filter";
    const trigger = searchable
      ? document.createElement("div")
      : document.createElement("button");
    trigger.className = "multi-filter-trigger";
    if (!searchable) trigger.type = "button";
    trigger.setAttribute("aria-controls", `${filterId}-options`);
    trigger.setAttribute("aria-expanded", "false");
    const optionList = document.createElement("div");
    optionList.className = "multi-filter-options";
    optionList.id = `${filterId}-options`;
    optionList.hidden = true;
    const clearButton = document.createElement("button");
    clearButton.className = "multi-filter-clear";
    clearButton.type = "button";
    clearButton.textContent = "Deselect all";
    clearButton.disabled = true;

    let optionSearch = null;
    let searchClearButton = null;
    if (searchable) {
      optionSearch = document.createElement("input");
      optionSearch.className =
        "multi-filter-search multi-filter-search--summary";
      optionSearch.type = "search";
      optionSearch.id = `${filterId}-search`;
      optionSearch.name = `${filterId}-search`;
      optionSearch.autocomplete = "off";
      optionSearch.placeholder = `All ${label.toLocaleLowerCase()}`;
      optionSearch.setAttribute(
        "aria-label",
        `Search ${label.toLocaleLowerCase()}`,
      );
      searchClearButton = document.createElement("button");
      searchClearButton.className = "multi-filter-search-clear";
      searchClearButton.type = "button";
      searchClearButton.setAttribute(
        "aria-label",
        `Clear ${label.toLocaleLowerCase()} search`,
      );
      searchClearButton.textContent = "×";
      searchClearButton.hidden = true;
      trigger.append(optionSearch, searchClearButton);
    } else {
      trigger.textContent = `All ${label.toLocaleLowerCase()}`;
    }
    optionList.append(clearButton);

    options.forEach(({ value, text }, optionIndex) => {
      const option = document.createElement("label");
      option.className = "multi-filter-option";
      option.dataset.filterText = text.toLocaleLowerCase();
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = `${filterId}-option-${optionIndex + 1}`;
      checkbox.name = `${filterId}-options`;
      checkbox.value = value;
      option.append(checkbox, document.createTextNode(text));
      optionList.append(option);
    });

    const setOpen = (isOpen) => {
      filter.classList.toggle("is-open", isOpen);
      trigger.setAttribute("aria-expanded", String(isOpen));
      optionList.hidden = !isOpen;
    };

    if (searchable) {
      optionSearch.addEventListener("focus", () => setOpen(true));
      optionSearch.addEventListener("click", () => setOpen(true));
    } else {
      trigger.addEventListener("click", () => {
        setOpen(!filter.classList.contains("is-open"));
      });
    }

    const filterOptionsBySearch = () => {
      const query = optionSearch.value.trim().toLocaleLowerCase();
      setOpen(true);
      optionList.querySelectorAll(".multi-filter-option").forEach((option) => {
        option.hidden =
          Boolean(query) && !option.dataset.filterText.includes(query);
      });
      searchClearButton.hidden = !query;
      filter.dispatchEvent(new Event("change", { bubbles: true }));
    };
    optionSearch?.addEventListener("input", filterOptionsBySearch);
    optionSearch?.addEventListener("search", filterOptionsBySearch);
    searchClearButton?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      optionSearch.value = "";
      filterOptionsBySearch();
      optionSearch.focus();
    });

    const updateFilterLabel = () => {
      const count = getValues().length;
      const text = count
        ? `${label}: ${count} selected`
        : `All ${label.toLocaleLowerCase()}`;
      if (optionSearch) {
        optionSearch.placeholder = text;
      } else {
        trigger.textContent = text;
      }
      clearButton.disabled = count === 0;
    };

    const getValues = () =>
      Array.from(optionList.querySelectorAll("input:checked")).map(
        ({ value }) => value,
      );

    optionList.addEventListener("change", () => {
      updateFilterLabel();
    });

    clearButton.addEventListener("click", () => {
      optionList.querySelectorAll("input:checked").forEach((checkbox) => {
        checkbox.checked = false;
      });
      updateFilterLabel();
      filter.dispatchEvent(new Event("change", { bubbles: true }));
    });

    filter.append(trigger, optionList);
    return {
      element: filter,
      getValues,
      getSearchQuery: () =>
        optionSearch?.value.trim().toLocaleLowerCase() || "",
    };
  };

  document.addEventListener("click", (event) => {
    document.querySelectorAll(".multi-filter.is-open").forEach((filter) => {
      if (filter.contains(event.target)) return;
      filter.classList.remove("is-open");
      filter
        .querySelector(".multi-filter-trigger")
        ?.setAttribute("aria-expanded", "false");
      const options = filter.querySelector(".multi-filter-options");
      if (options) options.hidden = true;
    });
  });

  const loadPlayers = async () => {
    if (!peoplePanel) return;

    try {
      const playerData =
        location.protocol === "file:"
          ? window.PLAYER_DATA
          : await fetch("assets/data/players.json?v=20260727-5")
              .then((response) => {
                if (!response.ok) {
                  throw new Error(`Player data returned ${response.status}`);
                }
                return response.json();
              })
              .catch((error) => {
                if (window.PLAYER_DATA) return window.PLAYER_DATA;
                throw error;
              });
      if (!playerData) {
        throw new Error("No player data is available.");
      }
      const countries = playerData.countries || {};
      const players = (
        Array.isArray(playerData) ? playerData : playerData.players || []
      ).map((player) => ({
        ...player,
        aliases: [...(player.aliases || [])],
        achievements: [...(player.achievements || [])],
      }));
      players.sort(
        (first, second) =>
          Number(Boolean(second.highlighted)) -
            Number(Boolean(first.highlighted)) ||
          (first.highlighted && second.highlighted
            ? (first.highlightOrder ?? Number.MAX_SAFE_INTEGER) -
              (second.highlightOrder ?? Number.MAX_SAFE_INTEGER)
            : 0) ||
          first.name.localeCompare(second.name, undefined, {
            sensitivity: "base",
          }),
      );
      if (peopleCount) peopleCount.textContent = `(${players.length})`;
      const firstRowSize = getDirectoryFirstRowSize();
      const controls = document.createElement("div");
      controls.className = "directory-controls directory-controls--people";

      const search = document.createElement("input");
      search.className = "directory-search";
      search.type = "search";
      search.id = "people-search";
      search.name = "people-search";
      search.placeholder = "Search people…";
      search.setAttribute("aria-label", "Search people");

      const achievementFilter = createMultiFilter("Badges", [
        { value: "gold", text: "Gold" },
        { value: "silver", text: "Silver" },
        { value: "bronze", text: "Bronze" },
        { value: "vip", text: "VIP" },
      ]);

      const countryOptions = Array.from(
        new Set(
          players.flatMap(({ country, secondaryCountry }) =>
            [country, secondaryCountry].filter(Boolean),
          ),
        ),
      )
        .map((code) => [code, countries[code] || "Unknown"])
        .sort((a, b) => a[1].localeCompare(b[1]));
      const countryFilter = createMultiFilter(
        "Countries",
        countryOptions.map(([value, text]) => ({ value, text })),
        { searchable: true },
      );

      const resultCount = document.createElement("span");
      resultCount.className = "directory-result-count";
      resultCount.setAttribute("aria-live", "polite");
      controls.append(
        search,
        achievementFilter.element,
        countryFilter.element,
        resultCount,
        createDirectoryDivider(),
      );

      const renderPlayers = (visiblePlayers, showAll = false) => {
        const playersToRender = showAll
          ? visiblePlayers
          : visiblePlayers.slice(0, firstRowSize);
        const cards = playersToRender.map((player) =>
          createPersonCard(player, countries),
        );
        Array.from(peoplePanel.children).forEach((child) => {
          if (child !== controls && child !== peopleRankingsLink)
            child.remove();
        });
        peoplePanel.append(...cards);

        if (visiblePlayers.length > firstRowSize && !showAll) {
          const showAllButton = document.createElement("button");
          showAllButton.className = "accordion-show-more";
          showAllButton.type = "button";
          showAllButton.textContent = "Show all";
          showAllButton.setAttribute("aria-expanded", "false");
          showAllButton.addEventListener("click", () => {
            renderPlayers(visiblePlayers, true);
            Array.from(peoplePanel.querySelectorAll(".person-card"))
              .slice(firstRowSize)
              .forEach((card, index) => {
                card.classList.add("accordion-reveal-item");
                card.style.animationDelay = `${Math.min(index * 45, 270)}ms`;
              });
          });
          peoplePanel.append(showAllButton);
        }

        resultCount.textContent =
          search.value ||
          achievementFilter.getValues().length ||
          countryFilter.getValues().length ||
          countryFilter.getSearchQuery()
            ? `${visiblePlayers.length} result${visiblePlayers.length === 1 ? "" : "s"}`
            : "";
      };

      const filterPlayers = () => {
        const query = search.value.trim().toLocaleLowerCase();
        const achievements = achievementFilter.getValues();
        const selectedCountries = countryFilter.getValues();
        const countryQuery = countryFilter.getSearchQuery();
        const searchedCountries = countryQuery
          ? countryOptions
              .filter(([, name]) =>
                name.toLocaleLowerCase().includes(countryQuery),
              )
              .map(([code]) => code)
          : [];
        const activeCountries = new Set([
          ...selectedCountries,
          ...searchedCountries,
        ]);
        const hasCountryFilter =
          selectedCountries.length > 0 || Boolean(countryQuery);
        const filteredPlayers = players.filter((player) => {
          const searchableText = (
            `${player.name} ${(player.aliases || []).join(" ")} ` +
            `${player.summary || ""} ${player.details || ""}`
          ).toLocaleLowerCase();
          const hasAchievement =
            !achievements.length ||
            (player.achievements || []).some(({ type }) =>
              achievements.includes(type),
            );
          return (
            (!query || searchableText.includes(query)) &&
            hasAchievement &&
            (!hasCountryFilter ||
              activeCountries.has(player.country) ||
              activeCountries.has(player.secondaryCountry))
          );
        });
        renderPlayers(filteredPlayers);
      };

      search.addEventListener("input", filterPlayers);
      achievementFilter.element.addEventListener("change", filterPlayers);
      countryFilter.element.addEventListener("change", filterPlayers);
      peoplePanel.append(controls);
      renderPlayers(players);
    } catch (error) {
      const fallback = document.getElementById("people-static-fallback");
      if (fallback) {
        const cards = Array.from(fallback.querySelectorAll(".person-card"));
        const firstRowSize = getDirectoryFirstRowSize();
        const clonedCards = cards.map((card) => {
          const clone = card.cloneNode(true);
          clone.querySelectorAll("img").forEach((image) => {
            image.loading = "lazy";
            image.decoding = "async";
          });
          return clone;
        });
        clonedCards.sort((first, second) =>
          first.dataset.personName.localeCompare(
            second.dataset.personName,
            undefined,
            { sensitivity: "base" },
          ),
        );
        if (peopleCount) peopleCount.textContent = `(${clonedCards.length})`;
        const controls = document.createElement("div");
        controls.className = "directory-controls directory-controls--people";
        const search = document.createElement("input");
        search.className = "directory-search";
        search.type = "search";
        search.id = "people-fallback-search";
        search.name = "people-fallback-search";
        search.placeholder = "Search people…";
        search.setAttribute("aria-label", "Search people");
        const achievementFilter = createMultiFilter("Badges", [
          { value: "gold", text: "Gold" },
          { value: "silver", text: "Silver" },
          { value: "bronze", text: "Bronze" },
          { value: "vip", text: "VIP" },
        ]);
        const fallbackCountries = Array.from(
          new Map(
            clonedCards.map((card) => {
              const flag = card.querySelector(".person-flag");
              const code = flag
                ?.getAttribute("src")
                .match(/([^/]+)\.svg$/)?.[1];
              return [code, flag?.title];
            }),
          ),
        )
          .filter(([code, name]) => code && name)
          .sort((a, b) => a[1].localeCompare(b[1]));
        const countryFilter = createMultiFilter(
          "Countries",
          fallbackCountries.map(([value, text]) => ({ value, text })),
          { searchable: true },
        );
        const resultCount = document.createElement("span");
        resultCount.className = "directory-result-count";
        resultCount.setAttribute("aria-live", "polite");
        controls.append(
          search,
          achievementFilter.element,
          countryFilter.element,
          resultCount,
          createDirectoryDivider(),
        );

        const renderFallbackCards = (cards, showAll = false) => {
          const visibleCards = showAll ? cards : cards.slice(0, firstRowSize);
          Array.from(peoplePanel.children).forEach((child) => {
            if (child !== controls && child !== peopleRankingsLink)
              child.remove();
          });
          peoplePanel.append(...visibleCards);
          if (cards.length > firstRowSize && !showAll) {
            const showAllButton = document.createElement("button");
            showAllButton.className = "accordion-show-more";
            showAllButton.type = "button";
            showAllButton.textContent = "Show all";
            showAllButton.addEventListener("click", () => {
              renderFallbackCards(cards, true);
            });
            peoplePanel.append(showAllButton);
          }
          resultCount.textContent =
            search.value ||
            achievementFilter.getValues().length ||
            countryFilter.getValues().length ||
            countryFilter.getSearchQuery()
              ? `${cards.length} result${cards.length === 1 ? "" : "s"}`
              : "";
        };

        const filterFallbackCards = () => {
          const query = search.value.trim().toLocaleLowerCase();
          const achievements = achievementFilter.getValues();
          const selectedCountries = countryFilter.getValues();
          const countryQuery = countryFilter.getSearchQuery();
          const searchedCountries = countryQuery
            ? fallbackCountries
                .filter(([, name]) =>
                  name.toLocaleLowerCase().includes(countryQuery),
                )
                .map(([code]) => code)
            : [];
          const activeCountries = new Set([
            ...selectedCountries,
            ...searchedCountries,
          ]);
          const hasCountryFilter =
            selectedCountries.length > 0 || Boolean(countryQuery);
          const matches = clonedCards.filter((card) => {
            const flagCode = card
              .querySelector(".person-flag")
              ?.getAttribute("src")
              .match(/([^/]+)\.svg$/)?.[1];
            const cardAchievements = [
              card.dataset.achievement,
              card.dataset.vip === "true" ? "vip" : "",
            ].filter(Boolean);
            const hasAchievement =
              !achievements.length ||
              achievements.some((type) => cardAchievements.includes(type));
            return (
              (!query ||
                card.textContent.toLocaleLowerCase().includes(query)) &&
              hasAchievement &&
              (!hasCountryFilter || activeCountries.has(flagCode))
            );
          });
          renderFallbackCards(matches);
        };

        search.addEventListener("input", filterFallbackCards);
        achievementFilter.element.addEventListener(
          "change",
          filterFallbackCards,
        );
        countryFilter.element.addEventListener("change", filterFallbackCards);
        peoplePanel.append(controls);
        renderFallbackCards(clonedCards);
      } else {
        peoplePanel.textContent = "Player data could not be loaded.";
      }
      console.warn("Using the embedded player cards.", error);
    }
  };

  loadPlayers();

  personModalCloseButton?.addEventListener("click", closePersonModal);
  personModal?.addEventListener("click", (event) => {
    if (event.target === personModal) closePersonModal();
  });

  const closeModal = () => {
    if (!modal || modal.style.display === "none") return;
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    modalImage.removeAttribute("src");
    lastFocusedElement?.focus();
  };

  modalCloseButton?.addEventListener("click", closeModal);
  modal?.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });
  modalImage?.addEventListener("click", () => {
    if (modalImage.src) window.open(modalImage.src, "_blank", "noopener");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeModal();
    closeImpressum();
    closePersonModal();
    closeGameModal();
    closeMaintenanceModal();
    if (menuContainer?.classList.contains("active")) setMenuOpen(false);
  });
});
