import { Check } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { STEP_LABELS, ROUTE_TO_STEP, ROUTES } from '../../data/places';
import { useAppStore } from '../../store/useAppStore';

const HOME_CONFIRM_MESSAGE =
  '처음으로 이동하면 현재 진행 상황이 초기화됩니다. 그래도 이동하시겠습니까?';

/** Sticky app bar: brand, 4-step progress, dev-only route switcher (1–6). */
export function ProgressHeader() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const resetProgress = useAppStore((state) => state.resetProgress);
  const [activeStep, completed] = ROUTE_TO_STEP[pathname] ?? [1, 0];

  function handleHomeClick() {
    if (pathname === '/' || pathname === '/intro') return;
    if (!window.confirm(HOME_CONFIRM_MESSAGE)) return;
    resetProgress();
    navigate('/');
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white">
      <div className="mx-auto flex h-[var(--app-header)] max-w-[1560px] items-center gap-3 px-4 md:gap-6 md:px-7">
        <button
          type="button"
          aria-label="미리강릉 첫 화면으로 이동"
          title="처음으로"
          onClick={handleHomeClick}
          className="group flex shrink-0 items-center gap-2.5 rounded-xl px-1.5 py-1 text-left transition duration-200 hover:-translate-y-px hover:bg-brand-tint hover:shadow-[0_4px_12px_rgba(16,24,40,.08)] focus:outline-none md:w-[210px]"
        >
          <img
            src="/miri-gangneung-logo.svg"
            alt=""
            width={28}
            height={28}
            className="h-7 w-7 shrink-0 transition-transform duration-200 group-hover:rotate-[-4deg] group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="whitespace-nowrap font-serif text-[15px] font-extrabold -tracking-[.3px]">
              미리강릉
            </span>
            <span className="hidden font-serif text-[10px] font-medium text-ink-soft md:block">
              사진 합성 · 맞춤 코스
            </span>
          </div>
        </button>

        {/* Mobile: current step + hairline progress. Desktop: full stepper. */}
        <div className="flex min-w-0 flex-1 items-center gap-2.5 md:hidden">
          <span className="flex h-[24px] shrink-0 items-center rounded-full bg-brand-tint px-2.5 text-xs font-bold text-brand">
            {activeStep}/{STEP_LABELS.length}
          </span>
          <div className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-bold text-ink">
              {STEP_LABELS[activeStep - 1]}
            </span>
            <span
              aria-hidden
              className="mt-1 block h-[3px] w-full overflow-hidden rounded-full bg-line"
            >
              <span
                className="block h-full rounded-full bg-brand transition-[width] duration-300"
                style={{ width: `${(activeStep / STEP_LABELS.length) * 100}%` }}
              />
            </span>
          </div>
        </div>

        <nav aria-label="진행 단계" className="hidden flex-1 justify-center md:flex">
          <ol className="flex w-full max-w-[600px] items-center">
            {STEP_LABELS.map((label, i) => {
              const done = i < completed;
              const active = !done && i + 1 === activeStep;
              return (
                <li key={label} className="flex flex-1 items-center">
                  <span
                    aria-hidden
                    className={`mb-[18px] mr-1 flex-1 ${i === 0 ? '' : done ? 'h-0.5 bg-ok/35' : 'h-px bg-line'}`}
                  />
                  <span className="flex w-[88px] shrink-0 flex-col items-center gap-1">
                    {done ? (
                      <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-ok text-white">
                        <Check size={13} strokeWidth={2.4} />
                      </span>
                    ) : (
                      <span
                        className={`flex h-[22px] w-[22px] items-center justify-center rounded-full text-[11px] ${
                          active
                            ? 'bg-brand font-bold text-white ring-2 ring-brand/15'
                            : 'border border-line bg-white font-semibold text-ink-soft'
                        }`}
                      >
                        {i + 1}
                      </span>
                    )}
                    <span
                      className={`text-xs ${active ? 'font-bold text-ink' : done ? 'font-semibold text-ink-muted' : 'font-medium text-ink-soft'}`}
                    >
                      {label}
                    </span>
                  </span>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="hidden w-[210px] shrink-0 justify-end md:flex">
          {import.meta.env.DEV && (
            <div className="flex items-center gap-[3px] rounded-full bg-fill p-1">
              {ROUTES.map((route, i) => (
                <button
                  key={route}
                  title={`화면 ${i + 1}`}
                  onClick={() => navigate(route)}
                  className={`h-[22px] w-[22px] rounded-full text-[11px] ${
                    pathname === route
                      ? 'bg-white font-bold text-brand shadow-[0_1px_3px_rgba(16,24,40,.12)]'
                      : 'font-semibold text-ink-soft hover:bg-brand-tint hover:text-brand'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
