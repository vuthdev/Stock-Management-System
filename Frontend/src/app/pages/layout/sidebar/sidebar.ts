import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgClass, NgOptimizedImage, AsyncPipe} from '@angular/common';
import {navData} from './nav-data';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import { MatButton, MatIconButton } from "@angular/material/button";
import { Observable } from 'rxjs';
import { Userdata } from '../../../service/userdata';
import { AuthService, User } from '../../../service/auth';

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink,
    MatIcon,
    RouterLinkActive,
    NgOptimizedImage,
    MatIconButton,
    AsyncPipe
],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar implements OnInit {
  navData = navData;
  currentUser$!: Observable<User | null>;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to current user from AuthService
    this.currentUser$ = this.authService.currentUser$;
  }

  onLogout(): void {
    this.authService.logout();
  }
}
