import {AfterContentInit, AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {DatePipe, formatDate} from '@angular/common';
import {Userdata} from '../../../service/userdata';
import {Adduser} from './adduser/adduser';
import {
  MatCell, MatCellDef,
  MatColumnDef,
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
  selector: 'app-users',
  imports: [
    MatIcon,
    Adduser,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    DatePipe,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatButton,
    MatPaginator,
    MatProgressSpinner
  ],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class Users implements OnInit, AfterViewInit {
  user = new MatTableDataSource<any>([]);
  isEdit = false;
  currentUser: any = {};
  isLoading: boolean = false;
  resultsLength: number = 0;
  baseUrl = 'http://localhost:3000';

  isModalOpen = false;

  constructor(private userService: Userdata) {
  }

  displayColumn: string[] = [
    'image',
    'username',
    'password',
    'email',
    'gender',
    'action'
  ]

  ngOnInit() {
    this.loadUser()

    this.userService.userUpdate$.subscribe(() => {
      this.loadUser()
    })
  }

  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.user.paginator = this.paginator;
  }

  deleteUser(id: string) {
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
      this.userService.deleteUser(id).subscribe({
        next: () => {
          Swal.fire({
            title: "Deleted!",
            text: "User has been deleted.",
            icon: "success",
            background: "rgb(38 38 38)",
            color: "white"
          });

          this.loadUser()
        },
        error: (err) => {
          console.error(err);
          Swal.fire({
            title: "Error!",
            text: "Something went wrong while deleting.",
            icon: "error",
            background: "rgb(38 38 38)",
            color: "white"
          });
        }
      });
    }
  });
  }

  loadUser() {
    this.isLoading = true;
    this.userService.getUser().subscribe({
      next: (data) => {
        this.user.data = data
        this.isLoading = false;
      },
      error: err => console.log(err)
    })
  }

  openAddModal() {
    this.isEdit = false;
    this.currentUser = {};
    this.isModalOpen = true;
  }

  openEditModal(user: any) {
    this.isEdit = true;
    this.currentUser = { ...user };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  protected readonly formatDate = formatDate;
}
