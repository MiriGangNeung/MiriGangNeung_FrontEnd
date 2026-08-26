# Frontend Development Status

> ?묒꽦 / ?낅뜲?댄듃: 2026-08-09  
> 遺꾩꽍 Git branch: `develop`  
> 遺꾩꽍 湲곗? commit: `aaf9d84`  
> React: `18.3.1` 쨌 Vite: `5.4.21` 쨌 Tailwind CSS: `3.4.19`

## 1. TL;DR

???꾨줈?앺듃???ъ슜?먭? 媛뺣쫱???ы뻾 ?μ냼瑜?怨좊Ⅴ怨? ?먰뵿 ?μ냼? 蹂몄씤 ?ъ쭊??議고빀?섎뒗 ?먮쫫??嫄곗퀜 ?ы뻾 肄붿뒪 寃곌낵瑜??뺤씤?섎뒗 ?⑥씪 ?섏씠吏 ?꾨줎?몄뿏?쒕떎. React Router??釉뚮씪?곗? ?쇱슦?곕줈 6媛??붾㈃???곌껐?섏뼱 ?덉쑝硫? 怨듯넻 吏꾪뻾 ?ㅻ뜑媛 ???붾㈃???좎??쒕떎.

?μ냼 ?좏깮, ?먰뵿 ?좏깮, ?ъ쭊 ?뚯씪 ?좏깮, ?숈쓽, ?ы뻾 議곌굔 ?좏깮, 肄붿뒪 移대뱶/吏??媛??좏깮 ?숆린?붾뒗 ?꾩옱 釉뚮씪?곗? UI?먯꽌 ?숈옉?쒕떎. ?좏깮媛믪? Zustand ?꾩뿭 ?ㅽ넗?댁뿉 ?좎??섍퀬, ?붾㈃蹂??꾩떆 ?곹깭??媛??섏씠吏 而댄룷?뚰듃媛 愿由ы븳??

?μ냼 紐⑸줉怨?肄붿뒪 寃곌낵??React Query瑜??듯빐 ?쎌?留??꾩옱 `Promise.resolve` 湲곕컲???뺤쟻 ?곗씠?곕떎. 諛섎㈃ 肄붿뒪 吏?꾨뒗 移댁뭅?ㅻ㏊ JavaScript SDK瑜?濡쒕뱶?섍퀬, ?꾨낫 寃쎈줈??`/api/walking-route` ?쒕쾭由ъ뒪 API瑜?嫄곗퀜 移댁뭅??紐⑤퉴由ы떚 ?꾨낫 寃쎈줈 API???붿껌?쒕떎.

?ъ쭊 ?⑹꽦? ?뚯씪 ?좏깮怨??④퀎蹂?吏꾪뻾 UI源뚯?留?援ы쁽?섏뼱 ?덉쑝硫??ㅼ젣 ?대?吏 ?⑹꽦 ?붿껌? ?섏? ?딅뒗?? ?⑹꽦 寃곌낵 ?대?吏? ?쇰? 寃곌낵 移대뱶 ?대?吏??placeholder濡??쒖떆?쒕떎. ?곕씪???꾩껜 UI ?먮쫫? ?遺遺?援ы쁽?섏뼱 ?덉쑝?? ?곗씠???곕룞 ?꾩꽦?꾨뒗 湲곕뒫蹂꾨줈 ?ㅻⅤ??

## 2. ?꾨줈?앺듃 媛쒖슂

**誘몃━媛뺣쫱**? 媛뺣쫱???꾨낫 ?μ냼瑜?理쒕? 3媛??좏깮?섍퀬, 洹몄쨷 ?먰뵿 ?μ냼瑜?諛곌꼍?쇰줈 ?ъ쭊 ?⑹꽦 ?먮쫫??泥댄뿕?????ы뻾 痍⑦뼢쨌?숉뻾쨌湲곌컙??留욎텣 肄붿뒪 寃곌낵瑜?蹂댁뿬二쇰뒗 ???좏뵆由ъ??댁뀡?대떎.

二쇱슂 ?ъ슜 寃쏀뿕? `?μ냼 ?좏깮 ???먰뵿 寃곗젙 ???ъ쭊 ?낅줈?쑣룻빀??吏꾪뻾 ???⑹꽦 寃곌낵 ?뺤씤 ???ы뻾 議곌굔 ?ㅼ젙 ??肄붿뒪? 吏???뺤씤`?대떎. ?꾩옱 ?깆? 濡쒓렇?몄씠???ъ슜??怨꾩젙 ?놁씠 ???먮쫫??諛붾줈 ?쒖옉?쒕떎.

?뷀듃由??ъ씤?몃뒗 [src/main.tsx](../src/main.tsx)?대ŉ, `QueryClientProvider`? Router瑜?援ъ꽦?섎뒗 理쒖긽???깆? [src/App.tsx](../src/App.tsx)?대떎. ?붾㈃ ?⑥쐞 而⑦뀒?대꼫??`src/pages`, ?ㅼ젣 ?붾㈃ UI??`src/components/organisms`, 怨듯넻 UI??atoms/molecules, ?좏깮 ?곗씠?곕뒗 Zustand ?ㅽ넗?댁뿉 諛곗튂?섏뼱 ?덈떎.

## 3. 湲곗닠 ?ㅽ깮

| 援щ텇               | ?ㅼ젣 ?ъ슜 湲곗닠                                         | 肄붾뱶???ъ슜 ?꾩튂                                                                                       |
| ------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| UI                  | React 18, TypeScript                                      | `src/main.tsx`, ?꾩껜 `.tsx`                                                                             |
| 鍮뚮뱶/媛쒕컻 ?쒕쾭 | Vite 5, `@vitejs/plugin-react`                            | [vite.config.ts](../vite.config.ts)                                                                      |
| ?쇱슦??             | React Router DOM 7 (`createBrowserRouter`)                | [src/App.tsx](../src/App.tsx)                                                                            |
| ?꾩뿭 ?곹깭         | Zustand 5                                                 | [src/store/useAppStore.ts](../src/store/useAppStore.ts)                                                  |
| ?쒕쾭 ?곹깭/罹먯떆  | TanStack React Query 5                                    | [src/queries/usePlacesQuery.ts](../src/queries/usePlacesQuery.ts)                                        |
| ?ㅽ???              | Tailwind CSS 3, PostCSS, Autoprefixer                     | [tailwind.config.js](../tailwind.config.js), [src/styles/index.css](../src/styles/index.css)             |
| ?대옒??議고빀       | `clsx`, `tailwind-merge`, CVA                             | [src/lib/cn.ts](../src/lib/cn.ts), [src/components/atoms/Button.tsx](../src/components/atoms/Button.tsx) |
| ?꾩씠肄?            | Lucide React                                              | organism/layout 而댄룷?뚰듃                                                                              |
| 吏???꾨낫 寃쎈줈    | 移댁뭅?ㅻ㏊ JavaScript SDK, 移댁뭅???꾨낫 寃쎈줈 REST API | [src/lib/kakaoMaps.ts](../src/lib/kakaoMaps.ts), [api/walking-route.ts](../api/walking-route.ts)         |
| ?뚯뒪??             | Vitest                                                    | `*.test.ts`                                                                                              |

