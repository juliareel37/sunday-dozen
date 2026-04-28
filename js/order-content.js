const ORDER_JSON_PATH = "content/order.json";

const getEmbedDimension = (preferred, fallback) => {
  const parsed = Number.parseInt(preferred, 10);
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }
  return fallback;
};

const applyResponsiveEmbedFrame = (frame, preferredHeight, fallbackHeight) => {
  const height = getEmbedDimension(preferredHeight, fallbackHeight);
  frame.classList.add("order-embed-frame");
  frame.width = "100%";
  frame.height = String(height);
  frame.style.setProperty("--embed-height", `${height}px`);
};

const attachGoogleAutoHeight = (frame, container, preferredWidth, preferredHeight) => {
  void container;
  void preferredWidth;
  const fixedHeight = getEmbedDimension(preferredHeight, 1604);
  frame.height = String(fixedHeight);
  frame.style.setProperty("--embed-height", `${fixedHeight}px`);
};

const parseEmbedInput = (value) => {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  const iframeMatch = trimmed.match(/<iframe\b[^>]*>/i);
  if (!iframeMatch) {
    return { src: trimmed };
  }

  const tag = iframeMatch[0];
  const getAttr = (name) => {
    const match = tag.match(new RegExp(`${name}\\s*=\\s*["']([^"']+)["']`, "i"));
    return match ? match[1] : null;
  };

  const width = getAttr("width");
  const height = getAttr("height");

  return {
    src: getAttr("src"),
    width: width && width.trim() ? width.trim() : null,
    height: height && height.trim() ? height.trim() : null,
    title: getAttr("title"),
  };
};

const ensureTallyEmbedScript = () => {
  const doc = document;
  const src = "https://tally.so/widgets/embed.js";

  const run = () => {
    if (typeof Tally !== "undefined") {
      Tally.loadEmbeds();
      return;
    }

    doc
      .querySelectorAll("iframe[data-tally-src]:not([src])")
      .forEach((frame) => {
        frame.src = frame.dataset.tallySrc;
      });
  };

  if (typeof Tally !== "undefined") {
    run();
    return;
  }

  if (doc.querySelector(`script[src="${src}"]`)) {
    run();
    return;
  }

  const script = doc.createElement("script");
  script.src = src;
  script.onload = run;
  script.onerror = run;
  doc.body.appendChild(script);
};

const renderTally = (tally, container) => {
  const parsed = parseEmbedInput(tally.embedSrc);
  if (!parsed || !parsed.src) return;

  const frame = document.createElement("iframe");
  frame.dataset.tallySrc = parsed.src;
  frame.loading = "lazy";
  applyResponsiveEmbedFrame(frame, tally.height || parsed.height, 1500);
  frame.setAttribute("frameborder", "0");
  frame.setAttribute("marginheight", "0");
  frame.setAttribute("marginwidth", "0");
  frame.title = tally.title || parsed.title || "";
  container.appendChild(frame);
  ensureTallyEmbedScript();
};

const renderGoogleForm = (google, container) => {
  const parsed = parseEmbedInput(google.embedSrc);
  if (!parsed || !parsed.src) return;
  const preferredWidth = parsed.width || google.width;
  const preferredHeight = parsed.height || google.height;

  const frame = document.createElement("iframe");
  frame.src = parsed.src;
  frame.loading = "lazy";
  applyResponsiveEmbedFrame(frame, preferredHeight, 1604);
  frame.setAttribute("frameborder", "0");
  frame.setAttribute("marginheight", "0");
  frame.setAttribute("marginwidth", "0");
  frame.setAttribute("scrolling", "auto");
  frame.title = google.title || parsed.title || "Form";
  frame.textContent = "Loading\u2026";
  container.appendChild(frame);
  attachGoogleAutoHeight(
    frame,
    container,
    preferredWidth,
    preferredHeight
  );
};

const renderOrderPage = (data) => {
  if (!data) return;

  if (data.meta && data.meta.title) {
    document.title = data.meta.title;
  }

  const heroTitle = document.getElementById("order-hero-title");
  if (heroTitle && data.pageHero && data.pageHero.title) {
    heroTitle.textContent = data.pageHero.title;
  }

  const formContainer = document.getElementById("order-tally");
  const legacyTally = data.tally;
  const form = data.form || (legacyTally ? { provider: "tally", tally: legacyTally } : null);

  if (formContainer && form) {
    formContainer.innerHTML = "";
    if (form.provider === "google" && form.google && form.google.embedSrc) {
      renderGoogleForm(form.google, formContainer);
    } else if (form.tally && form.tally.embedSrc) {
      renderTally(form.tally, formContainer);
    }
  }

  if (typeof window.initReveal === "function") {
    window.initReveal(document);
  } else {
    window.__revealPending = true;
  }
};

fetch(ORDER_JSON_PATH)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to load order content");
    }
    return response.json();
  })
  .then(renderOrderPage)
  .catch((error) => {
    console.error(error);
  });