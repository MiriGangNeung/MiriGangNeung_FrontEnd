import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ProgressHeader } from './ProgressHeader';

export function PageLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-canvas">
      <ProgressHeader />
      <Outlet />
    </div>
  );
}
