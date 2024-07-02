import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Categoria } from '../../../model/categoria';
import { CategoriaService } from '../../../services/categoria/categoria.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categoria-form',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './categoria-form.component.html',
  styleUrls: ['./categoria-form.component.css']
})
export class CategoriaFormComponent {
  categoriaForm: FormGroup;
  isEditMode: boolean;

  constructor(
    public dialogRef: MatDialogRef<CategoriaFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { categoria: Categoria; empresaId: number },
    private formBuilder: FormBuilder,
    private categoriaService: CategoriaService
  ) {
    this.isEditMode = !!data.categoria.id;

    this.categoriaForm = this.formBuilder.group({
      id: [{ value: data.categoria.id || '', disabled: true }],
      nombre: [data.categoria.nombre || '', [Validators.required, Validators.maxLength(30)]],
      descripcion: [data.categoria.descripcion || '', [Validators.required, Validators.maxLength(100)]],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.categoriaForm.valid) {
      const categoria: Categoria = {
        ...this.categoriaForm.getRawValue(),
        empresa: { id: this.data.empresaId }
      };

      if (this.isEditMode) {
        this.categoriaService.updateCategoria(categoria.id!, categoria).subscribe(
          () => this.dialogRef.close(true),
          error => console.error(error)
        );
      } else {
        this.categoriaService.createCategoria(categoria).subscribe(
          () => this.dialogRef.close(true),
          error => console.error(error)
        );
      }
    }
  }
}