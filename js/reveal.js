(() => {
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const items = Array.from(document.querySelectorAll(".reveal"));

  const applyDelay = (el) => {
    const delay = el.getAttribute("data-delay");
    if (delay) {
      el.style.setProperty("--reveal-delay", delay);
    }
  };

  items.forEach(applyDelay);

  if (prefersReduced || !items.length) {
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
})();
