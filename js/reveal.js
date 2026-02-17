(() => {
  const applyDelay = (el) => {
    const delay = el.getAttribute("data-delay");
    if (delay) {
      el.style.setProperty("--reveal-delay", delay);
    }
  };

  const initReveal = (root = document) => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const items = Array.from(root.querySelectorAll(".reveal")).filter(
      (el) => !el.classList.contains("is-visible")
    );

    if (!items.length) return;

    items.forEach(applyDelay);

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

  window.initReveal = initReveal;
  initReveal(document);

  if (window.__revealPending) {
    window.__revealPending = false;
    initReveal(document);
  }
})();
