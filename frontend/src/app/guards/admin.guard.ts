import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificar se o usuário está logado primeiro
  if (!authService.isLoggedIn()) {
    router.navigate(['/login'], { 
      queryParams: { returnUrl: state.url } 
    });
    return false;
  }

  // Verificar se é admin
  if (authService.isAdmin()) {
    return true;
  } else {
    // Redirecionar para a página de produtos se não for admin
    router.navigate(['/products']);
    return false;
  }
};
