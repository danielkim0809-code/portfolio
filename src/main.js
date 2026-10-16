import { projects } from "./content.js";

const illustrations = {
  portfolio: `<div class="mini-browser" aria-hidden="true"><div class="browser-bar"><span>● ● ●</span><span>daniel / portfolio</span><span>↗</span></div><div class="mini-content"><span class="mini-brand">dk®</span><div class="mini-nav">WORK &nbsp; ABOUT &nbsp; CONTACT</div><p>Ideas into<br /><em>experiences.</em></p><div class="mini-bottom"><span>DEVELOPER PORTFOLIO</span><span class="mini-flower">✳</span></div></div></div><span class="art-mark" aria-hidden="true">✳</span>`,
  archive: `<div class="archive-art" aria-hidden="true"><div class="archive-top">the everyday archive<span>↗</span></div><div class="archive-sheet"><span>COLLECT. OBSERVE. CREATE.</span><strong>Stay<br /><i>curious.</i></strong><div class="archive-shapes"><b></b><b></b><b></b></div><span class="archive-caption">A SPACE FOR SMALL INSPIRATIONS — CONCEPT 02</span></div></div>`,
};

const list = document.querySelector("#projects");
projects.forEach((project, index) => {
  const card = document.createElement("article");
  card.className = `project project-${project.visual}`;
  // This markup contains only our fixed illustrations; editable copy uses textContent below.
  card.innerHTML = `<button type="button" class="project-open" aria-haspopup="dialog"><div class="project-art">${illustrations[project.visual] || illustrations.portfolio}<span class="project-label"></span><span class="project-open-icon" aria-hidden="true">↗</span></div><div class="project-meta"><div><p class="project-category"></p><h3></h3><p class="project-subtitle"></p></div><span class="project-number" aria-hidden="true">0${index + 1}</span></div></button>`;
  card.querySelector(".project-label").textContent = project.label;
  card.querySelector(".project-category").textContent = project.category;
  card.querySelector("h3").textContent = project.title;
  card.querySelector(".project-subtitle").textContent = project.subtitle;
  card
    .querySelector("button")
    .setAttribute("aria-label", `${project.title} 상세 보기`);
  card
    .querySelector("button")
    .addEventListener("click", () => openProject(project));
  list.append(card);
});

const dialog = document.querySelector("#project-dialog");
function openProject(project) {
  document.querySelector("#dialog-label").textContent = project.label;
  document.querySelector("#dialog-title").textContent = project.title;
  document.querySelector("#dialog-description").textContent =
    project.description;
  const tags = document.querySelector("#dialog-tags");
  tags.replaceChildren(
    ...project.tags.map((tag) => {
      const element = document.createElement("span");
      element.textContent = tag;
      return element;
    }),
  );
  const link = document.querySelector("#dialog-link");
  link.hidden = !project.url;
  if (project.url) link.href = project.url;
  else link.removeAttribute("href");
  dialog.showModal();
}
document
  .querySelector("#close-dialog")
  .addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  const rect = dialog.getBoundingClientRect();
  if (
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom
  )
    dialog.close();
});

const toggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#navigation");
function closeMenu() {
  toggle.setAttribute("aria-expanded", "false");
  navigation.classList.remove("is-open");
}
toggle.addEventListener("click", () => {
  const expanded = toggle.getAttribute("aria-expanded") !== "true";
  toggle.setAttribute("aria-expanded", String(expanded));
  navigation.classList.toggle("is-open", expanded);
});
navigation
  .querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    toggle.getAttribute("aria-expanded") === "true"
  ) {
    closeMenu();
    toggle.focus();
  }
});
matchMedia("(min-width: 761px)").addEventListener("change", closeMenu);
document.querySelector("#year").textContent = new Date().getFullYear();
