# Intro Hero Page Design

## Goal

Add a standalone `/intro` travel landing page that leads into the existing `/` photo-and-course flow, visually following the supplied reference while applying the confirmed MD changes.

## Scope

- Keep existing `/` routes and `PageLayout` unchanged; register `/intro` as its sibling.
- Use the existing `PLACES` records for Jeongdongjin, Anmok, and Jumunjin. Add only ordered tour metadata keyed by `placeId`.
- Build six focused intro components: fixed logo header, hero, place cards, photo comparison, curated tour, and CTA.
- Use supplied `bg-cafe.png` as BEFORE and the supplied beach composite as AFTER, displayed at identical dimensions and `object-fit: cover` rules so the matched person pixels remain aligned.
- Generate project-local raster assets for the hero, three place cards, and CTA. Hero is a light, wide Jeongdongjin coastal train scene resembling the reference; other scenery is explicitly temporary.
- Respect reduced motion for every scroll-linked and automatic animation, retain keyboard focus visibility, and expose the comparison slider as an accessible range input.

## Architecture

`IntroPage` owns only section composition and passes the hero reference to `IntroHeader`. `useScrollReveal` and `useScrollProgress` hold reusable observer and scroll calculations. The photo comparison owns pointer and range input state; the curated tour consumes `INTRO_TOUR_STOPS` joined to `PLACES`.

## Verification

Unit tests cover tour-stop resolution and comparison percentage clamping. Build, lint, and the full Vitest suite verify type and integration safety. A manual visual check at `/intro` confirms desktop, narrow viewport, header transition, slider dragging, and CTA navigation.
