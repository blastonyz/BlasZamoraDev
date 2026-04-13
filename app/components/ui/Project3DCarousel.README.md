# Project3DCarousel Notes

## What Was Added
- Fan-style 3D transform engine via `computeCardTransforms(...)`
- Runtime controls for `R`, `radiusFactor`, `perspective`, `spacing`, `centerScale`, `transitionDuration`
- Drag + throw + snap behavior (pointer fallback)
- Auto-rotation pause/resume for hover, drag, and focus
- Keyboard navigation with Left/Right arrows
- `prefers-reduced-motion` support
- Optional debug arc overlay (`?debugArc=1`)

## Optional GSAP Plugin
If `Draggable` is registered in GSAP, the component detects it and reports availability.
Current implementation always includes a pointer-based fallback, so no plugin is strictly required.

## Visual QA
- Test `R base` + `radiusFactor` combinations: 300x1.0, 300x1.6, 300x2.0
- Test `perspective`: 800, 1200, 1600
- Drag/release and verify nearest-card snap
- Hover/focus pauses auto-rotation; leaving resumes
- Enable system reduced motion and verify minimized animation
