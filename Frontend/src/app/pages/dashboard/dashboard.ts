import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Sidebar} from '../layout/sidebar/sidebar';
import {Navbar} from '../layout/navbar/navbar';

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterOutlet,
    Sidebar,
    Navbar,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  isProductModal = false;

  toggleProductModal() {
    this.isProductModal = !this.isProductModal;
  }
}
