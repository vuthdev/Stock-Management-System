import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {navData} from '../sidebar/nav-data';
import {Addproduct} from './addproduct/addproduct';
import {Productdata} from '../../../service/productdata';
import {CurrencyPipe, formatDate} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable, MatTableDataSource
} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { MatButton } from '@angular/material/button';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product',
  imports: [
    Addproduct,
    MatIcon,
    MatProgressSpinner,
    MatTable,
    MatColumnDef,
    MatCell,
    MatHeaderCell,
    MatHeaderRow,
    MatRow,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatRowDef,
    MatPaginator,
    MatButton,
    CurrencyPipe
],
  templateUrl: './product.html',
  styleUrl: './product.css'
})
export class Product implements OnInit, AfterViewInit {
  navData = navData;
  products = new MatTableDataSource<any>([]);
  isEdit = false;
  currentProduct: any = {};
  isLoading: boolean = false;
  resultsLength = 0;

  isModalOpen = false;

  constructor(private productService: Productdata) {
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.products.paginator = this.paginator;
  }

  ngOnInit() {
    this.loadProducts();

    this.productService.productUpdate$.subscribe(() => {
      this.loadProducts();
    })
  }

  deleteProduct(id: number) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      background: "rgb(38 38 38)",
      color: "white"
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(id).subscribe({
          next: () => this.productService.notifyUpdated(),
          error: err => console.log(err)
        });
        Swal.fire({
          title: "Deleted!",
          text: "Your category has been deleted.",
          icon: "success",
          background: "rgb(38 38 38)",
          color: "white"
        });
      }
    });
  }

  loadProducts() {
    this.isLoading = true;
    this.productService.getProducts()
      .subscribe({
        next: (data) => {
          this.products.data = data
          this.isLoading = false;
          this.resultsLength = data.length;
        },
        error: err => console.log(err)
      })
  }

  displayedColumns: string[] = [
    'name',
    'description',
    'category',
    'stock',
    'price',
    'action'
  ];

  openAddModal() {
    this.isEdit = false;
    this.currentProduct = {};
    this.isModalOpen = true;
  }

  openEditModal(product: any) {
    this.isEdit = true;
    this.currentProduct = { ...product, category_id: product.category_id?._id || product.category_id };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
