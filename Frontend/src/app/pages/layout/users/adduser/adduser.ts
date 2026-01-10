import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Userdata } from '../../../../service/userdata';
import Swal from 'sweetalert2';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
  gender: string;
  profileImage: string | null;
}

@Component({
  selector: 'app-adduser',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    // PrimeNG Modules
    ButtonModule,
    InputTextModule,
    TooltipModule,
    ProgressSpinnerModule
  ],
  templateUrl: './adduser.html',
  styleUrls: ['./adduser.css']
})
export class Adduser implements OnChanges {
  @Output() close = new EventEmitter<void>();
  @Input() isEdit = false;
  @Input() userData: User | null = null;

  // Internal form data
  formData: User = {
    username: '',
    email: '',
    password: '',
    gender: '',
    profileImage: null
  };

  // File handling
  selectedFile: File | null = null;
  isDragging = false;
  imagePreview: string | null = null;
  baseUrl = 'http://localhost:9090/api/v1/users/';

  isClosing = false;
  isSubmitting = false;
  formSubmitted = false;

  constructor(private userService: Userdata) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['userData'] && this.userData) {
      this.formData = { ...this.userData };
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.handleFile(file);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.handleFile(file);
    }
  }

  private handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      Swal.fire({
        icon: "error",
        title: "Invalid File Type",
        text: "Please select an image file (PNG, JPG, GIF)",
        background: "rgb(38 38 38)",
        color: "white"
      });
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      Swal.fire({
        icon: "error",
        title: "File Too Large",
        text: "Image must be smaller than 5MB",
        background: "rgb(38 38 38)",
        color: "white"
      });
      return;
    }

    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  getFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  }

  removeImage() {
    this.selectedFile = null;
    this.imagePreview = null;
    this.formData.profileImage = null;
  }

  onSubmit() {
    this.formSubmitted = true;

    if (!this.formData.username || !this.formData.password ||
        !this.formData.email || !this.formData.gender) {
      this.showValidationError();
      return;
    }

    this.isSubmitting = true;

    if (this.isEdit) {
      this.updateUser();
    } else {
      this.addUser();
    }
  }

  private addUser() {
    const userData = {
      username: this.formData.username,
      email: this.formData.email,
      password: this.formData.password,
      gender: this.formData.gender
    };

    this.userService.addUser(userData).subscribe({
      next: (response: any) => {
        if (this.selectedFile && response.id) {
          this.uploadImage(response.id, false);
        } else {
          this.finishSuccess('User created successfully!');
        }
      },
      error: (err) => {
        console.error('Error creating user:', err);
        this.showError('Error', 'Failed to create user. Please try again.');
      }
    });
  }

  private updateUser() {
    const userData = {
      username: this.formData.username,
      email: this.formData.email,
      password: this.formData.password,
      gender: this.formData.gender
    };

    this.userService.updateUser(this.formData.id!, userData).subscribe({
      next: (response: any) => {
        if (this.selectedFile) {
          this.uploadImage(this.formData.id!, true);
        } else {
          this.finishSuccess('User updated successfully!');
        }
      },
      error: (err) => {
        console.error('Error updating user:', err);
        this.showError('Error', 'Failed to update user. Please try again.');
      }
    });
  }

  private uploadImage(userId: number, isUpdate: boolean) {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.userService.uploadImageFile(userId, formData).subscribe({
      next: (response) => {
        const message = isUpdate
          ? 'User updated with new profile image!'
          : 'User created with profile image!';
        this.finishSuccess(message);
      },
      error: (err) => {
        console.error('Error uploading image:', err);
        Swal.fire({
          icon: "warning",
          title: "Partial Success",
          text: "User saved, but image upload failed.",
          background: "rgb(38 38 38)",
          color: "white"
        });
        this.closeModalWithNotification();
      }
    });
  }

  private showValidationError() {
    Swal.fire({
      icon: 'warning',
      title: 'Missing Information',
      html: `<div class="text-left text-gray-300">
              <p>Please fill in all required fields.</p>
            </div>`,
      background: 'rgb(38 38 38)',
      color: 'white',
      confirmButtonText: 'Got it',
      confirmButtonColor: 'rgb(99 102 241)'
    });
    this.isSubmitting = false;
  }

  private showError(title: string, text: string) {
    Swal.fire({
      title,
      text,
      icon: 'error',
      background: 'rgb(38 38 38)',
      color: 'white',
      confirmButtonText: 'Try Again'
    });
    this.isSubmitting = false;
  }

  private finishSuccess(message: string) {
    Swal.fire({
      title: 'Success!',
      icon: 'success',
      text: message,
      background: "rgb(38 38 38)",
      color: "white",
      timer: 2000,
      showConfirmButton: false
    });
    this.closeModalWithNotification();
  }

  private closeModalWithNotification() {
    this.userService.notifyUpdated();
    this.closeModal();
  }

  closeModal() {
    if (this.isSubmitting) return;
    this.isClosing = true;
    setTimeout(() => {
      this.isClosing = false;
      this.close.emit();
    }, 300);
  }
}
