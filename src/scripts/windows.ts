/*
 * Desktop window manager: open, focus, drag, resize, close, minimise and zoom the Window components.
 * Anything with [data-open-window="<id>"] opens (or brings forward) that window.
 */

const desktop = document.querySelector<HTMLElement>(".desktop");
const windows = new Map(
  [...document.querySelectorAll<HTMLElement>("[data-window]")].map((el) => [el.dataset.window!, el]),
);

const CASCADE = 26;
const MARGIN = 8;
const MIN_WIDTH = 380;
const MIN_HEIGHT = 260;
let zTop = 10;
let opened = 0;

const reduceMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Run a CSS animation class to completion */
const animate = (el: HTMLElement, className: string) =>
  new Promise<void>((resolve) => {
    if (reduceMotion()) return resolve();
    el.classList.add(className);
    el.addEventListener(
      "animationend",
      () => {
        el.classList.remove(className);
        resolve();
      },
      { once: true },
    );
  });

const bounds = () => desktop!.getBoundingClientRect();

/**
 * Dragging may push a window partly off screen (title bar stays reachable);
 * opening and resizing keep it fully inside the desktop.
 */
const clampPosition = (win: HTMLElement, left: number, top: number, loose: boolean) => {
  const area = bounds();
  const minLeft = loose ? 80 - win.offsetWidth : MARGIN;
  const maxLeft = loose ? area.width - 80 : Math.max(MARGIN, area.width - win.offsetWidth - MARGIN);
  const maxTop = loose ? area.height - 40 : Math.max(0, area.height - win.offsetHeight - MARGIN);
  return {
    left: Math.min(Math.max(left, minLeft), maxLeft),
    top: Math.min(Math.max(top, 0), maxTop),
  };
};

const place = (win: HTMLElement, left: number, top: number, loose = false) => {
  const pos = clampPosition(win, left, top, loose);
  win.style.left = `${pos.left}px`;
  win.style.top = `${pos.top}px`;
};

const focus = (win: HTMLElement) => {
  for (const other of windows.values()) other.classList.toggle("is-active", other === win);
  win.style.zIndex = String(++zTop);
};

/** After a window goes away, the next one down becomes active */
const focusTopmost = () => {
  const top = [...windows.values()]
    .filter((w) => !w.hidden)
    .sort((a, b) => Number(b.style.zIndex) - Number(a.style.zIndex))[0];
  if (top) focus(top);
};

/*
 * "Want to see more?": each case study lists every other project as a card, preferred picks first.
 * Show the first two whose windows aren't open on the desktop; a window counts as open from when
 * it opens until it's closed (minimised windows are still open, as on a Mac). Runs on every open
 * and close, so suggestions in windows that are already showing update straight away.
 */
const SUGGESTIONS = 2;

const syncSeeMore = () => {
  const openIds = new Set([...windows].filter(([, w]) => w.dataset.placed).map(([id]) => id));
  // Let the rest of the page react too (Dock running dots, Calendly loading, Finder search focus)
  document.dispatchEvent(new CustomEvent("windows:change", { detail: { open: [...openIds] } }));
  for (const win of windows.values()) {
    const section = win.querySelector<HTMLElement>("[data-see-more]");
    if (!section) continue;
    let shown = 0;
    for (const card of section.querySelectorAll<HTMLElement>("[data-see-more-id]")) {
      const show = shown < SUGGESTIONS && !openIds.has(card.dataset.seeMoreId!);
      card.hidden = !show;
      if (show) shown++;
    }
    // Everything's open: nothing left to suggest
    section.hidden = shown === 0;
  }
};

const open = async (id: string) => {
  const win = windows.get(id);
  if (!win || !desktop) return;

  if (!win.hidden) {
    focus(win);
    return;
  }

  win.hidden = false;
  if (win.dataset.placed) {
    refit(win);
  } else {
    // Cascade new windows from a centred start, like the Finder does
    const area = bounds();
    const step = (opened++ % 6) * CASCADE;
    const left = Math.max(MARGIN, (area.width - win.offsetWidth) / 2 - 2 * CASCADE) + step;
    const top = Math.max(MARGIN, (area.height - win.offsetHeight) / 2 - 3 * CASCADE) + step;
    place(win, left, top);
    win.dataset.placed = "true";
    syncSeeMore();
  }
  focus(win);
  win.querySelector<HTMLElement>(".window__content")?.focus({ preventScroll: true });
  await animate(win, "is-opening");
};

const close = async (win: HTMLElement) => {
  await animate(win, "is-closing");
  win.hidden = true;
  win.classList.remove("is-active", "is-zoomed");
  win.removeAttribute("data-zoom-restore");
  win.querySelector(".window__content")?.scrollTo(0, 0);
  // Closed windows reopen at the default size
  win.style.width = "";
  win.style.height = "";
  delete win.dataset.placed;
  syncSeeMore();
  focusTopmost();
};

const minimize = async (win: HTMLElement) => {
  await animate(win, "is-minimizing");
  // Hidden but keeps its place and scroll position; opening it again restores it
  win.hidden = true;
  win.classList.remove("is-active");
  focusTopmost();
};

/** Refit a window the visitor left partly off screen or resized too big, e.g. after the browser got smaller */
const refit = (win: HTMLElement) => {
  const area = bounds();
  if (win.style.width && win.offsetWidth > area.width - MARGIN * 2) win.style.width = `${area.width - MARGIN * 2}px`;
  if (win.style.height && win.offsetHeight > area.height - MARGIN * 2) win.style.height = `${area.height - MARGIN * 2}px`;
  place(win, win.offsetLeft, win.offsetTop);
};

