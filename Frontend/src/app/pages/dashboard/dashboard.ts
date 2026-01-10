import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { Sidebar } from '../layout/sidebar/sidebar';
import { Navbar } from '../layout/navbar/navbar';
import { ButtonDirective } from 'primeng/button';
import { AuthService } from '../../service/auth';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, Sidebar, Navbar, ButtonDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  isProductModal = false;
  currentUser: any;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  toggleProductModal() {
    this.isProductModal = !this.isProductModal;
  }

  logout() {
    this.authService.logout(); // This will redirect to /login
  }
}
