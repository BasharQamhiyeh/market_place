import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoriesService } from '../../services/categories.service';
import { ItemsService } from '../../services/items';
import { Category, Attribute } from '../../admin/models';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-item-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './add-item-form.html',
  styleUrls: ['./add-item-form.css']
})
export class AddItemForm implements OnInit {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoriesService);
  private itemService = inject(ItemsService);
  private router = inject(Router);

  categories: Category[] = [];
  attributes: Attribute[] = [];
  uploadedFiles: File[] = [];

  form: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    price: [null, Validators.required],
    category_id: [null, Validators.required],
    attribute_values: this.fb.array([])
  });

  ngOnInit(): void {
    this.loadCategories();

    this.form.get('category_id')?.valueChanges.subscribe(catId => {
      if (catId) {
        this.loadAttributes(catId);
      } else {
        this.attributeValues.clear();
        this.attributes = [];
      }
    });
  }

  get attributeValues(): FormArray {
    return this.form.get('attribute_values') as FormArray;
  }

  async loadCategories() {
    this.categories = await firstValueFrom(this.categoryService.getCategories());
  }

  async loadAttributes(categoryId: number) {
    this.attributes = await firstValueFrom(this.categoryService.getAttributes(categoryId));
    this.attributeValues.clear();

    for (const attr of this.attributes) {
      this.attributeValues.push(this.fb.group({
        attribute_id: [attr.id, Validators.required],
        value: ['', Validators.required]
      }));
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.uploadedFiles = Array.from(input.files);
    }
  }

  async submit() {
    console.log(this.form.value);
    if (this.form.invalid) {
      console.error('Form is invalid');

      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        if (control && control.invalid) {
          console.log(key, control.errors);
        }
      })

      return;
    }

    const formData = new FormData();
    formData.append('title', this.form.value.title);
    formData.append('category_id', this.form.value.category_id);
    formData.append('description', this.form.value.description || '');
    formData.append('price', this.form.value.price || '');
    formData.append('attribute_values', JSON.stringify(
      this.form.value.attribute_values.map((attr: any) => ({
        attribute_id: attr.attribute_id,
        value: attr.value
      }))
    ));

    this.uploadedFiles.forEach(file => formData.append('photos', file));

    try {
      await firstValueFrom(this.itemService.createItem(formData));
      this.router.navigate(['/']);
    } catch (err) {
      console.error(err);
    }
  }
}
