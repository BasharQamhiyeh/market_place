// src/app/admin/components/attribute-form/attribute-form.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-attribute-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule
  ],
  templateUrl: './attribute-form.html',
})
export class AttributeFormComponent {
  form: ReturnType<FormBuilder['group']>;

  inputTypeOptions = [
    { value: '', label: '(Default) Text' },
    { value: 'text', label: 'Text' },
    { value: 'select', label: 'Select' },
    { value: 'number', label: 'Number' },
    { value: 'other', label: 'Other' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AttributeFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(120)]],
      input_type: [''], // empty = default text
      is_required: [true]
    });
    if (data?.attribute) {
      const a = data.attribute;
      this.form.patchValue({
        name: a.name,
        input_type: a.input_type ?? '',
        is_required: !!a.is_required
      });
    }
  }

  save() {
    if (this.form.invalid) return;
    const payload = {
      name: this.form.value.name!.trim(),
      input_type: this.form.value.input_type || null,
      is_required: this.form.value.is_required
    };
    this.dialogRef.close(payload);
  }

  cancel() {
    this.dialogRef.close();
  }
}
