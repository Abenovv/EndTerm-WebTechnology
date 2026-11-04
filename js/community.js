(function () {
  "use strict";
  const S = window.Sidequest,
    U = window.UI;
  function ids() {
    return U.readIds("sidequest-evening", S.activities);
  }
  function render() {
    const format = document.querySelector("#activity-format").value,
      query = document
        .querySelector("#activity-search")
        .value.trim()
        .toLowerCase(),
      found = S.activities.filter(
        (a) =>
          (format === "all" || a.format === format) &&
          `${a.title} ${a.topic}`.toLowerCase().includes(query),
      ),
      host = document.querySelector("#activities");
    host.replaceChildren();
    document.querySelector("#activity-count").textContent =
      `${found.length} activities`;
    if (!found.length)
      host.append(
        U.element(
          "p",
          "No activities found. Try another word or format.",
          "empty-state",
        ),
      );
    found.forEach((a) => {
      const card = U.element("article", undefined, "work-panel");
      card.append(
        U.element("span", a.format, "tag"),
        U.element("h3", a.title),
        U.element("p", `${a.topic} · ${a.minutes} min`),
      );
      const selected = ids().includes(a.id),
        button = U.element(
          "button",
          selected ? "Remove activity" : "Add to evening",
          "button secondary",
        );
      button.setAttribute("aria-pressed", String(selected));
      button.setAttribute(
        "aria-label",
        `${selected ? "Remove" : "Add"} ${a.title}`,
      );
      button.addEventListener("click", () => {
        const next = selected
          ? ids().filter((id) => id !== a.id)
          : [...ids(), a.id];
        if (U.write("sidequest-evening", next)) {
          render();
          document
            .querySelector(
              `[aria-label="${selected ? "Add" : "Remove"} ${a.title}"]`,
            )
            ?.focus();
        } else U.notice("Your browser could not save this activity.");
      });
      card.append(button);
      host.append(card);
    });
    const selected = S.activities.filter((a) => ids().includes(a.id)),
      list = document.querySelector("#evening-list");
    list.replaceChildren();
    if (!selected.length)
      list.append(
        U.element(
          "p",
          "Your evening is empty. Add an activity to start.",
          "empty-state",
        ),
      );
    selected.forEach((a) =>
      list.append(U.element("p", `${a.title} · ${a.minutes} min`)),
    );
    document.querySelector("#evening-total").textContent =
      `${selected.length} activities · ${S.total(selected, "minutes")} minutes`;
  }
  document.querySelector("#activity-format").addEventListener("change", render);
  document.querySelector("#activity-search").addEventListener("input", render);
  document.querySelector("#clear-evening").addEventListener("click", () => {
    if (U.write("sidequest-evening", [])) render();
    else U.notice("Your browser could not clear your evening.");
  });
  const game = new URLSearchParams(location.search).get("game");
  if (["Emberwake", "Orbit Post", "After Hours"].includes(game))
    document.querySelector("#preferences-game").value = game;
  function showSaved() {
    const p = U.read("sidequest-playtest", null),
      box = document.querySelector("#saved-preferences");
    box.hidden =
      !p ||
      typeof p.name !== "string" ||
      !["Emberwake", "Orbit Post", "After Hours"].includes(p.game);
    if (!box.hidden)
      document.querySelector("#saved-summary").textContent =
        `${p.name} · ${p.game} · ${p.format || "Online"}${p.minutes ? " · " + p.minutes + " minutes" : ""}`;
  }
  U.bindForm(document.querySelector("#preferences-form"), (data) => {
    const p = {
      name: data.name,
      game: data.game,
      format: data.format,
      minutes: Number(data.minutes),
      message: data.message,
    };
    if (!U.write("sidequest-playtest", p))
      return {
        ok: false,
        message:
          "Your browser could not save these preferences. Your form has been kept.",
      };
    showSaved();
    return {
      ok: true,
      message: `Saved, ${data.name}. Your preferences stay on this device; your email was not stored or sent.`,
    };
  });
  document.querySelector("#clear-preferences").addEventListener("click", () => {
    if (U.write("sidequest-playtest", null)) showSaved();
    else U.notice("Your browser could not clear your preferences.");
  });
  render();
  showSaved();
})();
