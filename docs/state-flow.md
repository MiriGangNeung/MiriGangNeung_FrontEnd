# State Flow

화면별로 상태가 어디서 관리되는지 정리한 문서. 루트 `README.md`의 "State" 표(원본 프로토타입 기준)를 프로덕션 전환 후 구조로 확장한 것 — 상태 종류 자체의 의미는 README를 참고하고, 여기서는 "어디에 사는가"만 다룬다.

## 책임 구분

| 종류                     | 위치                                         | 이유                                                                    |
| ------------------------ | -------------------------------------------- | ----------------------------------------------------------------------- |
| 화면 간 공유 상태        | `store/useAppStore.ts` (Zustand)             | 여러 화면이 읽거나 쓰는 값 — 라우트 이동으로 언마운트돼도 유지되어야 함 |
| 화면 전용 상태           | 각 `pages/*Page.tsx`의 `useState`            | 다른 화면이 참조하지 않는 값 — 페이지 언마운트 시 사라져도 무방         |
| 서버 데이터(현재는 정적) | `queries/usePlacesQuery.ts` (TanStack Query) | 나중에 실제 API로 교체될 자리 — 캐싱/재요청 책임을 미리 분리            |

## 화면별 매핑

| 화면               | 경로                | Zustand                                                                            | 페이지 로컬                                                                            | TanStack Query                      |
| ------------------ | ------------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------- |
| 1 BackgroundPicker | `/`                 | `picks`, `liked`                                                                   | `tab`                                                                                  | `usePlacesQuery` (장소 목록)        |
| 2 OnePickConfirm   | `/one-pick`         | `picks`(읽기), `onePick`                                                           | —                                                                                      | —                                   |
| 3 PhotoUpload      | `/photo-upload`     | `onePick`(읽기, 이름 표시용)                                                       | `agreeA`, `agreeB`, 합성 진행 상태(`useComposeRun` 훅: `phase`/`stageIndex`/`elapsed`) | —                                   |
| 4 CompositeResult  | `/composite-result` | `onePick`(읽기)                                                                    | —                                                                                      | —                                   |
| 5 CourseOptions    | `/course-options`   | `picks`, `onePick`(읽기), `types`, `companion`, `duration`, `startDate`, `endDate` | —                                                                                      | —                                   |
| 6 CourseResult     | `/course-result`    | `onePick`, `types`, `companion`, `duration`(읽기)                                  | `activeStop`                                                                           | `useCourseStopsQuery` (코스 정거장) |

## 왜 이렇게 나눴는지

- `tab`, `agreeA/agreeB`, 합성 진행 상태, `activeStop`은 다른 화면이 전혀 참조하지 않는 것을 실제 데이터 흐름을 추적해 확인한 뒤 페이지 로컬로 남겼다 — Zustand로 옮기면 불필요하게 전역 상태가 커짐.
- `picks`/`onePick`/`types`/`companion`/`duration`/`startDate`/`endDate`는 최소 2개 이상의 화면이 참조하므로 Zustand로 이동 — 라우터 도입 후 화면이 실제로 언마운트되기 때문에, 여기 남아있으면 뒤로가기 시 값이 사라지는 회귀가 생김.
- 장소 목록/코스 정거장은 지금은 100% 정적 데이터지만, 실제 서버가 생기면 `usePlacesQuery`/`useCourseStopsQuery`의 `queryFn` 한 줄만 바꾸면 되도록 미리 TanStack Query로 감싸둠 — 이 자리에 로딩/에러 UI는 아직 추가하지 않음(진짜 지연/실패가 없는데 흉내만 내는 UI를 만들지 않기 위함).
