import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";
import {Userdata} from '../../../../service/userdata';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {MatButton, MatIconButton} from '@angular/material/button';
import Swal from 'sweetalert2';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-adduser',
  imports: [
    FormsModule,
    MatIcon,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInput,
    MatRadioButton,
    MatRadioGroup,
    MatButton,
    NgClass,
    MatIconButton
  ],
  templateUrl: './adduser.html',
  styleUrl: './adduser.css'
})
export class Adduser {
  @Output() close = new EventEmitter();
  @Input() isEdit = false;
  @Input() userData: any = {}
  isClosing = false;
  selectedFile: File | null = null;
  isDragging = false;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;

    const file = event.dataTransfer?.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  constructor(private userService: Userdata) {
  }

  onSubmit() {
    if (!this.userData.username || !this.userData.password || !this.userData.email || !this.userData.gender)  {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Please fill all fields`,
        background: "rgb(38 38 38)",
        color: "white"
      });
      return
    }

    const formData = new FormData();
    formData.append("username", this.userData.username);
    formData.append("email", this.userData.email);
    formData.append("password", this.userData.password);
    formData.append("gender", this.userData.gender);
    if (this.selectedFile) {
      formData.append("image", this.selectedFile);
    }

    if (this.isEdit) {

      this.userService.updateUser(this.userData._id, formData).subscribe({
        next: (res) => {
          console.log("User updated: ", res);
          this.userService.notifyUpdated();
          this.close.emit();
          Swal.fire({
            title: 'Successfully updated',
            icon: 'success',
            text: 'You have successfully updated a user.',
            background: "rgb(38 38 38)",
            color: "white"
          })
        },
        error: err => console.log(err)
      })
    } else {
      this.userService.addUser(formData).subscribe({
        next: (res) => {
          console.log("User added: ", res);
          this.userService.notifyUpdated();
          this.close.emit();
          Swal.fire({
            title: 'Successfully added',
            icon: 'success',
            text: 'You have successfully added a user.',
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
      this.isClosing = false;
      this.close.emit();
    },300)
  }
}
