(function () {
  "use strict";
  const S = window.Sidequest,
    U = window.UI,
    output = document.querySelector("#recommendations");
  function recommend() {
    const minutes = Number(document.querySelector("#minutes").value),
      invalid = !Number.isInteger(minutes) || minutes < 10 || minutes > 180;
    document.querySelector("#minutes-error").textContent = invalid
      ? "Enter a whole number from 10 to 180."
      : "";
    document
      .querySelector("#minutes")
      .setAttribute("aria-invalid", String(invalid));
    output.replaceChildren();
    if (invalid) return;
    const found = S.filterSessions(
      "",
      document.querySelector("#mood").value,
      "short",
    )
      .filter((s) => s.minutes <= minutes)
      .slice(0, 3);
    if (!found.length)
      output.append(
        U.element(
          "p",
          "No sessions fit that time. Try at least 20 minutes or another mood.",
          "empty-state",
        ),
      );
    else found.forEach((s) => output.append(U.sessionCard(s)));
    U.reveal(output);
  }
  document.querySelector("#recommend").addEventListener("click", recommend);
  document.querySelector("#mood").addEventListener("change", recommend);
  document.querySelector("#minutes").addEventListener("input", recommend);
  document.querySelector("#minutes").addEventListener("keydown", (e) => {
    if (e.key === "Enter") recommend();
  });
  function renderSaved() {
    const sessions = S.sessions.filter((s) => U.savedIds().includes(s.id)),
      list = document.querySelector("#saved-games");
    list.replaceChildren();
    if (!sessions.length)
      list.append(
        U.element(
          "p",
          "Your shortlist is empty. Save a session above or in Our games.",
          "empty-state",
        ),
      );
    else
      sessions.forEach((s) => {
        const card = U.sessionCard(s);
        card.id = "saved-" + s.id;
        list.append(card);
      });
    document.querySelector("#saved-total").textContent =
      `${sessions.length} saved · ${S.total(sessions, "minutes")} minutes in total`;
  }
  document.querySelector("#clear-games").addEventListener("click", () => {
    if (U.write("sidequest-sessions", []))
      document.dispatchEvent(new Event("shortlist-change"));
    else U.notice("Your browser could not clear your shortlist.");
  });
  document.addEventListener("shortlist-change", renderSaved);
  recommend();
  renderSaved();
})();
