import { Empresa } from './empresa';

export interface Categoria {
    id: number;
    nombre: string;
    descripcion: string;
    empresa: Empresa;
}
