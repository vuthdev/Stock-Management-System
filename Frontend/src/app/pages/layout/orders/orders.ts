import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Addorder } from './addorder/addorder';
import { Orderdata } from '../../../service/orderdata';
import Swal from 'sweetalert2';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';

interface OrderItem {
  id?: number;
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

interface Order {
  id: number;
  userId: number;           // Add this
  userName: string;         // Add this
  orderDate: string;        // Add this
  totalAmount: number;      // Add this
  items: OrderItem[];
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CurrencyPipe,
    DatePipe,
    Addorder,
    // PrimeNG Modules
    ButtonModule,
    ProgressSpinnerModule,
    TooltipModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    TagModule
  ],
  templateUrl: './orders.html',
  styleUrls: ['./orders.css']
})
export class Orders implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  isLoading = false;
  searchTerm: string = '';
  isModalOpen = false;
  isEdit = false;
  currentOrder: Order | null = null;

  // Stats
  totalOrders: number = 0;
  todaysOrders: number = 0;
  totalRevenue: number = 0;
  averageOrderValue: number = 0;

  constructor(private orderService: Orderdata) {}

  ngOnInit() {
    this.loadOrders();

    this.orderService.orderUpdate$.subscribe(() => {
      this.loadOrders();
    });
  }

  loadOrders() {
    this.isLoading = true;

    this.orderService.getOrders().subscribe({
      next: (data: Order[]) => {
        this.orders = data;
        this.filteredOrders = [...this.orders];
        this.calculateStats();
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error loading orders:', err);

        Swal.fire({
          title: 'Error!',
          text: 'Failed to load orders. Please try again.',
          icon: 'error',
          background: 'rgb(38 38 38)',
          color: 'white',
          confirmButtonText: 'Retry',
          showCancelButton: true,
          cancelButtonText: 'Cancel'
        }).then((result) => {
          if (result.isConfirmed) {
            this.loadOrders();
          }
        });
      }
    });
  }

  calculateStats() {
    this.totalOrders = this.orders.length;
    this.totalRevenue = this.orders.reduce((sum, order) => sum + order.totalAmount, 0);
    this.averageOrderValue = this.totalOrders > 0 ? this.totalRevenue / this.totalOrders : 0;

    // Calculate today's orders
    const today = new Date().toDateString();
    this.todaysOrders = this.orders.filter(order =>
      new Date(order.orderDate).toDateString() === today
    ).length;
  }

  getTotalItems(order: Order): number {
    return order.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  onSearch() {
    if (!this.searchTerm.trim()) {
      this.filteredOrders = [...this.orders];
      return;
    }

    const searchLower = this.searchTerm.toLowerCase();
    this.filteredOrders = this.orders.filter(order =>
      order.userName.toLowerCase().includes(searchLower) ||
      order.id.toString().includes(searchLower) ||
      order.items.some(item =>
        item.productName.toLowerCase().includes(searchLower)
      )
    );
  }

  clearSearch() {
    this.searchTerm = '';
    this.filteredOrders = [...this.orders];
  }

  filterByDate(range: 'today' | 'week') {
    const now = new Date();

    if (range === 'today') {
      const today = now.toDateString();
      this.filteredOrders = this.orders.filter(order =>
        new Date(order.orderDate).toDateString() === today
      );
    } else if (range === 'week') {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      this.filteredOrders = this.orders.filter(order =>
        new Date(order.orderDate) >= oneWeekAgo
      );
    }
  }

  clearFilters() {
    this.searchTerm = '';
    this.filteredOrders = [...this.orders];
  }

  viewOrder(order: Order) {
    Swal.fire({
      title: `Order #${order.id}`,
      html: `
        <div class="text-left text-gray-300 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-400 mb-1">Customer</label>
              <div class="bg-gray-800/50 p-3 rounded-lg font-medium text-white">${order.userName}</div>
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-1">Order Date</label>
              <div class="bg-gray-800/50 p-3 rounded-lg text-white">${new Date(order.orderDate).toLocaleString()}</div>
            </div>
          </div>

          <div>
            <label class="block text-sm text-gray-400 mb-2">Order Items</label>
            <div class="space-y-2">
              ${order.items.map(item => `
                <div class="flex justify-between items-center p-3 rounded-lg bg-gray-800/30">
                  <div>
                    <p class="font-medium text-white">${item.productName}</p>
                    <p class="text-sm text-gray-400">${item.quantity} × ${item.unitPrice}</p>
                  </div>
                  <p class="font-bold text-emerald-400">${item.totalPrice}</p>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="pt-4 border-t border-gray-700">
            <div class="flex justify-between items-center">
              <span class="text-lg font-semibold text-white">Total</span>
              <span class="text-2xl font-bold text-emerald-400">${order.totalAmount}</span>
            </div>
          </div>
        </div>
      `,
      background: "rgb(38 38 38)",
      color: "white",
      confirmButtonText: "Close",
      showCloseButton: true,
      width: "600px"
    });
  }

  openAddModal() {
    this.isEdit = false;
    this.currentOrder = null;
    this.isModalOpen = true;
  }

  openEditModal(order: Order) {
    this.isEdit = true;
    this.currentOrder = { ...order };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  deleteOrder(id: number) {
    const order = this.orders.find(o => o.id === id);
    const orderNumber = order ? `Order #${order.id}` : 'this order';

    Swal.fire({
      title: "Delete Order?",
      html: `<div class="text-gray-300">
              <p>Are you sure you want to delete <strong class="text-white">${orderNumber}</strong>?</p>
              <p class="text-sm text-gray-400 mt-2">This action cannot be undone.</p>
            </div>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: "rgb(38 38 38)",
      color: "white",
      customClass: {
        confirmButton: "swal2-confirm-btn",
        cancelButton: "swal2-cancel-btn"
      },
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this.orderService.deleteOrder(id).toPromise()
          .catch(() => {
            Swal.showValidationMessage('Failed to delete order');
          });
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: `Order #${id} has been deleted successfully.`,
          icon: "success",
          background: "rgb(38 38 38)",
          color: "white",
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  }

  exportOrders() {
    Swal.fire({
      title: "Export Orders",
      text: "Export functionality would be implemented here.",
      icon: "info",
      background: "rgb(38 38 38)",
      color: "white"
    });
  }

  printOrders() {
    window.print();
  }
}
