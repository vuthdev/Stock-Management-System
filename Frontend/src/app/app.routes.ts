import { Routes } from '@angular/router';
import {Product} from './pages/layout/product/product';
import {Dashboard} from './pages/dashboard/dashboard';
import {Users} from './pages/layout/users/users';
import {Categories} from './pages/layout/categories/categories';
import {Orders} from './pages/layout/orders/orders';
import {Home} from './pages/layout/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'register',
    component: Register
  },
  {
    path: 'dashboard',
    component: Dashboard,
    children: [
      {
        path: '',
        component: Home,
      },
      {
        path: 'products',
        component: Product
      },
      {
        path: 'categories',
        component: Categories
      },
      {
        path: 'users',
        component: Users
      },
      {
        path: 'orders',
        component: Orders
      }
    ]
  }
];
