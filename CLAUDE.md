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

## Decap CMS — tried for the hero heading, reverted

`admin/config.yml` + `admin/index.html` set up a working Decap CMS admin
UI, backed by the `github` backend authenticating against a GitHub OAuth
App, proxied through Netlify's built-in OAuth provider
(`base_url: https://api.netlify.com`, `auth_endpoint: auth`). This
replaced an initial `git-gateway`/Netlify Identity attempt, abandoned
after it kept failing with `API_ERROR: Your Git Gateway backend is not
returning valid settings` — a known, widely-reported issue tied to
Netlify winding down Identity/Git Gateway. The GitHub OAuth App itself and
its Client ID/Secret are registered in the Netlify dashboard under Project
configuration → OAuth (not in this repo).

**The login/save pipeline is confirmed working end to end** (verified with
a real edit that committed to GitHub). But it was only ever wired up for
one field — the hero `h1`, split into `heading_main` / `heading_highlight`
in a `content/site.json` fetched client-side and injected via
`data-cms="..."` attributes before `split_text()` ran. That wiring has
been **removed** (the `h1` is plain hardcoded text again, `load_cms_content()`
is gone from `js/index.js`, `content/site.json` is deleted, and
`admin/config.yml` has an empty `collections: []`), because it turned out
to be a bad fit for a one-pager:

- Decap only ever commits files to git — on a zero-build static site,
  nothing turns an edited JSON/markdown file into a rendered page, so this
  only worked at all because `js/index.js` did custom client-side
  injection into an *existing* element. That doesn't generalize past a
  couple of one-off fields.
- Content edited via the CMS only reaches Google after a JS-render pass
  (delayed, not guaranteed), and never reaches non-JS consumers (link
  previews, simple crawlers) at all — they'd see whatever's hardcoded in
  `index.html`, which drifts out of sync with the CMS-edited value.
- One field per section = one JSON key + one `data-cms` attribute + one
  `config.yml` field, by hand, every time. Too much ceremony for what a
  one-pager needs.

Conclusion: for this site, asking Claude to edit content directly is a
better fit than a CMS. Decap's actual sweet spot is content with a natural
"one entry = one file/page" shape — e.g. a blog — where a real static site
generator renders each entry into its own page at build time. This site
has no build step, so a blog isn't a `config.yml` collection away either;
it would need one of: (a) introducing a generator like Eleventy, (b) a
client-side blog listing/post-render page (same SEO/staleness caveats as
above, worse per-post), or (c) wiring up the Decap collection without
real rendering, just to try the editing UX. Not decided/built as of this
writing — ask before assuming which path, if any, is wanted.

The Netlify OAuth App + GitHub backend setup itself stays valid and
working if CMS editing is revisited for something that's actually a good
fit (like a blog) — no need to redo that part.

## Git workflow

Every change in this project should be committed and pushed to
`origin/main` (https://github.com/Ezra-Siton-UIX/raz-zafrir) right after
it's made, without waiting to be asked. No global git identity is
configured on this machine, so commits pass identity inline:

```
git -c user.name="Ezra Siton" -c user.email="siton.today@gmail.com" commit -m "..."
```
