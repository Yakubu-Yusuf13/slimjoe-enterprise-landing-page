/**
 * Initializes the page interactions after the document has been parsed.
 * @returns {void}
 */
const init = () => {
  initMobileMenu();
  initAccordion();
  initPricingToggle();
  initHeaderShadow();
  initFooterYear();
  initEnquiryForm();
};

/**
 * Opens and closes the mobile navigation with its button, links, or Escape.
 * @returns {void}
 */
const initMobileMenu = () => {
  const menuToggle = document.querySelector(".site-header__toggle");
  const primaryNav = document.querySelector(".site-header__nav");

  if (!menuToggle || !primaryNav) {
    return;
  }

  const setMenuOpen = (isOpen) => {
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    primaryNav.classList.toggle("site-header__nav--open", isOpen);
  };

  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    setMenuOpen(!isExpanded);
  });

  primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });
};

/**
 * Animates FAQ panels and ensures only one answer is open at a time.
 * @returns {void}
 */
const initAccordion = () => {
  const questions = document.querySelectorAll(".faq__question");

  /**
   * Closes an answer panel after animating its height to zero.
   * @param {HTMLButtonElement} question - The button controlling the panel.
   * @param {HTMLElement} panel - The answer panel to collapse.
   * @returns {void}
   */
  const closePanel = (question, panel) => {
    question.setAttribute("aria-expanded", "false");
    panel.style.height = `${panel.scrollHeight}px`;

    requestAnimationFrame(() => {
      panel.style.height = "0px";
    });

    panel.ontransitionend = (event) => {
      if (event.propertyName !== "height" || question.getAttribute("aria-expanded") === "true") {
        return;
      }

      panel.hidden = true;
      panel.style.height = "";
      panel.ontransitionend = null;
    };
  };

  questions.forEach((question) => {
    question.addEventListener("click", () => {
      const panelId = question.getAttribute("aria-controls");
      const panel = document.getElementById(panelId);

      if (!panel) {
        return;
      }

      const isExpanded = question.getAttribute("aria-expanded") === "true";

      questions.forEach((otherQuestion) => {
        if (otherQuestion === question || otherQuestion.getAttribute("aria-expanded") !== "true") {
          return;
        }

        const otherPanel = document.getElementById(otherQuestion.getAttribute("aria-controls"));
        if (otherPanel) {
          closePanel(otherQuestion, otherPanel);
        }
      });

      if (isExpanded) {
        closePanel(question, panel);
        return;
      }

      question.setAttribute("aria-expanded", "true");
      panel.hidden = false;
      panel.style.height = "0px";

      requestAnimationFrame(() => {
        panel.style.height = `${panel.scrollHeight}px`;
      });

      panel.ontransitionend = (event) => {
        if (event.propertyName === "height" && question.getAttribute("aria-expanded") === "true") {
          panel.style.height = "auto";
          panel.ontransitionend = null;
        }
      };
    });
  });
};

/**
 * Switches displayed sample plan prices and reveals the yearly savings badge.
 * @returns {void}
 */
const initPricingToggle = () => {
  const pricingSwitch = document.querySelector(".pricing__switch");
  const savingsBadge = document.querySelector(".pricing__savings");

  if (!pricingSwitch) {
    return;
  }

  pricingSwitch.addEventListener("click", () => {
    const isYearly = pricingSwitch.getAttribute("aria-checked") !== "true";
    const billingPeriod = isYearly ? "yearly" : "monthly";

    pricingSwitch.setAttribute("aria-checked", String(isYearly));

    document.querySelectorAll(".pricing__amount").forEach((price) => {
      price.textContent = price.dataset[billingPeriod];
    });

    document.querySelectorAll(".pricing__period").forEach((period) => {
      period.textContent = isYearly ? "/ month, billed yearly" : "/ month";
    });

    document.querySelectorAll(".pricing__billing-note").forEach((note) => {
      note.textContent = isYearly ? "Billed annually. 20% off monthly billing." : "Billed monthly.";
    });

    if (savingsBadge) {
      savingsBadge.hidden = !isYearly;
    }
  });
};

/**
 * Adds a shadow to the sticky header after the page scrolls more than 10px.
 * @returns {void}
 */
const initHeaderShadow = () => {
  const header = document.querySelector(".site-header");

  if (!header) {
    return;
  }

  const updateHeaderShadow = () => {
    header.classList.toggle("site-header--scrolled", window.scrollY > 10);
  };

  window.addEventListener("scroll", updateHeaderShadow, { passive: true });
  updateHeaderShadow();
};

/**
 * Writes the current year into the footer.
 * @returns {void}
 */
const initFooterYear = () => {
  const currentYear = String(new Date().getFullYear());

  document.querySelectorAll(".site-footer__year").forEach((year) => {
    year.textContent = currentYear;
  });
};

/**
 * Preserves the demo enquiry form and maps wholesale tiers to the form select.
 * @returns {void}
 */
const initEnquiryForm = () => {
  const planSelect = document.querySelector("#plan");
  const signupForm = document.querySelector("#signup-form");
  const formMessage = document.querySelector("#form-message");

  if (planSelect) {
    document.querySelectorAll(".pricing__cta").forEach((button) => {
      button.addEventListener("click", () => {
        planSelect.value = button.dataset.plan;
      });
    });
  }

  if (!signupForm || !formMessage) {
    return;
  }

  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!signupForm.reportValidity()) {
      return;
    }

    const formData = new FormData(signupForm);
    const name = formData.get("name").trim();
    formMessage.textContent = `Thanks, ${name}. Your enquiry is ready, but this demo form does not send or store submissions yet.`;
  });
};

document.addEventListener("DOMContentLoaded", init);
