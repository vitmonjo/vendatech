import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Products } from './pages/products/products';
import { ProductDetail } from './pages/product-detail/product-detail';
import { MyProducts } from './pages/my-products/my-products';
import { ProductForm } from './pages/product-form/product-form';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Cart } from './pages/cart/cart';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'products', component: Products },
  { path: 'products/:id', component: ProductDetail },
  { path: 'my-products', component: MyProducts },
  { path: 'my-products/new', component: ProductForm },
  { path: 'my-products/edit/:id', component: ProductForm },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'cart', component: Cart },
  { path: '**', redirectTo: '' }, // Rota curinga para redirecionar para a home
];
