document.documentElement.classList.add("js");

const header = document.querySelector(".site-header");
const themeToggle = document.querySelector(".theme-toggle");
const copyEmailButtons = document.querySelectorAll("[data-copy-email]");
const accordions = document.querySelectorAll("[data-accordion]");
const tactileSurfaces = document.querySelectorAll(
  ".tactile-surface, .work-card, .button, .contact-links a, .contact-links button, .tool-grid span"
);
const heroGlassButton = document.querySelector("[data-scroll-target]");
const projectBubbles = document.querySelectorAll(".project-bubble");
const waferStage = document.querySelector(".wafer-stage");
const hero = document.querySelector(".hero");

const getCleanUrl = () => {
  const cleanPath = window.location.pathname.replace(/index\.html$/, "");
  return `${window.location.origin}${cleanPath}${window.location.search}`;
};

const removeHashFromUrl = () => {
  if (window.location.hash || /index\.html$/.test(window.location.pathname)) {
    window.history.replaceState(null, "", getCleanUrl());
  }
};

document
  .querySelectorAll(
    ".section-heading, .intro-grid, .skills-section, .current-section, .contact-section, .work-card, .expertise-item, .tool-grid span, .current-card, .project-copy, .project-deep-dive, .project-facts, .project-gallery figure"
  )
  .forEach((element) => {
    element.classList.add("scroll-reveal");
  });

document
  .querySelectorAll(".section-heading h2, .intro-grid h2, .contact-section h2")
  .forEach((element) => {
    element.classList.add("scroll-text");
  });

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
  );

  document.querySelectorAll(".scroll-reveal, .scroll-text").forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  document.querySelectorAll(".scroll-reveal, .scroll-text").forEach((element) => {
    element.classList.add("is-visible");
  });
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

const setupMipsDemo = (demo) => {
  const instructionNodes = [...demo.querySelectorAll("[data-mips-instruction]")];
  const registerNodes = [...demo.querySelectorAll("[data-mips-register]")];
  const stageNodes = [...demo.querySelectorAll("[data-mips-stage]")];
  const pc = demo.querySelector("[data-mips-pc]");
  const currentInstruction = demo.querySelector("[data-mips-current]");
  const aluOperation = demo.querySelector("[data-mips-alu]");
  const note = demo.querySelector("[data-mips-note]");
  const stepButton = demo.querySelector("[data-mips-step]");
  const resetButton = demo.querySelector("[data-mips-reset]");

  if (!instructionNodes.length || !registerNodes.length || !stageNodes.length || !pc || !currentInstruction || !aluOperation || !note || !stepButton || !resetButton) {
    return;
  }

  const program = [
    { text: "LOAD R1, 5", operation: "Pass immediate", destination: 1, execute: () => 5 },
    { text: "LOAD R2, 3", operation: "Pass immediate", destination: 2, execute: () => 3 },
    { text: "ADD R3, R1, R2", operation: "Add", destination: 3, execute: (registers) => registers[1] + registers[2] },
    { text: "SUB R4, R1, R2", operation: "Subtract", destination: 4, execute: (registers) => registers[1] - registers[2] },
    { text: "AND R5, R1, R2", operation: "Bitwise AND", destination: 5, execute: (registers) => registers[1] & registers[2] },
    { text: "OR R6, R1, R2", operation: "Bitwise OR", destination: 6, execute: (registers) => registers[1] | registers[2] }
  ];
  const stages = ["pc", "instruction", "control", "registers", "alu", "writeback"];
  const stageNotes = {
    pc: "The program counter selects the next instruction.",
    instruction: "The processor reads the current instruction.",
    control: "Control logic selects the required datapath signals.",
    registers: "The register file provides the required operands.",
    alu: "The ALU performs the selected operation.",
    writeback: "The result returns to the destination register."
  };
  let registers;
  let instructionIndex;
  let stageIndex;
  let writtenRegister;

  const render = () => {
    const instruction = program[instructionIndex];
    const complete = instructionIndex >= program.length;

    pc.textContent = complete ? String(program.length) : String(instructionIndex);
    currentInstruction.textContent = complete ? "Program complete" : instruction.text;
    aluOperation.textContent = complete ? "Idle" : instruction.operation;
    note.textContent = complete ? "Program complete. Reset the demo to run it again." : stageNotes[stages[stageIndex]];
    stepButton.textContent = complete ? "Complete" : "Step";
    stepButton.disabled = complete;

    instructionNodes.forEach((node, index) => {
      node.classList.toggle("is-current", index === instructionIndex && !complete);
      node.classList.toggle("is-complete", index < instructionIndex || complete);
    });

    stageNodes.forEach((node) => {
      node.classList.toggle("is-active", !complete && node.dataset.mipsStage === stages[stageIndex]);
    });

    registerNodes.forEach((node, index) => {
      node.textContent = String(registers[index]);
      node.parentElement.classList.toggle("is-written", index === writtenRegister);
    });
  };

  const resetDemo = () => {
    registers = Array(8).fill(0);
    instructionIndex = 0;
    stageIndex = 0;
    writtenRegister = undefined;
    render();
  };

  stepButton.addEventListener("click", () => {
    if (instructionIndex >= program.length) {
      return;
    }

    writtenRegister = undefined;

    if (stages[stageIndex] === "writeback") {
      const instruction = program[instructionIndex];
      registers[instruction.destination] = instruction.execute(registers) & 0xff;
      writtenRegister = instruction.destination;
      instructionIndex += 1;
      stageIndex = 0;
    } else {
      stageIndex += 1;
    }

    render();
  });

  resetButton.addEventListener("click", resetDemo);
  resetDemo();
};

