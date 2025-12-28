import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import {Productdata} from '../../../../service/productdata';
import {Categorydata} from '../../../../service/categorydata';
import {MatFormField} from '@angular/material/form-field';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton, MatIconButton} from '@angular/material/button';
import {NgClass} from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-addproduct',
  imports: [
    MatIcon,
    FormsModule,
    MatFormField,
    MatSelect,
    MatLabel,
    MatOption,
    MatInput,
    MatButton,
    NgClass,
    MatIconButton,
  ],
  templateUrl: './addproduct.html',
  styleUrl: './addproduct.css'
})
export class Addproduct implements OnInit {
  @Output() close = new EventEmitter();
  @Input() isEdit = false;
  @Input() productData: any = {}
  categories: any = []

  isClosing = false;

  constructor(private productService: Productdata, private categoryService: Categorydata) {
  }

  ngOnInit() {
    this.getCategoryData()
  }

  onSubmit() {
    if (!this.productData.name || !this.productData.stock || !this.productData.price || !this.productData.description || !this.productData.category_id) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Please fill all fields`,
        background: "rgb(38 38 38)",
        color: "white"
      });
      return
    }

    if (this.isEdit) {
      this.productService.updateProduct(this.productData._id, this.productData).subscribe({
        next: (res) => {
          console.log("Product updated: ", res);
          this.productService.notifyUpdated();
          this.close.emit();
          Swal.fire({
            title: 'Successfully updated',
            icon: 'success',
            text: 'You have successfully updated a product.',
            background: "rgb(38 38 38)",
            color: "white"
          })
        },
        error: err => console.log(err)
      })
    } else {
      this.productService.addProduct(this.productData).subscribe({
        next: (res) => {
          console.log("Product added: ", res);
          this.productService.notifyUpdated();
          this.close.emit();
          Swal.fire({
            title: 'Successfully added',
            icon: 'success',
            text: 'You have successfully added a product.',
            background: "rgb(38 38 38)",
            color: "white",
          })
        },
        error: (err) => {
          console.log(err);
        }
      })
    }
  }

  getCategoryData() {
    this.categoryService.getCategory().subscribe({
      next: (res) => {
        this.categories = res;
      }
    })
  }

  closeModal() {
    this.isClosing = true;

    setTimeout(() => {
      this.isClosing = false;
      this.close.emit();
    },300)
  }
}
