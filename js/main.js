document.querySelectorAll(".faq-question").forEach((question) => {
  question.addEventListener("click", () => {
    const isExpanded = question.getAttribute("aria-expanded") === "true";
    const answer = document.getElementById(question.getAttribute("aria-controls"));

    question.setAttribute("aria-expanded", String(!isExpanded));
    answer.hidden = isExpanded;
  });
});

const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector(".primary-nav");

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  primaryNav.classList.toggle("is-open", !isExpanded);
});

primaryNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    primaryNav.classList.remove("is-open");
  });
});

const planSelect = document.querySelector("#plan");

document.querySelectorAll(".plan-cta").forEach((button) => {
  button.addEventListener("click", () => {
    planSelect.value = button.dataset.plan;
  });
});

const signupForm = document.querySelector("#signup-form");
const formMessage = document.querySelector("#form-message");

signupForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!signupForm.reportValidity()) {
    return;
  }

  const formData = new FormData(signupForm);
  const name = formData.get("name").trim();
  formMessage.textContent = `Thanks, ${name}. Your enquiry is ready, but this demo form does not send or store submissions yet.`;
});
