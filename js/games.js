(function () {
  "use strict";
  const S = window.Sidequest,
    U = window.UI;
  let compared = [];
  const search = document.querySelector("#search"),
    genre = document.querySelector("#genre"),
    sort = document.querySelector("#sort");
  function comparison() {
    const host = document.querySelector("#comparison");
    host.replaceChildren();
    if (!compared.length) {
      host.append(
        U.element(
          "p",
          "No sessions selected. Use Compare on a card.",
          "empty-state",
        ),
      );
      return;
    }
    const selected = S.sessions.filter((s) => compared.includes(s.id)),
      list = U.element("div", undefined, "comparison-grid");
    selected.forEach((s) => {
      const card = U.element("article", undefined, "work-panel");
      card.append(
        U.element("h3", s.title),
        U.element("p", `${s.genre} · ${s.minutes} minutes`),
      );
      const remove = U.element(
        "button",
        "Remove " + s.title,
        "button secondary",
      );
      remove.addEventListener("click", () => {
        compared = compared.filter((id) => id !== s.id);
        render();
      });
      card.append(remove);
      list.append(card);
    });
    host.append(
      list,
      U.element(
        "p",
        `Combined session time: ${S.total(selected, "minutes")} minutes`,
      ),
    );
  }
  function render() {
    const found = S.filterSessions(search.value, genre.value, sort.value),
      host = document.querySelector("#catalog");
    host.replaceChildren();
    document.querySelector("#game-count").textContent =
      `${found.length} of ${S.sessions.length} sessions`;
    document.querySelector("#catalog-empty").hidden = Boolean(found.length);
    found.forEach((s) => {
      const card = U.sessionCard(s),
        button = U.element(
          "button",
          compared.includes(s.id) ? "Selected for comparison" : "Compare",
          "button compare-button",
        );
      button.setAttribute("aria-label", `Compare ${s.title}`);
      button.setAttribute("aria-pressed", String(compared.includes(s.id)));
      button.disabled = compared.length >= 3 && !compared.includes(s.id);
      button.addEventListener("click", () => {
        compared = compared.includes(s.id)
          ? compared.filter((id) => id !== s.id)
          : [...compared, s.id];
        render();
        document.querySelector(`[aria-label="Compare ${s.title}"]`)?.focus();
      });
      card.querySelector(".card-body").append(button);
      host.append(card);
    });
    comparison();
  }
  search.addEventListener("input", render);
  genre.addEventListener("change", render);
  sort.addEventListener("change", render);
  document.querySelector("#reset-filters").addEventListener("click", () => {
    search.value = "";
    genre.value = "all";
    sort.value = "title";
    render();
    search.focus();
  });
  render();
  if (location.hash)
    document.getElementById(location.hash.slice(1))?.scrollIntoView();
})();
