import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: 'view-department/:id', renderMode: RenderMode.Client },
  { path: 'edit-department/:id', renderMode: RenderMode.Client },
  { path: 'department-settings/:id', renderMode: RenderMode.Client },
  { path: 'app-inside/services/:deptId', renderMode: RenderMode.Client },
  { path: 'app-inside/manage-group/:deptId', renderMode: RenderMode.Client },
  { path: 'app-inside/manage-group/:deptId/create', renderMode: RenderMode.Client },
  { path: 'view-service/:id', renderMode: RenderMode.Client },
  { path: 'edit-service/:id', renderMode: RenderMode.Client },
  { path: 'user-management/manage/:userId', renderMode: RenderMode.Client },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
