import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../../model/categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private apiUrl = `${environment.urlHost}categoria`;

  constructor(private http: HttpClient) {}

  getAllCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl, this.getHttpOptions());
  }

  getCategoriasByEmpresa(empresaId: number): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiUrl}/empresa/${empresaId}`, this.getHttpOptions());
  }

  getCategoria(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}/${id}`, this.getHttpOptions());
  }

  createCategoria(categoria: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(`${this.apiUrl}/save`, categoria, this.getHttpOptions());
  }

  updateCategoria(id: number, categoria: Categoria): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.apiUrl}/${id}/update`, categoria, this.getHttpOptions());
  }

  deleteCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.getHttpOptions());
  }

  addProductosToCategoria(id: number, productoIds: number[]): Observable<Categoria> {
    return this.http.post<Categoria>(`${this.apiUrl}/${id}/addProductos`, productoIds, this.getHttpOptions());
  }

  removeProductosFromCategoria(id: number, productoIds: number[]): Observable<Categoria> {
    return this.http.post<Categoria>(`${this.apiUrl}/${id}/removeProductos`, productoIds, this.getHttpOptions());
  }

  private getHttpOptions() {
    const token = sessionStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  }
}
