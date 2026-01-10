import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Addproduct } from './addproduct/addproduct';
import { Productdata } from '../../../service/productdata';
import Swal from 'sweetalert2';

// PrimeNG Imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';

interface Products {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  categoryName: string;
  stock: number;
  price: number;
}

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CurrencyPipe,
    Addproduct,
    // PrimeNG Modules
    TableModule,
    ButtonModule,
    ProgressSpinnerModule,
    TooltipModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    TagModule
  ],
  templateUrl: './product.html',
  styleUrls: ['./product.css']
})
export class Product implements OnInit {
  products: Products[] = [];
  filteredProducts: Products[] = [];
  isEdit = false;
  currentProduct: Products | null = null;
  isLoading: boolean = false;
  resultsLength: number = 0;
  searchTerm: string = '';
  isModalOpen = false;

  // Stats
  totalStock: number = 0;
  totalValue: number = 0;
  outOfStockCount: number = 0;

  constructor(private productService: Productdata) {}

  ngOnInit() {
    this.loadProducts();

    this.productService.productUpdate$.subscribe(() => {
      this.loadProducts();
    });
  }

  loadProducts() {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (data: Products[]) => {
        this.products = data;
        this.filteredProducts = [...this.products];
        this.resultsLength = data.length;
        this.calculateStats();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.isLoading = false;

        Swal.fire({
          title: "Error!",
          text: "Failed to load products. Please try again.",
          icon: "error",
          background: "rgb(38 38 38)",
          color: "white",
          confirmButtonText: "Retry",
          showCancelButton: true,
          cancelButtonText: "Cancel"
        }).then((result) => {
          if (result.isConfirmed) {
            this.loadProducts();
          }
        });
      }
    });
  }

  calculateStats() {
    this.totalStock = this.products.reduce((sum, product) => sum + product.stock, 0);
    this.totalValue = this.products.reduce((sum, product) => sum + (product.price * product.stock), 0);
    this.outOfStockCount = this.products.filter(product => product.stock === 0).length;
  }

  onSearch() {
    if (!this.searchTerm.trim()) {
      this.filteredProducts = [...this.products];
      return;
    }

    const searchLower = this.searchTerm.toLowerCase();
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(searchLower) ||
      product.categoryName.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower) ||
      product.id.toString().includes(searchLower)
    );
  }

  clearSearch() {
    this.searchTerm = '';
    this.filteredProducts = [...this.products];
  }

  deleteProduct(id: number) {
    const product = this.products.find(p => p.id === id);
    const productName = product ? product.name : 'this product';

    Swal.fire({
      title: "Delete Product?",
      html: `<div class="text-gray-300">
              <p>Are you sure you want to delete <strong class="text-white">${productName}</strong>?</p>
              <p class="text-sm text-gray-400 mt-2">This action cannot be undone and will remove all product data.</p>
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
        return this.productService.deleteProduct(id).toPromise()
          .catch(() => {
            Swal.showValidationMessage('Failed to delete product');
          });
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: `"${productName}" has been deleted successfully.`,
          icon: "success",
          background: "rgb(38 38 38)",
          color: "white",
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  }

  viewProduct(product: Products) {
    Swal.fire({
      title: product.name,
      html: `
        <div class="text-left text-gray-300 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-400 mb-1">Product ID</label>
              <div class="bg-gray-800/50 p-3 rounded-lg font-mono text-white">${product.id}</div>
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-1">Category</label>
              <div class="bg-gray-800/50 p-3 rounded-lg text-white">${product.categoryName}</div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-400 mb-1">Stock</label>
              <div class="bg-gray-800/50 p-3 rounded-lg text-white font-bold ${product.stock === 0 ? 'text-red-300' : product.stock <= 10 ? 'text-yellow-300' : 'text-green-300'}">
                ${product.stock} units
              </div>
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-1">Price</label>
              <div class="bg-gray-800/50 p-3 rounded-lg text-white font-bold text-lg">${product.price }</div>
            </div>s
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-1">Description</label>
            <div class="bg-gray-800/50 p-3 rounded-lg text-white">${product.description || 'No description provided'}</div>
          </div>
          <div class="pt-4 border-t border-gray-700">
            <p class="text-sm text-gray-500">Product ID: ${product.id} | Category ID: ${product.categoryId}</p>
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
    this.currentProduct = null;
    this.isModalOpen = true;
  }

  openEditModal(product: Products) {
    this.isEdit = true;
    this.currentProduct = { ...product };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  exportData() {
    Swal.fire({
      title: "Export Data",
      text: "Export functionality would be implemented here.",
      icon: "info",
      background: "rgb(38 38 38)",
      color: "white"
    });
  }

  printTable() {
    window.print();
  }
}
