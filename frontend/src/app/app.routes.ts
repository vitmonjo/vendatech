import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Products } from './pages/products/products';
import { ProductDetail } from './pages/product-detail/product-detail';
import { MyProducts } from './pages/my-products/my-products';
import { ProductForm } from './pages/product-form/product-form';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Cart } from './pages/cart/cart';
import { Admin } from './pages/admin/admin';
import { Profile } from './pages/profile/profile';
import { Payment } from './pages/payment/payment';
import { PaymentSuccess } from './pages/payment-success/payment-success';
import { OrderHistory } from './pages/order-history/order-history';
import { adminGuard } from './guards/admin.guard';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'products', component: Products },
  { path: 'products/:id', component: ProductDetail },
  { path: 'my-products', component: MyProducts },
  { path: 'my-products/new', component: ProductForm },
  { path: 'my-products/edit/:id', component: ProductForm },
  { path: 'admin', component: Admin, canActivate: [adminGuard] },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'cart', component: Cart, canActivate: [authGuard] },
  { path: 'payment', component: Payment, canActivate: [authGuard] },
  { path: 'payment-success', component: PaymentSuccess, canActivate: [authGuard] },
  { path: 'orders', component: OrderHistory, canActivate: [authGuard] },
  { path: 'profile', component: Profile },
  { path: '**', redirectTo: '' }, // Rota curinga para redirecionar para a home
];
