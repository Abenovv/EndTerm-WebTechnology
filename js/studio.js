(function () {
  "use strict";
  const S = window.Sidequest,
    U = window.UI;
  let selected = [];
  function render() {
    const discipline = document.querySelector("#discipline").value,
      found = S.tasks.filter(
        (t) => discipline === "all" || t.discipline === discipline,
      ),
      host = document.querySelector("#roadmap");
    host.replaceChildren();
    document.querySelector("#task-count").textContent =
      `${found.length} proposed tasks`;
    found.forEach((t) => {
      const card = U.element("article", undefined, "roadmap-card");
      card.append(
        U.element("span", t.discipline, "tag"),
        U.element("h3", t.title),
        U.element("p", t.detail),
        U.element("p", `${t.hours} estimated hours`),
      );
      const label = U.element("label", undefined, "task-choice"),
        input = document.createElement("input");
      input.type = "checkbox";
      input.checked = selected.includes(t.id);
      input.setAttribute("aria-label", `Include ${t.title}`);
      input.addEventListener("change", () => {
        selected = input.checked
          ? [...selected, t.id]
          : selected.filter((id) => id !== t.id);
        updateTotal();
      });
      label.append(input, document.createTextNode(" Include in estimate"));
      card.append(label);
      host.append(card);
    });
    updateTotal();
  }
  function updateTotal() {
    const tasks = S.tasks.filter((t) => selected.includes(t.id));
    document.querySelector("#production-total").textContent =
      `${tasks.length} selected tasks · ${S.total(tasks, "hours")} estimated hours`;
  }
  document.querySelector("#discipline").addEventListener("change", render);
  document.querySelector("#reset-production").addEventListener("click", () => {
    selected = [];
    render();
  });
  const date = document.querySelector("#collaboration-start"),
    now = new Date();
  date.min = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  function showSaved() {
    const b = U.read("sidequest-collaboration", null),
      box = document.querySelector("#collaboration-saved");
    box.replaceChildren();
    box.hidden =
      !b ||
      typeof b.name !== "string" ||
      !["Design", "Art", "Code", "Testing"].includes(b.role) ||
      !Number.isInteger(b.weeks);
    if (box.hidden) return;
    box.append(
      U.element("h3", "Your collaboration brief"),
      U.element(
        "p",
        `${b.name} · ${b.role} · ${b.hours} hours/week · approximately ${b.weeks} weeks for ${b.total} hours of tasks.`,
      ),
    );
    const clear = U.element(
      "button",
      "Clear collaboration brief",
      "button secondary",
    );
    clear.addEventListener("click", () => {
      if (U.write("sidequest-collaboration", null)) showSaved();
      else U.notice("Your browser could not clear this brief.");
    });
    box.append(clear);
  }
  U.bindForm(document.querySelector("#collaboration-form"), (data) => {
    const hours = Number(data.hours),
      total = S.total(
        S.tasks.filter((t) => t.discipline === data.role),
        "hours",
      ),
      b = {
        name: data.name,
        role: data.role,
        hours,
        total,
        weeks: Math.ceil(total / hours),
        start: data.start,
        message: data.message,
      };
    if (!U.write("sidequest-collaboration", b))
      return {
        ok: false,
        message:
          "Your browser could not save this brief. Your form has been kept.",
      };
    showSaved();
    return {
      ok: true,
      message: `Brief saved. Allow about ${b.weeks} weeks at ${hours} hours per week. No email was sent or stored.`,
    };
  });
  render();
  showSaved();
})();
