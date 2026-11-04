(function () {
  "use strict";
  const S = window.Sidequest,
    U = window.UI,
    route = document.querySelector("#route"),
    photo = document.querySelector("#photo-stop"),
    lore = document.querySelector("#lore-stop");
  const requested = new URLSearchParams(location.search).get("route");
  if ([...route.options].some((o) => o.value === requested))
    route.value = requested;
  function localDate(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }
  const date = document.querySelector("#booking-date");
  date.min = localDate(new Date());
  const last = new Date();
  last.setFullYear(last.getFullYear() + 1);
  date.max = localDate(last);
  function update() {
    const minutes = S.expeditionMinutes(
        route.value,
        photo.checked,
        lore.checked,
      ),
      trail = document.querySelector("#trail");
    trail.replaceChildren();
    const stops = [
      "Valley gate",
      S.sessions.find((s) => s.id === route.value).title.split(": ")[1],
    ];
    if (photo.checked) stops.push("Photo stop");
    if (lore.checked) stops.push("Valley memories");
    stops.push("Campfire");
    stops.forEach((s) => trail.append(U.element("li", s)));
    document.querySelector("#route-total").textContent =
      `Your trail: ${minutes} minutes`;
    const people = Number(document.querySelector("#booking-people").value);
    document.querySelector("#booking-estimate").textContent =
      Number.isInteger(people) && people >= 1 && people <= 6
        ? `${people} participant${people === 1 ? "" : "s"} · ${minutes} minutes each · ${people * minutes} participant-minutes`
        : "Choose 1 to 6 participants to calculate the group estimate.";
  }
  [route, photo, lore, document.querySelector("#booking-people")].forEach(
    (el) => el.addEventListener("input", update),
  );
  route.addEventListener("change", update);
  function showSaved() {
    const p = U.read("sidequest-expedition", null),
      box = document.querySelector("#booking-saved");
    box.replaceChildren();
    box.hidden =
      !p ||
      typeof p.name !== "string" ||
      !S.sessions.some((s) => s.id === p.route) ||
      !Number.isInteger(p.minutes) ||
      !Number.isInteger(p.people) ||
      typeof p.date !== "string";
    if (box.hidden) return;
    box.append(
      U.element("h3", "Your saved expedition"),
      U.element(
        "p",
        `${p.name} · ${p.date} · ${p.people} participants · ${p.minutes} minutes each`,
      ),
    );
    const clear = U.element(
      "button",
      "Clear expedition plan",
      "button secondary",
    );
    clear.addEventListener("click", () => {
      if (U.write("sidequest-expedition", null)) showSaved();
      else U.notice("Your browser could not clear this plan.");
    });
    box.append(clear);
  }
  U.bindForm(document.querySelector("#booking-form"), (data) => {
    const p = {
      name: data.name,
      date: data.date,
      people: Number(data.people),
      route: route.value,
      minutes: S.expeditionMinutes(route.value, photo.checked, lore.checked),
    };
    if (!U.write("sidequest-expedition", p))
      return {
        ok: false,
        message:
          "Your browser could not save this plan. Your form has been kept.",
      };
    showSaved();
    return {
      ok: true,
      message: `Expedition plan saved for ${data.name}. No place was reserved and no contact details were stored.`,
    };
  });
  document
    .querySelector("#booking-form")
    .addEventListener("local-save", update);
  update();
  showSaved();
})();
