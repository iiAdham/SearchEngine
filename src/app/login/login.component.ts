import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService, LoginRequest } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('0.3s ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  error: string | null = null;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.error = null;

      const loginRequest: LoginRequest = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      const startTime = Date.now();
      this.authService.login(loginRequest).subscribe({
        next: () => {
          const elapsedTime = Date.now() - startTime;
          const remainingTime = Math.max(0, 1000 - elapsedTime);

          setTimeout(() => {
            this.isLoading = false;
            this.toastr.success('Login successful', 'Success');
            this.router.navigate(['/Home']);
          }, remainingTime);
        },
        error: (error) => {
          const elapsedTime = Date.now() - startTime;
          const remainingTime = Math.max(0, 1000 - elapsedTime);

          setTimeout(() => {
            const errorMessage = error.error?.message || 'An error occurred during login';
            this.error = errorMessage;
            this.toastr.error(errorMessage, 'Login Error');
            this.isLoading = false;
          }, remainingTime);
        }
      });
    }
  }

  navigateToRegister(): void {
    // Add animation state before navigation
    this.router.navigate(['/register']);
  }

  ngOnInit(): void {
    // Empty implementation
  }
}
