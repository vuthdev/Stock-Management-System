import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

// PrimeNG Imports
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { AuthService } from '../../service/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    InputTextModule,
    ButtonModule,
    CheckboxModule,
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }

    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      remember: [false],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.errorMessage = 'Please enter both username and password.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { username, password, remember } = this.loginForm.value;

    this.authService.login({ username, password, remember }).subscribe({
      next: (response) => {
        console.log('✅ Login successful:', response);
        this.isLoading = false;

        Swal.fire({
          title: 'Welcome back!',
          icon: 'success',
          text: `Logged in as ${response.username}`,
          background: 'rgb(17 24 39)',
          color: 'white',
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            popup: 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700',
            title: 'text-white',
          },
        }).then(() => {
          this.router.navigate(['/dashboard']);
        });
      },
      error: (err) => {
        console.error('❌ Login failed:', err);
        this.isLoading = false;

        if (err.status === 401) {
          this.errorMessage = 'Invalid username or password.';
        } else if (err.status === 0) {
          this.errorMessage = 'Cannot connect to server. Please check if the backend is running.';
        } else {
          this.errorMessage = 'Login failed. Please try again.';
        }
      },
    });
  }
}
