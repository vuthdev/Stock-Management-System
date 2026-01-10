import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Productdata } from '../../../../service/productdata';
import { Categorydata } from '../../../../service/categorydata';
import Swal from 'sweetalert2';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { TagModule } from 'primeng/tag';
import { Select, SelectModule } from 'primeng/select';

interface Product {
  id?: number;
  name: string;
  description: string;
  categoryId: number | null;
  stock: number | null;
  price: number | null;
}

interface Category {
  id: number;
  name: string;
}

@Component({
  selector: 'app-addproduct',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CurrencyPipe,
    // PrimeNG Modules
    ButtonModule,
    InputTextModule,
    Textarea,
    InputNumberModule,
    SelectModule,
    TooltipModule,
    ProgressSpinnerModule,
    MessageModule,
    TagModule,
  ],
  templateUrl: './addproduct.html',
  styleUrls: ['./addproduct.css'],
})
export class Addproduct implements OnInit, OnChanges {
  @Output() close = new EventEmitter<void>();
  @Input() isEdit = false;
  @Input() productData: Product | null = null;

  // Internal form data
  formData: Product = {
    name: '',
    description: '',
    categoryId: null,
    stock: null,
    price: null,
  };

  categories: any[] = [];

  isClosing = false;
  isSubmitting = false;
  formSubmitted = false;

  constructor(private productService: Productdata, private categoryService: Categorydata) {}

  ngOnInit() {
    this.loadCategories();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['productData'] && this.productData) {
      this.formData = {
        ...this.productData,
        stock: this.productData.stock ?? null,
        price: this.productData.price ?? null,
        categoryId: this.productData.categoryId ?? null,
      };
    }
  }

  loadCategories() {
    this.categoryService.getCategory().subscribe({
      next: (res: Category[]) => {
        this.categories = res;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.categories = []; // Ensure it's always an array
      },
    });
  }

  getCategoryName(categoryId: number): string | null {
    if (!this.categories || this.categories.length === 0) return null;
    const category = this.categories.find((c) => c.id === categoryId);
    return category ? category.name : null;
  }

  onSubmit() {
    this.formSubmitted = true;

    // Validate form
    if (
      !this.formData.name?.trim() ||
      !this.formData.description?.trim() ||
      !this.formData.categoryId ||
      this.formData.stock === null ||
      this.formData.stock === undefined ||
      this.formData.stock < 0 ||
      !this.formData.price ||
      this.formData.price <= 0
    ) {
      this.showValidationError();
      return;
    }

    this.isSubmitting = true;

    // Prepare data
    const productData = {
      ...this.formData,
      categoryId:
        typeof this.formData.categoryId === 'object'
          ? (this.formData.categoryId as any).id
          : this.formData.categoryId,
      name: this.formData.name.trim(),
      description: this.formData.description.trim(),
      stock: Number(this.formData.stock),
      price: Number(this.formData.price),
    };

    if (this.isEdit) {
      this.updateProduct(productData);
    } else {
      this.addProduct(productData);
    }
  }

  private updateProduct(data: Product) {
    if (!data.id) {
      this.showError('Update failed', 'Product ID is missing');
      this.isSubmitting = false;
      return;
    }

    this.productService.updateProduct(data.id, data).subscribe({
      next: (res) => {
        console.log('Product updated:', res);
        this.productService.notifyUpdated();
        this.showSuccess('Product Updated', 'Product has been updated successfully.');
        this.closeModalWithDelay();
      },
      error: (err) => {
        console.error('Update error:', err);
        this.showError('Update Failed', 'Failed to update product. Please try again.');
        this.isSubmitting = false;
      },
    });
  }

  private addProduct(data: Product) {
    // Remove id for new products
    const { id, ...productWithoutId } = data;

    this.productService.addProduct(productWithoutId).subscribe({
      next: (res) => {
        console.log('Product added:', res);
        this.productService.notifyUpdated();
        this.showSuccess('Product Created', 'New product has been added successfully.');
        this.closeModalWithDelay();
      },
      error: (err) => {
        console.error('Add error:', err);
        this.showError('Creation Failed', 'Failed to create product. Please try again.');
        this.isSubmitting = false;
      },
    });
  }

  private showValidationError() {
    const missingFields = [];
    if (!this.formData.name?.trim()) missingFields.push('Product Name');
    if (!this.formData.categoryId) missingFields.push('Category');
    if (
      this.formData.stock === null ||
      this.formData.stock === undefined ||
      this.formData.stock < 0
    )
      missingFields.push('Valid Stock');
    if (!this.formData.price || this.formData.price <= 0) missingFields.push('Valid Price');
    if (!this.formData.description?.trim()) missingFields.push('Description');

    Swal.fire({
      icon: 'warning',
      title: 'Missing Information',
      html: `
        <div class="text-left text-gray-300 space-y-3">
          <p>Please fill in all required fields:</p>
          <ul class="list-disc list-inside space-y-2">
            ${missingFields
              .map((field) => `<li><strong>${field}</strong> is required</li>`)
              .join('')}
          </ul>
        </div>
      `,
      background: 'rgb(38 38 38)',
      color: 'white',
      confirmButtonText: 'Got it',
      confirmButtonColor: 'rgb(99 102 241)',
      customClass: {
        confirmButton: 'swal2-confirm-btn',
      },
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
      showCloseButton: true,
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
      confirmButtonColor: 'rgb(239 68 68)',
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
    this.formData = {
      name: '',
      description: '',
      categoryId: null,
      stock: null,
      price: null,
    };
    this.formSubmitted = false;
    this.isClosing = false;
  }
}
