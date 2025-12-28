import { Component } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatAnchor } from "@angular/material/button";
import { Router, RouterLink } from "@angular/router";
import { FormBuilder, FormGroup, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Userdata } from '../../service/userdata';
import { MatRadioButton, MatRadioGroup } from "@angular/material/radio";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  imports: [MatFormField, MatLabel, MatIcon, MatInput, MatAnchor, RouterLink, ɵInternalFormsSharedModule, ReactiveFormsModule, MatRadioButton, MatRadioGroup],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  signupForm!: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private userdata: Userdata,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group(
      {
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        gender: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: Register.passwordMatchValidator }
    );
  }

  static passwordMatchValidator(form: AbstractControl): { [key: string]: boolean } | null {
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

    const formValue = this.signupForm.value;

    this.userdata.addUser(formValue).subscribe({
      next: (res) => {
        console.log('✅ Registered:', res);
        this.isLoading = false;
        Swal.fire({
          title: 'Successfully registerd',
          icon: 'success',
          text: 'You have successfully registered',
          background: "rgb(38 38 38)",
          color: "white"
        })
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('❌ Registration failed:', err);
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Registration failed';
      },
    });
  }
}
