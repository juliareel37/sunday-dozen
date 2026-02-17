(() => {
  const placeholders = Array.from(
    document.querySelectorAll("[data-include]")
  );

  if (!placeholders.length) return;

  const loadPartial = async (el) => {
    const path = el.getAttribute("data-include");
    if (!path) return;

    const res = await fetch(path, { cache: "no-cache" });
    if (!res.ok) {
      throw new Error(`Failed to load include: ${path}`);
    }

    const html = await res.text();
    el.outerHTML = html;
  };

  Promise.all(placeholders.map(loadPartial))
    .then(() => {
      if (document.body.dataset.contactMode === "thank-you") {
        document.querySelectorAll(".reveal").forEach((el) => {
          el.classList.remove("reveal");
          el.classList.add("is-visible");
          el.removeAttribute("data-delay");
        });
        return;
      }

      if (typeof window.initReveal === "function") {
        window.initReveal(document);
      } else {
        window.__revealPending = true;
      }
    })
    .catch((error) => {
      console.error(error);
    });
})();
