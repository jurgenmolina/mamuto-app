import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CategoriaService } from '../../services/categoria/categoria.service';
import { Categoria } from '../../model/categoria';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { DialogConfirmComponent } from '../../components/dialog-confirm/dialog-confirm.component';
import { MatNativeDateModule } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { CategoriaFormComponent } from './categoria-form/categoria-form.component';
import { EmpresaService } from '../../services/empresa/empresa.service';

@Component({
  selector: 'app-categorias',
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
    MatNativeDateModule,
    CommonModule
  ],
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriasComponent implements OnInit {
  displayedColumns: string[] = ['nombre', 'descripcion', 'acciones'];
  dataSource = new MatTableDataSource<Categoria>();
  totalCategorias: number = 0;
  empresaId: number;
  empresaNombre: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private categoriaService: CategoriaService,
    private EmpresaService: EmpresaService,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    this.empresaId = +this.route.snapshot.params['empresaId'];
  }

  ngOnInit(): void {
    this.loadCategorias();
    this.loadEmpresaInfo();
  }

  loadEmpresaInfo(): void {
    this.EmpresaService.getEmpresa(this.empresaId).subscribe(
      empresa => {
        this.empresaNombre = empresa.nombre;
      },
      error => console.error('Error fetching empresa info:', error)
    );
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
      data: { ...categoria, empresa: { id: this.empresaId } }
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
