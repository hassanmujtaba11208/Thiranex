# TaskFlow Pro – Smart To-Do Manager

A modern, fully client-side task management web application built with plain HTML5, CSS3, and vanilla JavaScript (ES6+). No frameworks, no build tools, no backend — just open `index.html` and it works.

![Tech](https://img.shields.io/badge/HTML5-CSS3-JavaScript-blueviolet)

## Project Overview

TaskFlow Pro is a single-page to-do list application designed to look and feel like a polished 2026 SaaS product while remaining entirely self-contained. All data is stored in the browser via `localStorage`, so tasks persist across page reloads with zero setup.

It was built as a submission-ready portfolio piece demonstrating core front-end engineering skills: DOM manipulation, event delegation, state management, responsive design, accessibility, and clean CSS architecture — without relying on any external framework or library.

## Features

**Task management (CRUD)**
- Create tasks via the input field, the Add button, or the Enter key
- Read/display all tasks with title, timestamp, and status
- Update (inline edit) a task's title, with Save/Cancel
- Delete a single task, with a confirmation dialog

**Status management**
- Mark tasks completed or active again via a custom checkbox
- Completed tasks show a line-through state with a smooth transition

**Organization**
- Filter by All / Active / Completed
- Real-time search-as-you-type across task titles
- Live statistics dashboard: total, active, completed, and a completion-percentage ring

**Bulk actions**
- Mark all tasks completed
- Clear all completed tasks
- Delete all tasks
- Every destructive action requires confirmation

**Persistence**
- All tasks automatically saved to `window.localStorage`
- Automatically reloaded on page refresh — no backend or database required

**Design & UX**
- Glassmorphism cards over a soft gradient "aurora" background
- Dark theme by default, with a light-theme toggle
- Smooth add/remove/hover/focus animations
- Toast notifications for user feedback
- Fully responsive: mobile, tablet, laptop, and desktop layouts
- Accessible: semantic HTML, labelled inputs, visible focus states, keyboard support (Enter/Escape while editing), `aria-live` toast and error messaging, reduced-motion support

## Technologies Used

| Layer      | Technology                                  |
|------------|----------------------------------------------|
| Structure  | HTML5 (semantic markup)                      |
| Styling    | CSS3 (custom properties, Flexbox, Grid, media queries, glassmorphism) |
| Behavior   | Vanilla JavaScript ES6+ (modules pattern via IIFE, arrow functions, template literals, event delegation) |
| Storage    | Browser `localStorage` API                   |
| Fonts      | Google Fonts — Sora (display) & Inter (body) |

No jQuery, no Bootstrap, no React/Vue, no build step.

## Installation Steps

1. Download or clone this project folder.
2. Open the `TaskFlow-Pro` folder in VS Code (or any editor).
3. Double-click `index.html`, or right-click it and choose **Open with Live Server** (recommended if you have the VS Code Live Server extension).
4. Start adding tasks — everything is saved automatically to your browser.

No `npm install`, no server, no configuration required.

## Folder Structure

```
TaskFlow-Pro/
│
├── index.html            # App markup & structure
├── css/
│   └── style.css         # Design system, layout, responsive rules, animations
├── js/
│   └── script.js         # App state, rendering, CRUD logic, localStorage
├── assets/                # Reserved for future icons/images
├── README.md              # This file
└── project-report.txt     # Academic project report
```

## Screenshots Section

_Add screenshots of the app here before submission, e.g.:_

```
assets/screenshot-desktop.png
assets/screenshot-mobile.png
```

| Desktop View | Mobile View |
|---|---|
| _(insert screenshot)_ | _(insert screenshot)_ |

## Future Improvements

- Drag-and-drop task reordering
- Due dates, priorities, and tags/categories per task
- Sub-tasks / checklists within a task
- Cloud sync via a backend API (currently local-only by design)
- Export/import tasks as JSON or CSV
- Multiple task lists / boards
- Undo toast for delete actions
- PWA support (offline installable app with a service worker)

## License

This project is provided for educational/portfolio use.
