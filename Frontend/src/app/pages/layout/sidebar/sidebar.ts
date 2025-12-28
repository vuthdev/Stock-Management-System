import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgClass, NgOptimizedImage, AsyncPipe} from '@angular/common';
import {navData} from './nav-data';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import { MatButton, MatIconButton } from "@angular/material/button";
import { Observable } from 'rxjs';
import { Userdata } from '../../../service/userdata';

interface User {
  _id: string;
  username: string;
  email: string;
  image: string;
}

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
  baseUrl = 'http://localhost:3000';

  currentUser$: Observable<User | null> | undefined;

  constructor(private userdata: Userdata) {}

  ngOnInit(): void {
    this.userdata.loadInitialUser();
    this.currentUser$ = this.userdata.currentUser$ as Observable<User | null>;
  }

  onLogout(): void {
    this.userdata.logout();
  }
}
