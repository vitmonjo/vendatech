import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService, User } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  currentUser$!: Observable<User | null>;
  isEditing = false;

  profileForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    currentPassword: [''],
    newPassword: [''],
    confirmPassword: [''],
  });

  ngOnInit(): void {
    this.currentUser$ = this.authService.getCurrentUser();
    
    // Carregar dados do usuário no formulário
    this.currentUser$.subscribe(user => {
      if (user) {
        this.profileForm.patchValue({
          name: user.name,
          email: user.email
        });
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      // Reset form se cancelar edição
      this.currentUser$.subscribe(user => {
        if (user) {
          this.profileForm.patchValue({
            name: user.name,
            email: user.email,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
        }
      });
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      const formData = this.profileForm.value;
      
      // Validação de senha se fornecida
      if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
        this.snackBar.open('As senhas não coincidem', 'Fechar', { duration: 3000 });
        return;
      }

      // Preparar dados para envio (remover campos vazios)
      const profileData: any = {
        name: formData.name,
        email: formData.email
      };

      // Adicionar senha apenas se fornecida
      if (formData.newPassword) {
        profileData.password = formData.newPassword;
        profileData.currentPassword = formData.currentPassword;
      }

      this.authService.updateProfile(profileData).subscribe({
        next: (response) => {
          this.snackBar.open('Perfil atualizado com sucesso!', 'Fechar', { duration: 3000 });
          this.isEditing = false;
        },
        error: (error) => {
          console.error('Erro ao atualizar perfil:', error);
          this.snackBar.open('Erro ao atualizar perfil. Tente novamente.', 'Fechar', { duration: 3000 });
        }
      });
    }
  }

  changePassword(): void {
    const formData = this.profileForm.value;
    
    if (!formData.currentPassword || !formData.newPassword) {
      this.snackBar.open('Preencha todos os campos de senha', 'Fechar', { duration: 3000 });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      this.snackBar.open('As senhas não coincidem', 'Fechar', { duration: 3000 });
      return;
    }

    // Aqui você implementaria a chamada para alterar senha
    this.snackBar.open('Senha alterada com sucesso!', 'Fechar', { duration: 3000 });
    this.profileForm.patchValue({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  }
}
