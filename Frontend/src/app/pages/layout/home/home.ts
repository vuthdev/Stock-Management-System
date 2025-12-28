import {AfterViewInit, Component, OnInit} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {Productdata} from '../../../service/productdata';
import {Categorydata} from '../../../service/categorydata';
import {Userdata} from '../../../service/userdata';
import {Orderdata} from '../../../service/orderdata';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {Chart, registerables} from 'chart.js';

Chart.register(...registerables)

@Component({
  selector: 'app-home',
  imports: [
    MatIcon,
    MatProgressSpinner
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit, AfterViewInit {
  products: any = [];
  categories: any = [];
  user: any =[];
  order: any =[];
  isLoading = { products: false, category: false, user: false, order: false };
  chart: any

  constructor(
    private productService: Productdata,
    private categoryService: Categorydata,
    private userService: Userdata,
    private orderService: Orderdata
  ) {}

  ngOnInit() {
    this.getProductCount();
    this.getCategoryCount();
    this.getUserCount()
    this.getOrderCount()
  }

  ngAfterViewInit() {
    this.loadChartData();
  }

  createBarChart(labels: string[], data: number[]) {
  this.chart = new Chart('barChart', {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Orders (USD)',
          data,
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2,
          borderRadius: 6,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

  loadChartData() {
    this.orderService.getOrderMonthlyStats().subscribe((res) => {
      const labels = res.map((item) => item.month);
      const data = res.map((item) => item.total);

      this.createBarChart(labels, data);
    });
  }

  getProductCount(): void {
    this.isLoading.products = true;
    this.productService.getProductStats().subscribe((res) => {
      this.products = res;
      this.isLoading.products = false;
    })
  }

  getCategoryCount(): void {
    this.isLoading.category = true;
    this.categoryService.getCategory().subscribe((res) => {
      this.categories = res.length;
      this.isLoading.category = false;
    })
  }

  getUserCount(): void {
    this.isLoading.user = true;
    this.userService.getUser().subscribe((res) => {
      this.user = res.length;
      this.isLoading.user = false;
    })
  }

  getOrderCount(): void {
    this.isLoading.order = true;
    this.orderService.getOrders().subscribe((res) => {
      this.isLoading.order = false;
      this.order = res.length;
    })
  }
}
