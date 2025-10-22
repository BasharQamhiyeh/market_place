import { ServerRoute, RenderMode } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // For static home page
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  // For item-details with :id — disable prerender, or provide getPrerenderParams
  {
    path: 'item-details/:id',
    renderMode: RenderMode.Server
  },
  // For admin categories/:id
  {
    path: 'admin/categories/:id',
    renderMode: RenderMode.Server
  },
  // you may add a fallback
  {
    path: '**',
    renderMode: RenderMode.Client
  }
];