Axios ??蹂꾨룄 HTTP ?대씪?댁뼵?? React Hook Form, Redux, 蹂꾨룄 UI 而댄룷?뚰듃 ?쇱씠釉뚮윭由? ?좎쭨 泥섎━ ?쇱씠釉뚮윭由щ뒗 ?섏〈??諛??ъ슜 肄붾뱶?먯꽌 ?뺤씤?섏? ?딅뒗??

## 4. ?꾩껜 ?붾㈃ 諛??섏씠吏

### 諛곌꼍/?μ냼 ?좏깮

- Route: `/`
- ?붾㈃ 紐⑹쟻: 媛뺣쫱 ?꾨낫 ?μ냼瑜?理쒕? 3媛??좏깮?쒕떎.
- 二쇱슂 UI: 移댄뀒怨좊━ 移? ?μ냼 移대뱶 洹몃━?? ?좏깮 ?쒖꽌 諛곗?, ?좏깮 ?꾨즺 諛?
- ?ъ슜???묒뾽: ???꾪꽣 ?꾪솚, ?μ냼 ?좏깮/?댁젣, ?ㅼ쓬 ?④퀎 ?대룞.
- 二쇱슂 而댄룷?뚰듃: `BackgroundPicker`, `PlaceCard`, `Button`, `ImageSlot`.
- ?곹깭: 濡쒖뺄 `tab`, ?꾩뿭 `picks`.
- ?곌껐 API: ?μ냼 ?곗씠?곕뒗 `usePlacesQuery`???뺤쟻 Promise.
- 二쇱슂 ?뚯씪: [src/pages/BackgroundPickerPage.tsx](../src/pages/BackgroundPickerPage.tsx), [src/components/organisms/BackgroundPicker.tsx](../src/components/organisms/BackgroundPicker.tsx).
- ?꾩옱 援ы쁽 ?곹깭: **援ы쁽 ?꾨즺** ???좏깮 ???쒗븳 諛??ㅼ쓬 踰꾪듉 鍮꾪솢?깊솕媛 援ы쁽?섏뼱 ?덈떎.

### ?먰뵿 ?μ냼 寃곗젙

- Route: `/one-pick`
- ?붾㈃ 紐⑹쟻: ?좏깮???μ냼 以??ъ쭊 ?⑹꽦??諛곌꼍?????먰뵿??怨좊Ⅸ??
- 二쇱슂 UI: ?좏깮 ?μ냼 移대뱶, ?먰뵿 諛곗?, ?댁쟾/?ㅼ쓬 踰꾪듉.
- ?ъ슜???묒뾽: ?먰뵿 蹂寃? ?μ냼 ?좏깮 ?붾㈃ 蹂듦?, ?낅줈???붾㈃ ?대룞.
- 二쇱슂 而댄룷?뚰듃: `OnePickConfirm`, `ImageSlot`, `Tag`.
- ?곹깭: ?꾩뿭 `picks`, `onePick`.
- ?곌껐 API: ?놁쓬.
- 二쇱슂 ?뚯씪: [src/pages/OnePickConfirmPage.tsx](../src/pages/OnePickConfirmPage.tsx), [src/components/organisms/OnePickConfirm.tsx](../src/components/organisms/OnePickConfirm.tsx).
- ?꾩옱 援ы쁽 ?곹깭: **援ы쁽 ?꾨즺** ??移대뱶 ?대┃/?ㅻ낫???좏깮?쇰줈 ?먰뵿??諛붽? ???덈떎.

### ?ъ쭊 ?낅줈??諛??⑹꽦 吏꾪뻾

- Route: `/photo-upload`
- ?붾㈃ 紐⑹쟻: 濡쒖뺄 ?ъ쭊怨??꾩닔 ?숈쓽瑜?諛쏄퀬 ?⑹꽦 吏꾪뻾 ?곹깭瑜?蹂댁뿬以??
- 二쇱슂 UI: ?뚯씪 ?좏깮/?쒕옒洹몄븻?쒕∼ ?곸뿭, ?좏깮 ?ъ쭊 誘몃━蹂닿린, ?숈쓽 泥댄겕諛뺤뒪, ?④퀎??吏꾪뻾 ?⑤꼸.
- ?ъ슜???묒뾽: ?대?吏 ?뚯씪 ?좏깮쨌援먯껜쨌??젣, ?숈쓽 ?좉?, ?⑹꽦 ?쒖옉/珥덇린?? 寃곌낵 ?붾㈃ ?대룞.
- 二쇱슂 而댄룷?뚰듃: `PhotoUpload`, `ImageSlot`.
- ?곹깭: 濡쒖뺄 `photoFile`, `agreeA`, `agreeB`; custom hook??`phase`, `stageIndex`, `elapsed`; ?꾩뿭 `onePick`.
- ?곌껐 API: ?놁쓬. `useComposeRun`??1.5珥?媛꾧꺽 ??대㉧濡?吏꾪뻾 ?곹깭瑜?留뚮뱺??
- 二쇱슂 ?뚯씪: [src/pages/PhotoUploadPage.tsx](../src/pages/PhotoUploadPage.tsx), [src/components/organisms/PhotoUpload.tsx](../src/components/organisms/PhotoUpload.tsx), [src/hooks/useComposeRun.ts](../src/hooks/useComposeRun.ts).
- ?꾩옱 援ы쁽 ?곹깭: **?쇰? 援ы쁽** ???뚯씪 ?좏깮 諛?吏꾪뻾 UI???숈옉?섏?留??ㅼ젣 ?⑹꽦 API/寃곌낵???녿떎.

### ?⑹꽦 寃곌낵 ?뺤씤

- Route: `/composite-result`
- ?붾㈃ 紐⑹쟻: ?먰뵿 ?뺣낫? ?⑹꽦 寃곌낵瑜??뺤씤?섍퀬 肄붿뒪 ?ㅼ젙?쇰줈 ?댁뼱吏꾨떎.
- 二쇱슂 UI: 寃곌낵 ?대?吏 ?곸뿭, ?먰뵿 ?뺣낫 移대뱶, ?ъ깮??肄붿뒪 ?앹꽦/怨듭쑀 踰꾪듉.
- ?ъ슜???묒뾽: ?낅줈???붾㈃?쇰줈 ?섎룎?꾧? ?ъ깮?? 肄붿뒪 議곌굔 ?붾㈃ ?대룞.
- 二쇱슂 而댄룷?뚰듃: `CompositeResult`, `ImageSlot`.
- ?곹깭: ?꾩뿭 `onePick`.
- ?곌껐 API: ?놁쓬.
- 二쇱슂 ?뚯씪: [src/pages/CompositeResultPage.tsx](../src/pages/CompositeResultPage.tsx), [src/components/organisms/CompositeResult.tsx](../src/components/organisms/CompositeResult.tsx).
- ?꾩옱 援ы쁽 ?곹깭: **?쇰? 援ы쁽** ???붾㈃ ?대룞? ?곌껐?섏뼱 ?덉쑝??寃곌낵 ?대?吏??placeholder?닿퀬 ??Β룰났?졖룹쟾泥댄솕硫?踰꾪듉? ?몃뱾?ш? ?녿떎.

