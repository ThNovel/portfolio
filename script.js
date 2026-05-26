const header = document.querySelector(".site-header");
const tactileSurfaces = document.querySelectorAll(".tactile-surface, .work-card");
const heroGlassButton = document.querySelector("[data-scroll-target]");
const projectBubbles = document.querySelectorAll(".project-bubble");
const waferGrid = document.querySelector(".wafer-die-grid");
const waferStage = document.querySelector(".wafer-stage");

if (waferGrid && waferGrid.children.length === 0) {
  for (let i = 0; i < 130; i += 1) {
    waferGrid.appendChild(document.createElement("span"));
  }
}

const updateHeaderDepth = () => {
  const scrolled = window.scrollY > 16;
  header.style.filter = scrolled ? "drop-shadow(0 12px 28px rgba(9, 9, 9, 0.08))" : "none";
};

updateHeaderDepth();

let lastScrollY = window.scrollY;

const updateHeaderVisibility = () => {
  const currentScrollY = window.scrollY;
  const scrollingDown = currentScrollY > lastScrollY;
  const movedEnough = Math.abs(currentScrollY - lastScrollY) > 6;

  updateHeaderDepth();

  if (currentScrollY < 40) {
    header.classList.remove("header-hidden");
  } else if (movedEnough && scrollingDown) {
    header.classList.add("header-hidden");
  } else if (movedEnough) {
    header.classList.remove("header-hidden");
  }

  lastScrollY = currentScrollY;
};

window.addEventListener("scroll", updateHeaderVisibility, { passive: true });

tactileSurfaces.forEach((surface) => {
  surface.classList.add("tactile-surface");

  surface.addEventListener("pointerenter", () => {
    if (surface.classList.contains("project-bubble")) {
      projectBubbles.forEach((bubble) => {
        if (bubble !== surface) {
          bubble.classList.remove("is-revealed");
        }
      });
    }

    surface.classList.add("is-revealed");
  });

  surface.addEventListener("pointerleave", () => {
    surface.classList.remove("is-revealed");
  });

  surface.addEventListener("focus", () => {
    surface.classList.add("is-revealed");
  });

  surface.addEventListener("blur", () => {
    surface.classList.remove("is-revealed");
  });

  surface.addEventListener("pointermove", (event) => {
    const rect = surface.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    surface.style.setProperty("--pointer-x", `${x}%`);
    surface.style.setProperty("--pointer-y", `${y}%`);
  });
});

if (waferStage) {
  waferStage.addEventListener("pointermove", (event) => {
    const rect = waferStage.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    waferStage.style.setProperty("--pointer-x", `${x}%`);
    waferStage.style.setProperty("--pointer-y", `${y}%`);
  });
}

if (heroGlassButton) {
  heroGlassButton.addEventListener("click", () => {
    const target = document.querySelector(heroGlassButton.dataset.scrollTarget);

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}
