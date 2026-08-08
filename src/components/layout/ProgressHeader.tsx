import { Check, Waves } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { STEP_LABELS, ROUTE_TO_STEP, ROUTES } from '../../data/places';

/** Sticky app bar: brand, 4-step progress, dev-only route switcher (1–6). */
export function ProgressHeader() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [activeStep, completed] = ROUTE_TO_STEP[pathname] ?? [1, 0];

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white">
      <div className="mx-auto flex h-[74px] max-w-[1560px] items-center gap-6 px-7">
        <div className="flex w-[210px] shrink-0 items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-brand text-white">
            <Waves size={18} strokeWidth={1.8} />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-extrabold -tracking-[.3px]">미리강릉</span>
            <span className="text-[11px] font-medium text-ink-soft">사진 합성 · 맞춤 코스</span>
          </div>
        </div>

        <nav aria-label="진행 단계" className="flex flex-1 justify-center">
          <ol className="flex w-full max-w-[600px] items-center">
            {STEP_LABELS.map((label, i) => {
              const done = i < completed;
              const active = !done && i + 1 === activeStep;
              return (
                <li key={label} className="flex flex-1 items-center">
                  {i > 0 && (
                    <span
                      className={`mb-5 mr-1 flex-1 ${done ? 'h-0.5 bg-ok/35' : 'h-px bg-line'}`}
                    />
                  )}
                  <span className="flex w-[92px] shrink-0 flex-col items-center gap-[7px]">
                    {done ? (
                      <span className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-ok text-white">
                        <Check size={15} strokeWidth={2.4} />
                      </span>
                    ) : (
                      <span
                        className={`flex h-[26px] w-[26px] items-center justify-center rounded-full text-xs ${
                          active
                            ? 'bg-brand font-bold text-white ring-4 ring-brand/15'
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

        <div className="flex w-[210px] shrink-0 justify-end">
          {import.meta.env.DEV && (
            <div className="flex items-center gap-[3px] rounded-full bg-fill p-1">
              {ROUTES.map((route, i) => (
                <button
                  key={route}
                  title={`화면 ${i + 1}`}
                  onClick={() => navigate(route)}
                  className={`h-[26px] w-[26px] rounded-full text-xs ${
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
