// Renders events.json into the #events-list container on events.html.
// To post a new event, add an object to /data/events.json — no code edits needed.
//
// NOTE: fetch() requires a real server (Live Server, Netlify, etc.) — opening
// this file directly (file://) will block the request due to browser CORS
// rules for local files. Always preview through Live Server.

document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("events-list");
  const tabs = document.querySelectorAll(".filter-tabs button");
  if (!list) return;

  let events = [];
  let currentFilter = "upcoming";

  fetch("/data/events.json")
    .then((res) => res.json())
    .then((data) => {
      events = data.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
      render();
    })
    .catch((err) => {
      list.innerHTML = `<p class="event-empty">Couldn't load events right now. (${err.message})</p>`;
    });

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.setAttribute("aria-pressed", "false"));
      tab.setAttribute("aria-pressed", "true");
      currentFilter = tab.dataset.filter;
      render();
    });
  });

  function formatDate(iso) {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function render() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const filtered = events.filter((e) => {
      const eventDate = new Date(e.date + "T00:00:00");
      if (currentFilter === "upcoming") return eventDate >= today;
      if (currentFilter === "past") return eventDate < today;
      return true;
    });

    if (filtered.length === 0) {
      list.innerHTML = `<p class="event-empty">No ${currentFilter === "all" ? "" : currentFilter} events to show right now.</p>`;
      return;
    }

    list.innerHTML = filtered
      .map((e) => {
        const isPast = new Date(e.date + "T00:00:00") < today;
        return `
          <article class="card${isPast ? " is-past" : ""}">
            <p class="card-meta">${formatDate(e.date)} · ${e.time}</p>
            <h3>${e.title}</h3>
            <p>${e.description}</p>
            <p class="card-meta">${e.location}</p>
          </article>
        `;
      })
      .join("");
  }
});