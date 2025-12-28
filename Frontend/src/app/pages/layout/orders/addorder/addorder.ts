import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatIcon} from '@angular/material/icon';
import {Categorydata} from '../../../../service/categorydata';
import {Orderdata} from '../../../../service/orderdata';
import {Userdata} from '../../../../service/userdata';
import {Productdata} from '../../../../service/productdata';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatOption, MatSelect, MatSelectModule} from '@angular/material/select';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {NgClass} from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-addorder',
  imports: [
    FormsModule,
    MatIcon,
    MatFormField,
    MatSelect,
    MatLabel,
    MatOption,
    MatButton,
    MatInput,
    NgClass,
    MatIconButton
  ],
  templateUrl: './addorder.html',
  styleUrl: './addorder.css'
})
export class Addorder implements OnInit {
  @Output() close = new EventEmitter();
  @Input() isEdit = false;
  @Input() orderData: any = {}
  isClosing = false;

  user: any = []
  product: any = []

  constructor(private orderService: Orderdata,
              private userService: Userdata,
              private productService: Productdata) {
  }

  ngOnInit() {
    this.getUserData()
    this.getProductData()
  }

  onSubmit() {
    if(!this.orderData.userId || !this.orderData.productId) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select both a user and a product before saving the order.",
        background: "rgb(38 38 38)",
        color: "white"
      });
      return;
    }

    const selectedProduct = this.product.find((p: { _id: any; })=> p._id === this.orderData.productId);

    if (this.orderData.quantity > selectedProduct.stock) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Not enough stock! Available: ${selectedProduct.stock}`,
        background: "rgb(38 38 38)",
        color: "white"
      });
      return;
    }

    if (this.isEdit) {
      this.orderService.updateOrder(this.orderData._id, this.orderData).subscribe({
        next: (res) => {
          console.log("Order updated: ", res);
          this.orderService.notifyUpdated();
          this.close.emit();
          Swal.fire({
            title: 'Successfully updated',
            icon: 'success',
            text: 'You have successfully updated a order.',
            background: "rgb(38 38 38)",
            color: "white"
          })
        },
        error: err => console.log(err)
      })
    } else {
      this.orderService.addOrder(this.orderData).subscribe({
        next: (res) => {
          console.log("Order added: ", res);
          this.orderService.notifyUpdated();
          this.close.emit();
          Swal.fire({
            title: 'Successfully added',
            icon: 'success',
            text: 'You have successfully added a order.',
            background: "rgb(38 38 38)",
            color: "white"
          })
        },
        error: (err) => {
          console.log(err);
        }
      })
    }
  }

  getUserData() {
    this.userService.getUser().subscribe({
      next: (res) => {
        this.user = res;
      }
    })
  }

  getProductData() {
    this.productService.getProducts().subscribe({
      next: (res) => {
        this.product = res;
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
