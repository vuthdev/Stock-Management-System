import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth';
import Swal from 'sweetalert2';

// PrimeNG Imports
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    InputTextModule,
    ButtonModule,
    CheckboxModule,
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register implements OnInit {
  signupForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
        email: ['', [Validators.required, Validators.email]],
        gender: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        terms: [false, Validators.requiredTrue],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: AbstractControl): { [key: string]: boolean } | null {
    const password = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    if (!password || !confirm) {
      return null;
    }
    return password === confirm ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { username, email, password, gender } = this.signupForm.value;

    const registerData = {
      username,
      email,
      password,
      gender: gender.toLowerCase() // Convert "Male" to "male"
    };

    this.authService.register(registerData).subscribe({
      next: (response: { message: any; }) => {
        console.log('✅ Registered:', response);
        this.isLoading = false;

        Swal.fire({
          title: 'Account Created!',
          icon: 'success',
          text: response.message || 'You have successfully registered',
          background: 'rgb(17 24 39)',
          color: 'white',
          customClass: {
            popup: 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700',
            title: 'text-white',
            confirmButton: '!bg-gradient-to-r !from-green-600 !to-teal-600 !border-0',
          },
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (err) => {
        console.error('❌ Registration failed:', err);
        this.isLoading = false;

        // Handle different error types
        if (err.status === 400) {
          this.errorMessage = err.error?.error || 'Invalid registration data';
        } else if (err.status === 0) {
          this.errorMessage = 'Cannot connect to server. Please check if the backend is running.';
        } else {
          this.errorMessage = 'Registration failed. Please try again.';
        }
      },
    });
  }
}
