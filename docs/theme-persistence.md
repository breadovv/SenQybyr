# Theme Persistence Implementation

This project implements a persistent day/night theme across all pages.

## Overview

- The theme is applied by toggling the `theme-dark` class on the `body` element.
- The selected theme is stored in `localStorage` under the `theme` key with values `day` or `night`.
- A single initializer `initThemeToggle()` centralizes initialization and event binding.

## Initialization

- On page load, `initThemeToggle()` reads the saved value and applies the appropriate class.
- If `#themeSwitch` is present, its checked state and label text are synchronized.
- All pages include `js/script.js` to ensure the theme is initialized consistently.

## Error Handling

- Access to `localStorage` is wrapped in `try/catch` to prevent runtime errors (e.g., storage disabled, quota issues).
- Failures are logged to the console and the theme defaults to `day`.

## Development Notes

- Use only `theme-dark` in CSS. Avoid mixing with other dark-mode class names.
- Store `theme` as `day`/`night` for consistency.
- To add a new page, include `<script src="../js/script.js"></script>` (or `js/script.js` from the root) before `</body>`.

## Testing Checklist

- Toggle theme on `index.html` and navigate to `trending.html`, `history.html`, `liked.html`, and `profile.html` – the mode should persist.
- Reload each page individually to verify initial state matches saved preference.
- Verify the toggle updates both the visual theme and persists to `localStorage`.
- Test in multiple browsers (Chrome, Firefox, Edge, Safari) and on mobile/tablet, ensuring no layout or color issues.

## Maintenance

- If you add new components or pages, ensure styles use CSS variables or are compatible with the `theme-dark` class.
- If you refactor storage, update `safeGetTheme`/`safeSetTheme` in `js/script.js` accordingly.