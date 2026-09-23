// apps/frontend/src/app/app.routes.ts
import { Routes } from '@angular/router';

import { authGuard } from './core/auth/auth.guard';

export const appRoutes: Routes = [
  {
    path: 'signin',
    loadComponent: () =>
      import('./features/sign-in/sign-in.component').then(
        (m) => m.SignInComponent,
      ),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./features/sign-up/sign-up.component').then(
        (m) => m.SignUpComponent,
      ),
  },
  {
    path: 'accounts',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/accounts/accounts.component').then(
        (m) => m.AccountsComponent,
      ),
  },
  {
    path: 'transactions',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/transactions/transactions.component').then(
        (m) => m.TransactionsComponent,
      ),
  },
  // app.routes.ts
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  { path: '**', redirectTo: 'signin' },
];
