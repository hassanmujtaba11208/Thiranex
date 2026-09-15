/* =========================================================
   HASSAN MUJTABA — PORTFOLIO SCRIPT
   Vanilla JavaScript only — no dependencies
   ========================================================= */
(function () {
  "use strict";

  /* -----------------------------------------------------
     1 & 2. THEME: dark/light mode + localStorage persistence
  ----------------------------------------------------- */
  const THEME_KEY = "hm-portfolio-theme";
  const root = document.documentElement;
  const themeToggle = document.querySelector("[data-theme-toggle]");

  function getPreferredTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      );
      themeToggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    }
  }

  applyTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch (err) {
        /* localStorage unavailable — theme still applies for this session */
      }
    });
  }

  /* -----------------------------------------------------
     3, 4. MOBILE NAVIGATION + accessibility
  ----------------------------------------------------- */
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const navLinksEl = document.querySelector("[data-nav-links]");

  function closeMenu() {
    if (!menuToggle || !navLinksEl) return;
    navLinksEl.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  function openMenu() {
    if (!menuToggle || !navLinksEl) return;
    navLinksEl.classList.add("is-open");
    menuToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  if (menuToggle && navLinksEl) {
    menuToggle.addEventListener("click", function () {
      const isOpen = navLinksEl.classList.contains("is-open");
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close menu after selecting a link
    navLinksEl.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    // Close on Escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navLinksEl.classList.contains("is-open")) {
        closeMenu();
        menuToggle.focus();
      }
    });

    // Close when clicking outside the menu (mobile overlay)
    document.addEventListener("click", function (e) {
      const isClickInside =
        navLinksEl.contains(e.target) || menuToggle.contains(e.target);
      if (!isClickInside && navLinksEl.classList.contains("is-open")) {
        closeMenu();
      }
    });

    // Reset menu state on resize back to desktop
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 1024) {
        closeMenu();
      }
    });
  }

  /* -----------------------------------------------------
     9. ACTIVE NAVIGATION — mark current page link
  ----------------------------------------------------- */
  (function markActiveNav() {
    const path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-link").forEach(function (link) {
      const href = link.getAttribute("href");
      if (href === path || (path === "" && href === "index.html")) {
        link.setAttribute("aria-current", "page");
      }
    });
  })();

  /* -----------------------------------------------------
     5, 6. CONTACT FORM — validation + success message
  ----------------------------------------------------- */
  const contactForm = document.querySelector("[data-contact-form]");

  if (contactForm) {
    const statusEl = contactForm.querySelector("[data-form-status]");

    function setFieldError(field, message) {
      const group = field.closest(".form-group");
      if (!group) return;
      const errorEl = group.querySelector(".field-error");
      if (message) {
        group.classList.add("has-error");
        if (errorEl) errorEl.textContent = message;
      } else {
        group.classList.remove("has-error");
        if (errorEl) errorEl.textContent = "";
      }
    }

    function validateField(field) {
      const value = field.value.trim();

      if (field.hasAttribute("required") && value === "") {
        setFieldError(field, "This field is required.");
        return false;
      }

      if (field.type === "email" && value !== "") {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
          setFieldError(field, "Please enter a valid email address.");
          return false;
        }
      }

      if (field.name === "message" && value !== "" && value.length < 10) {
        setFieldError(field, "Message should be at least 10 characters.");
        return false;
      }

      setFieldError(field, "");
      return true;
    }

    contactForm.querySelectorAll("input, textarea").forEach(function (field) {
      field.addEventListener("blur", function () {
        validateField(field);
      });
    });

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const fields = Array.from(contactForm.querySelectorAll("input, textarea"));
      let isValid = true;

      fields.forEach(function (field) {
        if (!validateField(field)) {
          isValid = false;
        }
      });

      if (!isValid) {
        if (statusEl) {
          statusEl.textContent =
            "Please fix the highlighted fields before sending.";
          statusEl.classList.remove("is-success");
          statusEl.classList.add("is-visible");
        }
        return;
      }

      // Frontend-only project: no backend call is made.
      if (statusEl) {
        statusEl.textContent =
          "Thanks! Your message has been prepared successfully.";
        statusEl.classList.add("is-visible", "is-success");
      }

      contactForm.reset();
    });
  }

  /* -----------------------------------------------------
     7. DYNAMIC CURRENT YEAR
  ----------------------------------------------------- */
  document.querySelectorAll("[data-current-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* -----------------------------------------------------
     8. SCROLL INTERACTIONS — reveal-on-scroll animation
  ----------------------------------------------------- */
  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && revealEls.length) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* -----------------------------------------------------
     PROJECT FILTER (projects.html) — optional enhancement
  ----------------------------------------------------- */
  const filterButtons = document.querySelectorAll("[data-filter]");
  const projectCards = document.querySelectorAll("[data-category]");

  if (filterButtons.length && projectCards.length) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        const filter = btn.getAttribute("data-filter");

        filterButtons.forEach(function (b) {
          b.setAttribute("aria-pressed", "false");
        });
        btn.setAttribute("aria-pressed", "true");

        projectCards.forEach(function (card) {
          const category = card.getAttribute("data-category");
          const show = filter === "all" || category === filter;
          card.style.display = show ? "" : "none";
        });
      });
    });
  }
})();
