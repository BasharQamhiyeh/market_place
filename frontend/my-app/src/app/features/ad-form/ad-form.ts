// src/app/features/ad-form/ad-form.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api } from '../../services/api';

@Component({
  selector: 'app-ad-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
    // any other modules you need (e.g. for styling, validation etc.)
  ],
  templateUrl: './ad-form.html',
  styleUrls: ['./ad-form.css']  // if you have styles, optional
})
export class AdForm {
  title = '';
  description = '';
  category = '';
  price: number = 0;
  location = '';
  contact_info = '';
  files: File[] = [];
  token: string = ''; // Set this after login

  constructor(private api: Api) {}

  onFileChange(event: any) {
    this.files = Array.from(event.target.files);
  }

  submitAd() {
    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('description', this.description);
    formData.append('category', this.category);
    formData.append('price', this.price.toString());
    formData.append('location', this.location);
    formData.append('contact_info', this.contact_info);

    this.files.forEach((file) => formData.append('files', file));

    this.api.postAd(formData, this.token).subscribe((res) => {
      alert('Ad posted successfully!');
    });
  }
}
