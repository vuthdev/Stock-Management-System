import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Addcategory } from './addcategory/addcategory';
import { Categorydata } from '../../../service/categorydata';
import Swal from 'sweetalert2';

// PrimeNG Imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

interface Category {
  id: number;
  name: string;
  description: string;
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Addcategory,
    // PrimeNG Modules
    TableModule,
    ButtonModule,
    ProgressSpinnerModule,
    TooltipModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule
  ],
  templateUrl: './categories.html',
  styleUrls: ['./categories.css']
})
export class Categories implements OnInit {
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  isEdit = false;
  currentCategory: Category | null = null;
  isLoading: boolean = false;
  resultsLength: number = 0;
  recentCount: number = 0;
  activeCount: number = 0;
  isModalOpen = false;
  searchTerm: string = '';

  constructor(private categoryService: Categorydata) {}

  ngOnInit() {
    this.loadCategories();

    this.categoryService.categoryUpdate$.subscribe(() => {
      this.loadCategories();
    });
  }

  loadCategories() {
    this.isLoading = true;
    this.categoryService.getCategory().subscribe({
      next: (data: Category[]) => {
        // Sort by ID to show newest first
        this.categories = data.sort((a, b) => b.id - a.id);
        this.filteredCategories = [...this.categories];
        this.resultsLength = data.length;

        // Calculate stats
        this.calculateStats();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.isLoading = false;

        // Show error message
        Swal.fire({
          title: "Error!",
          text: "Failed to load categories. Please try again.",
          icon: "error",
          background: "rgb(38 38 38)",
          color: "white",
          confirmButtonText: "Retry",
          showCancelButton: true,
          cancelButtonText: "Cancel"
        }).then((result) => {
          if (result.isConfirmed) {
            this.loadCategories();
          }
        });
      }
    });
  }

  calculateStats() {
    // Calculate recent categories (last 30 days for demo)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    this.recentCount = this.categories.length; // For demo, show all as recent

    // For now, all categories are considered active
    this.activeCount = this.categories.length;
  }

  onSearch() {
    if (!this.searchTerm.trim()) {
      this.filteredCategories = [...this.categories];
      return;
    }

    const searchLower = this.searchTerm.toLowerCase();
    this.filteredCategories = this.categories.filter(category =>
      category.name.toLowerCase().includes(searchLower) ||
      category.description.toLowerCase().includes(searchLower) ||
      category.id.toString().includes(searchLower)
    );
  }

  clearSearch() {
    this.searchTerm = '';
    this.filteredCategories = [...this.categories];
  }

  deleteProduct(id: number) {
    // Find category name for better confirmation message
    const category = this.categories.find(c => c.id === id);
    const categoryName = category ? category.name : 'this category';

    Swal.fire({
      title: "Delete Category?",
      html: `<div class="text-gray-300">
              <p>Are you sure you want to delete <strong class="text-white">${categoryName}</strong>?</p>
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
        return this.categoryService.deleteCategory(id).toPromise()
          .catch(() => {
            Swal.showValidationMessage('Failed to delete category');
          });
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: `"${categoryName}" has been deleted successfully.`,
          icon: "success",
          background: "rgb(38 38 38)",
          color: "white",
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  }

  viewCategory(category: Category) {
    Swal.fire({
      title: category.name,
      html: `
        <div class="text-left text-gray-300 space-y-4">
          <div>
            <label class="block text-sm text-gray-400 mb-1">Category ID</label>
            <div class="bg-gray-800/50 p-3 rounded-lg font-mono text-white">${category.id}</div>
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-1">Description</label>
            <div class="bg-gray-800/50 p-3 rounded-lg text-white">${category.description || 'No description provided'}</div>
          </div>
          <div class="pt-4 border-t border-gray-700">
            <p class="text-sm text-gray-500">Created with ID: ${category.id}</p>
          </div>
        </div>
      `,
      background: "rgb(38 38 38)",
      color: "white",
      confirmButtonText: "Close",
      showCloseButton: true,
      width: "500px"
    });
  }

  openAddModal() {
    this.isEdit = false;
    this.currentCategory = null;
    this.isModalOpen = true;
  }

  openEditModal(category: Category) {
    this.isEdit = true;
    this.currentCategory = { ...category };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  // Utility functions
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
