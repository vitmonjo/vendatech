import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService, LoginRequest } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  isLoading = false;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      const credentials: LoginRequest = {
        email: this.loginForm.value.email!,
        password: this.loginForm.value.password!
      };

      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.snackBar.open('Login realizado com sucesso!', 'Fechar', { duration: 3000 });
          
          // Redirecionar baseado no tipo de usuário
          if (response.data.user.isAdmin) {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/products']);
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Erro de login:', error);
          this.snackBar.open(
            error.error?.message || 'E-mail ou senha inválidos.',
            'Fechar',
            { duration: 5000 }
          );
        }
      });
    }
  }
}
