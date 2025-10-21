import { Routes } from '@angular/router';
import { CategoryListComponent } from './components/category-list/category-list';
import { CategoryDetailComponent } from './components/category-detail/category-detail';
import { AdminGuard } from '../guards/admin.guard';

export const ADMIN_ROUTES: Routes = [
  { path: '', component: CategoryListComponent, canActivate: [AdminGuard]},           // /admin
  { path: 'categories/:id', component: CategoryDetailComponent, canActivate: [AdminGuard] }, // /admin/categories/:id
  { path: 'categories/new', component: CategoryDetailComponent, canActivate: [AdminGuard] }, // /admin/categories/new
];
