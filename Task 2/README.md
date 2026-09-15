# Hassan Mujtaba — Responsive Portfolio

## Project Overview

A complete, standalone developer portfolio website for Hassan Mujtaba — a
Software Engineering student, full-stack developer, and AI & cloud
enthusiast based in Karachi, Pakistan. The site is built from scratch with
HTML5, advanced CSS3, and vanilla JavaScript, with no frameworks, backend,
or database required.

## Task Objective

This project was built for **Task 3 — Advanced CSS3 & Responsive
Architecture**, and demonstrates:

- Advanced CSS3 (custom properties, gradients, `clamp()`, `backdrop-filter`,
  `color-mix()`, keyframe animations, pseudo-elements)
- CSS Grid for structural, multi-column layouts
- Flexbox for component-level alignment
- Mobile-first responsive architecture across 12+ breakpoints
- A full light/dark theme system driven entirely by CSS variables
- Accessible, semantic markup
- Modern, premium UI/UX with restrained glassmorphism and motion

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript (no libraries or frameworks)

## Features

- Sticky, glass-effect navigation with an active-page indicator
- Accessible hamburger menu for mobile, closing on link click, outside
  click, and <kbd>Esc</kbd>
- Light/dark theme toggle with `localStorage` persistence and no page reload
- Responsive hero section with a CSS/SVG-built "code panel" visual (no fake
  photos)
- Two-column About section with a quick-info card
- Skills section organized into six categories, laid out with CSS Grid and
  Flexbox tag rows
- Six project cards (Programming/Frontend/Backend/Databases/Cloud/Other
  skills reflected across projects) with category filtering, gradient
  icon areas, animated top border, and hover lift
- Contact page with a frontend-only form: field validation, inline error
  messages, and a success confirmation — no data is sent anywhere
- Reveal-on-scroll animations via `IntersectionObserver`
- Full `prefers-reduced-motion` support
- Dynamic copyright year via JavaScript
- Skip-to-content link, visible focus states, semantic landmarks, and
  labelled form fields throughout

## Responsive Breakpoints

| Range | Behavior |
|---|---|
| 320px – 599px | Single-column mobile layout, hamburger navigation |
| 600px – 767px | Two-column contact form and footer |
| 768px – 1023px | Two-column About/Contact, two-column project grid, hamburger nav still active |
| 1024px – 1279px | Full desktop navigation, three-column project grid, hero splits into two columns |
| 1280px – 1599px | Three-column skills grid |
| 1600px+ | Wider content container for large monitors |

Fluid typography and spacing use `clamp()`, `min()`, and `max()` throughout
so text and layout scale smoothly between breakpoints rather than jumping.

## Project Structure

```text
hassan-mujtaba-portfolio/
│
├── index.html
├── about.html
├── projects.html
├── contact.html
├── README.md
│
└── assets/
    │
    ├── css/
    │   └── styles.css
    │
    ├── js/
    │   └── script.js
    │
    └── images/
        └── README.md
```

## How to Run

1. Download or extract the project folder.
2. Open the `hassan-mujtaba-portfolio` folder.
3. Double-click `index.html` to open it in your browser — no build step or
   server is required.

Optionally, for live-reloading during editing, open the folder in VS Code
and use the "Live Server" extension.

## Task Requirements Completed

- [x] CSS Grid
- [x] Flexbox
- [x] Mobile-first responsive design
- [x] CSS variables (including a full dark-theme variable set)
- [x] Light/dark mode with `localStorage` persistence
- [x] Responsive typography (`clamp()`, `min()`, `max()`)
- [x] CSS3 animations and micro-interactions
- [x] Accessibility (semantic HTML, ARIA, keyboard navigation, skip link)
- [x] Professional, original UI design
- [x] Cross-device responsiveness (mobile / tablet / laptop / desktop)

## Notes

- Social and contact links use clearly-labelled placeholders
  (`your-profile`, `yourdomain.com`) since no real profile URLs were
  provided.
- Project "View Project" links are shown as disabled/placeholder buttons
  where no live deployment exists, rather than pointing to invented URLs.
- All project descriptions are based on realistic, generic project themes
  and do not claim fake companies, employment, or achievements.
