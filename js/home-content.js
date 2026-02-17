const HOME_JSON_PATH = "content/home.json";

const hydrateRevealIfNeeded = (root) => {
  if (typeof window.initReveal === "function") {
    window.initReveal(root || document);
  } else {
    window.__revealPending = true;
  }
};

const hydrateFaqIfNeeded = (root) => {
  if (typeof window.initFaq === "function") {
    window.initFaq(root || document);
  } else {
    window.__faqPending = true;
  }
};

const setText = (el, text) => {
  if (!el) return;
  el.textContent = text || "";
};

const buildHero = (hero) => {
  const section = document.createElement("section");
  section.className = "band band-hero reveal";
  section.dataset.delay = "0.12s";

  const container = document.createElement("div");
  container.className = "container hero-layout";

  const text = document.createElement("div");
  text.className = "hero-text";

  const title = document.createElement("h1");
  title.className = "hero-title";

  (hero.titleLines || []).forEach((line, index) => {
    const span = document.createElement("span");
    span.className = "reveal";
    const baseDelay = 0.2 + index * 0.08;
    span.dataset.delay = `${baseDelay.toFixed(2)}s`;
    span.textContent = line;
    title.appendChild(span);
  });

  const eyebrow = document.createElement("p");
  eyebrow.className = "eyebrow";
  setText(eyebrow, hero.eyebrow);

  const actions = document.createElement("div");
  actions.className = "hero-actions";

  if (hero.cta && hero.cta.href) {
    const cta = document.createElement("a");
    cta.className = "button ghost reveal";
    cta.dataset.delay = "0.52s";
    cta.href = hero.cta.href;
    cta.textContent = hero.cta.label || "Learn more";
    actions.appendChild(cta);
  }

  text.appendChild(title);
  text.appendChild(eyebrow);
  text.appendChild(actions);

  const media = document.createElement("div");
  media.className = "hero-media reveal";
  media.dataset.delay = "0.3s";
  media.setAttribute("aria-hidden", "true");

  if (hero.image && hero.image.src) {
    const img = document.createElement("img");
    img.src = hero.image.src;
    img.alt = hero.image.alt || "";
    img.className = "hero-image";
    media.appendChild(img);
  }

  container.appendChild(text);
  container.appendChild(media);
  section.appendChild(container);
  return section;
};

const buildAbout = (about) => {
  const section = document.createElement("section");
  section.className = "band band-highlights";

  const container = document.createElement("div");
  container.className = "container";

  const feature = document.createElement("div");
  feature.className = "baker-feature reveal";
  feature.dataset.delay = "0.28s";

  if (about.image && about.image.src) {
    const img = document.createElement("img");
    img.className = "baker-photo";
    img.src = about.image.src;
    img.alt = about.image.alt || "";
    feature.appendChild(img);
  }

  const copy = document.createElement("div");
  copy.className = "baker-copy";

  const heading = document.createElement("h2");
  heading.className = "baker-heading reveal";
  heading.dataset.delay = "0.32s";
  heading.appendChild(document.createTextNode(about.heading || ""));

  if (about.inlineLogo && about.inlineLogo.src) {
    const logo = document.createElement("img");
    logo.src = about.inlineLogo.src;
    logo.alt = about.inlineLogo.alt || "";
    logo.className = "inline-logo";
    heading.appendChild(logo);
  }

  copy.appendChild(heading);

  (about.paragraphs || []).forEach((text) => {
    const p = document.createElement("p");
    p.className = "lede reveal";
    p.dataset.delay = "0.38s";
    p.textContent = text;
    copy.appendChild(p);
  });

  if (about.cta && about.cta.href) {
    const cta = document.createElement("a");
    cta.className = "button ghost about reveal";
    cta.dataset.delay = "0.5s";
    cta.href = about.cta.href;
    cta.textContent = about.cta.label || "Read more";
    copy.appendChild(cta);
  }

  feature.appendChild(copy);
  container.appendChild(feature);
  section.appendChild(container);
  return section;
};

