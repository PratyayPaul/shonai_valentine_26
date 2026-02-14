const state = { act1Done: false };

const starsLayer = document.getElementById("starsLayer");
const moonBtn = document.getElementById("moonBtn");
const moonlight = document.getElementById("moonlight");
const toast = document.getElementById("toast");
const continueBtn = document.getElementById("continueBtn");
const nextActMount = document.getElementById("nextActMount");

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 1600);
}

// Background ambient stars
function spawnBackgroundStars(count = 70) {
  const w = window.innerWidth;
  const h = window.innerHeight;

  starsLayer.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const s = document.createElement("div");
    s.className = "bg-star";

    s.style.left = `${Math.random() * w}px`;
    s.style.top = `${Math.random() * h}px`;
    s.style.animationDuration = `${4 + Math.random() * 6}s`;
    s.style.animationDelay = `${Math.random() * 3}s`;
    s.style.opacity = (0.45 + Math.random() * 0.55).toFixed(2);

    starsLayer.appendChild(s);
  }
}

function buildAct1Stars() {
  starField.innerHTML = "";

  const starsCount = 14;
  const specialIndex = Math.floor(Math.random() * starsCount);

  for (let i = 0; i < starsCount; i++) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "star-btn";

    // random placement
    btn.style.left = `${8 + Math.random() * 84}%`;
    btn.style.top  = `${12 + Math.random() * 76}%`;

    if (i === specialIndex) {
      btn.classList.add("star-special");
      btn.dataset.special = "true";
      btn.setAttribute("aria-label", "Glowing star");
    } else {
      btn.setAttribute("aria-label", "Star");
    }

    btn.addEventListener("click", () => onStarClick(btn));
    starField.appendChild(btn);
  }

  showToast("Tap the glowing star 🌟");
}

function onStarClick(btn) {
  if (state.act1Done) return;

  const isSpecial = btn.dataset.special === "true";

  if (!isSpecial) {
    btn.animate(
      [
        { transform: "translate(-50%, -50%) scale(1)" },
        { transform: "translate(-50%, -50%) scale(1.22)" },
        { transform: "translate(-50%, -50%) scale(1)" },
      ],
      { duration: 260, easing: "ease-out" }
    );
    showToast("Nope, not that one 😄");
    return;
  }

  // Special star found
  state.act1Done = true;

  // Shooting star trail
  const rect = starField.getBoundingClientRect();
  const starRect = btn.getBoundingClientRect();

  const trail = document.createElement("div");
  trail.className = "trail";
  trail.style.left = `${starRect.left - rect.left}px`;
  trail.style.top  = `${starRect.top - rect.top}px`;
  starField.appendChild(trail);

  btn.classList.add("shooting");
  showToast("You found it 🤍");

  setTimeout(() => {
    trail.remove();
    continueBtn.classList.remove("hidden");
    continueBtn.focus({ preventScroll: true });
  }, 920);
}

// For now, Continue just scrolls a tiny bit and shows a message.
// Next step: we will inject Act 2 here.
continueBtn.addEventListener("click", () => {
  showToast("Act 2 revealed ✨");
  renderAct2();
  nextActMount.scrollIntoView({ behavior: "smooth", block: "start" });
});

