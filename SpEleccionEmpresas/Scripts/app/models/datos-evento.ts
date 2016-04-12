export class DatosEvento {

    public orden: string;
    public datos: any;

    constructor(orden: string, datos: any) {
        this.orden = orden;
        this.datos = datos;
    }
}