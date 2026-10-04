const F1_CHECKER = { type: "checker", size: 12, c1: "#ffffff", c2: "#111111" };
const FILM_HOLES = { type: "stripes", size: 7, c1: "#f4e9d0", c2: "transparent" };
const CANDY_STRIPES = { type: "circle", size: 10, c1: "#f4a6c0", c2: "#ffffff" };

const STRIP_STYLES = {
  basic: {
    name: "Basic",
    desc: "Pick your own color",
  },

  f1: {
    name: "F1 Racing",
    desc: "Checkered flag, race-day red",
    bg: "#15151e",
    text: "#ffffff",
    border: "none",
    textFont: "Impact, 'Arial Black', sans-serif",
    textStyle: "normal",
    textTransform: "uppercase",
    letterSpacing: "2px",
    top: { h: 12, pattern: F1_CHECKER },
    bottom: { h: 12, pattern: F1_CHECKER },
  },

  film: {
    name: "Film Roll",
    desc: "Classic 35mm look",
    bg: "#1b1b1b",
    text: "#f4e9d0",
    border: "none",
    textFont: "'Courier New', monospace",
    textStyle: "normal",
    textTransform: "none",
    letterSpacing: "1px",
    top: { h: 8, pattern: FILM_HOLES },
    bottom: { h: 8, pattern: FILM_HOLES },
  },

  candy: {
    name: "Candy Stripes",
    desc: "Sweet pink and white",
    bg: "#fff5f8",
    text: "#b0476b",
    border: "none",
    textFont: "'Dancing Script', cursive",
    textStyle: "italic",
    textTransform: "none",
    letterSpacing: "normal",
    top: { h: 10, pattern: CANDY_STRIPES },
    bottom: { h: 10, pattern: CANDY_STRIPES },
  },
};

function parseColor(c) {
  if (!c) return [255, 255, 255];
  if (c[0] === "#") {
    let h = c.slice(1);
    if (h.length === 3) h = h.split("").map((x) => x + x).join("");
    return [0, 2, 4].map((i) => parseInt(h.substr(i, 2), 16));
  }
  const m = c.match(/\d+/g);
  return m ? m.slice(0, 3).map(Number) : [255, 255, 255];
}

function patternCss(p) {
  if (p.type === "checker") {
    return ("repeating-conic-gradient(" + p.c1 + " 0% 25%, " + p.c2 + " 0% 50%) 0 0 / " + p.size + "px " + p.size + "px");
  }
  if (p.type === "circle"){
    return ("radial-gradient(circle, " + p.c1 + " 50%, " + p.c2 + " 50%) 0 0 / " + p.size + "px " + p.size + "px");
  }
  return ("repeating-linear-gradient(90deg, " + p.c1 + " 0 " + p.size + "px, " + p.c2 + " " + p.size + "px " + p.size * 2 + "px)");
}

function makeDecor(spec) {
  const el = document.createElement("div");
  el.className = "strip-decor";
  el.dataset.pattern = JSON.stringify(spec.pattern); // dibaca saat membuat gambar download
  el.style.gridColumn = "1 / -1";
  el.style.width = "100%";
  el.style.height = spec.h + "px";
  el.style.background = patternCss(spec.pattern);
  return el;
}

function styleStrip(strip, textEl, opts) {
  opts = opts || {};
  const id = opts.id || localStorage.getItem("photoStyle") || "basic";
  const known = !!STRIP_STYLES[id];
  const cfg = STRIP_STYLES[id] || STRIP_STYLES.basic;
  const isBasic = !known || id === "basic";

  strip.querySelectorAll(".strip-decor").forEach((e) => e.remove());

  let bg, text;
  if (isBasic) {
    bg = opts.color || localStorage.getItem("photoBackgroundColor") || "#fffdfc";
    const [r, g, b] = parseColor(bg);
    text = (r * 299 + g * 587 + b * 114) / 1000 < 128 ? "#f0f0f0" : "#121212";
  } else {
    bg = cfg.bg;
    text = cfg.text;
  }

  strip.style.backgroundColor = bg;
  strip.style.border = isBasic ? "none" : cfg.border || "none";

  if (textEl) {
    textEl.style.color = text;
    textEl.style.fontFamily = isBasic ? "'Dancing Script', cursive" : cfg.textFont;
    textEl.style.fontStyle = isBasic ? "italic" : cfg.textStyle || "normal";
    textEl.style.textTransform = isBasic ? "none" : cfg.textTransform || "none";
    textEl.style.letterSpacing = isBasic ? "normal" : cfg.letterSpacing || "normal";
  }

  if (!isBasic) {
    if (cfg.top) strip.insertBefore(makeDecor(cfg.top), strip.firstChild);
    if (cfg.bottom) strip.appendChild(makeDecor(cfg.bottom));
  }

  return { id, bg, text, isBasic };
}
