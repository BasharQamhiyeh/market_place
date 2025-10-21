// src/app/admin/components/category-detail/category-detail.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Category, Attribute } from '../../models';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CategoriesService } from '../../../services/categories.service';
import { AttributeFormComponent } from '../attribute-form/attribute-form';
import { OptionListComponent } from '../option-list/option-list';

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule
  ],
  templateUrl: './category-detail.html',
  styleUrls: ['./category-detail.css']
})
export class CategoryDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private admin = inject(CategoriesService);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);
  private router = inject(Router);

  categoryId!: number;
  category?: Category;
  attributes: Attribute[] = [];
  displayedColumns = ['id', 'name', 'type', 'required', 'options', 'actions'];

  ngOnInit() {
    this.categoryId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.categoryId) {
      this.router.navigate(['/admin']);
      return;
    }
    this.load();
  }

  load() {
    this.admin.getCategory(this.categoryId).subscribe({
      next: c => (this.category = c),
      error: err => console.error(err)
    });
    this.admin.getAttributes(this.categoryId).subscribe({
      next: attrs => (this.attributes = attrs),
      error: err => console.error(err)
    });
  }

  openAddAttribute() {
    const ref = this.dialog.open(AttributeFormComponent, { width: '520px', data: { categoryId: this.categoryId } });
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      this.admin.createAttribute(this.categoryId, result).subscribe({
        next: () => {
          this.snack.open('Attribute added', '', { duration: 1600 });
          this.load();
        },
        error: err => console.error(err)
      });
    });
  }

  editAttribute(attr: Attribute) {
    const ref = this.dialog.open(AttributeFormComponent, { width: '520px', data: { attribute: attr } });
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      this.admin.updateAttribute(attr.id, result).subscribe({
        next: () => {
          this.snack.open('Attribute updated', '', { duration: 1400 });
          this.load();
        },
        error: err => console.error(err)
      });
    });
  }

  manageOptions(attr: Attribute) {
    if (attr.input_type !== 'select') {
      alert('Options available only for select-type attributes.');
      return;
    }
    const ref = this.dialog.open(OptionListComponent, { width: '520px', data: { attribute: attr } });
    ref.afterClosed().subscribe(result => {
      if (result?.updated) this.load();
    });
  }

  deleteAttribute(attr: Attribute) {
    if (!confirm(`Delete attribute "${attr.name}"?`)) return;
    this.admin.deleteAttribute(attr.id).subscribe({
      next: () => this.load(),
      error: err => console.error(err)
    });
  }
}
