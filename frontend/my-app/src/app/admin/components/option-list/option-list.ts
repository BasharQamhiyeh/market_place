// src/app/admin/components/option-list/option-list.component.ts
import { Component, Inject, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Attribute, AttributeOption } from '../../models';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CategoriesService } from '../../../services/categories.service';

@Component({
  selector: 'app-option-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './option-list.html'
})
export class OptionListComponent implements OnInit {
  private admin = inject(CategoriesService);
  attribute!: Attribute;
  options: AttributeOption[] = [];
  addForm = new FormGroup({ value: new FormControl('', Validators.required) });

  constructor(
    private dialogRef: MatDialogRef<OptionListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.attribute = data.attribute;
  }

  ngOnInit() {
    this.load();
  }

  load() {
    this.admin.getOptions(this.attribute.id).subscribe({
      next: res => (this.options = res),
      error: err => console.error(err)
    });
  }

  add() {
    if (this.addForm.invalid) return;
    const value = this.addForm.value.value!.trim();
    if (!value) return;
    this.admin.createOption(this.attribute.id, { value }).subscribe({
      next: () => {
        this.addForm.reset();
        this.load();
      },
      error: err => console.error(err)
    });
  }

  deleteOpt(opt: AttributeOption) {
    if (!confirm(`Delete option "${opt.value}"?`)) return;
    this.admin.deleteOption(opt.id).subscribe({
      next: () => this.load(),
      error: err => console.error(err)
    });
  }

  close() {
    this.dialogRef.close({ updated: true });
  }
}
