(function () {
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "cta-title");
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-head">
        <div>
          <p class="eyebrow">Headlinica CTA</p>
          <h2 id="cta-title">Connect with Headlinica</h2>
          <p>Tell us what you are interested in and our editorial desk will follow up.</p>
        </div>
        <button class="modal-close" type="button" aria-label="Close popup">&times;</button>
      </div>
      <form class="form-grid" id="cta-form">
        <div class="field">
          <label for="cta-name">Name</label>
          <input id="cta-name" name="name" type="text" autocomplete="name" required>
        </div>
        <div class="field">
          <label for="cta-email">Email</label>
          <input id="cta-email" name="email" type="email" autocomplete="email" required>
        </div>
        <div class="field">
          <label for="cta-interest">Interest</label>
          <select id="cta-interest" name="interest" required>
            <option value="">Choose one</option>
            <option>Daily newsletter</option>
            <option>Editorial inquiry</option>
            <option>Partnership</option>
            <option>Advertising</option>
          </select>
        </div>
        <div class="field">
          <label for="cta-message">Message</label>
          <textarea id="cta-message" name="message" required></textarea>
        </div>
        <label class="checkline">
          <input type="checkbox" name="consent" required>
          <span>I agree to the Privacy Policy, Terms & Conditions, and Disclaimer.</span>
        </label>
        <button class="btn" type="submit">Submit Request</button>
        <p class="form-note" aria-live="polite"></p>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  const close = () => {
    modal.classList.remove("is-open");
    document.body.style.overflow = "";
  };

  const open = () => {
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
    const first = modal.querySelector("input");
    if (first) first.focus();
  };

  document.addEventListener("click", (event) => {
    const opener = event.target.closest(".js-open-cta");
    if (opener) {
      event.preventDefault();
      open();
    }

    if (event.target === modal || event.target.closest(".modal-close")) {
      close();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) close();
  });

  modal.querySelector("#cta-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const note = form.querySelector(".form-note");
    if (!form.reportValidity()) return;
    note.textContent = "Thanks. Your request has been received.";
    form.reset();
  });
})();