### 肄붿뒪 議곌굔 ?ㅼ젙

- Route: `/course-options`
- ?붾㈃ 紐⑹쟻: ?좏깮 ?μ냼瑜?諛뷀깢?쇰줈 ?ы뻾 ??? ?숉뻾, 湲곌컙??怨좊Ⅸ??
- 二쇱슂 UI: ???移? ?숉뻾/湲곌컙 ?쇰뵒??移대뱶, 吏곸젒 ?ㅼ젙 ?좎쭨 ?낅젰, ?좏깮 議곌굔 ?붿빟 ?⑤꼸.
- ?ъ슜???묒뾽: ???1~2媛??좏깮, ?숉뻾/湲곌컙 ?좏깮, 吏곸젒 ?ㅼ젙 ?좎쭨 蹂寃? 寃곌낵 ?붾㈃ ?대룞.
- 二쇱슂 而댄룷?뚰듃: `CourseOptions`, `RadioOption`, `ImageSlot`.
- ?곹깭: ?꾩뿭 `picks`, `onePick`, `types`, `companion`, `duration`, `startDate`, `endDate`.
- ?곌껐 API: ?놁쓬.
- 二쇱슂 ?뚯씪: [src/pages/CourseOptionsPage.tsx](../src/pages/CourseOptionsPage.tsx), [src/components/organisms/CourseOptions.tsx](../src/components/organisms/CourseOptions.tsx).
- ?꾩옱 援ы쁽 ?곹깭: **援ы쁽 ?꾨즺** ???좏깮 ?쒖빟怨??붿빟 諛섏쁺??援ы쁽?섏뼱 ?덈떎. ?좎쭨 踰붿쐞 寃利앹? ?녿떎.

### 肄붿뒪 寃곌낵 諛?吏??

- Route: `/course-result`
- ?붾㈃ 紐⑹쟻: ?앹꽦??寃껋쑝濡??쒖떆?섎뒗 媛뺣쫱 肄붿뒪? 吏?꾩긽 ?숈꽑???뺤씤?쒕떎.
- 二쇱슂 UI: ?쇱젙 移대뱶 紐⑸줉, ?쒖꽦 ?μ냼 留덉빱, 移댁뭅??吏?? ?꾨낫 寃쎈줈 ?대━?쇱씤, ?섎떒 ?됰룞 諛?
- ?ъ슜???묒뾽: ?쇱젙 移대뱶 ?먮뒗 吏??留덉빱 ?좏깮, 肄붿뒪 議곌굔 ?붾㈃?쇰줈 蹂듦?.
- 二쇱슂 而댄룷?뚰듃: `CourseResult`, `CourseMap`, `ImageSlot`.
- ?곹깭: 濡쒖뺄 `activeStop`, ?꾩뿭 ?ы뻾 議곌굔, React Query??`courseStops`.
- ?곌껐 API: 肄붿뒪 紐⑸줉? ?뺤쟻 ?곗씠?? 吏??SDK 諛?`GET /api/walking-route`???ㅼ젣 ?몃? ?곕룞.
- 二쇱슂 ?뚯씪: [src/pages/CourseResultPage.tsx](../src/pages/CourseResultPage.tsx), [src/components/organisms/CourseResult.tsx](../src/components/organisms/CourseResult.tsx), [src/components/organisms/CourseMap.tsx](../src/components/organisms/CourseMap.tsx).
- ?꾩옱 援ы쁽 ?곹깭: **?遺遺?援ы쁽** ??移대뱶쨌留덉빱 ?숆린?붿? 吏??寃쎈줈 ?붿껌? 援ы쁽?섏뼱 ?덇퀬, 肄붿뒪 寃곌낵 ?먯껜??怨좎젙 ?곗씠?곗씠硫?異붽?쨌?ㅽ넗由?移대뱶쨌???怨듭쑀??誘몄뿰寃곗씠??

## 5. ?ъ슜??二쇱슂 ?숈옉 ?먮쫫

1. ?ъ슜?먮뒗 `/`?먯꽌 ?μ냼 移댄뀒怨좊━瑜??좏깮?섍퀬 ?μ냼 移대뱶瑜??뚮윭 理쒕? 3媛쒓퉴吏 ?꾨낫瑜?怨좊Ⅸ?? `togglePick`???꾩뿭 `picks`瑜?媛깆떊?섎ŉ, 理쒖냼 1媛쒕? ?좏깮?섎㈃ ?ㅼ쓬 踰꾪듉???쒖꽦?붾맂??
2. `/one-pick`?먯꽌???꾩뿭 `picks`留?移대뱶濡?蹂댁씠怨? 移대뱶 ?좏깮? `setOnePick`?쇰줈 ?먰뵿??蹂寃쏀븳?? ?댁쟾?쇰줈 媛硫??좏깮 ?μ냼 ?붾㈃?쇰줈 ?뚯븘媛꾨떎.
3. `/photo-upload`?먯꽌 ?뚯씪 ?낅젰 ?먮뒗 ?쒕옒洹몄븻?쒕∼?쇰줈 `photoFile`???ㅼ젙?쒕떎. ???숈쓽媛 紐⑤몢 ?좏깮?섍퀬 ?뚯씪???덉쓣 ?뚮쭔 ?쒖옉 踰꾪듉???쒖꽦?붾맂?? ?쒖옉?섎㈃ API ?붿껌 ?놁씠 `useComposeRun`????대㉧媛 ?④퀎? 寃쎄낵 ?쒓컙??蹂寃쏀븳??
4. ?꾨즺 ??`/composite-result`?먯꽌 ?먰뵿 ?μ냼 ?뺣낫? ?⑹꽦 寃곌낵 ?곸뿭???뺤씤?쒕떎. 肄붿뒪 ?앹꽦 踰꾪듉? `/course-options`濡??대룞?섎ŉ, ?ъ깮?깆? ?낅줈???붾㈃?쇰줈 ?대룞?쒕떎.
5. `/course-options`?먯꽌 `toggleType`? 理쒖냼 1媛쑣룹턀? 2媛쒖쓽 ?ы뻾 ??낆쓣 ?좎??섍퀬, ?숉뻾쨌湲곌컙쨌吏곸젒 ?낅젰 ?좎쭨??Zustand 媛믪쑝濡?利됱떆 ?붿빟 ?⑤꼸??諛섏쁺?쒕떎. ?뺤씤 踰꾪듉? `/course-result`濡??대룞?쒕떎.
6. `/course-result`?먯꽌 ?쇱젙 移대뱶瑜??꾨Ⅴ嫄곕굹 吏??留덉빱瑜??꾨Ⅴ硫?`activeStop`??諛붾뚮ŉ, 移대뱶 媛뺤“? 吏??留덉빱 媛뺤“쨌吏???대룞???④퍡 媛깆떊?쒕떎. 吏??珥덇린???ㅼ뿉???꾨낫 寃쎈줈 API ?묐떟?쇰줈 ?대━?쇱씤???쒖떆?쒕떎.

