export class Empresa {

    public id: number;
    public nombre: string;
    public descripcion: string;
    public vacantes: number;

    constructor();
    constructor(nombre: string, descripcion: string, vacantes: number);
    constructor(nombre: string, descripcion: string, vacantes: number, id: number) {

        if (nombre != undefined) {
            if (id != undefined)
                this.id = id;

            this.nombre = nombre;
            this.descripcion = descripcion;
            this.vacantes = vacantes;
        }
    }



}