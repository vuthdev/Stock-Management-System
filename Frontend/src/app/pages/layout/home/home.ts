import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Productdata } from '../../../service/productdata';
import { Categorydata } from '../../../service/categorydata';
import { Userdata } from '../../../service/userdata';
import { Orderdata } from '../../../service/orderdata';

// PrimeNG v21 Imports - IMPORTANT: SelectModule instead of DropdownModule
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { SelectModule } from 'primeng/select'; // CHANGED: SelectModule
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext'; // Added for search input

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CurrencyPipe,
    // PrimeNG Modules
    ProgressSpinnerModule,
    ButtonModule,
    TooltipModule,
    SelectModule,      // CHANGED: SelectModule
    ChartModule,
    TableModule,
    TagModule,
    InputTextModule    // Added for search input
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  // Stats
  products: number = 0;
  categories: number = 0;
  user: number = 0;
  order: number = 0;

  // Growth metrics
  productGrowth: number = 12;
  userGrowth: number = 8;
  orderGrowth: number = 24;
  totalRevenue: number = 15420;
  lowStockCount: number = 7;
  adminCount: number = 3;
  conversionRate: number = 4.2;
  averageOrderValue: number = 125.50;
  newCustomers: number = 18;

  isLoading = { products: false, category: false, user: false, order: false };

  // Chart Data
  revenueChartData: any;
  chartOptions: any;
  selectedRange: any = { label: 'Last 30 days', value: '30' };

  // Chart ranges array - IMPORTANT: Must match p-select structure
  chartRanges = [
    { label: 'Last 7 days', value: '7' },
    { label: 'Last 30 days', value: '30' },
    { label: 'Last 90 days', value: '90' },
    { label: 'This year', value: '365' }
  ];

  // Top Products (mock data)
  topProducts = [
    { id: 1, name: 'iPhone 15 Pro', sold: 142, revenue: 28400, growth: 15 },
    { id: 2, name: 'MacBook Air M2', sold: 89, revenue: 97900, growth: 22 },
    { id: 3, name: 'AirPods Pro', sold: 156, revenue: 39000, growth: 8 },
    { id: 4, name: 'iPad Pro', sold: 67, revenue: 80400, growth: 18 },
    { id: 5, name: 'Apple Watch', sold: 124, revenue: 49600, growth: 12 }
  ];

  // Recent Orders (mock data)
  recentOrders = [
    { id: 1001, customer: 'John Smith', amount: 1299.99, status: 'Completed', date: '2 min ago' },
    { id: 1002, customer: 'Emma Wilson', amount: 899.50, status: 'Processing', date: '15 min ago' },
    { id: 1003, customer: 'Robert Brown', amount: 2499.99, status: 'Completed', date: '1 hour ago' },
    { id: 1004, customer: 'Sarah Johnson', amount: 599.99, status: 'Pending', date: '3 hours ago' },
    { id: 1005, customer: 'Michael Davis', amount: 1799.99, status: 'Completed', date: '5 hours ago' }
  ];

  constructor(
    private productService: Productdata,
    private categoryService: Categorydata,
    private userService: Userdata,
    private orderService: Orderdata
  ) {}

  ngOnInit() {
    this.getProductCount();
    this.getCategoryCount();
    this.getUserCount();
    this.getOrderCount();
    this.initChart();

    // Log to verify p-select is working
    console.log('Chart ranges:', this.chartRanges);
    console.log('Selected range:', this.selectedRange);
  }

  initChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    // Mock revenue data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenueData = [65000, 59000, 80000, 81000, 56000, 55000, 40000, 72000, 88000, 92000, 105000, 98000];

    // Filter data based on selected range
    const rangeValue = this.selectedRange?.value || '30';
    const monthsToShow = this.getMonthsForRange(rangeValue, months);
    const dataToShow = this.getDataForRange(rangeValue, revenueData);

    this.revenueChartData = {
      labels: monthsToShow,
      datasets: [
        {
          label: 'Revenue',
          data: dataToShow,
          fill: true,
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          borderWidth: 2
        }
      ]
    };

    this.chartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: 'white',
            font: {
              size: 14
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(30, 41, 59, 0.9)',
          titleColor: '#f8fafc',
          bodyColor: '#cbd5e1',
          borderColor: '#475569',
          borderWidth: 1
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              color: 'white',
              size: 12
            }
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary,
            font: {
              color: 'white',
              size: 12
            },
            callback: function(value: any) {
              return '$' + (value / 1000) + 'k';
            }
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          },
          beginAtZero: true
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      },
      animations: {
        tension: {
          duration: 1000,
          easing: 'linear'
        }
      }
    };
  }

  getMonthsForRange(range: string, months: string[]): string[] {
    const rangeMap: {[key: string]: number} = {
      '7': 7,
      '30': 6,
      '90': 9,
      '365': 12
    };
    const count = rangeMap[range] || 6;
    return months.slice(0, count);
  }

  getDataForRange(range: string, data: number[]): number[] {
    const rangeMap: {[key: string]: number} = {
      '7': 7,
      '30': 6,
      '90': 9,
      '365': 12
    };
    const count = rangeMap[range] || 6;
    return data.slice(0, count);
  }

  getStatusSeverity(status: string) {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'Processing':
        return 'info';
      case 'Pending':
        return 'warn';
      default:
        return 'secondary';
    }
  }

  getProductCount(): void {
    this.isLoading.products = true;
    this.productService.getProducts().subscribe((res) => {
      this.products = res.length;
      this.isLoading.products = false;
    }, (error) => {
      console.error('Error loading products:', error);
      this.isLoading.products = false;
    });
  }

  getCategoryCount(): void {
    this.isLoading.category = true;
    this.categoryService.getCategory().subscribe((res) => {
      this.categories = res.length;
      this.isLoading.category = false;
    }, (error) => {
      console.error('Error loading categories:', error);
      this.isLoading.category = false;
    });
  }

  getUserCount(): void {
    this.isLoading.user = true;
    this.userService.getUser().subscribe((res) => {
      this.user = res.length;
      this.isLoading.user = false;
    }, (error) => {
      console.error('Error loading users:', error);
      this.isLoading.user = false;
    });
  }

  getOrderCount(): void {
    this.isLoading.order = true;
    this.orderService.getOrders().subscribe((res) => {
      this.order = res.length;
      this.isLoading.order = false;
    }, (error) => {
      console.error('Error loading orders:', error);
      this.isLoading.order = false;
    });
  }

  // Method to handle chart range change
  onRangeChange() {
    console.log('Range changed to:', this.selectedRange);
    this.initChart(); // Re-initialize chart with new range
  }
}
