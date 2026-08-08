import { QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { PageLayout } from './components/layout/PageLayout';
import { BackgroundPickerPage } from './pages/BackgroundPickerPage';
import { OnePickConfirmPage } from './pages/OnePickConfirmPage';
import { PhotoUploadPage } from './pages/PhotoUploadPage';
import { CompositeResultPage } from './pages/CompositeResultPage';
import { CourseOptionsPage } from './pages/CourseOptionsPage';
import { CourseResultPage } from './pages/CourseResultPage';
import { queryClient } from './lib/queryClient';

const router = createBrowserRouter([
  {
    element: <PageLayout />,
    children: [
      { path: '/', element: <BackgroundPickerPage /> },
      { path: '/one-pick', element: <OnePickConfirmPage /> },
      { path: '/photo-upload', element: <PhotoUploadPage /> },
      { path: '/composite-result', element: <CompositeResultPage /> },
      { path: '/course-options', element: <CourseOptionsPage /> },
      { path: '/course-result', element: <CourseResultPage /> },
    ],
  },
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
