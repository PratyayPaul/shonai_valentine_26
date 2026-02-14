// ===============================
// Valentine Site Script (Fixed)
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  const state = { act1Done: false };

  // --- DOM refs (Act1)
  const starsLayer = document.getElementById("starsLayer");
  const moonBtn = document.getElementById("moonBtn");
  const moonlight = document.getElementById("moonlight");
  const toast = document.getElementById("toast");
  const continueBtn = document.getElementById("continueBtn");
  const nextActMount = document.getElementById("nextActMount");
  const moonField = document.getElementById("moonField");

  // Safety checks (if any id is missing, script won't crash)
  function exists(el) {
    return el !== null && el !== undefined;
  }

  function showToast(msg) {
    if (!exists(toast)) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("show"), 1600);
  }

  // -------------------------------
  // Background ambient stars (full page)
  // -------------------------------
  function spawnBackgroundStars(count = 70) {
    if (!exists(starsLayer)) return;

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

  // -------------------------------
  // Stars inside the moon box (Act1)
  // -------------------------------
  function spawnMoonFieldStars(field, count = 34) {
    if (!exists(field)) return;

    field.querySelectorAll(".box-star").forEach((el) => el.remove());

    for (let i = 0; i < count; i++) {
      const s = document.createElement("div");
      const r = Math.random();

      s.className = "box-star";
      if (r < 0.25) s.classList.add("s2");
      else if (r > 0.78) s.classList.add("s4");

      // Avoid stars too close to moon center (moon approx at 62%/38%)
      let x, y;
      for (let tries = 0; tries < 20; tries++) {
        x = 6 + Math.random() * 88; // %
        y = 10 + Math.random() * 78; // %
        const dx = x - 62;
        const dy = y - 38;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 10) break;
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

  // -------------------------------
  // Act 1 (Moon click)
  // -------------------------------
  function initAct1Moon() {
    showToast("Tap the moon 🌙");

    spawnMoonFieldStars(moonField, 38);

    if (!exists(moonBtn)) return;

    moonBtn.addEventListener(
      "click",
      () => {
        if (state.act1Done) return;
        state.act1Done = true;

        // Moonlight spill
        if (exists(moonlight)) {
          moonlight.classList.remove("hidden");
          moonlight.classList.add("show");
        }

        // Small sparkles near the moon
        if (exists(moonField)) {
          const r = moonField.getBoundingClientRect();
          for (let i = 0; i < 10; i++) {
            const sp = document.createElement("div");
            sp.className = "moon-spark";
            sp.style.left = `${0.62 * r.width + (Math.random() * 40 - 20)}px`;
            sp.style.top = `${0.38 * r.height + (Math.random() * 40 - 20)}px`;
            sp.style.setProperty("--dx", `${Math.random() * 140 - 70}px`);
            sp.style.setProperty("--dy", `${Math.random() * 120 - 40}px`);
            moonField.appendChild(sp);
            setTimeout(() => sp.remove(), 800);
          }
        }

        showToast("Moonlight unlocked 🤍");

        setTimeout(() => {
          if (exists(continueBtn)) {
            continueBtn.classList.remove("hidden");
            continueBtn.focus({ preventScroll: true });
          }
        }, 900);
      },
      { once: true }
    );
  }

  // -------------------------------
  // Continue -> Act 2
  // -------------------------------
  if (exists(continueBtn)) {
    continueBtn.addEventListener("click", () => {
      showToast("Act 2 revealed ✨");
      renderAct2();
      if (exists(nextActMount)) {
        nextActMount.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  // -------------------------------
  // Act 2 (Flip cards)
  // -------------------------------
  function renderAct2() {
    if (!exists(nextActMount)) return;
    if (nextActMount.dataset.act2 === "true") return;
    nextActMount.dataset.act2 = "true";

    const cards = [
      {
        title: "Something I adore",
        text: "I adore your thinking, your understanding, the way you look at relationships. The more I know you, the more I feel like you are the kind of person I want to be with forever.",
      },
      {
        title: "A tiny promise",
        text: "I promise: no ego, no silence, no running away. We will talk, we will heal, and we will choose each other even on the hard days.",
      },
      {
        title: "My favorite ‘you’",
        text: "My favorite you is you on our video calls—those cute expressions, your little reactions, your stories. In those minutes, I’m genuinely the happiest person.",
      },
      {
        title: "A moment I replay",
        text: "The moment you smile… it stays with me. I replay it in my mind like a habit and it makes my whole heart feel calm and full.",
      },
      {
        title: "What I’m waiting for",
        text: "I’m waiting for the day I can hold your hand and whisper, “We made it, love.” Then live the simplest life with you—small routines, warm evenings, and you beside me.",
      },
      {
        title: "One soft truth",
        text: "This is our first Valentine’s Day and I only want it to be you every year. I’m not here for a moment, Oeshmita. I’m here for forever.",
      },
    ];

    nextActMount.innerHTML += `
      <section class="act2-wrap" id="act2">
        <div class="act-content">
          <p class="tiny">💌 Act 2 — Memory Wall</p>
          <h2 class="act2-title">A few little truths… just for you</h2>
          <p class="act2-subtitle">Tap each card to flip it. Open all 6 to unlock the next step ✨</p>

          <div class="progress-row">
            <span class="progress-pill" id="act2Progress">Opened 0 / 6</span>
            <span class="progress-pill">Tip: Read them slowly 🤍</span>
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

    cards.forEach((c) => {
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

      let counted = false;

      card.addEventListener("click", () => {
        card.classList.toggle("flipped");

        if (card.classList.contains("flipped") && !counted) {
          counted = true;
          opened += 1;
          if (exists(progress)) progress.textContent = `Opened ${opened} / 6`;

          if (opened === cards.length) {
            showToast("Act 3 unlocked 💗");
            if (exists(act2Continue)) {
              act2Continue.classList.remove("hidden");
              act2Continue.focus({ preventScroll: true });
            }
          }
        }
      });

      if (exists(grid)) grid.appendChild(card);
    });

    if (exists(act2Continue)) {
      act2Continue.addEventListener(
        "click",
        () => {
          showToast("Act 3 revealed 💗");
          renderAct3();
          const act3 = document.getElementById("act3");
          if (act3) act3.scrollIntoView({ behavior: "smooth", block: "start" });
        },
        { once: true }
      );
    }
  }

  // -------------------------------
  // Act 3 (Find hearts) - FIXED
  // -------------------------------
  function renderAct3() {
    if (!exists(nextActMount)) return;
    if (nextActMount.dataset.act3 === "true") return;
    nextActMount.dataset.act3 = "true";

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

    if (!questArea) return;

    // Spotlight helper
    function setSpotlight(clientX, clientY) {
      const r = questArea.getBoundingClientRect();
      const x = ((clientX - r.left) / r.width) * 100;
      const y = ((clientY - r.top) / r.height) * 100;
      questArea.style.setProperty("--mx", `${x}%`);
      questArea.style.setProperty("--my", `${y}%`);
    }

    questArea.addEventListener("mousemove", (e) => setSpotlight(e.clientX, e.clientY));
    questArea.addEventListener(
      "touchmove",
      (e) => {
        const t = e.touches[0];
        if (t) setSpotlight(t.clientX, t.clientY);
      },
      { passive: true }
    );

    questArea.addEventListener(
      "touchstart",
      (e) => {
        const t = e.touches[0];
        if (t) setSpotlight(t.clientX, t.clientY);
      },
      { passive: true }
    );

    // Warmer hints
    let lastHintTime = 0;
    function warmerHint(minDistPx) {
      const now = Date.now();
      if (now - lastHintTime < 600) return;
      lastHintTime = now;

      if (minDistPx < 60) showToast("So close… 💗");
      else if (minDistPx < 120) showToast("Warm ✨");
      else showToast("Not here 😄 (try another corner ✨)");
    }

    let found = 0;
    const hearts = [
      { x: 12, y: 18 },
      { x: 84, y: 32 },
      { x: 70, y: 78 },
    ];

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

        if (exists(heartProgress)) {
          heartProgress.textContent = `Hearts found ${found} / 3`;
        }
        showToast("💗 +1 heart found!");

        if (found === 3) {
          showToast("Unlocked ✨");
          if (exists(reveal)) {
            reveal.classList.remove("hidden");
            reveal.scrollIntoView({ behavior: "smooth", block: "center" });
          }

          const btnAlways = document.getElementById("btnAlways");
          const btnHug = document.getElementById("btnHug");

          if (btnAlways) {
            btnAlways.addEventListener(
              "click",
              () => {
                showToast("Final Reveal 💌");
                renderFinal("always");
              },
              { once: true }
            );
          }

          if (btnHug) {
            btnHug.addEventListener(
              "click",
              () => {
                showToast("Final Reveal 💌");
                renderFinal("hug");
              },
              { once: true }
            );
          }
        }
      });

      questArea.appendChild(h);
      heartNodes.push({ el: h, pos });
    });

    function updateProximity(clientX, clientY) {
      const r = questArea.getBoundingClientRect();
      let minDist = Infinity;

      heartNodes.forEach(({ el, pos }) => {
        if (el.classList.contains("collected")) return;

        const hx = r.left + (pos.x / 100) * r.width;
        const hy = r.top + (pos.y / 100) * r.height;

        const dx = clientX - hx;
        const dy = clientY - hy;
        const d = Math.sqrt(dx * dx + dy * dy);
        minDist = Math.min(minDist, d);

        if (d < 95) el.classList.add("revealed");
        else el.classList.remove("revealed");
      });

      return minDist;
    }

    questArea.addEventListener("mousemove", (e) => updateProximity(e.clientX, e.clientY));
    questArea.addEventListener(
      "touchmove",
      (e) => {
        const t = e.touches[0];
        if (!t) return;
        updateProximity(t.clientX, t.clientY);
      },
      { passive: true }
    );

    questArea.addEventListener("click", (e) => {
      const d = updateProximity(e.clientX, e.clientY);
      warmerHint(d);
    });
  }

  // -------------------------------
  // Final (Letter + Back button)
  // -------------------------------
  function renderFinal(choice) {
    if (!exists(nextActMount)) return;
    if (nextActMount.dataset.final === "true") return;
    nextActMount.dataset.final = "true";

    const msg =
      choice === "hug"
        ? "Come here first 🫂 because I want to hold you for a long, long time."
        : "Always 🤍 because choosing you feels like the easiest thing in the world.";

    // IMPORTANT: your file is in /assets/letter.jpeg
    const letterImagePath = "assets/letter.jpeg";

    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
      <section class="final-wrap" id="final">
        <div class="act-content">
          <p class="tiny">💌 Final Reveal</p>
          <h2 class="final-title">I have one last thing for you…</h2>

          <p class="final-note">
            ${msg}<br/>
            Oeshmita, thank you for being you. This is our first Valentine’s Day and I’m so grateful it’s with you.
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

    const finalSec = document.getElementById("final");
    if (finalSec) finalSec.scrollIntoView({ behavior: "smooth", block: "start" });

    const backBtn = document.getElementById("finalBack");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        const act1 = document.getElementById("act1");
        if (act1) act1.scrollIntoView({ behavior: "smooth", block: "start" });
        else window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }

  // -------------------------------
  // INIT
  // -------------------------------
  spawnBackgroundStars();
  initAct1Moon();

  window.addEventListener("resize", () => spawnBackgroundStars());
});
