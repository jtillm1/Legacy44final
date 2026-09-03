// Handles any <form class="form" data-demo-form> on the page.
//
// FOR THE DEMO: this just shows a success message client-side, no email is
// actually sent. Before going live, replace the fetch() block below with a
// real Formspree or Netlify Forms endpoint.

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("form[data-demo-form]").forEach((form) => {
    const successBox = form.parentElement.querySelector(".form-success");

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // --- Real submission would go here, e.g.: -----------------------
      // fetch("https://formspree.io/f/YOUR_FORM_ID", {
      //   method: "POST",
      //   headers: { Accept: "application/json" },
      //   body: new FormData(form),
      // });
      // ------------------------------------------------------------------

      form.classList.add("is-submitted");
      if (successBox) successBox.classList.add("is-visible");
      form.reset();
    });
  });
});