const buildProcess = (process) => {
  const section = document.createElement("section");
  section.className = "band band-process";

  const container = document.createElement("div");
  container.className = "container";

  const box = document.createElement("div");
  box.className = "order-box reveal";
  box.dataset.delay = "0.28s";

  const heading = document.createElement("h2");
  heading.className = "reveal";
  heading.dataset.delay = "0.32s";
  heading.textContent = process.heading || "";
  box.appendChild(heading);

  const steps = document.createElement("div");
  steps.className = "order-steps";

  (process.steps || []).forEach((step, index) => {
    const article = document.createElement("article");
    article.className = "order-step reveal";
    const delay = 0.42 + index * 0.06;
    article.dataset.delay = `${delay.toFixed(2)}s`;

    const title = document.createElement("h3");
    title.textContent = step.title || "";

    const body = document.createElement("p");
    body.textContent = step.body || "";

    article.appendChild(title);
    article.appendChild(body);
    steps.appendChild(article);
  });

  box.appendChild(steps);

  if (process.note && process.note.text) {
    const note = document.createElement("p");
    note.className = "order-note reveal";
    note.dataset.delay = "0.58s";

    if (process.note.link && process.note.link.href) {
      const textParts = process.note.text.split(process.note.link.label);
      if (textParts.length > 1) {
        note.appendChild(document.createTextNode(textParts[0]));
        const link = document.createElement("a");
        link.href = process.note.link.href;
        link.textContent = process.note.link.label;
        note.appendChild(link);
        note.appendChild(document.createTextNode(textParts.slice(1).join(process.note.link.label)));
      } else {
        note.textContent = process.note.text;
      }
    } else {
      note.textContent = process.note.text;
    }

    box.appendChild(note);
  }

  if (process.cta && process.cta.href) {
    const cta = document.createElement("a");
    cta.className = "button ghost order reveal";
    cta.dataset.delay = "0.62s";
    cta.href = process.cta.href;
    cta.textContent = process.cta.label || "Order now";
    box.appendChild(cta);
  }

  container.appendChild(box);
  section.appendChild(container);
  return section;
};

const buildFaqAnswer = (item) => {
  const p = document.createElement("p");
  if (!item.link || !item.link.href || !item.link.label) {
    p.textContent = item.answer || "";
    return p;
  }

  const parts = (item.answer || "").split(item.link.label);
  if (parts.length > 1) {
    p.appendChild(document.createTextNode(parts[0]));
    const link = document.createElement("a");
    link.href = item.link.href;
    link.textContent = item.link.label;
    p.appendChild(link);
    p.appendChild(document.createTextNode(parts.slice(1).join(item.link.label)));
  } else {
    p.textContent = item.answer || "";
  }

  return p;
};

const buildFaq = (faq) => {
  const section = document.createElement("section");
  section.className = "band band-faq reveal";
  section.dataset.delay = "0.42s";

  const container = document.createElement("div");
  container.className = "container";

  const layout = document.createElement("div");
  layout.className = "faq-layout";

  const headingWrap = document.createElement("div");
  headingWrap.className = "faq-heading reveal";
  headingWrap.dataset.delay = "0.48s";

  const heading = document.createElement("h2");
  heading.textContent = faq.heading || "";
  headingWrap.appendChild(heading);

  const accordion = document.createElement("div");
  accordion.className = "faq-accordion";

  (faq.items || []).forEach((item, index) => {
    const details = document.createElement("details");
    details.className = "faq-item reveal";
    const delay = 0.54 + index * 0.06;
    details.dataset.delay = `${delay.toFixed(2)}s`;

    const summary = document.createElement("summary");
    summary.textContent = item.question || "";

    const answer = document.createElement("div");
    answer.className = "faq-answer";
    answer.appendChild(buildFaqAnswer(item));

    details.appendChild(summary);
    details.appendChild(answer);
    accordion.appendChild(details);
  });

  const cta = document.createElement("div");
  cta.className = "faq-cta";

  if (faq.cta && faq.cta.prompt) {
    const prompt = document.createElement("p");
    prompt.textContent = faq.cta.prompt;
    cta.appendChild(prompt);
  }

  if (faq.cta && faq.cta.href) {
    const link = document.createElement("a");
    link.className = "button ghost";
    link.href = faq.cta.href;
    link.textContent = faq.cta.label || "Send us a message";
    cta.appendChild(link);
  }

  layout.appendChild(headingWrap);
  layout.appendChild(accordion);
  layout.appendChild(cta);

  container.appendChild(layout);
  section.appendChild(container);
  return section;
};

const renderHomePage = (data) => {
  if (!data) return;

  if (data.meta && data.meta.title) {
    document.title = data.meta.title;
  }

  const heroContainer = document.getElementById("home-hero");
  if (heroContainer && data.hero) {
    heroContainer.innerHTML = "";
    heroContainer.appendChild(buildHero(data.hero));
  }

  const aboutContainer = document.getElementById("home-about");
  if (aboutContainer && data.about) {
    aboutContainer.innerHTML = "";
    aboutContainer.appendChild(buildAbout(data.about));
  }

  const processContainer = document.getElementById("home-process");
  if (processContainer && data.process) {
    processContainer.innerHTML = "";
    processContainer.appendChild(buildProcess(data.process));
  }

  const faqContainer = document.getElementById("home-faq");
  if (faqContainer && data.faq) {
    faqContainer.innerHTML = "";
    faqContainer.appendChild(buildFaq(data.faq));
  }

  hydrateRevealIfNeeded(document);
  hydrateFaqIfNeeded(document);
};

fetch(HOME_JSON_PATH)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to load home content");
    }
    return response.json();
  })
  .then(renderHomePage)
  .catch((error) => {
    console.error(error);
  });
