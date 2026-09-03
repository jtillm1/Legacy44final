// Handles any <form class="form" data-netlify="true"> on the page.
//
// This submits to Netlify Forms via AJAX so the page doesn't reload.
// Netlify Forms needs zero backend code or database — Netlify detects the
// form at deploy time (because of the data-netlify attribute + hidden
// form-name field) and stores every submission in Site settings > Forms,
// with an option to email you on every new submission.
//
// IMPORTANT: this only works once the site is actually deployed on Netlify.
// On localhost / Live Server / file://, the fetch below will fail — that's
// expected, not a bug. Test real submissions after deploying (see README).

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("form[data-netlify='true']").forEach((form) => {
    const successBox = form.parentElement.querySelector(".form-success");
    const errorBox = form.parentElement.querySelector(".form-error");

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const data = new FormData(form);

      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data).toString(),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Submission failed");
          form.classList.add("is-submitted");
          if (successBox) successBox.classList.add("is-visible");
          if (errorBox) errorBox.classList.remove("is-visible");
          form.reset();
        })
        .catch(() => {
          if (errorBox) errorBox.classList.add("is-visible");
        });
    });
  });
});