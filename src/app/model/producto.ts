import { Categoria } from "./categoria";
import { Empresa } from "./empresa";

export interface Producto{
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    imageUrl: string;
    empresa: Empresa;
    categoria: Categoria;
}
