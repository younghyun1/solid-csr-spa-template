import { createEffect, createSignal, onMount } from "solid-js";

// Util to get stored theme or default (light)
function getInitialTheme(): "light" | "dark" {
  if (typeof window !== "undefined") {
    const persisted = localStorage.getItem("theme");
    if (persisted === "dark" || persisted === "light") return persisted;
    if (window.matchMedia?.("(prefers-color-scheme: dark)")?.matches) {
      return "dark";
    }
  }
  return "light";
}

export const [theme, setTheme] = createSignal<"light" | "dark">(
  getInitialTheme(),
);

export function applyTheme(theme: "light" | "dark") {
  const html = document.documentElement;
  html.classList.remove("light", "dark");
  html.classList.add(theme);
}

export function toggleTheme() {
  const next = theme() === "dark" ? "light" : "dark";
  setTheme(next);
  localStorage.setItem("theme", next);
}

// Apply theme reactively whenever the signal changes.
// `onMount` ensures we don't touch `document` during SSR/hydration edge cases.
onMount(() => {
  createEffect(() => {
    applyTheme(theme());
  });
});
