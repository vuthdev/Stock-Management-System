import {AfterViewInit, Component, ElementRef, OnInit, viewChild, ViewChild} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import { formatDate, NgClass } from '@angular/common';
import {Addcategory} from './addcategory/addcategory';
import {Categorydata} from '../../../service/categorydata';
import {
  MatCell,
  MatCellDef, MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatButton} from '@angular/material/button';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categories',
  imports: [
    MatIcon,
    Addcategory,
    MatTable,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatButton,
    MatPaginator,
    MatProgressSpinner,
],
  templateUrl: './categories.html',
  styleUrl: './categories.css'
})
export class Categories implements OnInit, AfterViewInit {
  category = new MatTableDataSource<any>([]);
  isEdit = false;
  currentCategory: any = {};
  isLoading: boolean = false;
  resultsLength: number = 0;

  isModalOpen = false;

  constructor(private categoryService: Categorydata) {
  }

  displayColumns: string[] = [
    'name',
    'description',
    'action'
  ]


  ngOnInit() {
    this.loadCategories()

    this.categoryService.categoryUpdate$.subscribe(() => {
      this.loadCategories()
    })
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.category.paginator = this.paginator;
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
        this.categoryService.deleteCategory(id).subscribe({
          next: () => this.categoryService.notifyUpdated(),
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

  loadCategories() {
    this.isLoading = true;
    this.categoryService.getCategory().subscribe({
      next: (data) => {
        this.category.data = data
        this.isLoading = false;
        this.resultsLength = data.length
      },
      error: err => console.log(err)
    })
  }

  openAddModal() {
    this.isEdit = false;
    this.currentCategory = {};
    this.isModalOpen = true;
  }

  openEditModal(category: any) {
    this.isEdit = true;
    this.currentCategory = { ...category };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  protected readonly formatDate = formatDate;
}
