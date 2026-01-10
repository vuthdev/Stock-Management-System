import { Router, Routes } from '@angular/router';
import {Product} from './pages/layout/product/product';
import {Dashboard} from './pages/dashboard/dashboard';
import {Users} from './pages/layout/users/users';
import {Categories} from './pages/layout/categories/categories';
import {Orders} from './pages/layout/orders/orders';
import {Home} from './pages/layout/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { authGuard } from './service/auth.gaurd';
import { AuthService } from './service/auth';
import { inject } from '@angular/core';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
    canActivate: [() => {
      // Redirect to dashboard if already logged in
      const authService = inject(AuthService);
      const router = inject(Router);
      if (authService.isLoggedIn()) {
        router.navigate(['/dashboard']);
        return false;
      }
      return true;
    }]
  },
  {
    path: 'register',
    component: Register
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard], // Add guard here
    children: [
      {
        path: '',
        component: Home,
      },
      {
        path: 'products',
        component: Product,
        canActivate: [authGuard]
      },
      {
        path: 'categories',
        component: Categories,
        canActivate: [authGuard]
      },
      {
        path: 'users',
        component: Users,
        canActivate: [authGuard]
      },
      {
        path: 'orders',
        component: Orders,
        canActivate: [authGuard]
      }
    ]
  }
];
