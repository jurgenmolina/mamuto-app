import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CategoriaService } from '../../services/categoria/categoria.service';
import { Categoria } from '../../model/categoria';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DialogConfirmComponent } from '../../components/dialog-confirm/dialog-confirm.component';
import { CategoriaFormComponent } from './categoria-form/categoria-form.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit {
  displayedColumns: string[] = ['nombre', 'descripcion', 'acciones'];
  dataSource = new MatTableDataSource<Categoria>();
  totalCategorias: number = 0;
  empresaId: number;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private categoriaService: CategoriaService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.empresaId = Number(this.route.snapshot.paramMap.get('empresaId'));
  }

  ngOnInit(): void {
    this.loadCategorias();
  }

  loadCategorias(): void {
    this.categoriaService.getCategoriasByEmpresa(this.empresaId).subscribe(
      data => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.totalCategorias = data.length;
      },
      error => console.error(error)
    );
  }

  openDialog(categoria?: Categoria): void {
    const dialogRef = this.dialog.open(CategoriaFormComponent, {
      width: '600px',
      data: { categoria: categoria || {}, empresaId: this.empresaId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCategorias();
      }
    });
  }

  confirmDelete(id: number): void {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteCategoria(id);
      }
    });
  }

  deleteCategoria(id: number): void {
    this.categoriaService.deleteCategoria(id).subscribe(
      () => this.loadCategorias(),
      error => console.error(error)
    );
  }
}