document.querySelectorAll('[data-demo="mips8"]').forEach(setupMipsDemo);

const setupLvdDemo = (demo) => {
  const threshold = 11;
  const slider = demo.querySelector("[data-lvd-slider]");
  const voltageText = demo.querySelector("[data-lvd-voltage]");
  const statusVoltage = demo.querySelector("[data-lvd-status-voltage]");
  const percentText = demo.querySelector("[data-lvd-percent]");
  const fill = demo.querySelector("[data-lvd-fill]");
  const status = demo.querySelector("[data-lvd-status]");
  const explanation = demo.querySelector("[data-lvd-explanation]");
  const startButton = demo.querySelector("[data-lvd-start]");
  const pauseButton = demo.querySelector("[data-lvd-pause]");
  const resetButton = demo.querySelector("[data-lvd-reset]");
  let dischargeTimer;

  if (!slider || !voltageText || !statusVoltage || !percentText || !fill || !status || !explanation) {
    return;
  }

  const setVoltage = (value) => {
    const voltage = Math.max(8, Math.min(13, Number(value)));
    const percentage = Math.round(((voltage - 8) / 5) * 100);
    const connected = voltage >= threshold;
    const formattedVoltage = voltage.toFixed(1);

    slider.value = formattedVoltage;
    voltageText.textContent = formattedVoltage;
    statusVoltage.textContent = formattedVoltage;
    percentText.textContent = `${percentage}%`;
    fill.style.height = `${percentage}%`;
    status.textContent = connected ? "CONNECTED" : "DISCONNECTED";
    explanation.textContent = connected
      ? "The battery remains within its safe operating range. The load stays connected."
      : "The battery has fallen below the protection threshold. The Low Voltage Disconnect isolates the load to prevent over-discharge.";

    demo.classList.toggle("is-connected", connected);
    demo.classList.toggle("is-disconnected", !connected);
  };

  const pauseDischarge = () => {
    window.clearInterval(dischargeTimer);
    dischargeTimer = undefined;
  };

  slider.addEventListener("input", () => {
    pauseDischarge();
    setVoltage(slider.value);
  });

  if (startButton) {
    startButton.addEventListener("click", () => {
      if (dischargeTimer) {
        return;
      }

      dischargeTimer = window.setInterval(() => {
        const nextVoltage = Number(slider.value) - 0.1;
        setVoltage(nextVoltage);

        if (nextVoltage <= 8) {
          pauseDischarge();
        }
      }, 420);
    });
  }

  if (pauseButton) {
    pauseButton.addEventListener("click", pauseDischarge);
  }

  if (resetButton) {
    resetButton.addEventListener("click", () => {
      pauseDischarge();
      setVoltage(12);
    });
  }

  setVoltage(slider.value);
};

