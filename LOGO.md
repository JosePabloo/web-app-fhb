# Casa Norte Logo — Lattice Pathway

Modern, technical, intentional. Built for systems engineering across software, AI, and hardware.

## Concept Overview
- Icon: Square frame split by a diagonal pathway intersecting a perpendicular route; circular node at the junction signals decision/intelligence.
- Geometry: Modular grid (8px) so lines align to hardware silkscreen and UI pixel grids; sharp right angles for discipline and durability.
- Wordmark: `CASA NORTE` in a custom uppercase geometric sans—squared terminals, open counters on the As, and a small 45° notch on the N crossbar mirroring the icon path; tracking slightly loose for calm clarity.
- Tagline: `IDEAS BECOMING SYSTEMS.` centered beneath the wordmark at 60% size/weight; reads as a proof statement, not fluff.
- Color: Frame `#0B1A2A`, paths `#1E3B55`, node `#8AB4D6`; monochrome-friendly for etching/embossing.
- Notes: Suggests systems thinking and data flow without "AI spark" clichés; stacks cleanly for avatars and repo badges.

```
┌────────┐   CASA NORTE
│  ╲ ●  │   IDEAS BECOMING SYSTEMS.
│ ╱┼╱  │
│╱ ╱   │
└────────┘
```

## Wordmark Construction
- Typeface: Geometric sans base (e.g., Space Grotesk/Satoshi) with custom cuts: squared terminals, open A apex, 45° notch on N crossbar, straight-legged R echoing circuit angles.
- Spacing: Icon-to-wordmark ratio ~1:1.2 horizontally; letter tracking +2% for breathing room; tagline at 0 tracking.
- Alignment: Wordmark baseline aligns to icon centerline; tagline centered to the wordmark width.

## Usage Guidance
- Default background: white or soft off-white; invert to white-on-navy for dark headers or hardware engraving.
- Maintain clear space equal to half the icon frame thickness around the full lockup.
- Keep strokes solid (no gradients/neon) to reinforce durability and seriousness.
- For square marks, stack icon above the wordmark + tagline; for narrow spaces, move the tagline right of the wordmark.

## SVG Draft (vector-ready)
Source saved as `public/logo-casa-norte.svg`. Swap fonts as needed (e.g., Space Grotesk, Satoshi). Colors: frame `#0B1A2A`, paths `#1E3B55`, node `#8AB4D6`.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 140" role="img" aria-labelledby="title desc">
  <title id="title">Casa Norte logo</title>
  <desc id="desc">Square frame with angular circuit paths and node; CASA NORTE wordmark with tagline Ideas Becoming Systems.</desc>
  <style>
    .frame { fill: none; stroke: #0B1A2A; stroke-width: 6; stroke-linejoin: round; }
    .path { fill: none; stroke: #1E3B55; stroke-width: 6; stroke-linecap: round; stroke-linejoin: round; }
    .node { fill: #8AB4D6; }
    .word { fill: #0B1A2A; font-family: "Space Grotesk", "Plus Jakarta Sans", "Inter Tight", system-ui, -apple-system, "Segoe UI", sans-serif; font-weight: 700; letter-spacing: 0.05em; }
    .tag { fill: #0B1A2A; font-family: "Space Grotesk", "Plus Jakarta Sans", "Inter Tight", system-ui, -apple-system, "Segoe UI", sans-serif; font-weight: 600; letter-spacing: 0.02em; font-size: 14px; }
  </style>
  <g transform="translate(12 12)">
    <rect class="frame" x="0" y="0" width="104" height="104" rx="3" />
    <path class="path" d="M18 82 L50 50 L84 50" />
    <path class="path" d="M26 32 L26 68 L60 100" />
    <path class="path" d="M58 18 L92 18 L92 52" />
    <circle class="node" cx="58" cy="50" r="7" />
  </g>
  <text class="word" x="140" y="60" font-size="34">CASA NORTE</text>
  <text class="tag" x="140" y="88">IDEAS BECOMING SYSTEMS.</text>
</svg>
```
