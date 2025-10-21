// src/app/admin/components/category-list/category-list.component.ts
import { Component, Inject, OnInit, inject } from '@angular/core';
import { Category } from '../../models';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { CategoriesService } from '../../../services/categories.service';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule
  ],
  templateUrl: './category-list.html',
  styleUrls: ['./category-list.css']
})
export class CategoryListComponent implements OnInit {
  private admin = inject(CategoriesService);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  categories: Category[] = [];
  displayedColumns = ['id', 'name', 'actions'];

  // inline create form
  createForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(120)])
  });

  ngOnInit() {
    this.load();
  }

  load() {
    this.admin.getCategories().subscribe({
      next: res => (this.categories = res),
      error: err => console.error(err)
    });
  }

  openCategory(category: Category) {
    this.router.navigate(['/admin/categories', category.id]);
  }

  addCategory() {
    if (this.createForm.invalid) return;
    const name = this.createForm.value.name!.trim();
    if (!name) return;
    this.admin.createCategory({ name }).subscribe({
      next: () => {
        this.createForm.reset();
        this.load();
      },
      error: (err: any) => console.error(err)
    });
  }

  editCategory(c: Category) {
    const dialogRef = this.dialog.open(EditCategoryDialog, { data: { category: c }, width: '420px' });
    dialogRef.afterClosed().subscribe((result: { name?: string } | undefined) => {
      if (!result) return;
      this.admin.updateCategory(c.id, { name: result.name! }).subscribe(() => this.load());
    });
  }

  deleteCategory(c: Category) {
    if (!confirm(`Delete category "${c.name}"? This will remove its attributes too.`)) return;
    this.admin.deleteCategory(c.id).subscribe(() => this.load());
  }
}

/** Simple Edit Dialog — included as a standalone inner component */
@Component({
  selector: 'edit-category-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatDialogModule, MatCardModule, CommonModule],
  template: `
    <h2 mat-dialog-title>Edit Category</h2>
    <form [formGroup]="form" style="padding: 16px;">
      <mat-form-field appearance="outline" style="width:100%">
        <mat-label>Name</mat-label>
        <input matInput formControlName="name" />
      </mat-form-field>

      <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:12px">
        <button mat-button mat-dialog-close>Cancel</button>
        <button mat-flat-button color="primary" [disabled]="form.invalid" (click)="save()">Save</button>
      </div>
    </form>
  `
})
export class EditCategoryDialog {
  form = new FormGroup({ name: new FormControl('', Validators.required) });
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<EditCategoryDialog>) {
    if (data?.category?.name) this.form.setValue({ name: data.category.name });
  }
  save() {
    if (this.form.invalid) return;
    this.dialogRef.close({ name: this.form.value.name });
  }
}