## 6. Routing 援ъ“

```text
/
?붴?? PageLayout (怨듯넻 ProgressHeader + Outlet)
    ?쒋?? /                 BackgroundPickerPage
    ?쒋?? /one-pick         OnePickConfirmPage
    ?쒋?? /photo-upload     PhotoUploadPage
    ?쒋?? /composite-result CompositeResultPage
    ?쒋?? /course-options   CourseOptionsPage
    ?붴?? /course-result    CourseResultPage
```

[src/App.tsx](../src/App.tsx)??`createBrowserRouter`???⑥씪 ?덉씠?꾩썐 ?꾨옒??6媛??됰㈃ route瑜??붾떎. index route, ?숈쟻 route, protected route, redirect, 404 route???녿떎. [PageLayout](../src/components/layout/PageLayout.tsx)? 寃쎈줈 蹂寃???`window.scrollTo(0, 0)`???ㅽ뻾?섍퀬 怨듯넻 ?ㅻ뜑? ?먯떇 ?붾㈃???뚮뜑留곹븳?? 媛쒕컻 紐⑤뱶?먯꽌留??ㅻ뜑 ?곗륫??6媛?route濡?諛붾줈 ?대룞?섎뒗 ?붾㈃ ?꾪솚湲곌? ?쒖떆?쒕떎.

## 7. 二쇱슂 而댄룷?뚰듃

| 援щ텇     | 而댄룷?뚰듃                       | ??븷 諛??곹깭/愿怨?                                                                                                              |
| --------- | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Layout    | `PageLayout`                      | 怨듯넻 ?ㅻ뜑? `Outlet`???쒓났?섍퀬 寃쎈줈 蹂寃????ㅽ겕濡ㅼ쓣 留??꾨줈 蹂대궦??                                                   |
| Layout    | `ProgressHeader`                  | ?꾩옱 path瑜?`ROUTE_TO_STEP`??留ㅽ븨??4?④퀎 吏꾪뻾 ?곹깭瑜??쒖떆?쒕떎. 媛쒕컻 ?섍꼍?먯꽌??route 吏곸젒 ?대룞 踰꾪듉???쒓났?쒕떎. |
| 怨듯넻 UI | `Button`                          | CVA? `cn`?쇰줈 primary/secondary/ghost/chip 蹂?뺤쓣 ?쒓났?쒕떎. ?꾩옱 `BackgroundPicker`???꾪꽣 移⑹뿉???ъ슜?쒕떎.                |
| 怨듯넻 UI | `ImageSlot`                       | `src`媛 ?덉쑝硫??대?吏, ?놁쑝硫?placeholder瑜??쒖떆?쒕떎. ?щ윭 ?붾㈃???ъ쭊 ?곸뿭 湲곕컲 而댄룷?뚰듃??                            |
| 怨듯넻 UI | `Tag`, `RadioOption`, `PlaceCard` | ?μ냼 ?쒓렇, ?쇰뵒??移대뱶, ?μ냼 ?좏깮 移대뱶瑜?媛곴컖 罹≪뒓?뷀븳?? `PlaceCard`???좏깮 ?쒖꽌? ?ㅻ낫???좏깮??泥섎━?쒕떎.           |
| 湲곕뒫 UI | `PhotoUpload`                     | ?뚯씪 ?낅젰쨌誘몃━蹂닿린쨌?숈쓽쨌吏꾪뻾 UI瑜?props 肄쒕갚?쇰줈 ?섏씠吏 ?곹깭? ?곌껐?쒕떎.                                        |
| 湲곕뒫 UI | `CourseOptions`                   | ?ы뻾 議곌굔??props濡?諛쏄퀬, ?좏깮 ?붿빟??利됱떆 怨꾩궛?쒕떎.                                                                    |
| 湲곕뒫 UI | `CourseResult` / `CourseMap`      | 紐⑸줉/留덉빱 ?좏깮??`activeStop`?쇰줈 怨듭쑀?쒕떎. `CourseMap`? 吏??SDK, 留덉빱, ?대━?쇱씤怨?吏???ㅻ쪟 ?곹깭瑜?愿由ы븳??         |

## 8. ?곹깭 愿由?諛??곗씠???먮쫫

### Local State

- `BackgroundPickerPage`: ?좏깮 移댄뀒怨좊━ ??`tab`.
- `PhotoUploadPage`: `photoFile`, ?꾩닔 ?숈쓽 2媛?
- `CourseResultPage`: ?꾩옱 媛뺤“???쇱젙??諛곗뿴 ?몃뜳??`activeStop`.
- `useComposeRun`: ?⑹꽦 UI??`phase`, `stageIndex`, `elapsed`, interval ref.
- `CourseMap`: SDK/寃쎈줈 ?ㅻ쪟 臾멸뎄 `error`, `routeError`? 吏??媛앹껜 ref.

### Global State

[useAppStore](../src/store/useAppStore.ts)??Zustand濡??μ냼 ?좏깮(`picks`, `onePick`)怨?肄붿뒪 議곌굔(`types`, `companion`, `duration`, `startDate`, `endDate`)??蹂닿??쒕떎. 媛??섏씠吏???꾩슂??slice? setter留?援щ룆?쒕떎. ?덈줈怨좎묠 ??蹂듦뎄瑜??꾪븳 persist 誘몃뱾?⑥뼱???녿떎.

### Server State

[usePlacesQuery.ts](../src/queries/usePlacesQuery.ts)??`places`, `course-stops` query key濡??뺤쟻 諛곗뿴??`Promise.resolve`??臾닿린??stale 罹먯떆濡?愿由ы븳?? ?ㅼ젣 ?ㅽ듃?뚰겕 紐⑸줉/肄붿뒪 API ?묐떟??罹먯떆?섎뒗 援ъ“???꾩쭅 ?꾨땲?? ?꾨낫 寃쎈줈??React Query瑜??곗? ?딄퀬 `CourseMap`??effect?먯꽌 吏곸젒 ?붿껌?쒕떎.

### URL State

URL? ?붾㈃ 寃쎈줈留?愿由ы븳?? query parameter? path parameter???ъ슜?섏? ?딅뒗?? ?꾨낫 寃쎈줈 ?몄텧 ?쒖뿉留??μ냼 諛곗뿴??`stops` query parameter濡?吏곷젹?붾릺??`/api/walking-route`???꾨떖?쒕떎.

### 二쇱슂 ?곗씠???먮쫫

````text
?μ냼/肄붿뒪 ?붾㈃
  ??usePlacesQuery / useCourseStopsQuery
  ??Promise.resolve(?뺤쟻 PLACES / COURSE_STOPS)
  ??React Query 罹먯떆
  ???붾㈃ ?뚮뜑留?
