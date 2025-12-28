import { Component } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { MatFormField, MatLabel, MatError } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatAnchor } from "@angular/material/button";
import { Router, RouterLink } from "@angular/router";
import { FormGroup, FormBuilder, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';
import { Userdata } from '../../service/userdata';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  imports: [MatIcon, MatFormField, MatLabel, MatInput, MatAnchor, RouterLink, MatError, ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private userdata: Userdata,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
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

    const { username, password } = this.loginForm.value;

    this.userdata.getUser().subscribe({
      next: (users: any[]) => {

        const matchedUser = users.find(
          (user) => user.username === username && String(user.password) === password
        );

        this.isLoading = false;

        if (matchedUser) {
          Swal.fire({
            title: 'Welcome back!',
            icon: 'success',
            text: 'You have successfully login',
            background: "rgb(38 38 38)",
            color: "white"
          })

          this.userdata.setCurrentUser(matchedUser);
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'Invalid username or password.';
        }
      },
      error: (err) => {
        console.error('❌ Login failed: Error fetching user data.', err);
        this.isLoading = false;
        this.errorMessage = 'Could not connect to the user data service.';
      },
    });
  }
}
