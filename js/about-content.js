const ABOUT_JSON_PATH = "content/about.json";

const buildParagraphs = (paragraphs) => {
  const fragment = document.createDocumentFragment();
  (paragraphs || []).forEach((text) => {
    if (!text) return;
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    fragment.appendChild(paragraph);
  });
  return fragment;
};

const buildImage = (image, className, delay) => {
  if (!image || !image.src) return null;
  const figure = document.createElement("figure");
  figure.className = className;
  figure.classList.add("reveal");
  if (delay) figure.dataset.delay = delay;

  const img = document.createElement("img");
  img.src = image.src;
  img.alt = image.alt || "";
  figure.appendChild(img);
  return figure;
};

const buildLandscapeSection = (section) => {
  const wrapper = document.createElement("section");
  wrapper.className = "about-section about-section--stacked";

  const grid = document.createElement("div");
  grid.className = "about-grid about-grid--landscape";

  const text = document.createElement("div");
  text.className = "about-text reveal";
  text.dataset.delay = "0.26s";

  const heading = document.createElement("h2");
  heading.textContent = section.heading || "";
  text.appendChild(heading);
  text.appendChild(buildParagraphs(section.paragraphs));

  const image = buildImage(
    (section.images || [])[0],
    "about-image about-image--landscape",
    "0.32s"
  );

  grid.appendChild(text);
  if (image) grid.appendChild(image);
  wrapper.appendChild(grid);
  return wrapper;
};

const buildPortraitSection = (section) => {
  const wrapper = document.createElement("section");
  wrapper.className = "about-section";

  const grid = document.createElement("div");
  grid.className = "about-grid about-grid--portrait";

  const image = buildImage(
    (section.images || [])[0],
    "about-image about-image--portrait",
    "0.3s"
  );

  const text = document.createElement("div");
  text.className = "about-text reveal";
  text.dataset.delay = "0.26s";

  const heading = document.createElement("h2");
  heading.textContent = section.heading || "";
  text.appendChild(heading);
  text.appendChild(buildParagraphs(section.paragraphs));

  if (image) grid.appendChild(image);
  grid.appendChild(text);
  wrapper.appendChild(grid);
  return wrapper;
};

const buildPortraitStackSection = (section) => {
  const wrapper = document.createElement("section");
  wrapper.className = "about-section";

  const grid = document.createElement("div");
  grid.className = "about-grid about-grid--portrait";

  const text = document.createElement("div");
  text.className = "about-text reveal";
  text.dataset.delay = "0.3s";

  const heading = document.createElement("h2");
  heading.textContent = section.heading || "";
  text.appendChild(heading);
  text.appendChild(buildParagraphs(section.paragraphs));

  const stack = document.createElement("div");
  stack.className = "about-portrait-stack";

  (section.images || []).forEach((image) => {
    const figure = buildImage(
      image,
      "about-image about-image--portrait about-image--stack",
      "0.36s"
    );
    if (figure) stack.appendChild(figure);
  });

  grid.appendChild(text);
  grid.appendChild(stack);
  wrapper.appendChild(grid);
  return wrapper;
};

const buildSection = (section) => {
  if (!section) return null;
  switch (section.layout) {
    case "landscape":
      return buildLandscapeSection(section);
    case "portrait":
      return buildPortraitSection(section);
    case "portraitStack":
      return buildPortraitStackSection(section);
    default:
      return buildPortraitSection(section);
  }
};

const renderAboutPage = (data) => {
  if (!data) return;

  if (data.meta && data.meta.title) {
    document.title = data.meta.title;
  }

  const heroTitle = document.getElementById("about-hero-title");
  if (heroTitle && data.pageHero && data.pageHero.title) {
    heroTitle.textContent = data.pageHero.title;
  }

  const heroSubtitle = document.getElementById("about-hero-subtitle");
  const subtitleText = data.pageHero ? data.pageHero.subtitle : "";
  if (heroSubtitle) {
    if (subtitleText) {
      heroSubtitle.textContent = subtitleText;
      heroSubtitle.style.display = "";
    } else {
      heroSubtitle.textContent = "";
      heroSubtitle.style.display = "none";
    }
  }

  const sectionsContainer = document.getElementById("about-sections");
  if (!sectionsContainer) return;
  sectionsContainer.innerHTML = "";

  (data.sections || []).forEach((section) => {
    const element = buildSection(section);
    if (element) sectionsContainer.appendChild(element);
  });

  hydrateReveal(sectionsContainer);
};

const hydrateReveal = (root) => {
  const items = Array.from((root || document).querySelectorAll(".reveal"));
  if (!items.length) return;

  items.forEach((el) => {
    const delay = el.getAttribute("data-delay");
    if (delay) {
      el.style.setProperty("--reveal-delay", delay);
    }
  });

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReduced || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      threshold: 0,
      rootMargin: "0px 0px 0px 0px",
    }
  );

  items.forEach((el) => observer.observe(el));
};

fetch(ABOUT_JSON_PATH)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to load about content");
    }
    return response.json();
  })
  .then(renderAboutPage)
  .catch((error) => {
    console.error(error);
  });