CourseMap
  ??courseStops 醫뚰몴 蹂??  ??GET /api/walking-route?stops=...
  ??Vercel API ?먮뒗 Vite 媛쒕컻 誘몃뱾?⑥뼱
  ??移댁뭅???꾨낫 寃쎈줈 API
  ??points ?묐떟
  ??移댁뭅?ㅻ㏊ Polyline ?뚮뜑留?```

## 9. API ?곌껐 ?꾪솴

| 湲곕뒫 | API/?곗씠??| ?ъ슜 ?붾㈃ | ?곹깭 |
| --- | --- | --- | --- |
| ?μ냼 紐⑸줉 | `usePlacesQuery` ??`PLACES` | 諛곌꼍/?μ냼 ?좏깮 | ?뺤쟻 mock ?곗씠??|
| 肄붿뒪 紐⑸줉 | `useCourseStopsQuery` ??`COURSE_STOPS` | 肄붿뒪 寃곌낵 | ?뺤쟻 mock ?곗씠??|
| 移댁뭅?ㅻ㏊ SDK | `https://dapi.kakao.com/v2/maps/sdk.js` | 肄붿뒪 寃곌낵 吏??| ?ㅼ젣 ?몃? SDK ?곕룞 |
| ?꾨낫 寃쎈줈 | `GET /api/walking-route?stops=...` | 肄붿뒪 寃곌낵 吏??| 援ы쁽?? 移댁뭅??REST API ?꾨줉??|
| ?ъ쭊 ?⑹꽦 | ?놁쓬 | ?ъ쭊 ?낅줈???⑹꽦 寃곌낵 | 誘몄뿰寃?|
| 肄붿뒪 ?앹꽦 | ?놁쓬 | 肄붿뒪 議곌굔/寃곌낵 | 誘몄뿰寃? 怨좎젙 肄붿뒪 ?쒖떆 |

?꾨낫 寃쎈줈 ?대씪?댁뼵?몃뒗 [src/lib/walkingRoute.ts](../src/lib/walkingRoute.ts)???덇퀬, ?쒕쾭 泥섎━??[api/walking-route.ts](../api/walking-route.ts)???덈떎. ?쒕쾭???낅젰 stops瑜?寃利앺븯怨? 理쒕? 7媛?stop ?⑥쐞濡?移댁뭅???꾨낫 寃쎈줈 API瑜??몄텧??以묐났 醫뚰몴瑜??쒓굅??`points`瑜?諛섑솚?쒕떎. Vite 媛쒕컻 ?쒕쾭?먯꽌??[api/walking-route-dev.ts](../api/walking-route-dev.ts)媛 媛숈? handler瑜?誘몃뱾?⑥뼱濡??쒓났?쒕떎.

?섍꼍 蹂?섎뒗 `VITE_KAKAO_MAP_API_KEY`(釉뚮씪?곗? SDK)? `KAKAO_REST_API_KEY`(?쒕쾭 寃쎈줈 API)瑜??ㅼ젣 肄붾뱶?먯꽌 ?ъ슜?쒕떎. `VITE_API_BASE_URL`? `.env.example`?먮쭔 ?덇퀬 ?몄텧 肄붾뱶?먯꽌???ъ슜?섏? ?딅뒗?? ?몄쬆 token, 怨듯넻 request/response interceptor, ?꾩뿭 HTTP ?ㅻ쪟 泥섎━???뺤씤?섏? ?딅뒗??

## 10. 백엔드 API 연동 요구사항

현재 프론트엔드의 화면 흐름을 실제 서비스로 전환하려면 아래 API가 필요하다. `docs/api-spec-draft.md`와 [src/types/api.ts](../src/types/api.ts)의 타입을 계약의 출발점으로 삼되, 실제 구현 완료 여부는 현재 코드에서 확인되는 호출 코드 기준으로 구분한다.

| 기능 | 메서드/경로 | 요청 핵심 | 응답 핵심 | 사용 화면 | 현재 상태 |
| --- | --- | --- | --- | --- | --- |
| 장소 목록 | `GET /api/places` | 선택적 `cat`, `limit`, `cursor` | `{ places: Place[] }` | `/` | **필요; 미연결**. `usePlacesQuery`가 `PLACES` 정적 배열을 반환한다. |
| 사진 합성 Job 생성 | `POST /api/composite-jobs` | `multipart/form-data`: 사용자 사진 파일, `onePickId` | `{ id, status, progress }` | `/photo-upload` | **필요; 미연결**. 현재는 `useComposeRun` 타이머만 실행한다. |
| 사진 합성 Job 조회 | `GET /api/composite-jobs/:id` | path의 Job ID | `{ id, status, progress, resultUrl? }` | `/photo-upload`, `/composite-result` | **필요; 미연결**. running 상태 polling과 done 결과 반영이 없다. |
| 여행 코스 생성 | `POST /api/courses` | `placeIds`, `onePickId`, `types`, `companion`, `duration`, 선택적 `startDate`, `endDate` | `{ stops: CourseStop[] }` | `/course-options` → `/course-result` | **필요; 미연결**. 결과 화면이 `COURSE_STOPS` 정적 배열을 사용한다. |
| 도보 경로 | `GET /api/walking-route` | `stops` JSON query parameter | `{ points: { lat, lng }[] }` | `/course-result` | **연결 완료**. 프론트 API wrapper와 Vercel/Vite 서버 handler가 구현되어 있다. |

### API별 연동 방식

**장소 목록**은 `usePlacesQuery`의 `queryFn`을 `fetch('/api/places')` 기반으로 교체하면 된다. 응답의 `places`를 React Query 캐시에 저장하고, `cat` 필터를 서버로 보낼지 클라이언트에서 필터링할지는 장소 수와 pagination 도입 여부에 따라 결정한다.

**사진 합성**은 두 단계 API가 필요하다. 파일과 동의를 통과하면 `POST /api/composite-jobs`에 파일을 multipart로 업로드하고, 반환된 Job ID를 페이지 상태 또는 mutation hook에 저장한다. 이후 `GET /api/composite-jobs/:id`를 1~2초 간격으로 조회해 `queued/running/done`을 UI에 반영하고, `done`의 `resultUrl`을 합성 결과 화면의 `ImageSlot`에 전달해야 한다. 운영 환경에는 `failed` 상태와 Job 만료 정책도 필요하다.

**여행 코스 생성**은 코스 조건 확인 버튼에서 `POST /api/courses`를 호출하는 구조다. `CreateCourseRequest`의 `placeIds`와 `onePickId`는 Zustand의 `picks`·`onePick`, 여행 타입/동행/기간은 각각 `types`·`companion`·`duration`에서 만든다. `duration === 'custom'`이면 날짜 범위를 함께 보내고, 응답 `stops`를 mutation 결과 또는 route state로 `/course-result`에 전달해야 한다.

**도보 경로**는 이미 연결된 유일한 실 API다. 브라우저는 서버 프록시만 호출하고 서버는 `KAKAO_REST_API_KEY`로 카카오 REST API를 호출한다. 브라우저용 `VITE_KAKAO_MAP_API_KEY`와 서버용 키가 분리되어 있다.

