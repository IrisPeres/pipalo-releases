/* Pip demo: every .pip-slot gets its own copy of the mascot from <template id="pip-tpl">. No network, no storage. */
(() => {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tpl = document.getElementById('pip-tpl');
  const WAVE = 'M-100 0 Q-75 -10 -50 0 T0 0 T50 0 T100 0 T150 0 T200 0 T250 0 T300 0';
  let uid = 0;

  /** One mascot. Fill goes from 0% at the feet (y 130) to 100% at the top of the head (y 20), as in the app. */
  function makePip(slot) {
    const n = ++uid;
    slot.innerHTML = tpl.innerHTML.replace(/clip-(idle|hot|nudge)/g, `clip-$1-${n}`);
    const svg = slot.querySelector('svg');
    svg.querySelectorAll('.wave').forEach((w) => {
      w.setAttribute('shape-rendering', 'geometricPrecision');
      const area = document.createElementNS(NS, 'path');
      area.setAttribute('d', `${WAVE} V10 H-100Z`);
      area.setAttribute('fill', '#D97757');
      const line = document.createElementNS(NS, 'path');
      line.setAttribute('d', WAVE);
      line.setAttribute('fill', 'none');
      line.setAttribute('stroke', '#f0a58a');
      line.setAttribute('stroke-width', 3);
      line.setAttribute('stroke-linecap', 'round');
      w.append(area, line);
    });
    svg.querySelectorAll('.st-idle .face rect[height="20"], .st-nudge .eyes-open rect, .st-nudge .eyes-closed rect').forEach((r) => r.classList.add('eye'));

    let pct = 0;
    let forced = null;
    const apply = (s) => {
      svg.classList.remove('s-idle', 's-hot', 's-nudge');
      svg.classList.add(`s-${s}`);
    };
    const pip = {
      svg,
      get pct() { return pct; },
      setPct(p, burning = false) {
        pct = Math.max(0, Math.min(100, p));
        const y = 130 - (110 * pct) / 100;
        svg.querySelectorAll('.fillr').forEach((r) => r.setAttribute('y', y));
        svg.querySelectorAll('.wave-pos').forEach((g) => g.setAttribute('transform', `translate(0 ${y})`));
        svg.classList.toggle('full', pct >= 90);
        if (!forced) apply(pct >= 80 || burning ? 'hot' : 'idle');
      },
      /** A wellness reminder pose: state "nudge" plus the kind of move (water, lunch, shutdown...). null returns to usage mode. */
      nudge(kind) {
        [...svg.classList].filter((c) => c.startsWith('k-')).forEach((c) => svg.classList.remove(c));
        forced = kind;
        if (kind) {
          svg.classList.add(`k-${kind}`);
          apply('nudge');
        } else apply(pct >= 80 ? 'hot' : 'idle');
      },
    };
    pip.setPct(Number(slot.dataset.pct ?? 0));
    return pip;
  }
  const slot = (id) => document.getElementById(id);

  /* ---- hero: the water is the token budget ---- */
  const CAPTIONS = [
    [100, "Full! Pip can't hold any more."],
    [90, "90%! Pip's head is filling up."],
    [80, '80% spent. Pip is getting nervous.'],
    [50, "Halfway through this month's budget. Pace yourself!"],
    [0, 'Calm. Vibes are unmetered.'],
  ];
  const BURN_QUIPS = ['Tokens go brrr. Pip is concerned.', 'Is this a refactor or a bonfire?', 'Sprinting. Sweating. Regretting the monorepo.'];
  const hero = makePip(slot('pip-hero'));
  const range = document.getElementById('usage');
  const readout = document.getElementById('usage-readout');
  const caption = document.getElementById('usage-caption');
  const burnBtn = document.getElementById('burn');
  let burning = false;
  let auto = !reduced;
  let dir = 1;
  let quip = 0;

  function showHero(p) {
    hero.setPct(p, burning);
    range.value = String(Math.round(p));
    readout.textContent = `${Math.round(p)}% of the monthly budget`;
    caption.textContent = burning && p < 100 ? BURN_QUIPS[quip % BURN_QUIPS.length] : CAPTIONS.find(([t]) => p >= t)[1];
  }
  range.addEventListener('input', () => {
    auto = false;
    burning = false;
    burnBtn.setAttribute('aria-pressed', 'false');
    burnBtn.textContent = 'Burn tokens fast';
    showHero(Number(range.value));
  });
  burnBtn.addEventListener('click', () => {
    auto = false;
    burning = !burning;
    quip++;
    burnBtn.setAttribute('aria-pressed', String(burning));
    burnBtn.textContent = burning ? 'Cool down' : 'Burn tokens fast';
    if (!burning) showHero(hero.pct);
  });
  showHero(Number(range.value));
  setInterval(() => {
    if (document.hidden) return;
    if (burning) {
      showHero(Math.min(100, hero.pct + 1.4));
      if (hero.pct >= 100) { burning = false; burnBtn.setAttribute('aria-pressed', 'false'); burnBtn.textContent = 'Burn tokens fast'; showHero(100); }
    } else if (auto) {
      const next = hero.pct + dir * 0.35;
      if (next >= 96) dir = -1;
      if (next <= 8) dir = 1;
      showHero(next);
    }
  }, 60);

  /* ---- the three moods of the water ---- */
  ['pip-calm', 'pip-hot', 'pip-full'].forEach((id) => makePip(slot(id)));

  /* ---- funniest messages: strings from the app's own reminders ---- */
  const MESSAGES = [
    { kind: 'water', title: 'Hydration check', text: 'Hydrate or diedrate. Grab a glass and drink up.' },
    { kind: 'water', title: 'Sip sip hooray', text: 'Coffee is not water. Pip checked. Go fill that glass.' },
    { kind: 'posture', title: 'Posture check', text: 'Shoulders down, back supported, screen at eye level, feet flat. Pip is judging you. Lovingly.' },
    { kind: 'lunch', title: 'Feed the human', text: 'Pip runs on tokens. You run on lunch. Go eat, for real, away from the screen.' },
    { kind: 'fruitPm', title: 'Second fruit!', text: 'Round two of fruit. Pip believes in your afternoon.' },
    { kind: 'eyes', title: 'Blink break', text: 'Look far away, then blink slowly 10 times. Pip is great at blinking.' },
    { kind: 'shutdown', title: 'Log off, human', text: 'The best code is written by rested people. Wrap up, leave a note for future-you, and disconnect.' },
  ];
  const talker = makePip(slot('pip-talk'));
  const bTitle = document.getElementById('msg-title');
  const bText = document.getElementById('msg-text');
  const counter = document.getElementById('msg-count');
  const pauseBtn = document.getElementById('msg-pause');
  let i = 0;
  let playing = !reduced;
  function show(k) {
    i = (k + MESSAGES.length) % MESSAGES.length;
    const m = MESSAGES[i];
    talker.nudge(m.kind);
    bTitle.textContent = m.title;
    bText.textContent = m.text;
    counter.textContent = `${i + 1} / ${MESSAGES.length}`;
  }
  document.getElementById('msg-next').addEventListener('click', () => show(i + 1));
  document.getElementById('msg-prev').addEventListener('click', () => show(i - 1));
  pauseBtn.addEventListener('click', () => {
    playing = !playing;
    pauseBtn.textContent = playing ? 'Pause' : 'Play';
    pauseBtn.setAttribute('aria-pressed', String(!playing));
  });
  pauseBtn.textContent = playing ? 'Pause' : 'Play';
  pauseBtn.setAttribute('aria-pressed', String(!playing));
  show(0);
  setInterval(() => { if (playing && !document.hidden) show(i + 1); }, 6500);
})();
