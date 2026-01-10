import { Component, OnInit, signal } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AuthService } from './service/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  isLoading = true;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Wait for auth check
    setTimeout(() => {
      this.isLoading = false;
    }, 100);
  }
}
