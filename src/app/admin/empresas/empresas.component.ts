import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EmpresaService } from '../../services/empresa/empresa.service';
import { Empresa } from '../../model/empresa';
import { EmpresaFormComponent } from './empresa-form/empresa-form.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { DialogConfirmComponent } from '../../components/dialog-confirm/dialog-confirm.component';
import { MatNativeDateModule } from '@angular/material/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-empresas',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    ReactiveFormsModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatNativeDateModule,
    CommonModule
  ],
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.css']
})
export class EmpresasComponent implements OnInit {
  displayedColumns: string[] = ['nombre', 'url_P_Web', 'acciones'];
  dataSource = new MatTableDataSource<Empresa>();
  totalEmpresas: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private empresaService: EmpresaService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEmpresas();
  }

  loadEmpresas(): void {
    this.empresaService.getEmpresas().subscribe(
      data => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.totalEmpresas = data.length;
      },
      error => console.error(error)
    );
  }

  openDialog(empresa?: Empresa): void {
    const dialogRef = this.dialog.open(EmpresaFormComponent, {
      width: '600px',
      data: empresa || {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadEmpresas();
      }
    });
  }

  confirmDelete(id: number): void {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteEmpresa(id);
      }
    });
  }

  deleteEmpresa(id: number): void {
    this.empresaService.deleteEmpresa(id).subscribe(
      () => this.loadEmpresas(),
      error => console.error(error)
    );
  }

  goToCategories(empresaId: number): void {
    this.router.navigate(['/admin/categoria', empresaId]);
  }
}
