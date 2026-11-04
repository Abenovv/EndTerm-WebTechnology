(function (root) {
  "use strict";
  const sessions = [
    {
      id: "emberwake",
      title: "Emberwake: First light",
      world: "Emberwake",
      genre: "adventure",
      minutes: 30,
      image: "emberwake",
      description: "Follow a small flame through the first valley courtyard.",
    },
    {
      id: "emberwake-bridges",
      title: "Emberwake: Broken bridges",
      world: "Emberwake",
      genre: "adventure",
      minutes: 45,
      image: "emberwake",
      description: "Reconnect the old bridges using clues in the stonework.",
    },
    {
      id: "emberwake-memories",
      title: "Emberwake: Lost memories",
      world: "Emberwake",
      genre: "adventure",
      minutes: 60,
      image: "emberwake",
      description:
        "Trace three memories to discover why the valley went quiet.",
    },
    {
      id: "orbit-post",
      title: "Orbit Post: First delivery",
      world: "Orbit Post",
      genre: "cozy",
      minutes: 20,
      image: "orbit-post",
      description: "Deliver your first letter and meet a lonely moon keeper.",
    },
    {
      id: "orbit-post-garden",
      title: "Orbit Post: Moon garden",
      world: "Orbit Post",
      genre: "cozy",
      minutes: 35,
      image: "orbit-post",
      description: "Help the residents grow a garden between mail deliveries.",
    },
    {
      id: "orbit-post-parcel",
      title: "Orbit Post: The lost parcel",
      world: "Orbit Post",
      genre: "cozy",
      minutes: 40,
      image: "orbit-post",
      description: "Follow a parcel across tiny planets and make new friends.",
    },
    {
      id: "after-hours",
      title: "After Hours: Rainy opening",
      world: "After Hours",
      genre: "puzzle",
      minutes: 25,
      image: "after-hours",
      description:
        "Open the noodle shop and decode a customer’s unusual order.",
    },
    {
      id: "after-hours-last",
      title: "After Hours: Last customer",
      world: "After Hours",
      genre: "puzzle",
      minutes: 50,
      image: "after-hours",
      description: "Piece together the last customer’s story before sunrise.",
    },
  ];
  const activities = [
    {
      id: "a1",
      title: "Valley clue exchange",
      format: "Online",
      minutes: 20,
      topic: "Emberwake",
    },
    {
      id: "a2",
      title: "Sketch a moon resident",
      format: "In person",
      minutes: 30,
      topic: "Orbit Post",
    },
    {
      id: "a3",
      title: "Noodle shop story circle",
      format: "Online",
      minutes: 25,
      topic: "After Hours",
    },
    {
      id: "a4",
      title: "Design a valley puzzle",
      format: "In person",
      minutes: 45,
      topic: "Emberwake",
    },
    {
      id: "a5",
      title: "Write a space postcard",
      format: "Online",
      minutes: 15,
      topic: "Orbit Post",
    },
    {
      id: "a6",
      title: "Sound of a rainy city",
      format: "In person",
      minutes: 35,
      topic: "After Hours",
    },
    {
      id: "a7",
      title: "Accessibility feedback circle",
      format: "Online",
      minutes: 30,
      topic: "All worlds",
    },
    {
      id: "a8",
      title: "Student concept showcase",
      format: "In person",
      minutes: 60,
      topic: "All worlds",
    },
  ];
  const tasks = [
    {
      id: "t1",
      title: "Define the core loop",
      discipline: "Design",
      hours: 4,
      detail: "Write the player’s main action and its reward.",
    },
    {
      id: "t2",
      title: "Map the first level",
      discipline: "Design",
      hours: 6,
      detail: "Sketch a short route with an optional discovery.",
    },
    {
      id: "t3",
      title: "Build a colour study",
      discipline: "Art",
      hours: 5,
      detail: "Choose a palette that supports navigation and mood.",
    },
    {
      id: "t4",
      title: "Draw scene silhouettes",
      discipline: "Art",
      hours: 8,
      detail: "Check that landmarks remain readable at a distance.",
    },
    {
      id: "t5",
      title: "Prototype movement",
      discipline: "Code",
      hours: 8,
      detail: "Build movement with keyboard controls.",
    },
    {
      id: "t6",
      title: "Connect the first puzzle",
      discipline: "Code",
      hours: 10,
      detail: "Track puzzle state and give feedback after each action.",
    },
    {
      id: "t7",
      title: "Run an accessibility pass",
      discipline: "Testing",
      hours: 4,
      detail: "Check contrast, keyboard use and reduced motion.",
    },
    {
      id: "t8",
      title: "Review player feedback",
      discipline: "Testing",
      hours: 5,
      detail: "Group observations and choose the next three fixes.",
    },
  ];
  function filterSessions(query = "", genre = "all", sort = "title") {
    const term = String(query).trim().toLowerCase();
    return sessions
      .filter(
        (s) =>
          (genre === "all" || s.genre === genre) &&
          `${s.title} ${s.description}`.toLowerCase().includes(term),
      )
      .sort((a, b) =>
        sort === "short"
          ? a.minutes - b.minutes
          : sort === "long"
            ? b.minutes - a.minutes
            : a.title.localeCompare(b.title),
      );
  }
  function total(items, property) {
    return items.reduce((sum, item) => sum + item[property], 0);
  }
  function expeditionMinutes(id, photo, lore) {
    const s = sessions.find((s) => s.id === id && s.world === "Emberwake");
    if (!s) throw new Error("Choose a valid Emberwake route.");
    return s.minutes + (photo ? 10 : 0) + (lore ? 15 : 0);
  }
  function validate(name, value, formType, now = new Date()) {
    const text = String(value ?? "").trim();
    if (name === "consent")
      return value === true
        ? ""
        : "Please agree to save these choices on this device.";
    if (name === "message" && formType === "preferences")
      return text.length <= 500 ? "" : "Use 500 characters or fewer.";
    if (!text) return "Please complete this field.";
    if (name === "name" && (text.length < 2 || text.length > 60))
      return "Use between 2 and 60 characters.";
    if (
      name === "email" &&
      (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text) || text.length > 120)
    )
      return "Enter an email such as player@example.com.";
    if (
      name === "phone" &&
      (!/^\+?[\d\s()-]+$/.test(text) ||
        text.replace(/\D/g, "").length < 10 ||
        text.replace(/\D/g, "").length > 15)
    )
      return "Use a phone number with 10 to 15 digits.";
    const ranges = { people: [1, 6], hours: [1, 20], minutes: [15, 180] };
    if (ranges[name]) {
      const [min, max] = ranges[name],
        number = Number(text);
      if (!Number.isInteger(number) || number < min || number > max)
        return `Use a whole number from ${min} to ${max}.`;
      if (name === "minutes" && number % 5 !== 0)
        return "Choose a multiple of 5 minutes.";
    }
    if (name === "date" || name === "start") {
      const date = new Date(text + "T12:00:00"),
        today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const limit = new Date(today);
      limit.setFullYear(limit.getFullYear() + 1);
      limit.setHours(23, 59, 59);
      const local =
        date.getFullYear() +
        "-" +
        String(date.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(date.getDate()).padStart(2, "0");
      if (
        Number.isNaN(date.getTime()) ||
        !/^\d{4}-\d{2}-\d{2}$/.test(text) ||
        local !== text ||
        date < today ||
        date > limit
      )
        return "Choose today or a date within the next year.";
    }
    if (
      name === "message" &&
      formType === "collaboration" &&
      (text.length < 20 || text.length > 500)
    )
      return "Describe your idea in 20 to 500 characters.";
    const choices = {
      game: ["Emberwake", "Orbit Post", "After Hours"],
      format: ["Online", "In person", "Either works"],
      role: ["Design", "Art", "Code", "Testing"],
    };
    if (choices[name] && !choices[name].includes(text))
      return "Choose one of the available options.";
    return "";
  }
  const api = {
    sessions,
    activities,
    tasks,
    filterSessions,
    total,
    expeditionMinutes,
    validate,
  };
  root.Sidequest = api;
  if (typeof module !== "undefined") module.exports = api;
})(typeof window === "undefined" ? globalThis : window);
