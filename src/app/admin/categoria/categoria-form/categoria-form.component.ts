import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Categoria } from '../../../model/categoria';
import { CategoriaService } from '../../../services/categoria/categoria.service';
import { AuthService } from '../../../services/auth.service';
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
    @Inject(MAT_DIALOG_DATA) public data: { id?: number; nombre?: string; descripcion?: string; empresa: { id: number } },
    private formBuilder: FormBuilder,
    private categoriaService: CategoriaService,
    private loginService: AuthService
  ) {
    this.isEditMode = !!data.id;

    this.categoriaForm = this.formBuilder.group({
      id: [{ value: data.id || '', disabled: true }],
      nombre: [data.nombre || '', [Validators.required, Validators.maxLength(30)]],
      descripcion: [data.descripcion || '', [Validators.required, Validators.maxLength(100)]],
      empresa: [data.empresa.id, Validators.required]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.categoriaForm.valid) {
      const categoria: Categoria = this.transformToUpperCase(this.categoriaForm.getRawValue());

      if (this.isEditMode) {
        this.categoriaService.updateCategoria(categoria.id, categoria).subscribe(
          () => {
            this.dialogRef.close(true);
            this.refreshToken();
          },
          error => console.error(error)
        );
      } else {
        this.categoriaService.createCategoria(categoria).subscribe(
          () => {
            this.dialogRef.close(true);
            this.refreshToken();
          },
          error => console.error(error)
        );
      }
    }
  }

  private refreshToken(): void {
    const oldToken = this.loginService.userToken;
    this.loginService.refreshToken(oldToken).subscribe(
      newToken => console.log('Token actualizado:', newToken),
      error => console.error('Error al actualizar el token:', error)
    );
  }

  private transformToUpperCase(categoria: Categoria): Categoria {
    return {
      ...categoria,
      nombre: categoria.nombre.toUpperCase(),
      descripcion: categoria.descripcion.toUpperCase(),
      empresa: {
        ...categoria.empresa,
        nombre: categoria.empresa.nombre.toUpperCase()
      }
    };
  }
}
