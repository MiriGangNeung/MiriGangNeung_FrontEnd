# Course Place Addition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let a user search, preview on the map, and append a new place to the end of the course in `/course-result`.

**Architecture:** Add coordinates to the static place model and move search, duplicate prevention, added-stop creation, and map-preview composition into pure helpers. `CourseResultPage` owns the mutable course list; `CourseResult` owns only the transient addition-panel controls and emits a selected place to the page for confirmation.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Vitest, Kakao Maps JavaScript SDK.

## Global Constraints

- Search only the current static `PLACES` dataset by name, region, and tags.
- Append confirmed places only; do not persist additions to an API or Zustand.
- Insert at the end, disallow duplicate place IDs, and show selected locations on the existing Kakao map.
- Preserve existing map SDK and route-error handling.

---

## File Structure

- Modify: `src/types/domain.ts` — add coordinates to `Place`.
- Modify: `src/data/places.ts` — supply coordinates for each searchable place.
- Create: `src/lib/coursePlaceAddition.ts` — pure search, append, and preview functions.
- Create: `src/lib/coursePlaceAddition.test.ts` — behavior tests for the helper module.
- Modify: `src/pages/CourseResultPage.tsx` — hold mutable course state and synchronize map preview/confirmation.
- Modify: `src/components/organisms/CourseResult.tsx` — render and control the left-side search/select panel.

### Task 1: Place data and tested itinerary helpers

**Files:**

- Modify: `src/types/domain.ts:3-10`
- Modify: `src/data/places.ts:10-92`
- Create: `src/lib/coursePlaceAddition.ts`
- Create: `src/lib/coursePlaceAddition.test.ts`

**Interfaces:**

- Consumes: `Place` and `CourseStop` from `src/types/domain.ts`.
- Produces: `searchPlaces(places: Place[], query: string): Place[]`, `createAddedStop(place: Place, courseStops: CourseStop[]): CourseStop | null`, and `getMapStops(courseStops: CourseStop[], previewPlace: Place | null): CourseStop[]`.

- [x] **Step 1: Write the failing helper tests**

```ts
it('searches place names, regions, and tags without case or surrounding-space sensitivity', () => {
  expect(searchPlaces(places, '  coffee ')).toEqual([places[1]]);
  expect(searchPlaces(places, 'gangneung')).toEqual([places[0], places[1]]);
});

it('creates the next stop at the end of the course and rejects duplicates', () => {
  expect(createAddedStop(place, courseStops)).toMatchObject({ n: 3, time: '15:30', id: place.id });
  expect(createAddedStop({ ...place, id: courseStops[0].id }, courseStops)).toBeNull();
});

it('adds an unconfirmed selected place only to the map preview', () => {
  expect(getMapStops(courseStops, place)).toHaveLength(3);
  expect(courseStops).toHaveLength(2);
});
```

- [x] **Step 2: Run the helper tests to verify they fail**

Run: `npm.cmd test -- --run src/lib/coursePlaceAddition.test.ts`

Expected: FAIL because `coursePlaceAddition.ts` does not exist.

- [x] **Step 3: Implement the smallest helper module and data-model changes**

```ts
export function searchPlaces(places: Place[], query: string) {
  const keyword = query.trim().toLowerCase();
  if (!keyword) return places;
  return places.filter((place) =>
    [place.name, place.region, ...place.tags].some((value) =>
      value.toLowerCase().includes(keyword),
    ),
  );
}

export function createAddedStop(place: Place, courseStops: CourseStop[]) {
  if (courseStops.some((stop) => stop.id === place.id)) return null;
  const lastStop = courseStops.at(-1);
  return {
    n: (lastStop?.n ?? 0) + 1,
    id: place.id,
    name: place.name,
    time: addMinutes(lastStop?.time ?? '09:00', 90),
    stay: '60 min',
    crowd: 'mid',
    note: place.region,
    lat: place.lat,
    lng: place.lng,
  };
}
```

- [x] **Step 4: Run the helper tests to verify they pass**

Run: `npm.cmd test -- --run src/lib/coursePlaceAddition.test.ts`

Expected: PASS with all three tests green.

