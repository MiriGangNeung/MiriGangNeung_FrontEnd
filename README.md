# Handoff: 미리강릉 (Miri Gangneung) — desktop web flow

## Overview

"미리강릉" lets a user pick Gangneung destinations, composite their own photo onto the chosen
background with AI, and then generate a personalised travel course shown on a real map.
Six desktop screens, one linear flow: pick → one-pick → upload/compose → result → course
conditions → course + map.

## About the design files

The files in `src/` are a **React component set derived from an HTML design prototype**.
They are a _design reference_: the visual spec (layout, color, type, spacing, states, copy) is
authoritative, the code is a starting point. Recreate them inside your codebase using its own
conventions (routing, data layer, image component, i18n, analytics) rather than dropping the
folder in as-is. `MiriGangneung.dc.html` is the original interactive prototype — open it in a
browser to check any behavior the code leaves ambiguous.

## Fidelity

**High-fidelity.** All colors, type sizes, radii, shadows and copy are final and match the
prototype 1:1. Photography is intentionally left as placeholders (`ImageSlot`) — swap in real
imagery or your own image component.

## Stack as delivered

React 18 + Vite, Tailwind CSS (tokens in `tailwind.config.js`), `lucide-react` icons,
Leaflet + OpenStreetMap for the map. No other runtime dependency, no global state library —
all state lives in `App.jsx` and flows down as props.

## Files

```
index.html, vite.config.js, postcss.config.js, tailwind.config.js, package.json
src/main.jsx                  entry (imports leaflet CSS + tailwind)
src/index.css                 font import, base resets, focus/selection styling
src/App.jsx                   ALL application state + screen switch
src/data/places.js            places, tabs, steps, compose stages, options, course stops (real lat/lng)
src/components/
  ProgressHeader.jsx          sticky bar: brand, 4-step progress, prototype screen switcher 1–6
  PlaceCard.jsx               screen-1 grid card (pick badge, like toggle, tags)
  RadioOption.jsx             screen-5 radio card
  Button.jsx                  PrimaryButton / SecondaryButton / GhostButton / Chip / Tag
  ImageSlot.jsx               photo placeholder — replace with your <Image>
  CourseMap.jsx               Leaflet map, numbered pins, dashed route, two-way selection
src/screens/
  BackgroundPicker.jsx        screen 1
  OnePickConfirm.jsx          screen 2
  PhotoUpload.jsx             screen 3 (ready / running / done)
  CompositeResult.jsx         screen 4
  CourseOptions.jsx           screen 5
  CourseResult.jsx            screen 6
MiriGangneung.dc.html         original HTML prototype (reference only)
```

Run locally: `npm install && npm run dev`.

## Screens

### 1 — BackgroundPicker · 배경 고르기

Purpose: pick up to 3 destinations.
Layout: `grid-cols-[minmax(360px,1fr)_2.05fr]`, full-height. Left = full-bleed photo with a
160° dark gradient overlay and headline block inset 56px top / 44px sides. Right = filter chip
row (h 42, gap 8, horizontally scrollable, `whitespace-nowrap`), 3-column card grid (gap 20),
and a sticky summary bar (bottom 22, radius 20, shadow `bar`).
Cards: radius 16, 1px `#E4E9F2` border, 4:3 photo, hover lifts 2px to shadow `lift`. Picked
cards get a 2.5px `#2F6FED` inner border and a numbered blue badge (order of selection).
Like button: 34px circle, white 95%, heart fills `#F0573F`.
Primary CTA "선택 완료" disabled while `picks.length === 0`.

### 2 — OnePickConfirm · 원픽 배경 확인

Purpose: choose the ONE background used for compositing; the other two stay as course candidates.
Layout: max-width 1040, 3 equal cards (radius 20). Selected card: 2.5px blue border +
`0 10px 30px rgba(47,111,237,.22)`, coral "원픽" pill top-left, green check circle top-right,
filled blue "원픽 선택됨" bar. Sticky bottom bar echoes the chosen name.

### 3 — PhotoUpload · 사진 합성

Purpose: upload the user photo, consent, run the composite.
Layout: `grid-cols-[1fr_380px]`. Left card holds the two 4:3 panes (원픽 배경 / 내 사진) plus a
toolbar (사진 교체 / 삭제) and the format hint. Right sticky panel (top 98) has three states:

- **ready** — two required consent checkboxes; CTA disabled until both checked.
- **running** — elapsed timer chip (0.1s tick), 5-stage vertical timeline, spinner on the
  active stage, green check on completed ones. Stages advance every 1500ms.
- **done** — green check, elapsed total, "결과 확인하기" → screen 4, "다시 만들기" resets.

### 4 — CompositeResult · 합성 결과

