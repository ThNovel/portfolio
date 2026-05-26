const header = document.querySelector(".site-header");
const themeToggle = document.querySelector(".theme-toggle");
const copyEmailButtons = document.querySelectorAll("[data-copy-email]");
const accordions = document.querySelectorAll("[data-accordion]");
const tactileSurfaces = document.querySelectorAll(".tactile-surface, .work-card");
const heroGlassButton = document.querySelector("[data-scroll-target]");
const projectBubbles = document.querySelectorAll(".project-bubble");
const waferGrid = document.querySelector(".wafer-die-grid");
const waferStage = document.querySelector(".wafer-stage");

const getCleanUrl = () => {
  const cleanPath = window.location.pathname.replace(/index\.html$/, "");
  return `${window.location.origin}${cleanPath}${window.location.search}`;
};

const removeHashFromUrl = () => {
  if (window.location.hash || /index\.html$/.test(window.location.pathname)) {
    window.history.replaceState(null, "", getCleanUrl());
  }
};

if (waferGrid && waferGrid.children.length === 0) {
  for (let i = 0; i < 130; i += 1) {
    waferGrid.appendChild(document.createElement("span"));
  }
}

const setTheme = (theme) => {
  const isDark = theme === "dark";

  document.documentElement.dataset.theme = theme;
  localStorage.setItem("theme", theme);

  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute("aria-label", isDark ? "Turn off night mode" : "Turn on night mode");
    themeToggle.querySelector("span").textContent = isDark ? "☀" : "☾";
  }
};

setTheme(localStorage.getItem("theme") || "light");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  });
}

const copyText = async (text) => {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch (error) {
      // Fall back below when clipboard permissions are blocked.
    }
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  textArea.remove();
};

copyEmailButtons.forEach((button) => {
  const originalText = button.textContent.trim();

  button.addEventListener("click", async () => {
    try {
      await copyText(button.dataset.copyEmail);
      button.textContent = "Copied";
    } catch (error) {
      button.textContent = button.dataset.copyEmail;
    }

    window.setTimeout(() => {
      button.textContent = originalText;
    }, 1400);
  });
});

const openAccordionItem = (item, open) => {
  const trigger = item.querySelector(".accordion-trigger");
  const content = item.querySelector(".accordion-content");

  if (!trigger || !content) {
    return;
  }

  item.classList.toggle("is-open", open);
  trigger.setAttribute("aria-expanded", String(open));
  content.style.maxHeight = open ? `${content.scrollHeight}px` : "0px";
  content.style.opacity = open ? "1" : "0";
};

accordions.forEach((accordion) => {
  accordion.querySelectorAll(".accordion-item").forEach((item) => {
    const trigger = item.querySelector(".accordion-trigger");

    openAccordionItem(item, item.classList.contains("is-open"));

    if (trigger) {
      trigger.addEventListener("click", () => {
        openAccordionItem(item, !item.classList.contains("is-open"));
      });
    }
  });
});

const setupSimilarityDemo = (demo) => {
  const xRow = demo.querySelector('[data-bit-row="x"]');
  const wRow = demo.querySelector('[data-bit-row="w"]');
  const thresholdInput = demo.querySelector("[data-threshold]");
  const thresholdValue = demo.querySelector("[data-threshold-value]");
  const matchPattern = demo.querySelector("[data-match-pattern]");
  const matchCount = demo.querySelector("[data-match-count]");
  const output = demo.querySelector("[data-output]");
  const outputNode = demo.querySelector(".output-node");

  if (!xRow || !wRow || !thresholdInput || !thresholdValue || !matchPattern || !matchCount || !output) {
    return;
  }

  const createBitButtons = (row, defaults) => {
    defaults.forEach((value, index) => {
      const button = document.createElement("button");
      button.className = "bit-toggle";
      button.type = "button";
      button.dataset.bit = String(7 - index);
      button.setAttribute("aria-pressed", String(Boolean(value)));
      button.textContent = String(value);
      button.addEventListener("click", () => {
        const nextValue = button.getAttribute("aria-pressed") !== "true";
        button.setAttribute("aria-pressed", String(nextValue));
        button.textContent = nextValue ? "1" : "0";
        updateDemo();
      });
      row.appendChild(button);
    });
  };

  const readBits = (row) =>
    [...row.querySelectorAll(".bit-toggle")].map((button) =>
      button.getAttribute("aria-pressed") === "true" ? 1 : 0
    );

  const updateDemo = () => {
    const xBits = readBits(xRow);
    const wBits = readBits(wRow);
    const matches = xBits.map((bit, index) => (bit === wBits[index] ? 1 : 0));
    const count = matches.reduce((sum, bit) => sum + bit, 0);
    const threshold = Number(thresholdInput.value);
    const result = count >= threshold ? 1 : 0;

    thresholdValue.textContent = String(threshold);
    matchPattern.textContent = matches.join("");
    matchCount.textContent = String(count);
    output.textContent = String(result);

    if (outputNode) {
      outputNode.classList.toggle("is-high", Boolean(result));
    }
  };

  createBitButtons(xRow, [1, 0, 1, 1, 0, 0, 1, 0]);
  createBitButtons(wRow, [1, 1, 1, 0, 0, 0, 1, 0]);
  thresholdInput.addEventListener("input", updateDemo);
  updateDemo();
};

document.querySelectorAll('[data-demo="similarity"]').forEach(setupSimilarityDemo);

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

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));

    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    removeHashFromUrl();
  });
});

if (window.location.hash) {
  const target = document.querySelector(window.location.hash);

  if (target) {
    window.setTimeout(() => {
      target.scrollIntoView({ block: "start" });
      removeHashFromUrl();
    }, 0);
  }
} else {
  removeHashFromUrl();
}
