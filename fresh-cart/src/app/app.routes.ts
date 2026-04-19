import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', loadComponent: () => import('./components/home/home').then(m => m.HomeComponent) },
      { path: 'products', loadComponent: () => import('./components/products/products').then(m => m.ProductsComponent) },
      { path: 'products/:id', loadComponent: () => import('./components/product-details/product-details').then(m => m.ProductDetailsComponent) },
      { path: 'categories', loadComponent: () => import('./components/categories/categories').then(m => m.CategoriesComponent) },
      { path: 'brands', loadComponent: () => import('./components/brands/brands').then(m => m.BrandsComponent) },
      { path: 'cart', loadComponent: () => import('./components/cart/cart').then(m => m.CartComponent) },
      { path: 'wishlist', loadComponent: () => import('./components/wishlist/wishlist').then(m => m.WishlistComponent) },
      { path: 'support', loadComponent: () => import('./components/support/support').then(m => m.SupportComponent) },
      { path: 'profile', loadComponent: () => import('./components/profile/profile').then(m => m.ProfileComponent) },
      { path: 'orders', loadComponent: () => import('./components/orders/orders').then(m => m.OrdersComponent) },
      { path: 'addresses', loadComponent: () => import('./components/addresses/addresses').then(m => m.AddressesComponent) },
      { path: 'settings', loadComponent: () => import('./components/settings/settings').then(m => m.SettingsComponent) },
    ]
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', loadComponent: () => import('./components/login/login').then(m => m.LoginComponent) },
      { path: 'register', loadComponent: () => import('./components/register/register').then(m => m.RegisterComponent) },
    ]
  },
  { path: '**', redirectTo: 'home' }
];

