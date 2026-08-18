# raz-zafrir landing page

Static, single-page Hebrew (RTL) site: `index.html`, `css/styles.css`, `js/index.js`.

## Heading color accent — `.uk-primary-span`

Every major heading (`h1`, `h2`) highlights its punchline clause — usually the
part after a comma or line break — by wrapping it in
`<span class="uk-primary-span">...</span>`. Defined in `css/styles.css`:

```css
.uk-primary-span{color:var(--green);}
.services .uk-primary-span{color:#bfe3d1;}
```

The `.services` section has a dark navy background, so its override uses the
lighter mint tint (matching `.services .eyebrow`) instead of the standard
green, which would have poor contrast on navy.

When adding a new heading or editing an existing one, keep this pattern:
wrap the key/closing phrase in `.uk-primary-span` rather than leaving
headings a single flat color. The "אודות" (About) heading is the one
exception — it's just the person's name, so it's left uncolored.

## Typography scale — CSS variables

All `font-size` values live as custom properties in the `:root` block at the
top of `css/styles.css` (`--fs-h1`, `--fs-h2`, `--fs-eyebrow`, `--fs-nav`,
`--fs-price`, etc.) instead of being hardcoded on each selector. Rules
reference them, e.g. `h1{font-size:var(--fs-h1);}`.

This means a responsive tweak is a single override of the variable rather
than hunting down every selector that uses that size — e.g. the mobile `h1`
size is set with:

```css
@media (max-width:560px){
  :root{ --fs-h1:32px; }
}
```

When adding new text styles, add a new `--fs-*` variable rather than a
literal `px` value, and reuse an existing variable when the size already
matches an existing role (e.g. `--fs-section-lead` is shared by
`.section-head p` and `.contact p`, which are both section intro copy).

## Section spacing — `.uk-section` / `.p-b-0`

Every `<section>` gets its base 88px top/bottom padding from an explicit
`.uk-section` class (not a bare `section{}` element selector), so it's
opt-in and visible in the markup. A section that needs no bottom padding
(currently `.solution`, which has an image flush against its bottom edge)
adds the `.p-b-0` utility class alongside it, instead of a one-off
`.solution{padding-bottom:0;}` override. Keep using this pair — explicit
`.uk-section` class + `.p-b-0` utility — rather than reintroducing
per-section padding overrides.

## JS structure

All custom JS (GSAP text-split/fade-in animations, Lenis smooth scroll,
header-offset anchor scrolling, active-nav-link scrollspy) lives in one
file, `js/index.js` — kept deliberately unsplit per project preference.
Only the GSAP + Lenis CDN `<script>` tags are separate, since they're
third-party libraries.

Smooth scrolling is handled by Lenis (`init_smooth_scroll()`), driven off
`gsap.ticker` and synced to `ScrollTrigger.update` per the standard
GSAP/Lenis integration — not CSS `scroll-behavior:smooth` (removed, would
fight Lenis) and not native `window.scrollTo({behavior:'smooth'})`. The
anchor-click handler in `scroll_spy()` calls `lenis.scrollTo(target, {
offset: -headerHeight })` instead.

## CMS content example (Decap CMS)

There's a minimal, scoped-down proof of concept for editing content without
touching code, covering only the hero `h1`:

- `content/site.json` — `{ heading_main, heading_highlight }`, the two
  halves of the hero heading (plain text + the `.uk-primary-span` part).
- `admin/config.yml` + `admin/index.html` — the Decap CMS admin UI, backed
  by `git-gateway` (requires the site to be deployed on Netlify with
  Identity + Git Gateway enabled in its dashboard — not done from this
  repo, has to happen in the Netlify UI).
- In `index.html`, the two hero heading spans carry `data-cms="heading_main"`
  / `data-cms="heading_highlight"` attributes with the current text
  hardcoded as a fallback.
- In `js/index.js`, `load_cms_content()` fetches `content/site.json` and
  overwrites those two spans' text before `split_text()` runs (so the
  GSAP SplitText animation splits the final content, not a placeholder).
  Everything below it is now wrapped in an async IIFE that awaits this
  first. If the fetch fails (e.g. opening `index.html` directly as a
  `file://` URL during local preview — `fetch` is blocked there), it
  silently falls back to the hardcoded text — this is expected locally,
  and only resolves once actually served over http(s) (e.g. on Netlify).

This same pattern (data-cms attribute + fallback text + a field in
`admin/config.yml` + a key in `content/site.json`) is how to extend CMS
editing to more of the page, if that's ever wanted.

## Git workflow

Every change in this project should be committed and pushed to
`origin/main` (https://github.com/Ezra-Siton-UIX/raz-zafrir) right after
it's made, without waiting to be asked. No global git identity is
configured on this machine, so commits pass identity inline:

```
git -c user.name="Ezra Siton" -c user.email="siton.today@gmail.com" commit -m "..."
```