### 백엔드 공통 계약 및 운영 요구사항

* JSON API는 `Content-Type: application/json`을 보장하고 `400`, `401/403`, `404`, `409`, `429`, `5xx`를 구분한다.
* 사진 업로드 API는 파일 형식·용량·해상도 검증, 바이러스 검사, 저장 만료 정책, CDN 접근 URL 정책을 가져야 한다. API 키와 사용자 사진 원본은 프론트 로그에 남기지 않는다.
* 합성 Job은 재시도와 멱등성 키를 고려해야 하며 프론트는 polling 취소, timeout, 실패/재시도 UI를 처리해야 한다.
* `Place`, `CourseStop`, `CompositeJob` 스키마는 [src/types/api.ts](../src/types/api.ts)와 백엔드 계약을 일치시키고, 가능하면 OpenAPI에서 타입을 생성한다.
* `.env.example`의 `VITE_API_BASE_URL`은 현재 호출 코드에서 사용되지 않는다. 실제 API 서버를 붙일 때 base URL, CORS, proxy, credentials 정책을 함께 정의해야 한다.

### 프론트엔드 연결 작업 순서

1. `usePlacesQuery`를 실제 `GET /api/places` query로 교체하고 loading/error/empty UI를 추가한다.
2. `PhotoUploadPage`에 합성 Job 생성 mutation과 polling hook을 연결하고 `useComposeRun` 타이머를 서버 상태 기반 UI로 대체한다.
3. `CompositeResultPage`가 `resultUrl`을 받아 이미지와 재생성 상태를 렌더링하도록 변경한다.
4. `CourseOptionsPage`의 확인 버튼에서 `POST /api/courses`를 호출하고 성공 응답의 stops를 `CourseResultPage`에 전달한다.
5. 공통 API client에 base URL, JSON 파싱, 인증/오류 매핑, abort signal, 요청 timeout을 넣고 테스트를 추가한다.

### DTO 및 화면 데이터 매핑

| 화면 | 프론트 데이터 원천 | 요청 DTO | 응답 DTO | 연결 후 UI 반영 |
| --- | --- | --- | --- | --- |
| 장소 선택 | 로컬 `tab`, Zustand `picks` | `GetPlacesQuery` | `GetPlacesResponse` | 서버 장소 카드 렌더링, 선택 ID 유지 |
| 사진 업로드 | 로컬 `photoFile`, Zustand `onePick` | `CreateCompositeJobFormData` | `CreateCompositeJobResponse` | Job ID 저장 및 진행 시작 |
| 합성 진행/결과 | 저장한 Job ID | 없음 | `GetCompositeJobResponse` | progress·failed 오류·`resultUrl` 반영 |
| 코스 조건 | Zustand `picks`, `onePick`, `types`, `companion`, `duration`, 날짜 | `CreateCourseRequest` | `CreateCourseResponse` | 생성 loading/error와 stops 결과 전달 |
| 코스 지도 | 생성된 `stops`, 로컬 `activeStop` | `WalkingRouteStopDto[]` | `GetWalkingRouteResponse` | 지도 polyline과 마커 동기화 |

공통 오류 응답은 `ApiErrorResponse`로 통일한다. `VALIDATION_ERROR`는 폼 필드/조건 오류, `EXTERNAL_SERVICE_ERROR`는 합성 또는 지도 제공자 오류, `RATE_LIMITED`는 재시도 안내 UI로 분기한다. DTO의 전체 필드 정의와 예시 값은 [docs/api-spec-draft.md](api-spec-draft.md)의 `DTO 계약 정의` 절을 기준으로 한다.

예상 성공·실패 JSON 응답은 같은 문서의 `예상 응답 스키마` 절에 정의한다. 특히 합성 Job 조회는 `queued/running/done/failed`별 응답 조건을 가지며, `done`에는 `resultUrl`, `failed`에는 `error` 객체가 반드시 포함된다.

## 11. Custom Hooks

| Hook | ??븷 | ?ъ슜 ?꾩튂 | 諛섑솚/?곹깭 | API |
| --- | --- | --- | --- | --- |
| `useComposeRun` | ?⑹꽦 吏꾪뻾 UI ??대㉧ ?쒖뼱 | `PhotoUploadPage` | `phase`, `stageIndex`, `elapsed`, `start`, `reset` | ?놁쓬 |
| `usePlacesQuery` | ?μ냼 ?뺤쟻 諛곗뿴??query cache濡??몄텧 | `BackgroundPickerPage` | React Query 寃곌낵 | ?뺤쟻 Promise |
| `useCourseStopsQuery` | 肄붿뒪 ?뺤쟻 諛곗뿴??query cache濡??몄텧 | `CourseResultPage` | React Query 寃곌낵 | ?뺤쟻 Promise |

## 12. Tailwind / UI 援ъ“

Tailwind??`index.html`怨?`src/**/*.{js,jsx,ts,tsx}`瑜?content ??곸쑝濡??ㅼ젙?쒕떎. [tailwind.config.js](../tailwind.config.js)??釉뚮옖??釉붾（쨌肄붾엫쨌?됲겕쨌?쇱씤 ?됱긽, `Noto Sans KR` 湲瑗? 移대뱶/?⑤꼸/CTA 洹몃┝?먮? ?뺤옣?쒕떎. ?꾩뿭 CSS??body 諛곌꼍쨌?고듃, 留곹겕, focus-visible outline, selection留?`@layer base`?먯꽌 ?뺤쓽?쒕떎.

UI??**Tailwind ?대옒?ㅻ? 而댄룷?뚰듃 ?덉뿉 吏곸젒 ?묒꽦?섎뒗 諛⑹떇怨??쇰? 怨듯넻 UI 而댄룷?뚰듃瑜?蹂묓뻾?섎뒗 ?쇳빀 援ъ“**?? `Button`? CVA濡?variant瑜?媛뽰?留? ?붾㈃蹂?二쇱슂 CTA? 移대뱶 ?ㅽ??쇱? organism ?대???Tailwind class濡??묒꽦?섏뼱 ?덈떎. `clsx`? `tailwind-merge`??`cn` ?좏떥濡? CVA??`Button`?먯꽌 ?ъ슜?쒕떎. CSS module, 蹂꾨룄 CSS ?뚯씪, dark mode ?ㅼ젙? ?녿떎.

諛섎났 ?⑦꽩? ?κ렐 移대뱶, `border-line`, ??諛곌꼍, 釉뚮옖??釉붾（ CTA, pill/chip, `ImageSlot` ?ъ쭊 ?곸뿭?대ŉ, `Tag`쨌`RadioOption`쨌`PlaceCard`濡??쇰? ?ъ궗?⑸맂??

## 13. Responsive 援ы쁽 ?곹깭

