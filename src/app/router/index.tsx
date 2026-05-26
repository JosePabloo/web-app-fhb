/**
 * 
 * FILE: src/app/router/index.tsx
 * PURPOSE: Renders the nested Routes tree from routeConfig under a Suspense boundary for lazy-loaded pages.
 * NOTES: Enables layout nesting (Public vs Auth) and handles 404 via routeConfig while deferring loading fallback control.
 * 
 */

import { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { routeConfig } from './routes';

export function AppRouter() {
  return (
    <Suspense fallback={null}>
      <Routes>
        {routeConfig.map((route, idx) => {
          if ('children' in route && Array.isArray(route.children)) {
            return (
              <Route key={idx} element={route.element}>
                {route.children.map((child) => (
                  <Route key={child.path} path={child.path} element={child.element} />
                ))}
              </Route>
            );
          }
          return 'path' in route ? (
            <Route key={route.path ?? idx} path={route.path} element={route.element} />
          ) : null;
        })}
      </Routes>
    </Suspense>
  );
}

export default AppRouter;
