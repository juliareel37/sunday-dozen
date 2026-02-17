const ORDER_JSON_PATH = "content/order.json";

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
  const frame = document.createElement("iframe");
  frame.dataset.tallySrc = tally.embedSrc;
  frame.loading = "lazy";
  frame.width = "100%";
  frame.height = String(tally.height || 1500);
  frame.setAttribute("frameborder", "0");
  frame.setAttribute("marginheight", "0");
  frame.setAttribute("marginwidth", "0");
  frame.title = tally.title || "";
  container.appendChild(frame);
  ensureTallyEmbedScript();
};

const renderGoogleForm = (google, container) => {
  const frame = document.createElement("iframe");
  frame.src = google.embedSrc;
  frame.loading = "lazy";
  frame.width = String(google.width || "100%");
  frame.height = String(google.height || 1000);
  frame.setAttribute("frameborder", "0");
  frame.setAttribute("marginheight", "0");
  frame.setAttribute("marginwidth", "0");
  frame.title = google.title || "Form";
  frame.textContent = "Loading\u2026";
  container.appendChild(frame);
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
