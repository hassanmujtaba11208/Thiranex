# Hassan Mujtaba — Accessible Portfolio

Multi-page personal portfolio built to modern semantic HTML5 standards and WCAG 2.1 AA.

## Structure

```
portfolio/
├─ index.html
├─ about.html
├─ projects.html
├─ contact.html
├─ robots.txt
├─ sitemap.xml
├─ README.md
└─ assets/
   ├─ css/styles.css
   └─ images/        (add og-image.jpg, 1200x630)
```

**Important:** `styles.css` must live inside `assets/css/`. If the pages render unstyled,
the stylesheet is in the wrong folder — that is the single most common cause.

## How to run

Open `index.html` in a browser, or serve locally:

```
python -m http.server 8000
```

Then visit http://localhost:8000

## What's implemented

- Semantic landmarks: `header`, `nav`, `main`, `section`, `article`, `footer`
- Skip link, logical tab order, visible `:focus-visible` outlines
- `aria-label` on each nav, `aria-current="page"` on the active link
- `aria-labelledby` linking every section/article to its heading
- Labelled form controls with `autocomplete` and `aria-describedby` hints
- Unique title + meta description, canonical, Open Graph, Twitter Card per page
- Person JSON-LD on the home page, plus robots.txt and sitemap.xml
- `prefers-reduced-motion`, print styles, responsive layout (no horizontal scroll)

## Customise

1. Replace `https://hassanmujtaba.example.com` in every page with your real domain.
2. Swap placeholder project copy for your real work.
3. Add `assets/images/og-image.jpg` (1200×630).
4. Contact form posts to FormSubmit — confirm the address on first submit,
   or swap the `action` for Netlify Forms / your own endpoint.

## Verify

- Lighthouse (Chrome DevTools) → Accessibility & SEO should both be 100
- https://validator.w3.org/ → 0 errors
- Tab through every page; check focus is always visible
