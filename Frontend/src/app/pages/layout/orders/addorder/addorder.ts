import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Orderdata } from '../../../../service/orderdata';
import { Userdata } from '../../../../service/userdata';
import { Productdata } from '../../../../service/productdata';
import Swal from 'sweetalert2';

// PrimeNG Imports
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';

interface OrderItem {
  productId: number | null;
  quantity: number;
  unitPrice?: number;
  productName?: string;
  totalPrice?: number;
}

interface Order {
  id?: number;
  userId: number | null;
  items: OrderItem[];
}

interface User {
  id: number;
  username: string;
  email: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

@Component({
  selector: 'app-addorder',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CurrencyPipe,
    // PrimeNG Modules
    SelectModule,
    InputNumberModule,
    ButtonModule,
    TooltipModule,
    ProgressSpinnerModule,
    TagModule
  ],
  templateUrl: './addorder.html',
  styleUrls: ['./addorder.css']
})
export class Addorder implements OnInit, OnChanges {
  @Output() close = new EventEmitter<void>();
  @Input() isEdit = false;
  @Input() orderData: Order | null = null;

  // Internal form data
  formData: Order = {
    userId: null,
    items: [{ productId: null, quantity: 1 }]
  };

  users: User[] = [];
  products: Product[] = [];

  isClosing = false;
  isSubmitting = false;
  formSubmitted = false;

  constructor(
    private orderService: Orderdata,
    private userService: Userdata,
    private productService: Productdata
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.loadProducts();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['orderData'] && this.orderData) {
      this.formData = {
        ...this.orderData,
        items: this.orderData.items?.length > 0
          ? this.orderData.items
          : [{ productId: null, quantity: 1 }]
      };
    }
  }

  loadUsers() {
    this.userService.getUser().subscribe({
      next: (res: User[]) => {
        this.users = res;
      },
      error: (err) => {
        console.error('Error loading users:', err);
      }
    });
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (res: Product[]) => {
        this.products = res;
      },
      error: (err) => {
        console.error('Error loading products:', err);
      }
    });
  }

  addItem() {
    this.formData.items.push({ productId: null, quantity: 1 });
  }

  removeItem(index: number) {
    if (this.formData.items.length > 1) {
      this.formData.items.splice(index, 1);
    }
  }

  onProductChange(index: number) {
    const item = this.formData.items[index];
    if (item.productId) {
      const product = this.products.find(p => p.id === item.productId);
      if (product) {
        item.unitPrice = product.price;
        item.productName = product.name;
        this.calculateItemTotal(index);
      }
    }
  }

  getProduct(index: number): Product | undefined {
    const item = this.formData.items[index];
    return item.productId ? this.products.find(p => p.id === item.productId) : undefined;
  }

  getProductPrice(index: number): number {
    const product = this.getProduct(index);
    return product ? product.price : 0;
  }

  getMaxQuantity(index: number): number {
    const product = this.getProduct(index);
    return product ? product.stock : 0;
  }

  calculateItemTotal(index: number): number {
    const item = this.formData.items[index];
    const product = this.getProduct(index);

    if (product && item.quantity > 0) {
      const total = product.price * item.quantity;
      item.totalPrice = total;
      return total;
    }
    return 0;
  }

  calculateSubtotal(): number {
    return this.formData.items.reduce((sum, item) => {
      const product = this.products.find(p => p.id === item.productId);
      return product ? sum + (product.price * item.quantity) : sum;
    }, 0);
  }

  calculateTax(): number {
    return this.calculateSubtotal() * 0.10; // 10% tax
  }

  calculateTotal(): number {
    return this.calculateSubtotal() + this.calculateTax();
  }

  hasValidItems(): boolean {
    return this.formData.items.some(item =>
      item.productId !== null &&
      item.quantity > 0 &&
      item.quantity <= this.getMaxQuantity(this.formData.items.indexOf(item))
    );
  }

  validateStock(): boolean {
    for (const item of this.formData.items) {
      if (item.productId) {
        const product = this.products.find(p => p.id === item.productId);
        if (product && item.quantity > product.stock) {
          Swal.fire({
            icon: "error",
            title: "Insufficient Stock",
            text: `Not enough stock for ${product.name}. Available: ${product.stock}`,
            background: "rgb(38 38 38)",
            color: "white"
          });
          return false;
        }
      }
    }
    return true;
  }

  onSubmit() {
    this.formSubmitted = true;

    // Validate required fields
    if (!this.formData.userId || !this.hasValidItems()) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please select a customer and add valid items to the order.",
        background: "rgb(38 38 38)",
        color: "white"
      });
      return;
    }

    // Validate stock availability
    if (!this.validateStock()) {
      return;
    }

    this.isSubmitting = true;

    // Prepare payload
    const payload = {
      userId: this.formData.userId,
      items: this.formData.items
        .filter(item => item.productId !== null && item.quantity > 0)
        .map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
    };

    if (this.isEdit) {
      this.updateOrder(payload);
    } else {
      this.createOrder(payload);
    }
  }

  private createOrder(payload: any) {
    this.orderService.addOrder(payload).subscribe({
      next: (res) => {
        console.log('Order created:', res);
        this.showSuccess('Order created successfully!');
      },
      error: (err) => {
        console.error('Error creating order:', err);
        this.showError('Failed to create order. Please try again.');
      }
    });
  }

  private updateOrder(payload: any) {
    if (!this.formData.id) {
      this.showError('Update failed', 'Order ID is missing');
      return;
    }

    this.orderService.updateOrder(this.formData.id, payload).subscribe({
      next: (res) => {
        console.log('Order updated:', res);
        this.showSuccess('Order updated successfully!');
      },
      error: (err) => {
        console.error('Error updating order:', err);
        this.showError('Failed to update order. Please try again.');
      }
    });
  }

  private showSuccess(message: string) {
    Swal.fire({
      title: 'Success!',
      icon: 'success',
      text: message,
      background: "rgb(38 38 38)",
      color: "white",
      timer: 2000,
      showConfirmButton: false
    });

    this.orderService.notifyUpdated();
    this.closeModal();
  }

  private showError(title: string, text?: string) {
    Swal.fire({
      title,
      text: text || 'An error occurred. Please try again.',
      icon: 'error',
      background: "rgb(38 38 38)",
      color: "white",
      confirmButtonText: 'OK'
    });

    this.isSubmitting = false;
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
