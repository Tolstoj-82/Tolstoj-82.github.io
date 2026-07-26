document.addEventListener('DOMContentLoaded', () => {
  document
    .querySelectorAll('a[href^="apps/"], a[href^="games/chris-and-triss/"]')
    .forEach((link) => {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    });

  const menuButton = document.getElementById('hamburger-icon');
  const closeButton = document.getElementById('close-icon');
  const menuContainer = document.getElementById('site-menu');
  const accordions = document.querySelectorAll('.accordion');
  const modal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const modalCloseButton = modal?.querySelector('.close');
  const introPortrait = document.getElementById('intro-portrait');
  const introRotateButton = document.getElementById('intro-rotate-button');
  const introAudioButton = document.getElementById('intro-audio-button');
  const introAudio = document.getElementById('intro-audio');
  let lastFocusedElement = null;

  introRotateButton?.addEventListener('click', () => {
    const isRotated = introPortrait.classList.toggle('is-rotated');
    introRotateButton.setAttribute('aria-pressed', String(isRotated));
  });
  introPortrait?.addEventListener('pointerleave', (event) => {
    if (event.pointerType !== 'mouse') return;
    const focusedControl = introPortrait.querySelector(':focus');
    focusedControl?.blur();
  });

  const setIntroAudioPlaying = (isPlaying) => {
    if (!introPortrait || !introAudioButton) return;
    introPortrait.classList.toggle('is-audio-playing', isPlaying);
    introAudioButton.classList.toggle('is-stop', isPlaying);
    introAudioButton.setAttribute('aria-pressed', String(isPlaying));
    introAudioButton.setAttribute(
      'aria-label',
      isPlaying ? "Stop Tolstoj's song" : "Play Tolstoj's song"
    );
    const icon = introAudioButton.querySelector('span');
    if (icon) icon.textContent = isPlaying ? '■' : '▶';
  };

  introAudioButton?.addEventListener('click', async () => {
    if (!introAudio) return;
    if (!introAudio.paused) {
      introAudio.pause();
      introAudio.currentTime = 0;
      setIntroAudioPlaying(false);
      return;
    }
    try {
      await introAudio.play();
      setIntroAudioPlaying(true);
    } catch {
      setIntroAudioPlaying(false);
    }
  });
  introAudio?.addEventListener('ended', () => {
    introAudio.currentTime = 0;
    setIntroAudioPlaying(false);
  });

  const setMenuOpen = (isOpen) => {
    if (!menuContainer || !menuButton || !closeButton) return;
    menuContainer.classList.toggle('active', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
    menuContainer.setAttribute('aria-hidden', String(!isOpen));
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');

    if (isOpen) {
      closeButton.focus();
    } else if (menuContainer.contains(document.activeElement)) {
      menuButton.focus();
    }
  };

  if (menuContainer) {
    document.body.classList.toggle(
      'menu-open',
      menuContainer.classList.contains('active')
    );
  }

  menuButton?.addEventListener('click', () => {
    setMenuOpen(!menuContainer.classList.contains('active'));
  });

  closeButton?.addEventListener('click', () => setMenuOpen(false));

  accordions.forEach((accordion) => {
    accordion.addEventListener('click', () => {
      const submenu = accordion.nextElementSibling;
      if (!submenu?.classList.contains('menu')) return;

      const isOpen = submenu.classList.toggle('active');
      accordion.classList.toggle('active', isOpen);
      accordion.setAttribute('aria-expanded', String(isOpen));

      const arrow = accordion.querySelector('.arrow');
      if (arrow) arrow.textContent = isOpen ? '−' : '+';
    });
  });

  document.addEventListener('click', (event) => {
    if (
      menuContainer &&
      menuButton &&
      !menuContainer.hasAttribute('data-persistent') &&
      menuContainer.classList.contains('active') &&
      !menuContainer.contains(event.target) &&
      !menuButton.contains(event.target)
    ) {
      setMenuOpen(false);
    }
  });

  document.querySelectorAll('.clickable').forEach((image) => {
    image.addEventListener('click', () => {
      if (!modal || !modalImage) return;
      lastFocusedElement = document.activeElement;
      modalImage.src = image.src;
      modal.style.display = 'flex';
      modal.setAttribute('aria-hidden', 'false');
      modalCloseButton?.focus();
    });
  });

  document.querySelectorAll('.grid-item-clickable').forEach((card) => {
    const media = Array.from(card.children).find((child) =>
      child.matches('img, .project-card-art')
    );
    const description = Array.from(card.children).find((child) =>
      child.matches('p')
    );
    if (!media || !description?.textContent.trim()) return;

    const mediaStage = document.createElement('div');
    mediaStage.className = 'card-media';
    card.insertBefore(mediaStage, media);
    mediaStage.append(media, description);
  });

  const expandablePanels = [];
  const createDirectoryDivider = () => {
    const divider = document.createElement('hr');
    divider.className = 'directory-divider';
    divider.setAttribute('aria-hidden', 'true');
    return divider;
  };

  document
    .querySelectorAll('.grid.accordion-panel')
    .forEach((panel) => {
    const items = Array.from(panel.children);
    if (items.length < 2) return;

    const showMoreButton = document.createElement('button');
    showMoreButton.className = 'accordion-show-more';
    showMoreButton.type = 'button';
    showMoreButton.textContent = 'Show all';
    showMoreButton.setAttribute('aria-expanded', 'false');
    panel.append(showMoreButton);

    const collapseToFirstRow = () => {
      items.forEach((item) => {
        item.hidden = false;
      });

      const firstTop = items[0].offsetTop;
      const firstRowItems = items.filter(
        (item) => Math.abs(item.offsetTop - firstTop) < 2
      );
      const hasMore = firstRowItems.length < items.length;

      items.forEach((item, index) => {
        item.hidden = hasMore && index >= firstRowItems.length;
      });

      showMoreButton.hidden = !hasMore;
      showMoreButton.textContent = 'Show all';
      showMoreButton.setAttribute('aria-expanded', 'false');
    };

    showMoreButton.addEventListener('click', () => {
      const hiddenItems = items.filter((item) => item.hidden);
      hiddenItems.forEach((item, index) => {
        item.hidden = false;
        item.classList.remove('accordion-reveal-item');
        item.style.animationDelay = `${Math.min(index * 45, 270)}ms`;
        item.classList.add('accordion-reveal-item');
        item.addEventListener(
          'animationend',
          () => {
            item.classList.remove('accordion-reveal-item');
            item.style.removeProperty('animation-delay');
          },
          { once: true }
        );
      });
      showMoreButton.setAttribute('aria-expanded', 'true');
      showMoreButton.hidden = true;
    });

    collapseToFirstRow();
    expandablePanels.push({
      panel,
      items,
      button: showMoreButton,
      collapseToFirstRow
    });
  });

  expandablePanels
    .filter(({ panel }) =>
      ['projects-panel', 'games-patches-panel', 'articles-panel'].includes(
        panel.id
      )
    )
    .forEach(({ panel, items, button, collapseToFirstRow }) => {
      const controls = document.createElement('div');
      controls.className = 'directory-controls';

      const search = document.createElement('input');
      search.className = 'directory-search';
      search.type = 'search';
      search.placeholder = {
        'projects-panel': 'Search tools…',
        'games-patches-panel': 'Search games and patches…',
        'articles-panel': 'Search articles…'
      }[panel.id];
      search.setAttribute('aria-label', search.placeholder);

      const resultCount = document.createElement('span');
      resultCount.className = 'directory-result-count';
      resultCount.setAttribute('aria-live', 'polite');
      controls.append(search, resultCount, createDirectoryDivider());
      panel.prepend(controls);

      search.addEventListener('input', () => {
        const query = search.value.trim().toLocaleLowerCase();
        if (!query) {
          resultCount.textContent = '';
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
        resultCount.textContent = `${matches} result${matches === 1 ? '' : 's'}`;
      });
    });

  let panelResizeTimer;
  window.addEventListener('resize', () => {
    window.clearTimeout(panelResizeTimer);
    panelResizeTimer = window.setTimeout(() => {
      expandablePanels.forEach(({ button, collapseToFirstRow }) => {
        if (button.getAttribute('aria-expanded') === 'false') {
          collapseToFirstRow();
        }
      });
    }, 120);
  });

  document.querySelectorAll('.section-accordion').forEach((button) => {
    const panel = document.getElementById(button.getAttribute('aria-controls'));
    if (!panel) return;

    button.addEventListener('click', () => {
      const isOpen = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!isOpen));
      panel.hidden = isOpen;

      const icon = button.querySelector('.section-accordion-icon');
      if (icon) icon.textContent = isOpen ? '+' : '−';
    });
  });

  const gamesPanel = document.getElementById('games-patches-panel');
  const gameModal = document.getElementById('gameModal');
  const gameModalCloseButton = gameModal?.querySelector('.close');
  const gameModalImage = document.getElementById('gameModalImage');
  const gameModalTitle = document.getElementById('gameModalTitle');
  const gameModalDescription = document.getElementById(
    'gameModalDescription'
  );
  const gameModalDownload = document.getElementById('gameModalDownload');
  const gameModalUnavailable = document.getElementById(
    'gameModalUnavailable'
  );
  let lastGameTrigger = null;

  const createGameCard = (entry) => {
    const card = document.createElement('button');
    card.className = 'person-card game-directory-card';
    card.type = 'button';
    card.dataset.gameName = entry.name;
    card.dataset.gameImage = entry.image;
    card.dataset.gameDescription = entry.description;
    card.dataset.gameLink = entry.link || '';

    const media = document.createElement('span');
    media.className = 'person-photo-wrap';

    const image = document.createElement('img');
    image.className = 'person-photo';
    image.src = entry.image;
    image.alt = entry.name;
    image.loading = 'lazy';
    image.decoding = 'async';

    const overlay = document.createElement('span');
    overlay.className = 'person-summary';
    const name = document.createElement('span');
    name.className = 'person-name';
    name.textContent = entry.name;
    const description = document.createElement('span');
    description.className = 'person-details';
    description.textContent = entry.description;
    overlay.append(name, description);
    media.append(image, overlay);
    card.append(media);
    return card;
  };

  const setupGamesDirectory = (entries) => {
    if (!gamesPanel) return;
    const firstRowSize = Math.max(
      1,
      getComputedStyle(gamesPanel).gridTemplateColumns.split(' ').length
    );
    const controls = document.createElement('div');
    controls.className = 'directory-controls';
    const search = document.createElement('input');
    search.className = 'directory-search';
    search.type = 'search';
    search.placeholder = 'Search games and patches…';
    search.setAttribute('aria-label', search.placeholder);
    const resultCount = document.createElement('span');
    resultCount.className = 'directory-result-count';
    resultCount.setAttribute('aria-live', 'polite');
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
        const showAllButton = document.createElement('button');
        showAllButton.className = 'accordion-show-more';
        showAllButton.type = 'button';
        showAllButton.textContent = 'Show all';
        showAllButton.setAttribute('aria-expanded', 'false');
        showAllButton.addEventListener('click', () => {
          renderGames(visibleEntries, true);
          Array.from(gamesPanel.querySelectorAll('.game-directory-card'))
            .slice(firstRowSize)
            .forEach((card, index) => {
              card.classList.add('accordion-reveal-item');
              card.style.animationDelay = `${Math.min(index * 45, 270)}ms`;
            });
        });
        gamesPanel.append(showAllButton);
      }

      resultCount.textContent = search.value
        ? `${visibleEntries.length} result${visibleEntries.length === 1 ? '' : 's'}`
        : '';
    };

    search.addEventListener('input', () => {
      const query = search.value.trim().toLocaleLowerCase();
      const matches = entries.filter((entry) =>
        `${entry.name} ${entry.description}`
          .toLocaleLowerCase()
          .includes(query)
      );
      renderGames(matches);
    });
    renderGames(entries);
  };

  const loadGamesDirectory = async () => {
    if (!gamesPanel) return;
    try {
      const response = await fetch('assets/data/games-patches.json');
      if (!response.ok) {
        throw new Error(`Game data returned ${response.status}`);
      }
      setupGamesDirectory(await response.json());
    } catch (error) {
      const fallback = document.getElementById(
        'games-patches-static-fallback'
      );
      const entries = Array.from(
        fallback?.querySelectorAll('.game-directory-card') || []
      ).map((card) => ({
        image: card.dataset.gameImage,
        name: card.dataset.gameName,
        description: card.dataset.gameDescription,
        link: card.dataset.gameLink || null
      }));
      if (entries.length) setupGamesDirectory(entries);
      else gamesPanel.textContent = 'Game and patch data could not be loaded.';
      console.error(error);
    }
  };

  const closeGameModal = () => {
    if (!gameModal || gameModal.style.display === 'none') return;
    gameModal.style.display = 'none';
    gameModal.setAttribute('aria-hidden', 'true');
    gameModalImage?.removeAttribute('src');
    lastGameTrigger?.focus();
  };

  gamesPanel?.addEventListener('click', (event) => {
    const card = event.target.closest('.game-directory-card');
    if (
      !card ||
      !gameModal ||
      !gameModalImage ||
      !gameModalTitle ||
      !gameModalDescription ||
      !gameModalDownload ||
      !gameModalUnavailable
    ) return;
    lastGameTrigger = card;
    gameModalImage.src = card.dataset.gameImage;
    gameModalImage.alt = card.dataset.gameName;
    gameModalTitle.textContent = card.dataset.gameName;
    gameModalDescription.textContent = card.dataset.gameDescription;
    const hasDownload = Boolean(card.dataset.gameLink);
    gameModalDownload.hidden = !hasDownload;
    gameModalUnavailable.hidden = hasDownload;
    if (hasDownload) gameModalDownload.href = card.dataset.gameLink;
    else gameModalDownload.removeAttribute('href');
    gameModal.style.display = 'flex';
    gameModal.setAttribute('aria-hidden', 'false');
    gameModalCloseButton?.focus();
  });

  gameModalCloseButton?.addEventListener('click', closeGameModal);
  gameModal?.addEventListener('click', (event) => {
    if (event.target === gameModal) closeGameModal();
  });
  loadGamesDirectory();

  const impressumModal = document.getElementById('impressumModal');
  const openImpressumButton = document.getElementById('openImpressum');
  const closeImpressumButton = impressumModal?.querySelector('.close');

  const closeImpressum = () => {
    if (!impressumModal || impressumModal.style.display === 'none') return;
    impressumModal.style.display = 'none';
    impressumModal.setAttribute('aria-hidden', 'true');
    openImpressumButton?.focus();
  };

  openImpressumButton?.addEventListener('click', () => {
    if (!impressumModal) return;
    impressumModal.style.display = 'flex';
    impressumModal.setAttribute('aria-hidden', 'false');
    closeImpressumButton?.focus();
  });

  closeImpressumButton?.addEventListener('click', closeImpressum);
  impressumModal?.addEventListener('click', (event) => {
    if (event.target === impressumModal) closeImpressum();
  });

  const maintenanceModal = document.getElementById('maintenanceModal');
  const maintenanceCloseButton =
    maintenanceModal?.querySelector('.close');
  const maintenanceDismissButton =
    maintenanceModal?.querySelector('.maintenance-modal-dismiss');
  const maintenanceStorageKey = 'maintenance-notice-dismissed-date';
  const localDateStamp = () => {
    const date = new Date();
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0')
    ].join('-');
  };

  const closeMaintenanceModal = () => {
    if (!maintenanceModal || maintenanceModal.style.display === 'none') return;
    maintenanceModal.style.display = 'none';
    maintenanceModal.setAttribute('aria-hidden', 'true');
    try {
      localStorage.setItem(maintenanceStorageKey, localDateStamp());
    } catch (error) {
      // The notice still closes when storage is unavailable.
    }
  };

  maintenanceCloseButton?.addEventListener('click', closeMaintenanceModal);
  maintenanceDismissButton?.addEventListener('click', closeMaintenanceModal);
  maintenanceModal?.addEventListener('click', (event) => {
    if (event.target === maintenanceModal) closeMaintenanceModal();
  });
  let maintenanceDismissedToday = false;
  try {
    maintenanceDismissedToday =
      localStorage.getItem(maintenanceStorageKey) === localDateStamp();
  } catch (error) {
    // Show the notice normally when storage is unavailable.
  }
  if (maintenanceModal && !maintenanceDismissedToday) {
    maintenanceModal.style.display = 'flex';
    maintenanceModal.setAttribute('aria-hidden', 'false');
    maintenanceDismissButton?.focus();
  }

  const personModal = document.getElementById('personModal');
  const personModalCloseButton = personModal?.querySelector('.close');
  const personModalImage = document.getElementById('personModalImage');
  const personModalTitle = document.getElementById('personModalTitle');
  const personModalDetails = document.getElementById('personModalDetails');
  const personModalAchievements = document.getElementById(
    'personModalAchievements'
  );
  const achievementLabels = {
    gold: 'Gold medal',
    silver: 'Silver medal',
    bronze: 'Bronze medal',
    wr: 'World record',
    'former-wr': 'Former world record',
    vip: 'VIP'
  };
  let lastPersonTrigger = null;
  const trophyIcon = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 3h10v3h3a1 1 0 0 1 1 1v2c0 3.1-2.5 5.7-5.6 6A6 6 0 0 1 13 17.9V20h3v2H8v-2h3v-2.1A6 6 0 0 1 8.6 15 6 6 0 0 1 3 9V7a1 1 0 0 1 1-1h3V3Zm0 5H5v1a4 4 0 0 0 3 3.9A6 6 0 0 1 7 9.5V8Zm10 0v1.5a6 6 0 0 1-1 3.4A4 4 0 0 0 19 9V8h-2Z"/>
    </svg>
  `;

  const addAchievementBadges = (card, achievements = []) => {
    const validAchievements = achievements.filter(
      ({ type }) => achievementLabels[type]
    );
    if (!validAchievements.length) return;

    const container = document.createElement('span');
    container.className = 'person-achievements';
    const tooltip = document.createElement('span');
    tooltip.className = 'achievement-tooltip';

    const groupedAchievements = new Map();
    validAchievements.forEach((achievement) => {
      const group = groupedAchievements.get(achievement.type) || [];
      group.push(achievement);
      groupedAchievements.set(achievement.type, group);
    });

    groupedAchievements.forEach((achievements, type) => {
      const group = document.createElement('span');
      group.className = 'achievement-tooltip-group';
      const category = document.createElement('strong');
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
        const eventList = document.createElement('ul');
        eventList.className = 'achievement-tooltip-events';
        achievements.forEach(({ event }) => {
          const item = document.createElement('li');
          item.textContent = event || 'Event not specified';
          eventList.append(item);
        });
        group.append(eventList);
      }
      tooltip.append(group);
    });

    const tooltipText = Array.from(groupedAchievements.entries())
      .map(([type, achievements]) => {
        const events = achievements
          .map(({ event }) => event || 'Event not specified')
          .join(', ');
        return `${achievementLabels[type]}: ${events}`;
      })
      .join('; ');
    container.setAttribute(
      'aria-label',
      `Achievements: ${tooltipText}`
    );
    container.append(tooltip);

    const priority = ['gold', 'silver', 'bronze', 'wr', 'vip', 'former-wr'];
    const primaryType = priority.find((type) =>
      validAchievements.some((achievement) => achievement.type === type)
    );
    const primaryAchievement = validAchievements.find(
      ({ type }) => type === primaryType
    );
    const badge = document.createElement('span');
    const description = primaryAchievement.event
      ? `${achievementLabels[primaryType]}: ${primaryAchievement.event}`
      : achievementLabels[primaryType];
    badge.className = `person-achievement person-achievement--${primaryType}`;
    badge.setAttribute('role', 'img');
    badge.setAttribute('aria-label', description);
    badge.innerHTML = ['gold', 'silver', 'bronze'].includes(primaryType)
      ? trophyIcon
      : primaryType === 'former-wr'
        ? 'FWR'
        : primaryType.toUpperCase();
    container.append(badge);

    card.querySelector('.person-photo-wrap')?.append(container);
  };

  document
    .querySelectorAll('.person-card[data-achievement], .person-card[data-vip]')
    .forEach((card) => {
      const achievements = [];
      if (card.dataset.achievement) {
        achievements.push({
          type: card.dataset.achievement,
          event: card.dataset.achievementEvent
        });
      }
      if (card.dataset.vip === 'true') {
        achievements.push({
          type: 'vip',
          event: card.dataset.vipEvent
        });
      }
      addAchievementBadges(card, achievements);
    });

  const closePersonModal = () => {
    if (!personModal || personModal.style.display === 'none') return;
    personModal.style.display = 'none';
    personModal.setAttribute('aria-hidden', 'true');
    lastPersonTrigger?.focus();
  };

  const peoplePanel = document.getElementById('people-panel');
  const peopleCount = document.getElementById('people-count');
  const peopleRankingsLink = document.getElementById('people-rankings-link');

  peoplePanel?.addEventListener('click', (event) => {
    if (event.target.closest('.person-flags')) return;
    const card = event.target.closest('.person-card');
    if (
      !card ||
      !personModal ||
      !personModalImage ||
      !personModalTitle ||
      !personModalDetails ||
      !personModalAchievements
    ) return;

    lastPersonTrigger = card;
    personModalImage.src = card.dataset.personImage;
    personModalImage.alt = card.dataset.personName;
    personModalTitle.textContent = card.dataset.personName;
    personModalDetails.textContent = card.dataset.personDetails;
    personModalAchievements.replaceChildren();
    const achievements = JSON.parse(card.dataset.personAchievements || '[]');
    achievements.forEach(({ type, event: achievementEvent }) => {
      const item = document.createElement('li');
      const label = achievementLabels[type] || type;
      item.textContent = achievementEvent
        ? `${label}: ${achievementEvent}`
        : label;
      personModalAchievements.append(item);
    });
    personModalAchievements.hidden = achievements.length === 0;
    personModal.style.display = 'flex';
    personModal.setAttribute('aria-hidden', 'false');
    personModalCloseButton?.focus();
  });

  peoplePanel?.addEventListener('keydown', (event) => {
    const card = event.target.closest('.person-card');
    if (
      !card ||
      event.target.closest('.person-flags') ||
      !['Enter', ' '].includes(event.key)
    ) return;
    event.preventDefault();
    card.click();
  });

  const createPersonCard = (player, countries) => {
    const card = document.createElement('div');
    card.className = 'person-card';
    card.setAttribute('role', 'button');
    card.tabIndex = 0;
    card.dataset.personName = player.name;
    card.dataset.personImage = `assets/images/people/${player.id}.png`;
    card.dataset.personDetails = player.details || player.summary || '';
    card.dataset.personAchievements = JSON.stringify(
      player.achievements || []
    );

    const photoWrap = document.createElement('span');
    photoWrap.className = 'person-photo-wrap';

    const portrait = document.createElement('img');
    portrait.className = 'person-photo';
    portrait.src = card.dataset.personImage;
    portrait.alt = player.name;
    portrait.loading = 'lazy';
    portrait.decoding = 'async';
    portrait.addEventListener(
      'error',
      () => {
        const fallbackImage = 'assets/images/people/default.svg';
        portrait.src = fallbackImage;
        card.dataset.personImage = fallbackImage;
      },
      { once: true }
    );

    const summary = document.createElement('span');
    summary.className = 'person-summary';

    const name = document.createElement('span');
    name.className = 'person-name';
    name.textContent = player.name;

    const details = document.createElement('span');
    details.className = 'person-details';
    details.textContent = player.summary || 'More information coming soon.';
    summary.append(name, details);

    const countryCodes = [
      player.country || 'unknown',
      player.secondaryCountry
    ].filter(Boolean);
    let activeCountry = 0;
    const flagControl = document.createElement('button');
    flagControl.className = 'person-flags';
    flagControl.type = 'button';
    if (countryCodes.length > 1) {
      flagControl.classList.add('person-flags--multiple');
    }

    const flags = countryCodes.map((countryCode) => {
      const countryName = countries[countryCode] || 'Unknown';
      const flag = document.createElement('img');
      flag.className = 'person-flag';
      flag.src = `assets/images/flags/${countryCode}.svg`;
      flag.alt =
        countryCode === 'unknown'
          ? 'Unknown country'
          : `Flag of ${countryName}`;
      flag.loading = 'lazy';
      flag.decoding = 'async';
      flag.addEventListener(
        'error',
        () => {
          flag.src = 'assets/images/flags/unknown.svg';
          flag.alt = 'Unknown country';
        },
        { once: true }
      );
      return flag;
    });

    const showCountry = (index) => {
      activeCountry = index;
      const countryCode = countryCodes[activeCountry] || 'unknown';
      const countryName = countries[countryCode] || 'Unknown';
      flags.forEach((flag, flagIndex) => {
        flag.classList.toggle('person-flag--active', flagIndex === activeCountry);
      });
      flagControl.title = countryCodes.length > 1
        ? `${countryName} — click to show ${
            countries[countryCodes[(activeCountry + 1) % countryCodes.length]] ||
            'the other country'
          }`
        : countryName;
      flagControl.setAttribute('aria-label', flagControl.title);
    };

    flagControl.addEventListener('click', (event) => {
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

  const createMultiFilter = (label, options, { searchable = false } = {}) => {
    const details = document.createElement('details');
    details.className = 'multi-filter';
    const summary = document.createElement('summary');
    const optionList = document.createElement('div');
    optionList.className = 'multi-filter-options';
    const clearButton = document.createElement('button');
    clearButton.className = 'multi-filter-clear';
    clearButton.type = 'button';
    clearButton.textContent = 'Deselect all';
    clearButton.disabled = true;

    let optionSearch = null;
    let searchClearButton = null;
    if (searchable) {
      optionSearch = document.createElement('input');
      optionSearch.className =
        'multi-filter-search multi-filter-search--summary';
      optionSearch.type = 'search';
      optionSearch.placeholder = `All ${label.toLocaleLowerCase()}`;
      optionSearch.setAttribute(
        'aria-label',
        `Search ${label.toLocaleLowerCase()}`
      );
      searchClearButton = document.createElement('button');
      searchClearButton.className = 'multi-filter-search-clear';
      searchClearButton.type = 'button';
      searchClearButton.setAttribute(
        'aria-label',
        `Clear ${label.toLocaleLowerCase()} search`
      );
      searchClearButton.textContent = '×';
      searchClearButton.hidden = true;
      summary.append(optionSearch, searchClearButton);
      optionSearch.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        details.open = true;
      });
    } else {
      summary.textContent = `All ${label.toLocaleLowerCase()}`;
    }
    optionList.append(clearButton);

    options.forEach(({ value, text }) => {
      const option = document.createElement('label');
      option.className = 'multi-filter-option';
      option.dataset.filterText = text.toLocaleLowerCase();
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = value;
      option.append(checkbox, document.createTextNode(text));
      optionList.append(option);
    });

    const filterOptionsBySearch = () => {
      const query = optionSearch.value.trim().toLocaleLowerCase();
      details.open = true;
      optionList.querySelectorAll('.multi-filter-option').forEach((option) => {
        option.hidden =
          Boolean(query) && !option.dataset.filterText.includes(query);
      });
      searchClearButton.hidden = !query;
      details.dispatchEvent(new Event('change', { bubbles: true }));
    };
    optionSearch?.addEventListener('input', filterOptionsBySearch);
    optionSearch?.addEventListener('search', filterOptionsBySearch);
    searchClearButton?.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      optionSearch.value = '';
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
        summary.textContent = text;
      }
      clearButton.disabled = count === 0;
    };

    const getValues = () =>
      Array.from(optionList.querySelectorAll('input:checked')).map(
        ({ value }) => value
      );

    optionList.addEventListener('change', () => {
      updateFilterLabel();
    });

    clearButton.addEventListener('click', () => {
      optionList
        .querySelectorAll('input:checked')
        .forEach((checkbox) => {
          checkbox.checked = false;
        });
      updateFilterLabel();
      details.dispatchEvent(new Event('change', { bubbles: true }));
    });

    details.append(summary, optionList);
    return {
      element: details,
      getValues,
      getSearchQuery: () =>
        optionSearch?.value.trim().toLocaleLowerCase() || ''
    };
  };

  document.addEventListener('click', (event) => {
    document.querySelectorAll('.multi-filter[open]').forEach((filter) => {
      if (!filter.contains(event.target)) filter.removeAttribute('open');
    });
  });

  const loadPlayers = async () => {
    if (!peoplePanel) return;

    try {
      const playerData = await fetch(
        'assets/data/players.json?v=20260726-3'
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Player data returned ${response.status}`);
          }
          return response.json();
        })
        .catch((error) => {
          if (window.PLAYER_DATA) {
            return window.PLAYER_DATA;
          }
          throw error;
        });
      const countries = playerData.countries || {};
      const players = (
        Array.isArray(playerData) ? playerData : playerData.players || []
      ).map((player) => ({
        ...player,
        aliases: [...(player.aliases || [])],
        achievements: [...(player.achievements || [])]
      }));
      players.sort((first, second) =>
        first.name.localeCompare(second.name, undefined, {
          sensitivity: 'base'
        })
      );
      if (peopleCount) peopleCount.textContent = `(${players.length})`;
      const firstRowSize = Math.max(
        1,
        getComputedStyle(peoplePanel).gridTemplateColumns.split(' ').length
      );
      const controls = document.createElement('div');
      controls.className = 'directory-controls directory-controls--people';

      const search = document.createElement('input');
      search.className = 'directory-search';
      search.type = 'search';
      search.placeholder = 'Search people…';
      search.setAttribute('aria-label', 'Search people');

      const achievementFilter = createMultiFilter('Badges', [
        { value: 'gold', text: 'Gold' },
        { value: 'silver', text: 'Silver' },
        { value: 'bronze', text: 'Bronze' },
        { value: 'vip', text: 'VIP' }
      ]);

      const countryOptions = Array.from(
        new Set(
          players.flatMap(({ country, secondaryCountry }) =>
            [country, secondaryCountry].filter(Boolean)
          )
        )
      )
        .map((code) => [code, countries[code] || 'Unknown'])
        .sort((a, b) => a[1].localeCompare(b[1]));
      const countryFilter = createMultiFilter(
        'Countries',
        countryOptions.map(([value, text]) => ({ value, text })),
        { searchable: true }
      );

      const resultCount = document.createElement('span');
      resultCount.className = 'directory-result-count';
      resultCount.setAttribute('aria-live', 'polite');
      controls.append(
        search,
        achievementFilter.element,
        countryFilter.element,
        resultCount,
        createDirectoryDivider()
      );

      const renderPlayers = (visiblePlayers, showAll = false) => {
        const playersToRender = showAll
          ? visiblePlayers
          : visiblePlayers.slice(0, firstRowSize);
        const cards = playersToRender.map((player) =>
          createPersonCard(player, countries)
        );
        Array.from(peoplePanel.children).forEach((child) => {
          if (child !== controls && child !== peopleRankingsLink) child.remove();
        });
        peoplePanel.append(...cards);

        if (visiblePlayers.length > firstRowSize && !showAll) {
          const showAllButton = document.createElement('button');
          showAllButton.className = 'accordion-show-more';
          showAllButton.type = 'button';
          showAllButton.textContent = 'Show all';
          showAllButton.setAttribute('aria-expanded', 'false');
          showAllButton.addEventListener('click', () => {
            renderPlayers(visiblePlayers, true);
            Array.from(peoplePanel.querySelectorAll('.person-card'))
              .slice(firstRowSize)
              .forEach((card, index) => {
                card.classList.add('accordion-reveal-item');
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
            ? `${visiblePlayers.length} result${visiblePlayers.length === 1 ? '' : 's'}`
            : '';
      };

      const filterPlayers = () => {
        const query = search.value.trim().toLocaleLowerCase();
        const achievements = achievementFilter.getValues();
        const selectedCountries = countryFilter.getValues();
        const countryQuery = countryFilter.getSearchQuery();
        const searchedCountries = countryQuery
          ? countryOptions
              .filter(([, name]) =>
                name.toLocaleLowerCase().includes(countryQuery)
              )
              .map(([code]) => code)
          : [];
        const activeCountries = new Set([
          ...selectedCountries,
          ...searchedCountries
        ]);
        const hasCountryFilter =
          selectedCountries.length > 0 || Boolean(countryQuery);
        const filteredPlayers = players.filter((player) => {
          const searchableText = (
            `${player.name} ${(player.aliases || []).join(' ')} ` +
            `${player.summary || ''} ${player.details || ''}`
          ).toLocaleLowerCase();
          const hasAchievement =
            !achievements.length ||
            (player.achievements || []).some(
              ({ type }) => achievements.includes(type)
            );
          return (
            (!query || searchableText.includes(query)) &&
            hasAchievement &&
            (
              !hasCountryFilter ||
              activeCountries.has(player.country) ||
              activeCountries.has(player.secondaryCountry)
            )
          );
        });
        renderPlayers(filteredPlayers);
      };

      search.addEventListener('input', filterPlayers);
      achievementFilter.element.addEventListener('change', filterPlayers);
      countryFilter.element.addEventListener('change', filterPlayers);
      peoplePanel.append(controls);
      renderPlayers(players);
    } catch (error) {
      const fallback = document.getElementById('people-static-fallback');
      if (fallback) {
        const cards = Array.from(fallback.querySelectorAll('.person-card'));
        const firstRowSize = Math.max(
          1,
          getComputedStyle(peoplePanel).gridTemplateColumns.split(' ').length
        );
        const clonedCards = cards.map((card) => {
          const clone = card.cloneNode(true);
          clone.querySelectorAll('img').forEach((image) => {
            image.loading = 'lazy';
            image.decoding = 'async';
          });
          return clone;
        });
        clonedCards.sort((first, second) =>
          first.dataset.personName.localeCompare(
            second.dataset.personName,
            undefined,
            { sensitivity: 'base' }
          )
        );
        if (peopleCount) peopleCount.textContent = `(${clonedCards.length})`;
        const controls = document.createElement('div');
        controls.className = 'directory-controls directory-controls--people';
        const search = document.createElement('input');
        search.className = 'directory-search';
        search.type = 'search';
        search.placeholder = 'Search people…';
        search.setAttribute('aria-label', 'Search people');
        const achievementFilter = createMultiFilter('Badges', [
          { value: 'gold', text: 'Gold' },
          { value: 'silver', text: 'Silver' },
          { value: 'bronze', text: 'Bronze' },
          { value: 'vip', text: 'VIP' }
        ]);
        const fallbackCountries = Array.from(
          new Map(
            clonedCards.map((card) => {
              const flag = card.querySelector('.person-flag');
              const code = flag?.getAttribute('src').match(/([^/]+)\.svg$/)?.[1];
              return [code, flag?.title];
            })
          )
        )
          .filter(([code, name]) => code && name)
          .sort((a, b) => a[1].localeCompare(b[1]));
        const countryFilter = createMultiFilter(
          'Countries',
          fallbackCountries.map(([value, text]) => ({ value, text })),
          { searchable: true }
        );
        const resultCount = document.createElement('span');
        resultCount.className = 'directory-result-count';
        resultCount.setAttribute('aria-live', 'polite');
        controls.append(
          search,
          achievementFilter.element,
          countryFilter.element,
          resultCount,
          createDirectoryDivider()
        );

        const renderFallbackCards = (cards, showAll = false) => {
          const visibleCards = showAll ? cards : cards.slice(0, firstRowSize);
          Array.from(peoplePanel.children).forEach((child) => {
            if (child !== controls && child !== peopleRankingsLink) child.remove();
          });
          peoplePanel.append(...visibleCards);
          if (cards.length > firstRowSize && !showAll) {
            const showAllButton = document.createElement('button');
            showAllButton.className = 'accordion-show-more';
            showAllButton.type = 'button';
            showAllButton.textContent = 'Show all';
            showAllButton.addEventListener('click', () => {
              renderFallbackCards(cards, true);
            });
            peoplePanel.append(showAllButton);
          }
          resultCount.textContent =
              search.value ||
              achievementFilter.getValues().length ||
              countryFilter.getValues().length ||
              countryFilter.getSearchQuery()
              ? `${cards.length} result${cards.length === 1 ? '' : 's'}`
              : '';
        };

        const filterFallbackCards = () => {
          const query = search.value.trim().toLocaleLowerCase();
          const achievements = achievementFilter.getValues();
          const selectedCountries = countryFilter.getValues();
          const countryQuery = countryFilter.getSearchQuery();
          const searchedCountries = countryQuery
            ? fallbackCountries
                .filter(([, name]) =>
                  name.toLocaleLowerCase().includes(countryQuery)
                )
                .map(([code]) => code)
            : [];
          const activeCountries = new Set([
            ...selectedCountries,
            ...searchedCountries
          ]);
          const hasCountryFilter =
            selectedCountries.length > 0 || Boolean(countryQuery);
          const matches = clonedCards.filter((card) => {
            const flagCode = card
              .querySelector('.person-flag')
              ?.getAttribute('src')
              .match(/([^/]+)\.svg$/)?.[1];
            const cardAchievements = [
              card.dataset.achievement,
              card.dataset.vip === 'true' ? 'vip' : ''
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

        search.addEventListener('input', filterFallbackCards);
        achievementFilter.element.addEventListener(
          'change',
          filterFallbackCards
        );
        countryFilter.element.addEventListener('change', filterFallbackCards);
        peoplePanel.append(controls);
        renderFallbackCards(clonedCards);
      } else {
        peoplePanel.textContent = 'Player data could not be loaded.';
      }
      console.error(error);
    }
  };

  loadPlayers();

  personModalCloseButton?.addEventListener('click', closePersonModal);
  personModal?.addEventListener('click', (event) => {
    if (event.target === personModal) closePersonModal();
  });

  const closeModal = () => {
    if (!modal || modal.style.display === 'none') return;
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    modalImage.removeAttribute('src');
    lastFocusedElement?.focus();
  };

  modalCloseButton?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });
  modalImage?.addEventListener('click', () => {
    if (modalImage.src) window.open(modalImage.src, '_blank', 'noopener');
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    closeModal();
    closeImpressum();
    closePersonModal();
    closeGameModal();
    closeMaintenanceModal();
    if (menuContainer?.classList.contains('active')) setMenuOpen(false);
  });
});