Purpose: show the AI image and route the user into course generation.
Layout: max-width 1180. Headline 28px/800 + 2-line subcopy across the top, then
`grid-cols-[minmax(0,1.3fr)_minmax(340px,1fr)]` gap 24: left = 4:3 result image (radius 14,
"AI 생성 이미지" pill and fullscreen button over `rgba(16,24,40,.7)`), right = place card
(kicker / name 26px / region / description / meta row with 생성 시각 and the
"※ 실제 여행지와 다를 수 있습니다" disclaimer), the blue CTA banner, then the button stack.

### 5 — CourseOptions · 코스 조건 설정

Purpose: collect trip type (1–2 of 5), companion (1 of 4), duration (1 of 3, custom reveals
two date inputs), and preview the resulting conditions.
Layout: `grid-cols-[1fr_340px]`; four white section cards (radius 16, padding 24) on the left,
sticky summary panel on the right that updates live from state.

### 6 — CourseResult · 코스 결과 + 지도

Purpose: review the generated itinerary.
Layout: `grid-cols-[minmax(420px,40fr)_60fr]`, height `calc(100vh - 74px)`. Left column scrolls:
title, meta line, condition chips, then the numbered timeline of stops (dashed 2px connector,
96px thumbnail, stay-time and crowd chips). Right column is the Leaflet map. Clicking a card
selects the stop → map flies to it at zoom 14; clicking a pin selects the card. Floating action
bar is fixed bottom-center.

## Interactions & behavior

- Screen switching: `App.go(n)` sets state and scrolls to top. The 1–6 chip group in the header
  is a **prototype affordance** — remove it in production and drive screens from your router.
- Header progress maps 6 screens onto 4 steps via `SCREEN_TO_STEP`; keep any new step label in
  sync with that map so the bar never contradicts the screen.
- Compose run uses two intervals (100ms timer, 1500ms stage advance); both are cleared on
  completion and unmount. Replace with your real job polling.
- Hover: cards translate `-2px` and deepen the shadow; outline buttons switch border+text to
  `#2F6FED`; the primary button darkens to `#1E54C4`. Focus is a 2px `#2F6FED` ring, offset 2.
- Map transition: `flyTo` 0.7s; active pin grows 34→44px with a 6px halo.
- Responsive: designed for desktop ≥1280. Below ~1000px the 2-column screens need to stack —
  not specified in the prototype, decide with the product owner.

## State

| state                   | type                       | notes                                                |
| ----------------------- | -------------------------- | ---------------------------------------------------- |
| `screen`                | 1–6                        | current screen                                       |
| `tab`                   | tab id                     | screen-1 filter                                      |
| `picks`                 | string[] ≤3                | selection order drives the badge number              |
| `liked`                 | Record<id, bool>           | heart toggles, independent of picks                  |
| `onePick`               | place id                   | must stay inside `picks` (auto-repaired on deselect) |
| `agreeA/agreeB`         | bool                       | both required to compose                             |
| `phase`                 | 'ready'\|'running'\|'done' | compose lifecycle                                    |
| `stageIndex`, `elapsed` | number                     | timeline + timer                                     |
| `types`                 | string[] 1–2               | oldest drops when a 3rd is added                     |
| `companion`, `duration` | id                         | single select; `custom` reveals dates                |
| `startDate`, `endDate`  | ISO date                   | only used when duration = custom                     |
| `activeStop`            | index                      | shared by list and map                               |

Data needs in production: places + photos, the composite job (create/poll/result URL), and the
course generator (ordered stops with time, stay, crowd level, coordinates).

## Design tokens

Colors — brand `#2F6FED`, brand-dark `#1E54C4`, brand-tint `#E8F0FE`, coral `#F0573F`,
coral-tint `#FDEAE7`, ok `#1F9E56`, ink `#101828`, ink-muted `#4B5468`, ink-soft `#8A93A6`,
line `#E4E9F2`, canvas `#F4F7FC`, fill `#F1F4F9`, slot `#E8EDF5`, dashed connector `#CFD8E8`.
Type — Noto Sans KR 400/500/700/800. Display 40/30/28/26 (800, tight tracking), section 16–24,
body 14–15 at 1.75–1.8, meta 11–13.
Radius — 999 (pills), 20 (panels), 16 (cards), 14/12 (inner), 6 (checkbox).
Shadows — card `0 1px 2px rgba(16,24,40,.05)`, lift `0 12px 28px rgba(16,24,40,.13)`,
panel `0 4px 20px rgba(16,24,40,.06)`, cta `0 6px 16px rgba(47,111,237,.3)`,
bar `0 -2px 24px rgba(16,24,40,.08)`.
Spacing — 4px base; section gaps 18–32, card padding 22–26, header height 74.

## Assets

No production imagery is included — every photograph is an `ImageSlot` placeholder labelled with
what belongs there. Icons come from `lucide-react`. Map tiles are OpenStreetMap
(`https://tile.openstreetmap.org/{z}/{x}/{y}.png`) and require the "© OpenStreetMap
contributors" attribution shown in `CourseMap`; swap for your licensed tile provider if needed.
Course coordinates in `data/places.js` are real Gangneung locations — never hand-draw geography.
