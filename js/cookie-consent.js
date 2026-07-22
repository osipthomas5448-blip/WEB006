(function () {
  const key = "headlinica_cookie_choice";
  if (localStorage.getItem(key)) return;

  const banner = document.createElement("div");
  banner.className = "cookie-banner is-visible";
  banner.setAttribute("role", "region");
  banner.setAttribute("aria-label", "Cookie consent");
  banner.innerHTML = `
    <p><strong>Cookie notice:</strong> Headlinica uses essential cookies and optional analytics preferences to improve the reading experience.</p>
    <div class="cookie-actions">
      <button class="btn" type="button" data-cookie="accept">Accept</button>
      <button class="btn secondary" type="button" data-cookie="reject">Reject</button>
      <button class="btn secondary" type="button" data-cookie="preferences">Preferences</button>
    </div>
  `;

  document.body.appendChild(banner);

  banner.addEventListener("click", (event) => {
    const button = event.target.closest("[data-cookie]");
    if (!button) return;
    localStorage.setItem(key, button.dataset.cookie);
    banner.classList.remove("is-visible");
  });
})();
