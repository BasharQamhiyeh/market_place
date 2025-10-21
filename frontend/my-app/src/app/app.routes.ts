import { Routes } from '@angular/router';
import { AdList } from './features/ad-list/ad-list';
import { AdForm } from './features/ad-form/ad-form';
import { Home } from './home/home';
import { AddItemForm } from './features/add-item-form/add-item-form';
import { ItemDetails } from './features/item-details/item-details';
import { AuthGuard } from './guards/auth.guard';
import { UnauthorizedComponent } from './shared/unauthorized';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'add-item', component: AddItemForm, canActivate: [AuthGuard]},
  { path: 'item-details/:id', component: ItemDetails},
  {path: 'items/:id/edit', component: AddItemForm, canActivate: [AuthGuard]},
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
   { path: 'unauthorized', component: UnauthorizedComponent },
];
