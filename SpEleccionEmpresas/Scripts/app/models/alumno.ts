export class Empresa {

    public id: number;
    public nombre: string;
    public apellidos: string;
    public puntuacion: number;

    constructor();
    constructor(nombre: string, apellidos: string, puntuacion: number);
    constructor(nombre: string, apellidos: string, puntuacion: number, id: number) {

        if (nombre != undefined) {
            if (id != undefined)
                this.id = id;

            this.nombre = nombre;
            this.apellidos = apellidos;
            this.puntuacion = puntuacion;
        }
    }
}