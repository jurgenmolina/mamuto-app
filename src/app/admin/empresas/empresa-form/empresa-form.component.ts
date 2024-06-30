import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Empresa } from '../../../model/empresa';
import { EmpresaService } from '../../../services/empresa/empresa.service';
import { AuthService } from '../../../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empresa-form',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './empresa-form.component.html',
  styleUrls: ['./empresa-form.component.css']
})
export class EmpresaFormComponent {
  empresaForm: FormGroup;
  isEditMode: boolean;

  constructor(
    public dialogRef: MatDialogRef<EmpresaFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Empresa,
    private formBuilder: FormBuilder,
    private empresaService: EmpresaService,
    private loginService: AuthService // Inyecta el servicio de Login
  ) {
    this.isEditMode = !!data.id;

    this.empresaForm = this.formBuilder.group({
      id: [{ value: data.id || '', disabled: true }],
      nombre: [data.nombre || '', [Validators.required, Validators.maxLength(30)]],
      prefijo: [data.prefijo || '', [Validators.required, Validators.maxLength(10)]],
      direccion: [data.direccion || '', [Validators.required, Validators.maxLength(100)]],
      telefono: [data.telefono || '', [Validators.required, Validators.maxLength(15)]],
      email: [data.email || '', [Validators.required, Validators.email]],
      ciudad: [data.ciudad || '', [Validators.required, Validators.maxLength(30)]],
      pais: [data.pais || '', [Validators.required, Validators.maxLength(30)]],
      urlPWeb: [data.urlPWeb || '', [Validators.required, Validators.maxLength(100)]],
      logo: [data.logo || '']
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.empresaForm.valid) {
      const empresa: Empresa = this.transformToUpperCase(this.empresaForm.getRawValue());

      if (this.isEditMode) {
        this.empresaService.updateEmpresa(empresa.id, empresa).subscribe(
          () => {
            this.dialogRef.close(true);
            this.refreshToken(); // Llama al método para refrescar el token
          },
          error => console.error(error)
        );
      } else {
        this.empresaService.createEmpresa(empresa).subscribe(
          () => {
            this.dialogRef.close(true);
            this.refreshToken(); // Llama al método para refrescar el token
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

  private transformToUpperCase(empresa: Empresa): Empresa {
    return {
      ...empresa,
      nombre: empresa.nombre.toUpperCase(),
      prefijo: empresa.prefijo.toUpperCase(),
      direccion: empresa.direccion.toUpperCase(),
      telefono: empresa.telefono.toUpperCase(),
      email: empresa.email.toUpperCase(),
      ciudad: empresa.ciudad.toUpperCase(),
      pais: empresa.pais.toUpperCase(),
      urlPWeb: empresa.urlPWeb.toUpperCase(),
      logo: empresa.logo ? empresa.logo.toUpperCase() : ''
    };
  }
}
