import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";
import {Categorydata} from '../../../../service/categorydata';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton, MatIconButton} from '@angular/material/button';
import Swal from 'sweetalert2';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-addcategory',
  imports: [
    FormsModule,
    MatIcon,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
    MatIconButton,
    NgClass
  ],
  templateUrl: './addcategory.html',
  styleUrl: './addcategory.css',
})
export class Addcategory {
  @Output() close = new EventEmitter();
  @Input() isEdit = false;
  @Input() categoryData: any = {}
  isClosing = false;

  constructor(private categoryService: Categorydata) {
  }

  onSubmit() {
    if (!this.categoryData.name || !this.categoryData.description) {
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
      this.categoryService.updateCategory(this.categoryData, this.categoryData._id).subscribe({
        next: (res) => {
          console.log("Category updated: ", res);
          this.categoryService.notifyUpdated();
          this.close.emit();
          Swal.fire({
            title: 'Successfully updated',
            icon: 'success',
            text: 'You have successfully updated a category.',
            background: "rgb(38 38 38)",
            color: "white"
          })
        },
        error: err => console.log(err)
      })
    } else {
      this.categoryService.addCategory(this.categoryData).subscribe({
        next: (res) => {
          console.log("Category added: ", res);
          this.categoryService.notifyUpdated();
          this.close.emit();
          Swal.fire({
            title: 'Successfully added',
            icon: 'success',
            text: 'You have successfully added a category.',
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

  closeModal() {
    this.isClosing = true;
    setTimeout(() => {
      this.close.emit();
      this.isClosing = false;
    },300)
  }
}
