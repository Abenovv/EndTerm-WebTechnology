(function () {
  "use strict";
  const S = window.Sidequest;
  const speed = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? 0
    : 180;
  function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  }
  function read(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value === null ? fallback : value;
    } catch {
      return fallback;
    }
  }
  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }
  function notice(message) {
    let node = document.querySelector("#device-notice");
    if (!node) {
      node = element("p", "", "shell device-notice");
      node.id = "device-notice";
      node.setAttribute("role", "status");
      document.querySelector("main").prepend(node);
    }
    node.textContent = message;
  }
  function readIds(key, records) {
    const value = read(key, []);
    return Array.isArray(value)
      ? [
          ...new Set(
            value.filter((id) => records.some((item) => item.id === id)),
          ),
        ]
      : [];
  }
  function savedIds() {
    return readIds("sidequest-sessions", S.sessions);
  }
  function toggleSaved(id) {
    const current = savedIds(),
      ids = current.includes(id)
        ? current.filter((x) => x !== id)
        : [...current, id];
    if (!write("sidequest-sessions", ids)) {
      notice(
        "This browser could not save your choice. Allow local storage and try again.",
      );
      return;
    }
    document.dispatchEvent(new Event("shortlist-change"));
  }
  function sessionCard(session, heading = "h3") {
    const card = element("article", undefined, "game-card");
    card.id = session.id;
    const image = document.createElement("img");
    image.src = `assets/images/${session.image}.webp`;
    image.alt = `${session.world} concept artwork: ${session.image === "emberwake" ? "golden ruins in a mountain valley" : session.image === "orbit-post" ? "a courier on a colourful moon" : "a noodle shop on a rainy street"}`;
    image.width = 1200;
    image.height = 800;
    image.loading = "lazy";
    card.append(image);
    const body = element("div", undefined, "card-body");
    body.append(
      element("span", session.genre, "tag"),
      element(heading, session.title),
      element("p", session.description),
      element("p", `${session.minutes} minutes · ${session.world}`),
    );
    const saved = savedIds().includes(session.id),
      button = element(
        "button",
        saved ? "Remove from shortlist" : "Save session",
        "button secondary",
      );
    button.type = "button";
    button.dataset.save = session.id;
    button.setAttribute("aria-pressed", String(saved));
    button.setAttribute(
      "aria-label",
      `${saved ? "Remove" : "Save"} ${session.title}`,
    );
    button.addEventListener("click", () => toggleSaved(session.id));
    body.append(button);
    const link = element(
      "a",
      session.world === "Emberwake"
        ? "Plan an expedition →"
        : "Choose this world →",
      "text-link",
    );
    link.href =
      session.world === "Emberwake"
        ? `emberwake.html?route=${encodeURIComponent(session.id)}#expedition`
        : `community.html?game=${encodeURIComponent(session.world)}#playtest`;
    body.append(link);
    card.append(body);
    return card;
  }
  document.addEventListener("shortlist-change", () => {
    const ids = savedIds();
    document.querySelectorAll("[data-save]").forEach((button) => {
      const saved = ids.includes(button.dataset.save),
        session = S.sessions.find((s) => s.id === button.dataset.save);
      button.textContent = saved ? "Remove from shortlist" : "Save session";
      button.setAttribute("aria-pressed", String(saved));
      button.setAttribute(
        "aria-label",
        `${saved ? "Remove" : "Save"} ${session.title}`,
      );
    });
  });
  // Finish the previous effect and clear its queue before a repeated click.
  $(".help-toggle").on("click", function () {
    const open = this.getAttribute("aria-expanded") !== "true";
    this.setAttribute("aria-expanded", String(open));
    const panel = $("#" + this.getAttribute("aria-controls"));
    panel.stop(true, true);
    if (open) panel.removeAttr("hidden").hide().slideDown(speed);
    else panel.slideUp(speed, () => panel.attr("hidden", ""));
  });
  $("[data-scroll]").on("click", function (event) {
    event.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    $("html, body")
      .stop(true)
      .animate(
        { scrollTop: target.getBoundingClientRect().top + window.scrollY },
        speed,
      );
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  });
  function reveal(node) {
    $(node).stop(true, true).removeAttr("hidden").hide().fadeIn(speed);
  }
  function bindForm(form, onValid) {
    if (!form) return;
    const fields = [...form.querySelectorAll("input,select,textarea")],
      feedback = form.querySelector(".form-feedback");
    let attempted = false;
    function check(field) {
      const error = S.validate(
        field.name,
        field.type === "checkbox" ? field.checked : field.value,
        form.dataset.form,
      );
      document.getElementById(field.id + "-error").textContent = error;
      field.classList.toggle("is-invalid", Boolean(error));
      field.setAttribute("aria-invalid", String(Boolean(error)));
      return !error;
    }
    fields.forEach((field) =>
      ["input", "change"].forEach((event) =>
        field.addEventListener(event, () => {
          if (attempted || field.dataset.touched) check(field);
          $(feedback).stop(true, true).hide().attr("hidden", "");
        }),
      ),
    );
    fields.forEach((field) =>
      field.addEventListener("blur", () => {
        field.dataset.touched = "true";
        check(field);
      }),
    );
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      attempted = true;
      const outcomes = fields.map(check);
      if (outcomes.includes(false)) {
        $(feedback).stop(true, true).hide().attr("hidden", "");
        fields[outcomes.indexOf(false)].focus();
        return;
      }
      const data = Object.fromEntries(
        fields.map((field) => [
          field.name,
          field.type === "checkbox" ? field.checked : field.value.trim(),
        ]),
      );
      const result = onValid(data);
      if (!result.ok) {
        feedback.textContent = result.message;
        reveal(feedback);
        return;
      }
      form.reset();
      attempted = false;
      fields.forEach((field) => {
        delete field.dataset.touched;
        field.classList.remove("is-invalid");
        field.removeAttribute("aria-invalid");
        document.getElementById(field.id + "-error").textContent = "";
      });
      form.dispatchEvent(new Event("local-save"));
      feedback.textContent = result.message;
      reveal(feedback);
    });
  }
  const wishlist = document.querySelector("#wishlist-button");
  if (wishlist) {
    function refresh() {
      const saved = savedIds().includes("emberwake");
      wishlist.textContent = saved ? "Saved to my list ✓" : "Add to my list +";
      wishlist.setAttribute("aria-pressed", String(saved));
    }
    try {
      if (
        localStorage.getItem("sidequest-emberwake") === "saved" &&
        localStorage.getItem("sidequest-sessions") === null
      )
        write("sidequest-sessions", ["emberwake"]);
    } catch {
      /* Browsing still works when storage is unavailable. */
    }
    refresh();
    document.addEventListener("shortlist-change", refresh);
    wishlist.addEventListener("click", () => {
      toggleSaved("emberwake");
      document.querySelector("#wishlist-message").textContent =
        savedIds().includes("emberwake")
          ? "Saved on this device."
          : "Removed from your list.";
    });
  }
  window.UI = {
    element,
    read,
    write,
    readIds,
    savedIds,
    sessionCard,
    bindForm,
    reveal,
    notice,
  };
})();