const toggleZoom = (win: HTMLElement) => {
  if (win.classList.contains("is-zoomed")) {
    const [left, top, width, height] = (win.dataset.zoomRestore ?? "").split(",");
    Object.assign(win.style, { left, top, width, height });
    win.classList.remove("is-zoomed");
    return;
  }
  win.dataset.zoomRestore = [win.style.left, win.style.top, win.style.width, win.style.height].join(",");
  const area = bounds();
  Object.assign(win.style, {
    left: `${MARGIN}px`,
    top: `${MARGIN}px`,
    width: `${area.width - MARGIN * 2}px`,
    height: `${area.height - MARGIN * 2 - 80}px`, // leave the Dock visible
  });
  win.classList.add("is-zoomed");
};

for (const win of windows.values()) {
  win.addEventListener("pointerdown", () => focus(win));

  win.addEventListener("click", (event) => {
    const action = (event.target as HTMLElement).closest<HTMLElement>("[data-action]")?.dataset.action;
    if (action === "close") close(win);
    if (action === "minimize") minimize(win);
    if (action === "zoom") toggleZoom(win);
  });

  win.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close(win);
  });

  // Drag by the title bar
  const handle = win.querySelector<HTMLElement>("[data-drag-handle]");
  handle?.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || (event.target as HTMLElement).closest("button, a")) return;
    if (win.classList.contains("is-zoomed")) return;
    event.preventDefault();
    handle.setPointerCapture(event.pointerId);
    win.classList.add("is-dragging");
    const startX = event.clientX - win.offsetLeft;
    const startY = event.clientY - win.offsetTop;

    const move = (e: PointerEvent) => place(win, e.clientX - startX, e.clientY - startY, true);
    const end = () => {
      win.classList.remove("is-dragging");
      handle.removeEventListener("pointermove", move);
      handle.removeEventListener("pointerup", end);
      handle.removeEventListener("pointercancel", end);
    };
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", end);
    handle.addEventListener("pointercancel", end);
  });

  // Resize from the edges and corners
  for (const grip of win.querySelectorAll<HTMLElement>("[data-resize]")) {
    grip.addEventListener("pointerdown", (event) => {
      if (event.button !== 0 || win.classList.contains("is-zoomed")) return;
      event.preventDefault();
      grip.setPointerCapture(event.pointerId);
      win.classList.add("is-resizing");

      const edge = grip.dataset.resize!;
      const area = bounds();
      const minWidth = Math.min(MIN_WIDTH, area.width - MARGIN * 2);
      const minHeight = Math.min(MIN_HEIGHT, area.height - MARGIN * 2);
      const start = {
        x: event.clientX,
        y: event.clientY,
        left: win.offsetLeft,
        top: win.offsetTop,
        width: win.offsetWidth,
        height: win.offsetHeight,
      };

      const move = (e: PointerEvent) => {
        const dx = e.clientX - start.x;
        const dy = e.clientY - start.y;
        let { left, top, width, height } = start;

        // Right and bottom edges grow up to the desktop edge
        if (edge.includes("e")) width = Math.min(Math.max(start.width + dx, minWidth), area.width - start.left);
        if (edge.includes("s")) height = Math.min(Math.max(start.height + dy, minHeight), area.height - start.top);
        // Left and top edges move the window while the opposite edge stays put
        if (edge.includes("w")) {
          const right = start.left + start.width;
          left = Math.min(Math.max(start.left + dx, 0), right - minWidth);
          width = right - left;
        }
        if (edge.includes("n")) {
          const bottom = start.top + start.height;
          top = Math.min(Math.max(start.top + dy, 0), bottom - minHeight);
          height = bottom - top;
        }

        Object.assign(win.style, {
          left: `${left}px`,
          top: `${top}px`,
          width: `${width}px`,
          height: `${height}px`,
        });
      };

      const end = () => {
        win.classList.remove("is-resizing");
        grip.removeEventListener("pointermove", move);
        grip.removeEventListener("pointerup", end);
        grip.removeEventListener("pointercancel", end);
      };
      grip.addEventListener("pointermove", move);
      grip.addEventListener("pointerup", end);
      grip.addEventListener("pointercancel", end);
    });
  }

  // Double-clicking the title bar zooms, as on macOS (fixed-size windows, like Calendly, don't)
  handle?.addEventListener("dblclick", (event) => {
    if (win.hasAttribute("data-fixed-size")) return;
    if (!(event.target as HTMLElement).closest("button, a")) toggleZoom(win);
  });
}

// Folders, "Want to see more?" cards, Dock apps, and anything else that opens a window
document.addEventListener("click", (event) => {
  const trigger = (event.target as HTMLElement).closest<HTMLElement>("[data-open-window]");
  if (!trigger || !windows.has(trigger.dataset.openWindow!)) return;
  // Links (e.g. Calendly) keep a real href for no-JS visitors; here the window replaces the new tab
  if (trigger instanceof HTMLAnchorElement) event.preventDefault();

  for (const icon of document.querySelectorAll(".desktop-icon.is-selected")) icon.classList.remove("is-selected");
  if (trigger.classList.contains("desktop-icon")) trigger.classList.add("is-selected");

  open(trigger.dataset.openWindow!);
});

// Clicking empty desktop clears the folder selection
desktop?.addEventListener("pointerdown", (event) => {
  if (event.target === desktop) {
    for (const icon of document.querySelectorAll(".desktop-icon.is-selected")) icon.classList.remove("is-selected");
  }
});

// Keep windows on screen when the browser is resized
addEventListener("resize", () => {
  for (const win of windows.values()) {
    if (win.hidden || win.classList.contains("is-zoomed")) continue;
    refit(win);
  }
});