document.querySelectorAll('[data-demo="lvd"]').forEach(setupLvdDemo);

const setupCansatDemo = (demo) => {
  const startButton = demo.querySelector("[data-cansat-start]");
  const resetButton = demo.querySelector("[data-cansat-reset]");
  const marker = demo.querySelector("[data-cansat-marker]");
  const phase = demo.querySelector("[data-cansat-phase]");
  const altitude = demo.querySelector("[data-cansat-altitude]");
  const velocity = demo.querySelector("[data-cansat-velocity]");
  const temperature = demo.querySelector("[data-cansat-temperature]");
  const pressure = demo.querySelector("[data-cansat-pressure]");
  const link = demo.querySelector("[data-cansat-link]");
  const packet = demo.querySelector("[data-cansat-packet]");
  let missionTimer;
  let missionTime = 0;

  if (!startButton || !resetButton || !marker || !phase || !altitude || !velocity || !temperature || !pressure || !link || !packet) {
    return;
  }

  const setMissionState = (state) => {
    const pressureValue = 1013.25 * Math.pow(1 - state.altitude / 44330, 5.255);
    const temperatureValue = 24 - state.altitude * 0.0065 + Math.sin(state.time * 0.8) * 0.3;
    const markerPosition = 88 - Math.min(state.altitude, 400) / 400 * 72;

    phase.textContent = state.phase;
    altitude.textContent = Math.round(state.altitude).toString();
    velocity.textContent = state.velocity.toFixed(1);
    temperature.textContent = temperatureValue.toFixed(1);
    pressure.textContent = pressureValue.toFixed(1);
    link.textContent = state.link;
    packet.textContent = state.packet;

    marker.style.setProperty("--cansat-y", `${markerPosition}%`);
    demo.classList.toggle("is-running", state.running);
    demo.classList.toggle("is-descent", state.phase === "Descent");
    demo.classList.toggle("is-complete", state.phase === "Landing / Mission Complete");
  };

  const getMissionState = () => {
    if (missionTime < 0.4) {
      return {
        altitude: 0,
        link: "Standby",
        packet: "--",
        phase: "Idle",
        running: false,
        time: missionTime,
        velocity: 0
      };
    }

    if (missionTime < 7) {
      return {
        altitude: (missionTime / 7) * 315,
        link: "Transmitting",
        packet: `T+${missionTime.toFixed(1)}s`,
        phase: "Drone Ascent",
        running: true,
        time: missionTime,
        velocity: 0
      };
    }

    if (missionTime < 8.5) {
      return {
        altitude: 315,
        link: "Packet lock",
        packet: `T+${missionTime.toFixed(1)}s`,
        phase: "Release",
        running: true,
        time: missionTime,
        velocity: 0
      };
    }

    if (missionTime < 20) {
      const descentProgress = (missionTime - 8.5) / 11.5;
      return {
        altitude: Math.max(0, 315 * (1 - descentProgress)),
        link: "Receiving",
        packet: `T+${missionTime.toFixed(1)}s`,
        phase: "Descent",
        running: true,
        time: missionTime,
        velocity: -(10.8 + Math.sin(missionTime * 1.4) * 0.35)
      };
    }

    return {
      altitude: 0,
      link: "Complete",
      packet: `T+${missionTime.toFixed(1)}s`,
      phase: "Landing / Mission Complete",
      running: false,
      time: missionTime,
      velocity: 0
    };
  };

  const stopMission = () => {
    window.clearInterval(missionTimer);
    missionTimer = undefined;
  };

  const resetMission = () => {
    stopMission();
    missionTime = 0;
    startButton.textContent = "Start Mission Simulation";
    setMissionState(getMissionState());
  };

  startButton.addEventListener("click", () => {
    if (missionTimer) {
      return;
    }

    if (missionTime >= 20) {
      missionTime = 0;
    }

    startButton.textContent = "Simulation Running";
    missionTimer = window.setInterval(() => {
      missionTime += 0.22;
      const state = getMissionState();
      setMissionState(state);

      if (missionTime >= 20) {
        stopMission();
        startButton.textContent = "Run Again";
      }
    }, 180);
  });

  resetButton.addEventListener("click", resetMission);
  resetMission();
};

