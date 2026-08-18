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

## JS structure

All custom JS (GSAP text-split/fade-in animations, header-offset anchor
scrolling, active-nav-link scrollspy) lives in one file, `js/index.js` —
kept deliberately unsplit per project preference. Only the three GSAP CDN
`<script>` tags are separate, since they're third-party libraries.

## Git workflow

Every change in this project should be committed and pushed to
`origin/main` (https://github.com/Ezra-Siton-UIX/raz-zafrir) right after
it's made, without waiting to be asked. No global git identity is
configured on this machine, so commits pass identity inline:

```
git -c user.name="Ezra Siton" -c user.email="siton.today@gmail.com" commit -m "..."
```
