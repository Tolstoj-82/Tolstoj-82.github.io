const timeline = document.getElementById('timeline');

  events.forEach((event, index) => {
    const side = index % 2 === 0 ? 'left' : 'right';

    const wrapper = document.createElement('div');
    wrapper.className = 'event-wrapper';

    const dot = document.createElement('div');
    dot.className = 'event-dot';

    const eventBox = document.createElement('div');
    eventBox.className = `event ${side}`;

    const header = document.createElement('div');
    header.className = 'event-header';

    const arrow = document.createElement('span');
    arrow.className = 'arrow-icon';

    const titleBlock = document.createElement('div');
    titleBlock.innerHTML = `<div class="title">${event.title}</div><div class="date">${event.start}</div>`;

    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'accordion-content-wrapper';

    const content = document.createElement('div');
    content.className = 'accordion-content';
    content.innerHTML = event.content;

    contentWrapper.appendChild(content);
    header.appendChild(arrow);
    header.appendChild(titleBlock);
    eventBox.appendChild(header);
    eventBox.appendChild(contentWrapper);
    wrapper.appendChild(dot);
    wrapper.appendChild(eventBox);
    timeline.appendChild(wrapper);

    header.addEventListener('click', () => {
      const isOpen = contentWrapper.classList.toggle('open');
      arrow.classList.toggle('open');

      if (isOpen) {
        contentWrapper.style.maxHeight = content.scrollHeight + 'px';
      } else {
        contentWrapper.style.maxHeight = null;
      }
    });
  });