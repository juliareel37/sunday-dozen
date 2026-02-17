const CONTACT_JSON_PATH = "content/contact.json";

const hydrateRevealIfNeeded = (root) => {
  const mode = document.body.dataset.contactMode || "contact";
  if (mode === "thank-you") return;
  if (typeof window.initReveal === "function") {
    window.initReveal(root || document);
  } else {
    window.__revealPending = true;
  }
};

const buildFormField = (field) => {
  if (!field || !field.name || !field.type) return null;

  if (field.type === "textarea") {
    const textarea = document.createElement("textarea");
    textarea.id = field.id || field.name;
    textarea.name = field.name;
    textarea.placeholder = field.placeholder || "";
    if (field.required) textarea.required = true;
    return textarea;
  }

  const input = document.createElement("input");
  input.type = field.type;
  input.id = field.id || field.name;
  input.name = field.name;
  input.placeholder = field.placeholder || "";
  if (field.required) input.required = true;
  return input;
};

const buildContactSection = (contact, map, receipt, mode) => {
  const section = document.createElement("section");
  section.className = "content reveal";
  section.dataset.delay = "0.2s";

  const container = document.createElement("div");
  container.className = "container";

  const grid = document.createElement("div");
  grid.className = "grid two contact-grid";

  const left = document.createElement("div");
  left.className = "reveal";
  left.dataset.delay = "0.26s";

  const heading = document.createElement("h2");
  heading.className = "section-heading";
  heading.textContent = contact.heading || "";
  left.appendChild(heading);

  if (contact.lede) {
    const lede = document.createElement("p");
    lede.className = "lede";
    lede.textContent = contact.lede;
    left.appendChild(lede);
  }

  if (contact.form && mode !== "thank-you") {
    const form = document.createElement("form");
    form.className = "contact-form reveal";
    form.dataset.delay = "0.32s";
    if (contact.form.action) form.action = contact.form.action;
    form.method = "POST";

    if (contact.form.apiKey) {
      const apiKey = document.createElement("input");
      apiKey.type = "hidden";
      apiKey.name = "apiKey";
      apiKey.value = contact.form.apiKey;
      form.appendChild(apiKey);
    }

    (contact.form.fields || []).forEach((field) => {
      const el = buildFormField(field);
      if (el) form.appendChild(el);
    });

    const button = document.createElement("button");
    button.type = "submit";
    button.textContent = contact.form.buttonLabel || "Submit";
    form.appendChild(button);

    if (contact.form.redirectTo) {
      const redirect = document.createElement("input");
      redirect.type = "hidden";
      redirect.name = "redirectTo";
      const redirectUrl = new URL(contact.form.redirectTo, window.location.href);
      redirect.value = redirectUrl.href;
      form.appendChild(redirect);
    }

    left.appendChild(form);
  }

  if (mode === "thank-you" && receipt) {
    const receiptCard = document.createElement("div");
    receiptCard.className = "form-receipt reveal";
    receiptCard.dataset.delay = "0.32s";

    if (receipt.heading) {
      const headingEl = document.createElement("h3");
      headingEl.textContent = receipt.heading;
      receiptCard.appendChild(headingEl);
    }

    if (receipt.message) {
      const messageEl = document.createElement("p");
      messageEl.textContent = receipt.message;
      receiptCard.appendChild(messageEl);
    }

    left.appendChild(receiptCard);
  }

  grid.appendChild(left);

  if (map) {
    const right = document.createElement("div");
    right.className = "contact-map reveal";
    right.dataset.delay = "0.3s";

    if (map.title) {
      const title = document.createElement("h3");
      title.textContent = map.title;
      right.appendChild(title);
    }

    if (map.image && map.image.src) {
      const img = document.createElement("img");
      img.src = map.image.src;
      img.alt = map.image.alt || "";
      right.appendChild(img);
    }

    grid.appendChild(right);
  }

  container.appendChild(grid);
  section.appendChild(container);
  return section;
};

const renderContactPage = (data) => {
  if (!data) return;

  if (data.meta && data.meta.title) {
    document.title = data.meta.title;
  }

  const heroTitle = document.getElementById("contact-hero-title");
  if (heroTitle && data.pageHero && data.pageHero.title) {
    heroTitle.textContent = data.pageHero.title;
  }

  const content = document.getElementById("contact-content");
  if (content && data.contact) {
    const mode = document.body.dataset.contactMode || "contact";
    content.innerHTML = "";
    content.appendChild(buildContactSection(data.contact, data.map, data.receipt, mode));
  }

  const mode = document.body.dataset.contactMode || "contact";
  if (mode === "thank-you") {
    document.querySelectorAll(".reveal").forEach((el) => {
      el.classList.remove("reveal");
      el.classList.add("is-visible");
      el.removeAttribute("data-delay");
      el.style.transition = "none";
      el.style.animation = "none";
      el.style.opacity = "1";
      el.style.transform = "none";
    });
  }

  hydrateRevealIfNeeded(document);
};

fetch(CONTACT_JSON_PATH)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to load contact content");
    }
    return response.json();
  })
  .then(renderContactPage)
  .catch((error) => {
    console.error(error);
  });
