import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../model/loginRequest';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { NgIf, CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { IconsModule } from '../../icons/icons.module';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    NgIf,
    CommonModule,
    IconsModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginError: string = "";
  loginForm = this.formBuilder.group({
    username: ['', [Validators.required]],
    password: ['', Validators.required],
  });

  hidePassword = true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.registerCustomIcons();
  }

  ngOnInit(): void {
    if (this.authService.currentUserLoginOn.value) {
      this.router.navigate(['home']);
    }
  }

  private registerCustomIcons() {
    this.matIconRegistry.addSvgIcon(
      'google',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../assets/icons/google.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'microsoft',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../assets/icons/microsoft.svg')
    );
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  login() {
    if (this.loginForm.valid) {
      this.loginError = "";
      this.authService.login(this.loginForm.value as LoginRequest).subscribe({
        next: () => {
          this.router.navigate(['/home']);
          this.loginForm.reset();
        },
        error: (errorData) => {
          console.error('Error al iniciar sesión:', errorData);
          this.loginError = errorData.message;
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
      alert("Error al ingresar los datos.");
    }
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}