document.querySelectorAll('[data-demo="cansat"]').forEach(setupCansatDemo);

const updateHeaderDepth = () => {
  const scrolled = window.scrollY > 16;
  header.style.filter = scrolled ? "drop-shadow(0 12px 28px rgba(9, 9, 9, 0.08))" : "none";
};

updateHeaderDepth();

const updateHeroMotion = () => {
  if (!hero || !waferStage) {
    return;
  }

  const progress = Math.min(Math.max(window.scrollY / Math.max(hero.offsetHeight * 0.72, 1), 0), 1);
  const scale = 1 - progress * 0.1;
  const opacity = 1 - progress * 0.38;
  const shift = progress * 34;

  document.documentElement.style.setProperty("--wafer-scale", scale.toFixed(3));
  document.documentElement.style.setProperty("--wafer-opacity", opacity.toFixed(3));
  document.documentElement.style.setProperty("--wafer-shift", `${shift.toFixed(1)}px`);
};

updateHeroMotion();

let lastScrollY = window.scrollY;

const updateHeaderVisibility = () => {
  const currentScrollY = window.scrollY;
  const scrollingDown = currentScrollY > lastScrollY;
  const movedEnough = Math.abs(currentScrollY - lastScrollY) > 6;

  updateHeaderDepth();
  updateHeroMotion();

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
  const waferImage = waferStage.querySelector(".wafer-image");
  const waferLens = waferStage.querySelector(".wafer-lens");
  const canUseLens = window.matchMedia("(hover: hover) and (pointer: fine)").matches
    && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lensZoom = 1.6;
  let lensFrame;
  let lensX = 0;
  let lensY = 0;

  if (waferImage && waferLens && canUseLens) {
    const syncLensImage = () => {
      waferLens.style.backgroundImage = `url("${waferImage.currentSrc || waferImage.src}")`;
    };

    const updateLens = () => {
      const rect = waferStage.getBoundingClientRect();
      const lensSize = waferLens.offsetWidth;
      const x = Math.max(0, Math.min(rect.width, lensX));
      const y = Math.max(0, Math.min(rect.height, lensY));

      waferLens.style.left = `${x}px`;
      waferLens.style.top = `${y}px`;
      waferLens.style.backgroundSize = `${rect.width * lensZoom}px ${rect.height * lensZoom}px`;
      waferLens.style.backgroundPosition = `${lensSize / 2 - x * lensZoom}px ${lensSize / 2 - y * lensZoom}px`;
      lensFrame = undefined;
    };

    const requestLensUpdate = () => {
      if (!lensFrame) {
        lensFrame = window.requestAnimationFrame(updateLens);
      }
    };

    waferStage.addEventListener("pointerenter", () => {
      syncLensImage();
      waferStage.classList.add("is-lens-active");
    });

    waferStage.addEventListener("pointermove", (event) => {
      const rect = waferStage.getBoundingClientRect();

      lensX = event.clientX - rect.left;
      lensY = event.clientY - rect.top;
      waferStage.classList.add("is-lens-active");
      requestLensUpdate();
    });

    waferStage.addEventListener("pointerleave", () => {
      waferStage.classList.remove("is-lens-active");
    });

    document.addEventListener("pointermove", (event) => {
      if (!waferStage.contains(event.target)) {
        waferStage.classList.remove("is-lens-active");
      }
    }, { passive: true });

    waferImage.addEventListener("load", syncLensImage);
    window.addEventListener("resize", requestLensUpdate);
    syncLensImage();
  }
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
