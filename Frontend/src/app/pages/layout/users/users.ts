import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Adduser } from './adduser/adduser';
import { Userdata } from '../../../service/userdata';
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

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  gender: string;
  role: string;
  profileImage: string | null;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Adduser,
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
  templateUrl: './users.html',
  styleUrls: ['./users.css']
})
export class Users implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  isEdit = false;
  currentUser: User | null = null;
  isLoading: boolean = false;
  searchTerm: string = '';
  isModalOpen = false;

  // Stats
  totalUsers: number = 0;
  maleUsers: number = 0;
  femaleUsers: number = 0;
  activeUsers: number = 0;

  // API URL
  baseUrl = 'http://localhost:9090/api/v1/users/';

  constructor(private userService: Userdata) {}

  ngOnInit() {
    this.loadUsers();

    this.userService.userUpdate$.subscribe(() => {
      this.loadUsers();
    });
  }

  loadUsers() {
    this.isLoading = true;
    this.userService.getUser().subscribe({
      next: (data: User[]) => {
        this.users = data;
        this.filteredUsers = [...this.users];
        this.calculateStats();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.isLoading = false;

        Swal.fire({
          title: "Error!",
          text: "Failed to load users. Please try again.",
          icon: "error",
          background: "rgb(38 38 38)",
          color: "white",
          confirmButtonText: "Retry",
          showCancelButton: true,
          cancelButtonText: "Cancel"
        }).then((result) => {
          if (result.isConfirmed) {
            this.loadUsers();
          }
        });
      }
    });
  }

  calculateStats() {
    this.totalUsers = this.users.length;
    this.maleUsers = this.users.filter(user => user.gender === 'Male').length;
    this.femaleUsers = this.users.filter(user => user.gender === 'Female').length;
    this.activeUsers = this.users.length; // Assuming all users are active
  }

  onSearch() {
    if (!this.searchTerm.trim()) {
      this.filteredUsers = [...this.users];
      return;
    }

    const searchLower = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.username.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.role?.toLowerCase().includes(searchLower) ||
      user.gender?.toLowerCase().includes(searchLower) ||
      user.id.toString().includes(searchLower)
    );
  }

  clearSearch() {
    this.searchTerm = '';
    this.filteredUsers = [...this.users];
  }

  viewUser(user: User) {
    Swal.fire({
      title: user.username,
      html: `
        <div class="text-left text-gray-300 space-y-4">
          <div class="flex justify-center mb-4">
            @if (user.profileImage) {
              <img
                [src]="baseUrl + user.id + '/profileImage'"
                alt="${user.username} profile"
                class="w-32 h-32 rounded-full object-cover border-4 border-gray-700"
                onerror="this.src='https://ui-avatars.com/api/?name=${user.username}&background=4f46e5&color=fff&size=128'"
              >
            } @else {
              <div class="w-32 h-32 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center border-4 border-gray-700">
                <span class="text-4xl font-bold text-white">
                  ${user.username?.charAt(0).toUpperCase() || '?'}
                </span>
              </div>
            }
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-400 mb-1">User ID</label>
              <div class="bg-gray-800/50 p-3 rounded-lg font-mono text-white">${user.id}</div>
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-1">Role</label>
              <div class="bg-gray-800/50 p-3 rounded-lg text-white font-bold ${user.role === 'Admin' ? 'text-red-300' : 'text-green-300'}">
                ${user.role || 'User'}
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-400 mb-1">Email</label>
              <div class="bg-gray-800/50 p-3 rounded-lg text-white">${user.email}</div>
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-1">Gender</label>
              <div class="bg-gray-800/50 p-3 rounded-lg text-white">${user.gender || 'Not specified'}</div>
            </div>
          </div>

          <div class="pt-4 border-t border-gray-700">
            <p class="text-sm text-gray-500">Account created</p>
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
    this.currentUser = null;
    this.isModalOpen = true;
  }

  openEditModal(user: User) {
    this.isEdit = true;
    this.currentUser = { ...user };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  deleteUser(id: number) {
    const user = this.users.find(u => u.id === id);
    const userName = user ? user.username : 'this user';

    Swal.fire({
      title: "Delete User?",
      html: `<div class="text-gray-300">
              <p>Are you sure you want to delete <strong class="text-white">${userName}</strong>?</p>
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
        return this.userService.deleteUser(id).toPromise()
          .catch(() => {
            Swal.showValidationMessage('Failed to delete user');
          });
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: `"${userName}" has been deleted successfully.`,
          icon: "success",
          background: "rgb(38 38 38)",
          color: "white",
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  }

  onImageError(event: any) {
    event.target.style.display = 'none';
  }
}