肄붾뱶?먯꽌 ?뺤씤?섎뒗 ?듭떖 breakpoint??Tailwind `lg`?? ?μ냼 ?좏깮 ?붾㈃? `lg` ?댁긽?먯꽌 醫뚯륫 ?덉뼱濡??곗륫 紐⑸줉 2?댁씠 ?섍퀬, ?⑹꽦 寃곌낵쨌肄붿뒪 議곌굔쨌肄붿뒪 寃곌낵???곗뒪?ы넲?먯꽌 2???덉씠?꾩썐?쇰줈 ?꾪솚?쒕떎. 紐⑤컮??湲곕낯? ???댁씠硫?肄붿뒪 寃곌낵 吏?꾨뒗 `lg` 誘몃쭔?먯꽌 420px ?믪씠濡??쒖떆?쒕떎.

媛濡??섏묠 媛?μ꽦???덈뒗 吏꾪뻾 ?ㅻ뜑, 移댄뀒怨좊━ 移? 寃곌낵 ?쒓렇??`overflow-x-auto`瑜??ъ슜?쒕떎. `md`, `sm` ??蹂꾨룄 tablet ?몃텇?? 紐⑤컮???꾩슜 navigation, dark mode???뺤씤?섏? ?딅뒗?? ?곕씪??紐⑤컮???곗뒪?ы넲??二쇱슂 遺꾧린??援ы쁽?섏뼱 ?덇퀬 tablet ?꾩슜 洹쒖튃? 蹂꾨룄濡??녿떎.

## 14. Form 諛??ъ슜???낅젰 泥섎━

?ъ쭊 ?낅줈?쒕뒗 ?④릿 native `input[type=file]`瑜?ref濡??닿퀬, ?대┃ ?먮뒗 ?쒕옒洹몄븻?쒕∼?쇰줈 泥??뚯씪??`photoFile` state????ν븳?? ?좏깮 ?뚯씪? Object URL濡?誘몃━蹂닿린 ?섎ŉ cleanup ??URL???댁젣?쒕떎. accept??`image/*`?댁?留? ?붾㈃???덈궡???뚯씪 ?ш린(10MB)???대?吏 ?뺤떇??異붽? 寃利앹? 肄붾뱶???녿떎.

?숈쓽??controlled checkbox 2媛쒖씠硫? ?뚯씪怨????숈쓽媛 紐⑤몢 ?덉쓣 ???⑹꽦 ?쒖옉 踰꾪듉留??쒖꽦?붾맂?? 肄붿뒪 議곌굔???좎쭨 input? controlled state?닿퀬 `duration === 'custom'`???뚮쭔 ?섑??쒕떎. React Hook Form 諛??ㅽ궎留?validation? ?ъ슜?섏? ?딅뒗?? ?쒖텧 API, ?꾨뱶蹂??ㅻ쪟 臾멸뎄, ?꾩넚 loading/?깃났/?ㅽ뙣 ?곹깭???녿떎.

## 15. Loading / Error / Empty State

| ?곹깭 | ?꾩옱 泥섎━ |
| --- | --- |
| ?뺤쟻 ?μ냼/肄붿뒪 query loading/error | 蹂꾨룄 UI ?놁쓬. ?뺤쟻 `Promise.resolve`??寃곌낵媛 ?놁쓣 寃쎌슦 鍮?諛곗뿴???꾨떖?쒕떎. |
| 移댁뭅?ㅻ㏊ SDK ?ㅻ쪟 | `CourseMap`??吏???곸뿭 以묒븰???ㅻ쪟 臾멸뎄瑜??쒖떆?쒕떎. |
| ?꾨낫 寃쎈줈 ?ㅻ쪟 | 吏???섎떒 status 諛곕꼫瑜??쒖떆?섍퀬, 吏??留덉빱???좎??쒕떎. |
| ?ъ쭊 ?⑹꽦 吏꾪뻾 | ?ㅼ젣 ?붿껌 loading???꾨땶 `useComposeRun`???④퀎????대㉧ UI瑜??쒖떆?쒕떎. |
| 鍮꾩뼱 ?덈뒗 ?μ냼/肄붿뒪 ?곗씠??| 紐낆떆??empty-state UI ?놁쓬. 移대뱶 紐⑸줉留?鍮꾩뼱 ?덉쓣 ???덈떎. |
| ???ㅻ쪟/?몄쬆 ?ㅽ뙣/?ㅽ듃?뚰겕 怨듯넻 ?ㅻ쪟 | 援ы쁽 ?뺤씤 遺덇?(?몄쬆怨??쇰컲 API ???쒖텧???놁쓬). |
| 404 | route ?뺤쓽 諛??꾩슜 UI ?놁쓬. |

## 16. ?꾩옱 援ы쁽 ?곹깭 ?붿빟

| ?곸뿭 | ?곹깭 | ?ㅻ챸 |
| --- | --- | --- |
| ?꾨줈?앺듃 湲곕낯 援ъ“ | 援ы쁽 ?꾨즺 | Vite + React + TypeScript 吏꾩엯 援ъ“? lint/test/build ?ㅽ겕由쏀듃媛 ?덈떎. |
| Routing | ?遺遺?援ы쁽 | 6媛?二쇱슂 ?붾㈃怨?怨듯넻 ?덉씠?꾩썐???곌껐?섏뼱 ?덉쑝??404쨌蹂댄샇 route쨌redirect???녿떎. |
| 二쇱슂 ?붾㈃ | ?遺遺?援ы쁽 | ?μ냼 ?좏깮遺??吏??寃곌낵源뚯? UI? ?붾㈃ ?대룞??援ы쁽?섏뼱 ?덈떎. |
| 怨듯넻 而댄룷?뚰듃 | ?쇰? 援ы쁽 | atoms/molecules媛 ?덉쑝???ㅼ닔??踰꾪듉/移대뱶 ?ㅽ??쇱? ?붾㈃??吏곸젒 ?묒꽦?쒕떎. |
| ?꾩뿭 ?곹깭 | 援ы쁽 ?꾨즺 | Zustand濡??④퀎 媛??좏깮媛믪쓣 怨듭쑀?쒕떎. |
| ?뺤쟻 ?곗씠??query | 援ы쁽 ?꾨즺 | React Query cache瑜??ъ슜?섏?留??ㅼ젣 API媛 ?꾨땶 ?뺤쟻 ?곗씠?곕떎. |
| ?ъ쭊 ?⑹꽦 | ?쇰? 援ы쁽 | ?뚯씪 ?낅젰怨?吏꾪뻾 UI留??덇퀬 ?ㅼ젣 ?⑹꽦 ?붿껌/寃곌낵 ??μ? ?녿떎. |
| 肄붿뒪 ?앹꽦 | ?쇰? 援ы쁽 | 議곌굔 ?낅젰? 媛?ν븯??議곌굔 湲곕컲 API ?앹꽦 ?놁씠 怨좎젙 肄붿뒪瑜??쒖떆?쒕떎. |
| 吏???꾨낫 寃쎈줈 | ?遺遺?援ы쁽 | SDK 濡쒕뱶, 留덉빱 ?좏깮, ?쒕쾭 ?꾨줉?? ?대━?쇱씤 諛??ㅻ쪟 ?쒖떆媛 援ы쁽?섏뼱 ?덈떎. |
| Responsive | ?쇰? 援ы쁽 | 紐⑤컮??湲곕낯怨?`lg` 遺꾧린媛 ?덉쑝硫??몃텇?붾맂 breakpoint???녿떎. |
| Loading / Error | ?쇰? 援ы쁽 | 吏??愿???ㅻ쪟留?紐낆떆?곸쑝濡?泥섎━?쒕떎. |
| Styling | 援ы쁽 ?꾨즺 | Tailwind theme怨?怨듯넻 ?쒓컖 ?⑦꽩??諛뷀깢?쇰줈 ?붾㈃ UI媛 援ъ꽦?섏뼱 ?덈떎. |

