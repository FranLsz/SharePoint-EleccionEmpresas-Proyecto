import {Alumno} from './alumno'

export class Empresa {

    public id: number;
    public nombre: string;
    public descripcion: string;
    public vacantes: number;
    public alumnos: Alumno[];

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

    public static fromJson(json: any) {
        return new Empresa(json.Nombre, json.Descripcion, json.Vacantes, json.ID);
    }

    public static fromJsonList(json: any) {
        var list = [];
        for (var i = 0; i < json.length; i++) {
            list.push(Empresa.fromJson(json[i]));
        }
        return list;
    }

    public detach() {
        return new Empresa(this.nombre, this.descripcion, this.vacantes, this.id);
    }
}