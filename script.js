(() => {
  document.documentElement.classList.add("js");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* =========================================================
     Pack tabs + panel copy
     ========================================================= */
  const panelData = {
    papers: {
      kicker: "King size slim",
      title: "Ultra thin papers with MVP attitude.",
      copy: "32 leaves, slow burning feel, and artwork that looks good before the roll even starts."
    },
    hemp: {
      kicker: "100% organic hemp",
      title: "Smoother, cleaner, better rolls.",
      copy: "A chlorine-free paper feel with a premium finish and an easy burn made for conscious sessions."
    },
    story: {
      kicker: "Community first",
      title: "Started with friends, built for culture.",
      copy: "MVP connects street energy, outdoor moments, music, and the people who keep the circle alive."
    },
    stores: {
      kicker: "Offline stores",
      title: "Rolling through Lebanon.",
      copy: "Find MVP in Beirut, Achrafieh, Fanar, Batroun, Mansourieh, Baabda, Broumana, Dekwaneh, and more."
    }
  };

  const packStage = document.querySelector("[data-pack-stage]");
  const packZone = document.querySelector(".pack-zone");
  const openButtons = document.querySelectorAll("[data-open-pack]");
  const tabs = document.querySelectorAll(".paper-tab");
  const tabPanel = document.querySelector(".tab-panel");
  const panelKicker = document.querySelector("[data-panel-kicker]");
  const panelTitle = document.querySelector("[data-panel-title]");
  const panelCopy = document.querySelector("[data-panel-copy]");

  const openPack = () => {
    packStage?.classList.add("is-open");
  };

  const setActiveTab = (tabName) => {
    const data = panelData[tabName];
    if (!data) return;

    openPack();

    tabs.forEach((tab) => {
      const isActive = tab.dataset.tab === tabName;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
    });

    // restart the swap animation, then write the new copy
    tabPanel?.classList.remove("panel-swap");
    void tabPanel?.offsetWidth;
    panelKicker.textContent = data.kicker;
    panelTitle.textContent = data.title;
    panelCopy.textContent = data.copy;
    if (!reduceMotion) tabPanel?.classList.add("panel-swap");
  };

  openButtons.forEach((button) => button.addEventListener("click", openPack));
  tabs.forEach((tab) => tab.addEventListener("click", () => setActiveTab(tab.dataset.tab)));

  /* =========================================================
     Hero intro: split the headline into rising words
     ========================================================= */
  const heroTitle = document.getElementById("hero-title");
  if (heroTitle) {
    const words = heroTitle.textContent.trim().split(/\s+/);
    heroTitle.textContent = "";
    words.forEach((word, i) => {
      const outer = document.createElement("span");
      outer.className = "word";
      const inner = document.createElement("span");
      inner.textContent = word;
      inner.style.setProperty("--word-index", i);
      outer.appendChild(inner);
      heroTitle.appendChild(outer);
      if (i < words.length - 1) heroTitle.appendChild(document.createTextNode(" "));
    });
  }

  window.addEventListener("load", () => {
    requestAnimationFrame(() => document.documentElement.classList.add("is-loaded"));
    window.setTimeout(openPack, reduceMotion ? 300 : 1500);
  });

  // safety net: if load stalls (slow images), reveal anyway
  window.setTimeout(() => document.documentElement.classList.add("is-loaded"), 2500);

  /* =========================================================
     Ambient embers in the hero
     ========================================================= */
  const hero = document.querySelector(".hero");
  if (hero && !reduceMotion) {
    const layer = document.createElement("div");
    layer.className = "hero-embers";
    layer.setAttribute("aria-hidden", "true");
    const emberCount = window.innerWidth < 640 ? 8 : 16;
    for (let i = 0; i < emberCount; i++) {
      const ember = document.createElement("i");
      ember.className = "ember";
      const size = 3 + Math.random() * 4;
      ember.style.left = `${4 + Math.random() * 92}%`;
      ember.style.width = `${size}px`;
      ember.style.height = `${size}px`;
      ember.style.setProperty("--ember-duration", `${9 + Math.random() * 9}s`);
      ember.style.setProperty("--ember-delay", `${Math.random() * 12}s`);
      ember.style.setProperty("--ember-sway", `${(Math.random() * 6 - 3).toFixed(1)}rem`);
      ember.style.setProperty("--ember-opacity", (0.3 + Math.random() * 0.4).toFixed(2));
      layer.appendChild(ember);
    }
    hero.appendChild(layer);
  }

  /* =========================================================
     Pack 3D tilt follows the cursor
     ========================================================= */
  if (packZone && packStage && !reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    let rafId = null;
    let targetX = 0;
    let targetY = 0;

    const applyTilt = () => {
      packStage.style.setProperty("--tilt-x", `${targetX.toFixed(2)}deg`);
      packStage.style.setProperty("--tilt-y", `${targetY.toFixed(2)}deg`);
      rafId = null;
    };

    packZone.addEventListener("mousemove", (event) => {
      const rect = packZone.getBoundingClientRect();
      const relX = (event.clientX - rect.left) / rect.width - 0.5;
      const relY = (event.clientY - rect.top) / rect.height - 0.5;
      targetY = relX * 10; // rotateY follows horizontal movement
      targetX = relY * -8; // rotateX follows vertical movement
      if (!rafId) rafId = requestAnimationFrame(applyTilt);
    });

    packZone.addEventListener("mouseleave", () => {
      targetX = 0;
      targetY = 0;
      if (!rafId) rafId = requestAnimationFrame(applyTilt);
    });
  }

  /* =========================================================
     Infinite ticker marquee
     ========================================================= */
  const tickerTrack = document.querySelector("[data-ticker-track]");
  if (tickerTrack && !reduceMotion) {
    const originals = Array.from(tickerTrack.children);
    // duplicate until the track is at least twice the viewport, then once more
    // so translateX(-50%) loops seamlessly
    let copies = Math.max(2, Math.ceil((window.innerWidth * 2) / tickerTrack.scrollWidth) + 1);
    if (copies % 2 !== 0) copies += 1; // keep halves identical
    for (let i = 1; i < copies; i++) {
      originals.forEach((node) => {
        const clone = node.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        tickerTrack.appendChild(clone);
      });
    }
  }

  /* =========================================================
     Scroll-reveal system
     ========================================================= */
  const revealGroups = [
    { selector: ".section-heading", variant: "" },
    { selector: ".feature-tile, .spec-tile", variant: "reveal-scale", stagger: 90 },
    { selector: ".story-media", variant: "reveal-left" },
    { selector: ".story-copy", variant: "reveal-right" },
    { selector: ".map-card", variant: "reveal-left" },
    { selector: ".store-list span", variant: "", stagger: 55 },
    { selector: ".culture-gallery figure", variant: "reveal-scale", stagger: 100 },
    { selector: ".bundle img", variant: "reveal-left" },
    { selector: ".bundle-copy", variant: "reveal-right" },
    { selector: ".ticker", variant: "" }
  ];

  const revealEls = [];
  revealGroups.forEach(({ selector, variant, stagger = 0 }) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add("reveal");
      if (variant) el.classList.add(variant);
      if (stagger) el.style.setProperty("--reveal-delay", `${(i % 8) * stagger}ms`);
      revealEls.push(el);
    });
  });

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("in-view"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -6% 0px" }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* =========================================================
     Spec tile counters (100% / 32) count up on entry
     ========================================================= */
  const counters = document.querySelectorAll(".spec-tile strong");
  const runCounter = (el) => {
    const raw = el.textContent.trim();
    const target = parseInt(raw, 10);
    if (Number.isNaN(target)) return;
    const suffix = raw.replace(/^\d+/, "");
    const duration = 1300;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.closest(".spec-tile")?.classList.add("count-done");
      }
    };
    requestAnimationFrame(tick);
  };

  if (!reduceMotion && "IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => counterObserver.observe(el));
  }

  /* =========================================================
     Scroll-linked effects: progress bar, header state,
     scrollspy, image parallax — one rAF loop
     ========================================================= */
  const progressBar = document.querySelector(".scroll-progress");
  const header = document.querySelector(".site-header");
  const navLinks = Array.from(document.querySelectorAll(".site-header nav a"));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const parallaxImgs = [];
  if (!reduceMotion) {
    document
      .querySelectorAll(".story-media img, .map-card img")
      .forEach((img) => {
        img.classList.add("parallax-img");
        parallaxImgs.push(img);
      });
  }

  let scrollScheduled = false;

  const onScrollFrame = () => {
    scrollScheduled = false;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // progress bar
    if (progressBar && docHeight > 0) {
      progressBar.style.setProperty("--scroll-progress", (scrollTop / docHeight).toFixed(4));
    }

    // header state
    header?.classList.toggle("is-scrolled", scrollTop > 24);

    // scrollspy
    let activeIndex = -1;
    sections.forEach((section, i) => {
      if (section.getBoundingClientRect().top <= window.innerHeight * 0.4) activeIndex = i;
    });
    navLinks.forEach((link, i) => link.classList.toggle("is-active", i === activeIndex));

    // parallax
    const vh = window.innerHeight;
    parallaxImgs.forEach((img) => {
      const rect = img.parentElement.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > vh) return;
      const center = rect.top + rect.height / 2;
      const offset = ((center - vh / 2) / vh) * -34; // px, moves against scroll
      img.style.setProperty("--py", `${offset.toFixed(1)}px`);
    });
  };

  const requestScrollFrame = () => {
    if (!scrollScheduled) {
      scrollScheduled = true;
      requestAnimationFrame(onScrollFrame);
    }
  };

  window.addEventListener("scroll", requestScrollFrame, { passive: true });
  window.addEventListener("resize", requestScrollFrame);
  requestScrollFrame();
})();
