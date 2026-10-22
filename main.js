// ================= THEME TOGGLE =================
const root = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  themeIcon.textContent = theme === "dark" ? "🌙" : "☀️";
  try {
    localStorage.setItem("theme", theme);
  } catch (e) {}
}

(function initTheme() {
  let saved = null;
  try {
    saved = localStorage.getItem("theme");
  } catch (e) {}
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  applyTheme(saved || (prefersLight ? "light" : "dark"));
})();

themeToggle.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
});

// ================= MOBILE MENU =================
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");
const navLinks = document.querySelectorAll(".nav__link");

function closeMenu() {
  navMenu.classList.remove("show");
  navToggle.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
}

navToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("show");
  navToggle.classList.toggle("open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => link.addEventListener("click", closeMenu));

document.addEventListener("click", (e) => {
  if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) closeMenu();
});

// ================= ACTIVE LINK ON SCROLL =================
const sections = document.querySelectorAll("main section[id]");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      }
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);

sections.forEach((section) => observer.observe(section));

// ================= TYPING EFFECT =================
const typedEl = document.getElementById("typed-text");
const words = ["MERN Developer", "React Developer", "Node.js Developer", "Problem Solver"];
let wordIndex = 0;
let charIndex = words[0].length;
let deleting = true;

function type() {
  const word = words[wordIndex];

  if (deleting) {
    charIndex--;
  } else {
    charIndex++;
  }

  typedEl.textContent = word.substring(0, charIndex);

  let delay = deleting ? 50 : 100;

  if (!deleting && charIndex === word.length) {
    delay = 1800;
    deleting = true;
  } else if (deleting && charIndex === 0) {
    deleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    delay = 300;
  }

  setTimeout(type, delay);
}

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  setTimeout(type, 2000);
}

// ================= PROJECT MODAL =================
const projects = {
  "teyzix-market": {
    icon: "🛒",
    title: "Teyzix Market",
    description:
      "A multi-vendor service marketplace where vendors list services and customers browse, book and manage orders. Built as part of my internship at Teyzix Core.",
    tech: ["React", "Vite", "Node.js", "Express", "MongoDB", "JWT"],
    live: "https://teyzix-market.vercel.app",
    code: "#",
  },
  "vendor-quotation": {
    icon: "📄",
    title: "Vendor Management & Quotation System",
    description:
      "A system to manage vendors and handle the full quotation workflow: requesting, comparing and approving quotes.",
    tech: ["React", "Node.js", "Express", "MongoDB"],
    live: "https://vendor-hub-cyan.vercel.app/",
    code: "#",
  },
  "sp-market": {
    icon: "🏪",
    title: "Sp.market",
    description:
      "A combined product and service marketplace with deployment on a custom domain.",
    tech: ["React", "Node.js", "Express", "MongoDB"],
    live: "https://sp-market-iota.vercel.app/",
    code: "#",
  },
  "job-portal": {
    icon: "💼",
    title: "Job Portal",
    description:
      "A job portal with users, companies, jobs and applications, secured with auth middleware and email authentication.",
    tech: ["React", "Node.js", "Express", "MongoDB", "Nodemailer"],
    live: "https://job-portal-rose-theta.vercel.app/",
    code: "#",
  },
 converter: {
    icon: "🔄",
    title: "Word ⇄ PDF Converter",
    description:
      "A desktop app that converts Word documents to PDF and PDF back to Word, with a Flask backend and a Flet interface.",
    tech: ["Python", "Flask", "Flet"],
    live: "#",
    code: "https://github.com/esharajpoot156-max/Converter-word-to-pdf-pdf-to-word.git",
  }, 
};

const modal = document.getElementById("project-modal");
const modalThumb = document.getElementById("modal-thumb");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-description");
const modalTech = document.getElementById("modal-tech");
const modalLive = document.getElementById("modal-live");
const modalCode = document.getElementById("modal-code");
let lastFocused = null;

function openModal(key) {
  const p = projects[key];
  if (!p) return;

  lastFocused = document.activeElement;

  modalThumb.textContent = p.icon;
  modalTitle.textContent = p.title;
  modalDesc.textContent = p.description;
  modalTech.innerHTML = p.tech.map((t) => `<li>${t}</li>`).join("");

  modalLive.href = p.live;
  modalLive.style.display = p.live === "#" ? "none" : "inline-block";
  modalCode.href = p.code;
  modalCode.style.display = p.code === "#" ? "none" : "inline-block";

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  modal.querySelector(".modal__close").focus();
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (lastFocused) lastFocused.focus();
}

document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("click", (e) => {
    if (e.target.closest ("a")) return;
    openModal(card.dataset.project);
  });
  card.addEventListener("keydown", (e) =>{
    if (e.target.closest ("a")) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openModal(card.dataset.project);
    }
  });
});

modal.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", closeModal));

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
});

// ================= CONTACT FORM =================
const form = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  // Demo only: replace with Formspree / EmailJS / your backend endpoint
  formStatus.textContent = "Thanks! Your message has been received.";
  form.reset();
  setTimeout(() => (formStatus.textContent = ""), 4000);
});

// ================= FOOTER YEAR =================
document.getElementById("year").textContent = new Date().getFullYear();