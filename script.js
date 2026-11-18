(() => {
  // Change this name to switch portraits; add new sets below as needed.
  const portraitSet = 'line_v2';
  const portraitSets = {
    line_v2: {
      sage: 'assets/portrait/sho-portrait-v2-sage.png',
      ocean: 'assets/portrait/sho-portrait-v2-ocean.png',
      plum: 'assets/portrait/sho-portrait-v2-plum.png'
    }
  };
  const themeButtons = Array.from(document.querySelectorAll('[data-theme-choice]'));
  function setTheme(theme) {
    if (!['sage', 'ocean', 'plum'].includes(theme)) theme = 'sage';
    document.documentElement.dataset.theme = theme;
    const portrait = document.querySelector('[data-theme-portrait]');
    if (portrait) {
      const selected = portraitSets[portraitSet] || portraitSets.line_v2;
      portrait.src = selected[theme] || selected.sage;
    }
    themeButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.themeChoice === theme)));
    try { localStorage.setItem('site-theme', theme); } catch (_) { /* The switch still works without storage. */ }
  }
  let savedTheme;
  try { savedTheme = localStorage.getItem('site-theme'); } catch (_) { /* Use sage by default. */ }
  setTheme(savedTheme || 'sage');
  themeButtons.forEach(button => button.addEventListener('click', () => setTheme(button.dataset.themeChoice)));
  const buttons = document.querySelectorAll('[data-lang]');
  function setLanguage(language) {
    document.documentElement.lang = language;
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.lang === language)));
    try { localStorage.setItem('site-language', language); } catch (_) { /* The switch still works without storage. */ }
  }
  let saved;
  try { saved = localStorage.getItem('site-language'); } catch (_) { /* Use English by default. */ }
  if (saved === 'ja' || saved === 'en') setLanguage(saved);
  buttons.forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.lang)));
  document.querySelectorAll('.figure-gallery').forEach(gallery => {
    const slides = Array.from(gallery.querySelectorAll('[data-slide]'));
    const controls = Array.from(gallery.querySelectorAll('[data-figure]'));
    controls.forEach(control => control.addEventListener('click', () => {
      const index = Number(control.dataset.figure);
      slides.forEach((slide, i) => { slide.hidden = i !== index; });
      controls.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    }));
  });
  const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
  function selectTab(selected, focus = false) {
    tabs.forEach(tab => {
      const active = tab === selected;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      document.getElementById(tab.getAttribute('aria-controls')).hidden = !active;
    });
    if (focus) selected.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); selectTab(tabs[next], true); }
    });
  });
})();
