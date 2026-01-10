import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Categorydata } from '../../../../service/categorydata';
import Swal from 'sweetalert2';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';

interface Category {
  id?: number;
  name: string;
  description: string;
}

@Component({
  selector: 'app-addcategory',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    // PrimeNG Modules
    ButtonModule,
    InputTextModule,
    TextareaModule,
    TooltipModule,
    ProgressSpinnerModule,
    MessageModule
  ],
  templateUrl: './addcategory.html',
  styleUrls: ['./addcategory.css']
})
export class Addcategory implements OnChanges {
  @Output() close = new EventEmitter<void>();
  @Input() isEdit = false;
  @Input() categoryData: Category | null = null;

  formData: Category = { name: '', description: '' };

  isClosing = false;
  isSubmitting = false;
  formSubmitted = false;

  constructor(private categoryService: Categorydata) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['categoryData']) {
      if (this.categoryData) {
        this.formData = { ...this.categoryData };
      } else {
        this.formData = { name: '', description: '' };
      }
    }
  }

  onSubmit() {
    this.formSubmitted = true;

    // Validate form
    if (!this.formData.name?.trim() || !this.formData.description?.trim()) {
      this.showValidationError();
      return;
    }

    this.isSubmitting = true;

    // Trim whitespace
    const trimmedData = {
      ...this.formData,
      name: this.formData.name.trim(),
      description: this.formData.description.trim()
    };

    if (this.isEdit) {
      this.updateCategory(trimmedData);
    } else {
      this.addCategory(trimmedData);
    }
  }

  private updateCategory(data: Category) {
    if (!data.id) {
      console.error('Category ID is required for update');
      this.showError('Update failed', 'Category ID is missing');
      this.isSubmitting = false;
      return;
    }

    this.categoryService.updateCategory(data, data.id).subscribe({
      next: (res) => {
        console.log('Category updated:', res);
        this.categoryService.notifyUpdated();
        this.showSuccess('Category Updated', 'Category has been updated successfully.');
        this.closeModalWithDelay();
      },
      error: (err) => {
        console.error('Update error:', err);
        this.showError('Update Failed', 'Failed to update category. Please try again.');
        this.isSubmitting = false;
      }
    });
  }

  private addCategory(data: Category) {
    this.categoryService.addCategory(data).subscribe({
      next: (res) => {
        console.log('Category added:', res);
        this.categoryService.notifyUpdated();
        this.showSuccess('Category Created', 'New category has been created successfully.');
        this.closeModalWithDelay();
      },
      error: (err) => {
        console.error('Add error:', err);
        this.showError('Creation Failed', 'Failed to create category. Please try again.');
        this.isSubmitting = false;
      }
    });
  }

  private showValidationError() {
    Swal.fire({
      icon: 'warning',
      title: 'Missing Information',
      html: `
        <div class="text-left text-gray-300 space-y-3">
          <p>Please fill in all required fields:</p>
          <ul class="list-disc list-inside space-y-2">
            ${!this.formData.name ? '<li><strong>Category Name</strong> is required</li>' : ''}
            ${!this.formData.description ? '<li><strong>Description</strong> is required</li>' : ''}
          </ul>
        </div>
      `,
      background: 'rgb(38 38 38)',
      color: 'white',
      confirmButtonText: 'Got it',
      confirmButtonColor: 'rgb(99 102 241)',
      customClass: {
        confirmButton: 'swal2-confirm-btn'
      }
    });
  }

  private showSuccess(title: string, text: string) {
    Swal.fire({
      title,
      text,
      icon: 'success',
      background: 'rgb(38 38 38)',
      color: 'white',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
      showCloseButton: true
    });
  }

  private showError(title: string, text: string) {
    Swal.fire({
      title,
      text,
      icon: 'error',
      background: 'rgb(38 38 38)',
      color: 'white',
      confirmButtonText: 'Try Again',
      confirmButtonColor: 'rgb(239 68 68)'
    });
  }

  closeModal() {
    if (this.isSubmitting) return;

    this.isClosing = true;
    setTimeout(() => {
      this.close.emit();
      this.resetForm();
    }, 300);
  }

  private closeModalWithDelay() {
    this.isSubmitting = false;
    setTimeout(() => {
      this.closeModal();
    }, 1000);
  }

  private resetForm() {
    this.categoryData = { name: '', description: '' };
    this.formSubmitted = false;
    this.isClosing = false;
  }

  // Character counter method
  getCharacterCountColor(count: number): string {
    if (count === 0) return 'text-gray-500';
    if (count < 10) return 'text-yellow-400';
    if (count >= 10 && count < 50) return 'text-green-400';
    return 'text-red-400';
  }
}
