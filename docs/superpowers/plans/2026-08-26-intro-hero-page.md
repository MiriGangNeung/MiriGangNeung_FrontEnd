# Intro Hero Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `/intro` Gangneung landing page and link it to the existing trip flow.

**Architecture:** Six section components compose a page outside `PageLayout`. Shared hooks provide reveal/progress behavior, existing place data supplies all place copy, and a dependency-free slider overlays two same-size supplied images.

**Tech Stack:** React 18, TypeScript, React Router, Tailwind CSS, Lucide, Vitest.

**Spec:** `docs/superpowers/specs/2026-08-26-intro-hero-page-design.md`

## Global Constraints

- Do not alter existing `/` flow or add dependencies.
- Reuse existing Tailwind tokens and `PLACES`; use generated files only under `public/images/intro/`.
- Use `bg-cafe.png` as BEFORE and the supplied beach composite as AFTER without cropping or per-image transform differences.
- Support `prefers-reduced-motion`; make the slider operable with pointer and keyboard input.

---

### Task 1: Add intro data and testable utilities

**Files:**

- Modify: `src/data/places.ts`
- Create: `src/lib/introTour.ts`
- Test: `src/lib/introTour.test.ts`

- [ ] Write a failing test asserting stop metadata is joined to `PLACES` in the prescribed 09:00 → 18:20 order.
- [ ] Run `npm test -- src/lib/introTour.test.ts` and confirm it fails because the resolver is absent.
- [ ] Add `INTRO_TOUR_STOPS` with `placeId`, time, caption and a `getIntroTourStops(places = PLACES)` resolver.
- [ ] Run `npm test -- src/lib/introTour.test.ts` and confirm it passes.

### Task 2: Add reusable motion hooks and testable slider bounds

**Files:**

- Create: `src/hooks/useScrollReveal.ts`
- Create: `src/hooks/useScrollProgress.ts`
- Create: `src/lib/introSlider.ts`
- Test: `src/lib/introSlider.test.ts`

- [ ] Write failing clamp tests for negative, in-range, and over-100 slider inputs.
- [ ] Run `npm test -- src/lib/introSlider.test.ts` and confirm it fails because `clampComparisonPercent` is absent.
- [ ] Implement the clamp utility and hooks with reduced-motion fallbacks.
- [ ] Run the targeted tests and confirm they pass.

### Task 3: Generate and install page assets

**Files:**

- Create: `public/images/intro/hero-jeongdongjin.png`
- Create: `public/images/intro/place-jeongdongjin.png`
- Create: `public/images/intro/place-anmok.png`
- Create: `public/images/intro/place-jumunjin.png`
- Create: `public/images/intro/cta-cafe.png`
- Create: `public/images/intro/before-cafe.png`
- Create: `public/images/intro/after-beach.png`

- [ ] Generate the wide Korean coastal train hero and temporary scenic place/CTA assets with no embedded text or logos.
- [ ] Copy the two supplied 1440×1080 comparison images into the project without altering their pixels.
- [ ] Inspect generated files and confirm all requested paths exist.

### Task 4: Implement intro visual sections

**Files:**

- Create: `src/components/organisms/intro/IntroHeader.tsx`
- Create: `src/components/organisms/intro/HeroSection.tsx`
- Create: `src/components/organisms/intro/PlaceSelectSection.tsx`
- Create: `src/components/organisms/intro/PhotoExperienceSection.tsx`
- Create: `src/components/organisms/intro/CuratedTourSection.tsx`
- Create: `src/components/organisms/intro/CtaSection.tsx`

- [ ] Build the fixed logo-only header, full-height wave-cut hero, fan cards, full-width accessible comparison slider, sticky tour, and CTA.
- [ ] Ensure card and tour text come from `PLACES`, hero/header/progress use shared hooks, and CTA calls `navigate('/')`.
- [ ] Use responsive Tailwind layouts that stack rather than overflow below `md`.

### Task 5: Compose and route the page

**Files:**

- Create: `src/pages/IntroPage.tsx`
- Modify: `src/App.tsx`

- [ ] Add the composition page with a hero ref shared with the header.
- [ ] Add `{ path: '/intro', element: <IntroPage /> }` as a sibling of the `PageLayout` route.
- [ ] Run `npm run build` and correct TypeScript errors.

### Task 6: Verify the finished page

**Files:**

- Verify only

- [ ] Run `npm test`, `npm run lint`, and `npm run build`.
- [ ] Manually view `/intro` at desktop and narrow viewport; test header, reduced motion, pointer/keyboard slider, and CTA navigation.
