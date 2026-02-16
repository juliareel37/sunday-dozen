(() => {
  const items = document.querySelectorAll(".faq-item");

  items.forEach((item) => {
    const summary = item.querySelector("summary");
    const answer = item.querySelector(".faq-answer");

    if (!summary || !answer) return;

    summary.setAttribute("aria-expanded", "false");

    summary.addEventListener("click", (event) => {
      event.preventDefault();

      const isOpen = item.classList.contains("is-open");

      if (isOpen) {
        answer.style.height = `${answer.scrollHeight}px`;
        requestAnimationFrame(() => {
          answer.style.height = "0px";
          answer.style.opacity = "0";
        });
        summary.setAttribute("aria-expanded", "false");
        item.classList.remove("is-open");
        const onClose = () => {
          item.removeAttribute("open");
          answer.removeEventListener("transitionend", onClose);
        };
        answer.addEventListener("transitionend", onClose);
      } else {
        item.setAttribute("open", "");
        item.classList.add("is-open");
        summary.setAttribute("aria-expanded", "true");
        answer.style.height = "0px";
        answer.style.opacity = "1";
        requestAnimationFrame(() => {
          answer.style.height = `${answer.scrollHeight}px`;
        });
        const onOpen = () => {
          answer.style.height = "auto";
          answer.removeEventListener("transitionend", onOpen);
        };
        answer.addEventListener("transitionend", onOpen);
      }
    });
  });
})();
