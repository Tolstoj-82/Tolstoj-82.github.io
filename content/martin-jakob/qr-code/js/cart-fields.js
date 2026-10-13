(() => {
  "use strict";
  const { t } = window.QRGenerator.i18n;
  const fonts = [
    "Roboto",
    "Open Sans",
    "Lato",
    "Montserrat",
    "Source Sans 3",
    "Merriweather",
  ];
  const supported = [
    ...fonts,
    "Arial",
    "Verdana",
    "Georgia",
    "Times New Roman",
    "Courier New",
  ];
  const clean = (saved) => ({
    font: supported.includes(saved.font) ? saved.font : "Roboto",
    sources: Object.fromEntries(
      Object.entries(saved.sources || {}).filter(
        ([key, value]) => typeof value === "string",
      ),
    ),
    headingText: Object.fromEntries(
      Object.entries(saved.headingText || {}).filter(
        ([key, value]) =>
          key.startsWith("heading:") && typeof value === "string",
      ),
    ),
    hiddenFields: Array.isArray(saved.hiddenFields)
      ? saved.hiddenFields.filter((key) => typeof key === "string")
      : [],
  });
  function source(layout, key) {
    return (
      layout.sources?.[key] ??
      (key === "heading:title"
        ? "Titel"
        : key === "heading:subtitle"
          ? "Untertitel"
          : key)
    );
  }
  function detect(layout, rows) {
    layout.sources ||= {};
    const keys = [...new Set(rows.flatMap(Object.keys))];
    for (const [key, names] of [
      ["heading:title", ["titel", "title", "name", "bezeichnung"]],
      [
        "heading:subtitle",
        ["untertitel", "subtitle", "description", "beschreibung"],
      ],
    ]) {
      if (keys.includes(layout.sources[key])) continue;
      layout.sources[key] =
        names
          .map((name) =>
            keys.find(
              (field) => name === field.toLowerCase().replace(/[ _-]/g, ""),
            ),
          )
          .find(Boolean) || "";
    }
  }
  function titleValid(layout, records) {
    const key = source(layout, "heading:title");
    return Boolean(
      key &&
      records?.length &&
      records.every(
        (record) => record.Raw?.[key] != null && String(record.Raw[key]).trim(),
      ),
    );
  }
  function render(host, layout, keys, changed, bulk) {
    host.replaceChildren();
    const label=document.createElement('span');label.id='cartFontLabel';label.textContent=t('Schriftart');
    const picker=document.createElement('div');picker.className='font-picker';
    const button=document.createElement('button');button.type='button';button.className='font-picker-toggle';button.setAttribute('role','combobox');button.setAttribute('aria-labelledby','cartFontLabel');button.setAttribute('aria-haspopup','listbox');button.setAttribute('aria-expanded','false');button.setAttribute('aria-controls','cartFontOptions');
    const options=document.createElement('div');options.id='cartFontOptions';options.className='font-picker-options';options.setAttribute('role','listbox');options.setAttribute('aria-labelledby','cartFontLabel');options.hidden=true;
    const names=[...fonts];if(layout.font&&!names.includes(layout.font)&&supported.includes(layout.font))names.push(layout.font);
    let selected=supported.includes(layout.font)?layout.font:'Roboto';
    function close(){options.hidden=true;button.setAttribute('aria-expanded','false');}
    function update(){button.textContent=selected;button.style.fontFamily='"'+selected+'", sans-serif';for(const item of options.children)item.setAttribute('aria-selected',String(item.dataset.font===selected));}
    async function choose(name){selected=name;layout.font=name;update();close();button.focus();changed();try{await window.QRGenerator['cart-fonts'].ready(name);if(picker.isConnected&&layout.font===name)changed();}catch{window.QRGenerator.notifications.toast(t('Schriftart konnte nicht geladen werden.'),'warning');}}
    for(const name of names){const item=document.createElement('button');item.type='button';item.setAttribute('role','option');item.tabIndex=-1;item.dataset.font=name;item.textContent=name;item.style.fontFamily='"'+name+'", sans-serif';item.addEventListener('click',()=>choose(name));options.append(item);}
    function open(){options.hidden=false;button.setAttribute('aria-expanded','true');options.children[names.indexOf(selected)].focus();}
    button.addEventListener('click',()=>options.hidden?open():close());
    button.addEventListener('keydown',event=>{if(['ArrowDown','ArrowUp'].includes(event.key)){event.preventDefault();open();}});
    options.addEventListener('keydown',event=>{const index=[...options.children].indexOf(document.activeElement);if(event.key==='Escape'){event.preventDefault();event.stopPropagation();close();button.focus();}else if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)){event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?names.length-1:(index+(event.key==='ArrowDown'?1:names.length-1))%names.length;options.children[next].focus();}});
    picker.addEventListener('focusout',event=>{if(!picker.contains(event.relatedTarget))close();});
    picker.append(button,options);host.append(label,picker);update();

  }
  window.QRGenerator["cart-fields"] = {
    fonts,
    supported,
    clean,
    source,
    detect,
    titleValid,
    render,
  };
})();
