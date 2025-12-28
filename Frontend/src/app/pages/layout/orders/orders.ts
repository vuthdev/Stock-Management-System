import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Addcategory} from '../categories/addcategory/addcategory';
import {MatIcon} from '@angular/material/icon';
import {CurrencyPipe, DatePipe, formatDate} from '@angular/common';
import {Addorder} from './addorder/addorder';
import {Orderdata} from '../../../service/orderdata';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable, MatTableDataSource
} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatButton} from '@angular/material/button';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-orders',
  imports: [
    MatIcon,
    Addorder,
    MatTable,
    MatColumnDef,
    MatCell,
    MatCellDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatPaginator,
    MatButton,
    MatProgressSpinner,
    DatePipe,
    CurrencyPipe
  ],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders implements OnInit, AfterViewInit {
  order = new MatTableDataSource<any>([]);
  isEdit = false;
  currentOrder: any = {};
  isLoading: boolean = false;
  resultsLenght: number = 0;

  isModalOpen = false;

  constructor(private orderService: Orderdata) {
  }

  displayedColumns: string[] = [
    'userId',
    'productId',
    'quantity',
    'totalPrice',
    'orderDate',
    'action'
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.loadOrders()

    this.orderService.orderUpdate$.subscribe(() => {
      this.loadOrders()
    })
  }

  ngAfterViewInit() {
    this.order.paginator = this.paginator;
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
        this.orderService.deleteOrder(id).subscribe({
          next: () => this.orderService.notifyUpdated(),
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

  loadOrders() {
    this.isLoading = true;
    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.order = data
        this.isLoading = false;
        this.resultsLenght = data.length;
      },
      error: err => console.log(err)
    })
  }

  openAddModal() {
    this.isEdit = false;
    this.currentOrder = {};
    this.isModalOpen = true;
  }

  openEditModal(order: any) {
    this.isEdit = true;
    this.currentOrder = { ...order, userId: order.userId?._id || order.userId, productId: order.productId?._id || order.productId };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
