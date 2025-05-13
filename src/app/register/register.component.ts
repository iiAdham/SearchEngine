import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService, RegisterRequest } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
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
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  error: string | null = null;
  passwordStrengthClass = '';
  showPassword = false;

  // Password requirements
  requirements = [
    { text: 'At least 8 characters long', regex: /.{8,}/, met: false },
    { text: 'At least one uppercase letter', regex: /[A-Z]/, met: false },
    { text: 'At least one lowercase letter', regex: /[a-z]/, met: false },
    { text: 'At least one number', regex: /[0-9]/, met: false },
    { text: 'At least one special character (!@#$%^&*()-+~)', regex: /[!@#$%^&*()\-+~]/, met: false }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        this.passwordStrengthValidator
      ]],
      address: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(18), Validators.max(120)]]
    });

    // Monitor password changes to update strength indicator
    this.registerForm.get('password')?.valueChanges.subscribe(value => {
      this.checkPasswordStrength(value);
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  checkPasswordStrength(password: string) {
    if (!password) {
      this.passwordStrengthClass = '';
      this.requirements.forEach(req => req.met = false);
      return;
    }

    // Reset requirements
    this.requirements.forEach(req => {
      req.met = req.regex.test(password);
    });

    // Calculate strength
    const metCount = this.requirements.filter(req => req.met).length;

    // Set strength class
    if (password.length === 0) {
      this.passwordStrengthClass = '';
    } else if (metCount <= 1) {
      this.passwordStrengthClass = 'strength-weak';
    } else if (metCount <= 3) {
      this.passwordStrengthClass = 'strength-fair';
    } else if (metCount === 4) {
      this.passwordStrengthClass = 'strength-good';
    } else {
      this.passwordStrengthClass = 'strength-strong';
    }

    // For debugging - log the class being applied
    console.log('Password strength class:', this.passwordStrengthClass);
  }

  // Custom validator for password strength
  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value || '';

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasSpecial = /[!@#$%^&*()\-+~]/.test(value);

    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecial;

    if (!passwordValid) {
      return {
        passwordStrength: {
          hasUpperCase: !hasUpperCase,
          hasLowerCase: !hasLowerCase,
          hasNumeric: !hasNumeric,
          hasSpecial: !hasSpecial
        }
      };
    }

    return null;
  }

  getPasswordErrorMessage(): string {
    const passwordControl = this.registerForm.get('password');

    if (passwordControl?.errors?.['required']) {
      return 'Password is required';
    }

    if (passwordControl?.errors?.['minlength']) {
      return 'Password must be at least 8 characters long';
    }

    if (passwordControl?.errors?.['passwordStrength']) {
      const errors = passwordControl.errors['passwordStrength'];

      if (errors.hasUpperCase) {
        return 'Password must contain at least one uppercase letter';
      }

      if (errors.hasLowerCase) {
        return 'Password must contain at least one lowercase letter';
      }

      if (errors.hasNumeric) {
        return 'Password must contain at least one number';
      }

      if (errors.hasSpecial) {
        return 'Password must contain at least one special character (!@#$%^&*()-+~)';
      }
    }

    return '';
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.error = null;

      const registerRequest: RegisterRequest = {
        fullName: this.registerForm.value.fullName,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        address: this.registerForm.value.address,
        phoneNumber: this.registerForm.value.phoneNumber,
        age: this.registerForm.value.age
      };

      this.authService.register(registerRequest).subscribe({
        next: () => {
          this.toastr.success('Registration successful! Please login with your new account.', 'Success');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          const errorMessage = error.error?.message || 'An error occurred during registration';
          this.error = errorMessage;
          this.toastr.error(errorMessage, 'Registration Error');
          this.isLoading = false;
        }
      });
    }
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  // Add method to get password strength text
  getPasswordStrengthText(): string {
    switch (this.passwordStrengthClass) {
      case 'strength-weak':
        return 'Weak';
      case 'strength-fair':
        return 'Fair';
      case 'strength-good':
        return 'Good';
      case 'strength-strong':
        return 'Strong';
      default:
        return '';
    }
  }
}