function renderAct2(){
  // Prevent re-render if user clicks Continue again
  if (nextActMount.dataset.act2 === "true") return;
  nextActMount.dataset.act2 = "true";

  // You can edit these later (romantic-soft)
  const cards = [
    { title: "Something I adore", text: "I adore your thinking, your understanding, the way you look at relationships. The more I know you, the more I feel like you are the kind of person I want to be with forever."},
    { title: "A tiny promise", text: "I promise of no ego, no silence, no running away. We will talk, we will heal, and we will choose each other even on the hard days." },
    { title: "My favorite ‘you’", text: "My favorite you is you on our video calls. Those cute expressions, your little reactions, your stories. In those minutes, I am genuinely the happiest person." },
    { title: "A moment I replay", text: "The moment you smile… it stays with me.I replay it in my mind like a habit and it makes my whole heart feel calm and full." },
    { title: "What I’m waiting for", text: "I am waiting for the day I can hold your hand and whisper, “We made it, love.” And then live the simplest life with you. Our small routines, warm evenings, and you beside me." },
    { title: "One soft truth", text: "This is our first Valentine’s Day and I only want it to be you every year. I am not here for a moment, Oeshmita. I am here for forever." },
  ];

  nextActMount.innerHTML = `
    <section class="act2-wrap" id="act2">
      <div class="act-content">
        <p class="tiny">💌 Act 2 — Memory Wall</p>
        <h2 class="act2-title">A few little truths… just for you</h2>
        <p class="act2-subtitle">Tap each card to flip it. Open all 6 to unlock the next step ✨</p>

        <div class="progress-row">
          <span class="progress-pill" id="act2Progress">Opened 0 / 6</span>
          <span class="progress-pill">Tip:Read them slowly 🤍</span>
        </div>

        <div class="grid" id="act2Grid"></div>

        <div class="act2-continue">
          <button class="primary hidden" id="act2Continue" type="button">
            Continue to Act 3 ✨
          </button>
        </div>
      </div>
    </section>
  `;

  const grid = document.getElementById("act2Grid");
  const progress = document.getElementById("act2Progress");
  const act2Continue = document.getElementById("act2Continue");

  let opened = 0;

  cards.forEach((c, idx) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-inner">
        <div class="face front">
          <div class="card-title">${c.title}</div>
        </div>
        <div class="face back">
          <div class="card-text">${c.text}</div>
        </div>
      </div>
    `;

    // prevent double-count on repeated clicks
    let counted = false;

    card.addEventListener("click", () => {
      card.classList.toggle("flipped");

      // Count only first time it gets flipped open
      if (card.classList.contains("flipped") && !counted){
        counted = true;
        opened += 1;
        progress.textContent = `Opened ${opened} / 6`;

        if (opened === cards.length){
          showToast("Act 3 unlocked 💗");
          act2Continue.classList.remove("hidden");
          act2Continue.focus({ preventScroll: true });
        }
      }
    });

    grid.appendChild(card);
  });

act2Continue.addEventListener("click", () => {
  showToast("Act 3 revealed 💗");
  renderAct3();
  document.getElementById("act3").scrollIntoView({ behavior: "smooth", block: "start" });
}, { once: true });

}

function renderAct3(){
  // Prevent re-render
  if (nextActMount.dataset.act3 === "true") return;
  nextActMount.dataset.act3 = "true";

  // Append Act 3 after Act 2 (keep Act 1/2 intact)
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <section class="act3-wrap" id="act3">
      <div class="act-content">
        <p class="tiny">💗 Act 3 — A tiny quest</p>
        <h2 class="act3-title">Find 3 hidden hearts</h2>
        <p class="act3-subtitle">Move your mouse around… the hearts are hiding. Tap to collect 🤍</p>

        <div class="progress-row">
          <span class="progress-pill" id="heartProgress">Hearts found 0 / 3</span>
          <span class="progress-pill">Tip: Look around the box ✨</span>
        </div>

        <div class="quest-area" id="questArea" aria-label="Find three hearts"></div>

        <div class="reveal hidden" id="valentineReveal">
          <h3 class="big-question">Will you be my Valentine, Oeshmita? 🤍</h3>
          <div class="btn-row">
            <button class="secondary" id="btnHug" type="button">First, a hug 🫂</button>
            <button class="primary" id="btnAlways" type="button">Always 🤍</button>
          </div>
        </div>
      </div>
    </section>
  `;

  nextActMount.appendChild(wrapper);

  const questArea = document.getElementById("questArea");
  const heartProgress = document.getElementById("heartProgress");
  const reveal = document.getElementById("valentineReveal");

  // Spotlight tracking (mouse + touch)
function setSpotlight(clientX, clientY){
  const r = questArea.getBoundingClientRect();
  const x = ((clientX - r.left) / r.width) * 100;
  const y = ((clientY - r.top) / r.height) * 100;

  questArea.style.setProperty("--mx", `${x}%`);
  questArea.style.setProperty("--my", `${y}%`);
}

questArea.addEventListener("mousemove", (e) => setSpotlight(e.clientX, e.clientY));
questArea.addEventListener("touchmove", (e) => {
  const t = e.touches[0];
  if (t) setSpotlight(t.clientX, t.clientY);
}, { passive: true });

questArea.addEventListener("touchstart", (e) => {
  const t = e.touches[0];
  if (t) setSpotlight(t.clientX, t.clientY);
}, { passive: true });

// Warmer hints: show a hint when she taps/clicks the area (not a heart)
let lastHintTime = 0;
function warmerHint(minDistPx){
  const now = Date.now();
  if (now - lastHintTime < 600) return; // avoid spam
  lastHintTime = now;

  if (minDistPx < 60) showToast("So close… 💗");
  else if (minDistPx < 120) showToast("Warm ✨");
  else showToast("Not here 😄 (try another corner ✨");
}


  let found = 0;

  // Place 3 hearts (visible but small)
  const hearts = [
    { x: 12, y: 18 },
    { x: 84, y: 32 },
    { x: 70, y: 78 },
  ];

// store heart DOM nodes + positions for proximity checks
const heartNodes = [];

hearts.forEach((pos) => {
  const h = document.createElement("button");
  h.type = "button";
  h.className = "heart small";
  h.style.left = `${pos.x}%`;
  h.style.top = `${pos.y}%`;
  h.setAttribute("aria-label", "Hidden heart");

  let collected = false;

  h.addEventListener("click", (e) => {
    e.stopPropagation();
    if (collected) return;
    collected = true;

    h.classList.add("collected");
    found += 1;

    heartProgress.textContent = `Hearts found ${found} / 3`;
    showToast("💗 +1 heart found!");

    if (found === 3) {
      showToast("Unlocked ✨");
      reveal.classList.remove("hidden");
      reveal.scrollIntoView({ behavior: "smooth", block: "center" });

     document.getElementById("btnAlways").addEventListener("click", () => {
  showToast("Final Reveal 💌");
  renderFinal("always");
}, { once: true });

document.getElementById("btnHug").addEventListener("click", () => {
  showToast("Final Reveal 💌");
  renderFinal("hug");
}, { once: true });

    }
  });

  questArea.appendChild(h);
  heartNodes.push({ el: h, pos });
});

// Reveal hearts when spotlight is near + give warmer hints on clicks
function updateProximity(clientX, clientY){
  const r = questArea.getBoundingClientRect();

  // distance from pointer to each heart in px
  let minDist = Infinity;

  heartNodes.forEach(({ el, pos }) => {
    if (el.classList.contains("collected")) return;

    const hx = r.left + (pos.x / 100) * r.width;
    const hy = r.top + (pos.y / 100) * r.height;

    const dx = clientX - hx;
    const dy = clientY - hy;
    const d = Math.sqrt(dx*dx + dy*dy);
    minDist = Math.min(minDist, d);

    // reveal if within 95px
    if (d < 95) el.classList.add("revealed");
    else el.classList.remove("revealed");
  });

  return minDist;
}

// mouse proximity
questArea.addEventListener("mousemove", (e) => {
  updateProximity(e.clientX, e.clientY);
});

// touch proximity
questArea.addEventListener("touchmove", (e) => {
  const t = e.touches[0];
  if (!t) return;
  updateProximity(t.clientX, t.clientY);
}, { passive: true });

// click/tap on empty area -> warmer hint
questArea.addEventListener("click", (e) => {
  const d = updateProximity(e.clientX, e.clientY);
  warmerHint(d);
});

}

function renderFinal(choice) {
  if (nextActMount.dataset.final === "true") return;
  nextActMount.dataset.final = "true";

  const msg =
    choice === "hug"
      ? "Come here first 🫂 because I want to hold you for a long, long time."
      : "Always 🤍 because choosing you feels like the easiest thing in the world.";

  // Your handwritten letter image (put the file in /assets)
  const letterImagePath = "assets/letter.jpeg";

  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <section class="final-wrap" id="final">
      <div class="act-content">
        <p class="tiny">💌 Final Reveal</p>
        <h2 class="final-title">I have one last thing for you…</h2>

        <p class="final-note">
          ${msg}<br/>
          Oeshmita, thank you for being you. This is our first Valentine’s Day and I am so grateful it’s with you.
        </p>

        <div class="final-box">
          <p class="final-note" style="margin:0 0 10px;">
            <strong>A handwritten note, just for you 💌</strong><br/>
            <span style="opacity:.9;">Take a deep breath… then read it slowly 🤍</span>
          </p>

          <div class="letter-wrap">
            <img class="letter-img" src="${letterImagePath}" alt="Handwritten Valentine letter" />
            <div class="letter-actions">
              <a class="secondary" href="${letterImagePath}" target="_blank" rel="noopener noreferrer">
                Open full size 🔍
              </a>
            </div>
          </div>

          <div class="final-row">
            <button class="secondary" id="finalBack" type="button">Back to the sky ✨</button>
          </div>
        </div>
      </div>
    </section>
  `;

  nextActMount.appendChild(wrapper);

    // ✅ Scroll to Final section (optional but nice)
  document.getElementById("final").scrollIntoView({ behavior: "smooth", block: "start" });

  // ✅ FIX: Attach click handler AFTER the element exists
  const backBtn = document.getElementById("finalBack");
  backBtn.addEventListener("click", () => {
    const act1 = document.getElementById("act1");
    if (act1) {
      act1.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
}




function spawnMoonFieldStars(field, count = 34){
  // Remove old stars if reloaded / re-initialized
  field.querySelectorAll(".box-star").forEach(el => el.remove());

  for (let i = 0; i < count; i++){
    const s = document.createElement("div");
    const r = Math.random();

    s.className = "box-star";
    if (r < 0.25) s.classList.add("s2");
    else if (r > 0.78) s.classList.add("s4");

    // Avoid placing stars too close to the moon center (so moon looks clean)
    // Moon is at ~62% 38% in CSS; keep a soft "no-star" radius around it.
    let x, y;
    for (let tries = 0; tries < 20; tries++){
      x = 6 + Math.random() * 88;   // %
      y = 10 + Math.random() * 78;  // %
      const dx = x - 62;
      const dy = y - 38;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist > 10) break; // keep stars a little away from moon
    }

    const dur = 2.6 + Math.random() * 3.8;
    const delay = Math.random() * 2.5;

    s.style.left = `${x}%`;
    s.style.top = `${y}%`;
    s.style.animationDuration = `${dur}s`;
    s.style.animationDelay = `${delay}s`;

    field.appendChild(s);
  }
}

function initAct1Moon(){
  showToast("Tap the moon 🌙");

  const field = document.getElementById("moonField");
  spawnMoonFieldStars(field, 38); // increase/decrease if you want

  moonBtn.addEventListener("click", () => {
    if (state.act1Done) return;
    state.act1Done = true;

    // Moonlight spill
    moonlight.classList.remove("hidden");
    moonlight.classList.add("show");

    // Small sparkles near moon
    const r = field.getBoundingClientRect();
    for (let i = 0; i < 10; i++){
      const s = document.createElement("div");
      s.className = "moon-spark";
      s.style.left = `${(0.62 * r.width) + (Math.random()*40 - 20)}px`;
      s.style.top  = `${(0.38 * r.height) + (Math.random()*40 - 20)}px`;
      s.style.setProperty("--dx", `${Math.random()*140 - 70}px`);
      s.style.setProperty("--dy", `${Math.random()*120 - 40}px`);
      field.appendChild(s);
      setTimeout(() => s.remove(), 800);
    }

    showToast("Moonlight unlocked 🤍");

    setTimeout(() => {
      continueBtn.classList.remove("hidden");
      continueBtn.focus({ preventScroll: true });
    }, 900);
  }, { once: true });
}




// Init
spawnBackgroundStars();
initAct1Moon();
window.addEventListener("resize", () => spawnBackgroundStars());