- [x] **Step 5: Commit the tested helper layer**

```bash
git add src/types/domain.ts src/data/places.ts src/lib/coursePlaceAddition.ts src/lib/coursePlaceAddition.test.ts
git commit -m "feat: add course place helpers"
```

### Task 2: Page-level course and map-preview state

**Files:**

- Modify: `src/pages/CourseResultPage.tsx:1-27`

**Interfaces:**

- Consumes: `createAddedStop` and `getMapStops` from `src/lib/coursePlaceAddition.ts`.
- Produces: `courseStops` (confirmed stops), `mapStops` (confirmed plus optional preview), `mapActiveStop`, and `onAddPlace(place: Place)` passed to `CourseResult`.

- [x] **Step 1: Confirm the tested helper API covers page state changes**

Use the green tests from Task 1 as the failing-first proof for search, preview, append, duplicate rejection, sequence, and time calculations. Do not add untested transformation logic to the React page.

- [x] **Step 2: Implement the page wiring**

```tsx
const [courseStops, setCourseStops] = useState<CourseStop[]>([]);
const [previewPlace, setPreviewPlace] = useState<Place | null>(null);

useEffect(() => setCourseStops(data ?? []), [data]);

const mapStops = getMapStops(courseStops, previewPlace);
const mapActiveStop = previewPlace ? mapStops.length - 1 : activeStopIndex;
```

Pass both `courseStops` and `mapStops` to `CourseResult`; it must render cards from the confirmed array and pass `mapStops` and `mapActiveStop` to `CourseMap`. Set `previewPlace` on selection, and append only when `createAddedStop` returns a stop. After appending, clear the preview and set the active index to the new last index.

- [x] **Step 3: Run focused helper tests after wiring**

Run: `npm.cmd test -- --run src/lib/coursePlaceAddition.test.ts`

Expected: PASS; page wiring adds no independent transformation behavior.

- [x] **Step 4: Commit page state wiring**

```bash
git add src/pages/CourseResultPage.tsx
git commit -m "feat: sync added places with course map"
```

### Task 3: Left-side place-addition panel

**Files:**

- Modify: `src/components/organisms/CourseResult.tsx:1-144`

**Interfaces:**

- Consumes: `places: Place[]`, `courseStops` (confirmed), `mapStops` (confirmed plus preview), `mapActiveStop`, `onPreviewPlace(place: Place | null)`, and `onAddPlace(place: Place)`.
- Produces: an inline panel above the course list; a selected place is previewed before `onAddPlace` is called.

- [x] **Step 1: Use Task 1 search and duplicate tests as the pre-existing behavior contract**

The panel must call `searchPlaces(places, query)` and must disable results whose IDs appear in `courseStops`. The add action must only call `onAddPlace` for an enabled, selected result; Task 1's duplicate test guarantees the mutation layer rejects duplicate IDs too.

- [x] **Step 2: Implement the panel with local UI-only state**

```tsx
const [isPlaceAdderOpen, setIsPlaceAdderOpen] = useState(false);
const [query, setQuery] = useState('');
const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

function closePlaceAdder() {
  setIsPlaceAdderOpen(false);
  setQuery('');
  setSelectedPlace(null);
  onPreviewPlace(null);
}
```

Render this panel below the tags and above `<ol>`. Keep the cards mapped from confirmed `courseStops`, but pass `mapStops` and `mapActiveStop` to `CourseMap`. Include a labelled search input, result buttons showing name/region/tags, a zero-result message, a cancel button, and a disabled `코스에 추가` button until a result is selected. On selecting an enabled result, set it locally and call `onPreviewPlace(place)`; on confirmation call `onAddPlace(selectedPlace)` then close the panel.

- [x] **Step 3: Verify type safety, linting, and all unit tests**

Run: `npm.cmd run build; npm.cmd run lint; npm.cmd test -- --run`

Expected: all commands exit 0. Existing Vite deprecation warnings may remain, but there must be no TypeScript, ESLint, or test failures.

- [x] **Step 4: Commit the interaction UI**

```bash
git add src/components/organisms/CourseResult.tsx
git commit -m "feat: add course place search panel"
```
