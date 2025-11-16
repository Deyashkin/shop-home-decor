import { Routes } from '@angular/router';
import {Layout} from './shared/layout/layout';
import {Main} from './views/main/main';
import {Login} from './views/user/login/login';
import {Signup} from './views/user/signup/signup';
import {Catalog} from './views/product/catalog/catalog';
import {Detail} from './views/product/detail/detail';
import {Cart} from './views/order/cart/cart';
import {Order} from './views/order/order/order';
import {Favorite} from './views/personal/favorite/favorite';
import {Info} from './views/personal/info/info';
import {Orders} from './views/personal/orders/orders';
import {authForwardGuard} from './core/auth/auth-forward-guard';
import {AuthGuard} from './core/auth/auth-guard';

export const routes: Routes = [
  {
    path: '', component: Layout,
    children: [
      {path: '', component: Main},
      {path: 'login', component: Login, canActivate: [authForwardGuard]},
      {path: 'signup', component: Signup, canActivate: [authForwardGuard]},
      {path: 'catalog', component: Catalog},
      {path: 'product/:url', component: Detail},
      {path: 'cart', component: Cart},
      {path: 'order', component: Order},
      {path: 'favorite', component: Favorite, canActivate: [AuthGuard]},
      {path: 'orders', component: Orders, canActivate: [AuthGuard]},
      {path: 'profile', component: Info, canActivate: [AuthGuard]},
    ]
  },

];
