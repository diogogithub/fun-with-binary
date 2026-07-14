/*
 * Fun with Binary
 * Copyright (C) 2018–2026 Diogo Cordeiro
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

(() => {
  "use strict";

  const BIT_COUNT = 6;
  const MAX_VALUE = (2 ** BIT_COUNT) - 1;
  const DEVICE_HOST = "42.42.42.42";
  const query = new URLSearchParams(window.location.search);
  const deviceBase = window.location.hostname === DEVICE_HOST
    ? ""
    : query.get("device") === "1"
      ? `http://${DEVICE_HOST}`
      : null;
  const weights = Array.from({ length: BIT_COUNT }, (_, index) => 2 ** (BIT_COUNT - index - 1));

  function readPersistentNumber(key) {
    try {
      return Number.parseInt(localStorage.getItem(key) ?? "0", 10) || 0;
    } catch (_error) {
      return 0;
    }
  }

  const state = {
    target: 0,
    bits: Array(BIT_COUNT).fill(0),
    showWeights: true,
    score: readPersistentNumber("fwb-score"),
    streak: readPersistentNumber("fwb-streak"),
    locked: false,
  };

  const elements = {
    bits: document.querySelector("#bits"),
    target: document.querySelector("#target-number"),
    decimal: document.querySelector("#current-decimal"),
    binary: document.querySelector("#current-binary"),
    sum: document.querySelector("#current-sum"),
    difference: document.querySelector("#difference"),
    progress: document.querySelector("#progress-bar"),
    score: document.querySelector("#score"),
    streak: document.querySelector("#streak"),
    success: document.querySelector("#success"),
    successEquation: document.querySelector("#success-equation"),
    newChallenge: document.querySelector("#new-challenge"),
    toggleLabels: document.querySelector("#toggle-labels"),
    confetti: document.querySelector("#confetti"),
  };

  function randomTarget(previous = 0) {
    let target = previous;
    while (target === previous) {
      target = Math.floor(Math.random() * MAX_VALUE) + 1;
    }
    return target;
  }

  function currentValue() {
    return state.bits.reduce((total, bit, index) => total + (bit * weights[index]), 0);
  }

  function binaryString() {
    return state.bits.join("");
  }

  function activeWeights() {
    return weights.filter((_, index) => state.bits[index] === 1);
  }

  function createBit(index) {
    const wrapper = document.createElement("div");
    wrapper.className = "bit";

    const weight = document.createElement("span");
    weight.className = "bit-weight";
    weight.textContent = weights[index];
    weight.id = `bit-weight-${index}`;

    const button = document.createElement("button");
    button.className = "bit-button";
    button.type = "button";
    button.dataset.index = String(index);
    button.dataset.key = String(index + 1);
    button.setAttribute("aria-describedby", weight.id);
    button.setAttribute("aria-label", `Bit worth ${weights[index]}, off`);
    button.setAttribute("aria-pressed", "false");
    button.textContent = "0";

    const bitIndex = document.createElement("span");
    bitIndex.className = "bit-index";
    bitIndex.textContent = `bit ${BIT_COUNT - index - 1}`;

    button.addEventListener("click", () => toggleBit(index));

    wrapper.append(weight, button, bitIndex);
    return wrapper;
  }

  function renderBits() {
    const buttons = elements.bits.querySelectorAll(".bit-button");
    buttons.forEach((button, index) => {
      const enabled = state.bits[index] === 1;
      button.textContent = enabled ? "1" : "0";
      button.setAttribute("aria-pressed", String(enabled));
      button.setAttribute("aria-label", `Bit worth ${weights[index]}, ${enabled ? "on" : "off"}`);
      button.setAttribute("aria-disabled", String(state.locked));
    });
  }

  function renderStatus() {
    const value = currentValue();
    const remaining = state.target - value;
    const active = activeWeights();

    elements.target.textContent = String(state.target);
    elements.decimal.textContent = String(value);
    elements.binary.textContent = binaryString();
    elements.sum.textContent = active.length ? `${active.join(" + ")} = ${value}` : "0";
    elements.progress.style.width = `${Math.min((value / state.target) * 100, 100)}%`;
    elements.score.textContent = String(state.score);
    elements.streak.textContent = String(state.streak);

    elements.difference.classList.toggle("too-high", remaining < 0);
    if (value === 0) {
      elements.difference.textContent = "Start by switching on a bit.";
    } else if (remaining > 0) {
      elements.difference.textContent = `${remaining} more to reach the target.`;
    } else if (remaining < 0) {
      elements.difference.textContent = `${Math.abs(remaining)} too high — switch a bit off.`;
    } else {
      elements.difference.textContent = "Exact match.";
    }
  }

  function render() {
    renderBits();
    renderStatus();
    saveSession();
  }

  function saveSession() {
    try {
      sessionStorage.setItem("fwb-session", JSON.stringify({
        target: state.target,
        bits: state.bits,
        showWeights: state.showWeights,
      }));
    } catch (_error) {
      // The game remains fully usable when storage is unavailable.
    }
  }

  function restoreSession() {
    try {
      const saved = JSON.parse(sessionStorage.getItem("fwb-session") ?? "null");
      if (
        saved
        && Number.isInteger(saved.target)
        && saved.target > 0
        && saved.target <= MAX_VALUE
        && Array.isArray(saved.bits)
        && saved.bits.length === BIT_COUNT
        && saved.bits.every((bit) => bit === 0 || bit === 1)
      ) {
        state.target = saved.target;
        state.bits = saved.bits;
        state.showWeights = saved.showWeights !== false;
        return true;
      }
    } catch (_error) {
      // Ignore invalid or unavailable storage.
    }
    return false;
  }

  function persistScore() {
    try {
      localStorage.setItem("fwb-score", String(state.score));
      localStorage.setItem("fwb-streak", String(state.streak));
    } catch (_error) {
      // Score persistence is optional.
    }
  }

  function sendDeviceCommand(path) {
    if (deviceBase === null) {
      return;
    }

    const externalDevice = deviceBase !== "";
    fetch(`${deviceBase}${path}`, {
      method: "GET",
      cache: "no-store",
      mode: externalDevice ? "no-cors" : "same-origin",
    }).catch(() => {
      // The browser game should not fail when the physical device disconnects.
    });
  }

  function toggleBit(index) {
    if (state.locked || index < 0 || index >= BIT_COUNT) {
      return;
    }

    state.bits[index] = state.bits[index] === 1 ? 0 : 1;
    sendDeviceCommand(`/switch_state?led=${index}`);
    render();

    if (currentValue() === state.target) {
      completeChallenge();
    }
  }

  function completeChallenge() {
    state.locked = true;
    state.score += 1;
    state.streak += 1;
    persistScore();

    const active = activeWeights();
    elements.successEquation.textContent = `${binaryString()}₂ = ${active.join(" + ")} = ${state.target}₁₀`;
    elements.success.hidden = false;
    sendDeviceCommand("/won");
    render();
    launchConfetti();

    window.setTimeout(() => startChallenge(), 1750);
  }

  function startChallenge({ resetStreak = false } = {}) {
    if (resetStreak && currentValue() !== state.target && state.bits.some(Boolean)) {
      state.streak = 0;
      persistScore();
    }

    state.target = randomTarget(state.target);
    state.bits = Array(BIT_COUNT).fill(0);
    state.locked = false;
    elements.success.hidden = true;
    render();
  }

  function toggleWeights() {
    state.showWeights = !state.showWeights;
    elements.bits.classList.toggle("hide-weights", !state.showWeights);
    elements.toggleLabels.setAttribute("aria-pressed", String(state.showWeights));
    elements.toggleLabels.querySelector("span:last-child").textContent = state.showWeights ? "Hide weights" : "Show weights";
    saveSession();
  }

  function launchConfetti() {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      return;
    }

    const fragments = document.createDocumentFragment();
    const palette = ["var(--cyan)", "var(--mint)", "var(--yellow)", "#ffffff"];

    for (let index = 0; index < 34; index += 1) {
      const piece = document.createElement("i");
      const angle = (Math.PI * 2 * index) / 34;
      const distance = 100 + Math.random() * 220;
      piece.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
      piece.style.setProperty("--y", `${Math.sin(angle) * distance - 80}px`);
      piece.style.setProperty("--r", `${Math.round(Math.random() * 720 - 360)}deg`);
      piece.style.background = palette[index % palette.length];
      piece.style.animationDelay = `${Math.random() * 100}ms`;
      fragments.append(piece);
    }

    elements.confetti.replaceChildren(fragments);
    window.setTimeout(() => elements.confetti.replaceChildren(), 1200);
  }

  function handleKeyboard(event) {
    const target = event.target;
    if (target instanceof HTMLButtonElement || target instanceof HTMLAnchorElement || target instanceof HTMLInputElement) {
      return;
    }

    const index = Number.parseInt(event.key, 10) - 1;
    if (index >= 0 && index < BIT_COUNT) {
      event.preventDefault();
      toggleBit(index);
    }

    if (event.key.toLowerCase() === "n") {
      event.preventDefault();
      startChallenge({ resetStreak: true });
    }
  }

  function initialise() {
    const fragment = document.createDocumentFragment();
    for (let index = 0; index < BIT_COUNT; index += 1) {
      fragment.append(createBit(index));
    }
    elements.bits.append(fragment);

    const restored = restoreSession();
    if (!restored) {
      state.target = randomTarget();
    }

    elements.bits.classList.toggle("hide-weights", !state.showWeights);
    elements.toggleLabels.setAttribute("aria-pressed", String(state.showWeights));
    elements.toggleLabels.querySelector("span:last-child").textContent = state.showWeights ? "Hide weights" : "Show weights";

    elements.newChallenge.addEventListener("click", () => startChallenge({ resetStreak: true }));
    elements.toggleLabels.addEventListener("click", toggleWeights);
    document.addEventListener("keydown", handleKeyboard);

    render();
  }

  initialise();
})();