## 17. ?꾩옱 ?⑥븘 ?덈뒗 誘몄셿???붿냼

* ?꾩튂: [src/queries/usePlacesQuery.ts](../src/queries/usePlacesQuery.ts), [src/data/places.ts](../src/data/places.ts)
  ?꾩옱 ?곹깭: ?μ냼 紐⑸줉怨?肄붿뒪 寃곌낵媛 ?뺤쟻 mock ?곗씠?곕떎.
  肄붾뱶?먯꽌 ?뺤씤???댁슜: ??query ?⑥닔媛 `Promise.resolve(PLACES)`? `Promise.resolve(COURSE_STOPS)`瑜?諛섑솚?쒕떎.

* ?꾩튂: [src/hooks/useComposeRun.ts](../src/hooks/useComposeRun.ts), [src/components/organisms/CompositeResult.tsx](../src/components/organisms/CompositeResult.tsx)
  ?꾩옱 ?곹깭: ?ъ쭊 ?⑹꽦? ?쒕??덉씠?섏씠硫?寃곌낵 ?대?吏??placeholder??
  肄붾뱶?먯꽌 ?뺤씤???댁슜: `useComposeRun`? interval ??대㉧留??ㅽ뻾?섍퀬, 寃곌낵 ?붾㈃? `ImageSlot`??寃곌낵 `src`瑜??꾨떖?섏? ?딅뒗??

* ?꾩튂: [src/components/organisms/CourseOptions.tsx](../src/components/organisms/CourseOptions.tsx), [src/components/organisms/CourseResult.tsx](../src/components/organisms/CourseResult.tsx)
  ?꾩옱 ?곹깭: ?낅젰???ы뻾 議곌굔?쇰줈 ?ㅼ젣 肄붿뒪瑜??앹꽦?섏? ?딄퀬 怨좎젙??`COURSE_STOPS`瑜??ъ슜?쒕떎.
  肄붾뱶?먯꽌 ?뺤씤???댁슜: 肄붿뒪 議곌굔 ?뺤씤? route ?대룞留??섍퀬, 肄붿뒪 寃곌낵??`useCourseStopsQuery`???뺤쟻 諛곗뿴???뚮뜑留곹븳??

* ?꾩튂: [src/components/organisms/CompositeResult.tsx](../src/components/organisms/CompositeResult.tsx), [src/components/organisms/CourseResult.tsx](../src/components/organisms/CourseResult.tsx)
  ?꾩옱 ?곹깭: ?쇰? ?ъ슜???됰룞 踰꾪듉??誘몄뿰寃곗씠??
  肄붾뱶?먯꽌 ?뺤씤???댁슜: ?⑹꽦 寃곌낵???꾩껜?붾㈃/?대?吏 ??Β룰났?? 肄붿뒪 寃곌낵?????μ냼 異붽?/?ㅽ넗由?移대뱶 留뚮뱾湲?肄붿뒪 ??Β룰났??踰꾪듉??`onClick`???녿떎.

* ?꾩튂: [src/components/organisms/CourseOptions.tsx](../src/components/organisms/CourseOptions.tsx), [src/components/organisms/CourseResult.tsx](../src/components/organisms/CourseResult.tsx)
  ?꾩옱 ?곹깭: 肄붿뒪 議곌굔 誘몃━蹂닿린? 肄붿뒪 紐⑸줉???대?吏??placeholder??
  肄붾뱶?먯꽌 ?뺤씤???댁슜: ?대떦 `ImageSlot` 而댄룷?뚰듃??`src`媛 ?꾨떖?섏? ?딅뒗??

* ?꾩튂: [src/data/placePhotos.ts](../src/data/placePhotos.ts)
  ?꾩옱 ?곹깭: ?μ냼 ?ъ쭊? mock photo data濡?愿由щ맂??
  肄붾뱶?먯꽌 ?뺤씤???댁슜: ?뚯씪 二쇱꽍??mock data?쇨퀬 紐낆떆?섏뼱 ?덉쑝硫??쇰? ?μ냼???뺥솗???μ냼 ?ъ쭊???꾨땶 ?泥??ъ쭊???ъ슜?쒕떎怨??곹? ?덈떎.

## 18. ?듭떖 ?뚯씪 媛?대뱶

| ?뚯씪 | ??븷 |
| --- | --- |
| [src/main.tsx](../src/main.tsx) | React DOM 吏꾩엯?먭낵 ?꾩뿭 ?ㅽ???import |
| [src/App.tsx](../src/App.tsx) | QueryClient? 釉뚮씪?곗? ?쇱슦?곗쓽 理쒖긽??援ъ꽦 |
| [src/components/layout/PageLayout.tsx](../src/components/layout/PageLayout.tsx) | 怨듯넻 ?ㅻ뜑/Outlet 諛?route 蹂寃??ㅽ겕濡?泥섎━ |
| [src/store/useAppStore.ts](../src/store/useAppStore.ts) | ?μ냼 ?좏깮쨌?먰뵿쨌?ы뻾 議곌굔 ?꾩뿭 ?곹깭 |
| [src/pages](../src/pages) | ?붾㈃蹂?而⑦뀒?대꼫: ?곹깭/?쇱슦?낃낵 organism props ?곌껐 |
| [src/components/organisms](../src/components/organisms) | 媛??쒕퉬???붾㈃???ㅼ젣 UI? 吏??湲곕뒫 |
| [src/queries/usePlacesQuery.ts](../src/queries/usePlacesQuery.ts) | ?뺤쟻 ?μ냼/肄붿뒪 query cache |
| [src/lib/kakaoMaps.ts](../src/lib/kakaoMaps.ts) | 移댁뭅?ㅻ㏊ SDK 吏??濡쒕뜑 |
| [src/lib/walkingRoute.ts](../src/lib/walkingRoute.ts) | ?꾨낫 寃쎈줈 ?대씪?댁뼵???붿껌 諛??묐떟 寃利?|
| [api/walking-route.ts](../api/walking-route.ts) | 移댁뭅???꾨낫 寃쎈줈 REST API ?쒕쾭 ?꾨줉??|
| [tailwind.config.js](../tailwind.config.js) | ?됱긽쨌湲瑗는룰렇由쇱옄 Tailwind theme ?뺤옣 |

````
