function initializeArticleAccordions() {
  const main = document.querySelector("main");
  if (!main || main.dataset.accordionsReady === "true") return;
  main.dataset.accordionsReady = "true";

  const usedIds = new Set();
  const makeId = (text) => {
    const base =
      text
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-") || "section";
    let id = base;
    let suffix = 2;

    while (usedIds.has(id) || document.getElementById(id)) {
      id = `${base}-${suffix}`;
      suffix += 1;
    }

    usedIds.add(id);
    return id;
  };

  const headings = Array.from(main.querySelectorAll("h2")).filter(
    (heading) => !heading.closest(".article-accordion")
  );
  const accordionItems = [];

  headings.forEach((heading, index) => {
    const nextHeading = headings[index + 1] || null;
    const section = document.createElement("section");
    const panel = document.createElement("div");
    const trigger = document.createElement("button");
    const icon = document.createElement("span");
    const title = heading.textContent.trim();
    const sectionNumber = index + 1;
    const panelId = `article-accordion-panel-${index + 1}`;

    section.className = "article-accordion";
    section.id = makeId(title);
    heading.classList.add("article-accordion-heading");

    trigger.className = "article-accordion-trigger";
    trigger.type = "button";
    trigger.setAttribute("aria-expanded", "true");
    trigger.setAttribute("aria-controls", panelId);

    const headingLabel = document.createElement("span");
    const headingNumber = document.createElement("span");

    headingLabel.className = "article-accordion-label";
    headingNumber.className = "article-heading-number";
    headingNumber.setAttribute("aria-hidden", "true");
    headingNumber.textContent = `${sectionNumber}.`;
    headingLabel.appendChild(headingNumber);

    while (heading.firstChild) {
      headingLabel.appendChild(heading.firstChild);
    }
    trigger.appendChild(headingLabel);

    icon.className = "article-accordion-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = "−";
    trigger.appendChild(icon);
    heading.appendChild(trigger);

    panel.className = "article-accordion-panel";
    panel.id = panelId;
    panel.hidden = false;

    heading.before(section);
    section.appendChild(heading);
    section.appendChild(panel);

    while (section.nextSibling && section.nextSibling !== nextHeading) {
      panel.appendChild(section.nextSibling);
    }

    accordionItems.push({
      section,
      heading,
      trigger,
      icon,
      panel,
      title,
      sectionNumber,
    });

    trigger.addEventListener("click", () => {
      const isOpen = trigger.getAttribute("aria-expanded") === "true";
      setItemOpen(
        accordionItems.find((item) => item.trigger === trigger),
        !isOpen
      );
      updateControls();
    });
  });

  if (accordionItems.length === 0) return;

  const controls = document.createElement("div");
  const openAllButton = document.createElement("button");
  const closeAllButton = document.createElement("button");

  controls.className = "article-accordion-controls";
  controls.setAttribute("aria-label", "Accordion controls");

  openAllButton.type = "button";
  openAllButton.className = "article-accordion-control";
  openAllButton.textContent = "Open all";

  closeAllButton.type = "button";
  closeAllButton.className = "article-accordion-control";
  closeAllButton.textContent = "Close all";

  controls.append(openAllButton, closeAllButton);
  const tocHeader = document.querySelector(".article-toc-header");
  const closeButton = document.getElementById("close-icon");

  if (tocHeader && closeButton) {
    tocHeader.insertBefore(controls, closeButton);
  } else {
    accordionItems[0].section.before(controls);
  }

  function setItemOpen(item, isOpen) {
    if (!item) return;
    item.trigger.setAttribute("aria-expanded", String(isOpen));
    item.icon.textContent = isOpen ? "−" : "+";
    item.panel.hidden = !isOpen;
  }

  function setAll(isOpen) {
    accordionItems.forEach((item) => setItemOpen(item, isOpen));
    updateControls();
  }

  function updateControls() {
    const openCount = accordionItems.filter(
      ({ trigger }) => trigger.getAttribute("aria-expanded") === "true"
    ).length;

    openAllButton.disabled = openCount === accordionItems.length;
    closeAllButton.disabled = openCount === 0;
  }

  openAllButton.addEventListener("click", () => setAll(true));
  closeAllButton.addEventListener("click", () => setAll(false));
  updateControls();

  const tocList = document.getElementById("article-toc-list");
  if (!tocList) return;

  const tocEntries = [];

  function addTocEntry(target, title, level, item) {
    const listItem = document.createElement("li");
    const link = document.createElement("a");

    listItem.className = `article-toc-item article-toc-item--h${level}`;
    link.className = "article-toc-link";
    link.href = `#${target.id}`;
    link.textContent = title;
    listItem.appendChild(link);
    tocList.appendChild(listItem);
    tocEntries.push({ target, link, item, listItem, level });

    link.addEventListener("click", (event) => {
      event.preventDefault();
      setItemOpen(item, true);
      updateControls();
      history.pushState(null, "", `#${target.id}`);
      if (window.matchMedia("(max-width: 999px)").matches) {
        document.getElementById("close-icon")?.click();
      }
      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        setCurrentEntry(link);
      });
    });
  }

  accordionItems.forEach((item) => {
    addTocEntry(
      item.section,
      `${item.sectionNumber}. ${item.title}`,
      2,
      item
    );

    item.panel.querySelectorAll("h3").forEach((subheading, subheadingIndex) => {
      const title = subheading.textContent.trim();
      const subsectionNumber = `${item.sectionNumber}.${subheadingIndex + 1}`;
      const headingNumber = document.createElement("span");

      headingNumber.className = "article-heading-number";
      headingNumber.setAttribute("aria-hidden", "true");
      headingNumber.textContent = subsectionNumber;
      subheading.prepend(headingNumber);
      subheading.id = subheading.id || makeId(title);
      addTocEntry(subheading, `${subsectionNumber} ${title}`, 3, item);
    });
  });

  function setCurrentEntry(currentLink) {
    const currentIndex = tocEntries.findIndex(({ link }) => link === currentLink);
    const activeItem = tocEntries[currentIndex]?.item;

    tocEntries.forEach(({ link, item, listItem, level }, index) => {
      const isCurrent = link === currentLink;
      listItem.classList.toggle(
        "is-in-active-section",
        level === 3 && item === activeItem
      );
      link.classList.toggle("is-passed", index < currentIndex);
      link.classList.toggle("is-current", isCurrent);
      if (isCurrent) {
        link.setAttribute("aria-current", "location");
        if (document.getElementById("site-menu")?.classList.contains("active")) {
          link.scrollIntoView({ block: "nearest" });
        }
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  let scrollFrame = null;
  function updateCurrentFromScroll() {
    scrollFrame = null;
    const visibleEntries = tocEntries.filter(
      ({ target }) => target.getClientRects().length > 0
    );
    if (visibleEntries.length === 0) return;

    let current = visibleEntries[0];
    visibleEntries.forEach((entry) => {
      if (entry.target.getBoundingClientRect().top <= 110) {
        current = entry;
      }
    });
    setCurrentEntry(current.link);
  }

  window.addEventListener(
    "scroll",
    () => {
      if (scrollFrame === null) {
        scrollFrame = requestAnimationFrame(updateCurrentFromScroll);
      }
    },
    { passive: true }
  );

  const initialTarget = location.hash
    ? document.getElementById(location.hash.slice(1))
    : null;
  const initialEntry = tocEntries.find(({ target }) => target === initialTarget);

  if (initialEntry) {
    setItemOpen(initialEntry.item, true);
    updateControls();
    requestAnimationFrame(() => {
      initialEntry.target.scrollIntoView({ block: "start" });
      setCurrentEntry(initialEntry.link);
    });
  } else {
    updateCurrentFromScroll();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeArticleAccordions);
} else {
  initializeArticleAccordions();
}
