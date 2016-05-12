import {Alumno} from './alumno'

export class Empresa {

    public id: number;
    public nombre: string;
    public descripcion: string;
    public vacantes: number;
    public vacantesLibres: number;
    public alumnos: Alumno[];

    constructor();
    constructor(nombre: string, descripcion: string, vacantes: number);
    constructor(nombre: string, descripcion: string, vacantes: number, vacantesLibres: number);
    constructor(nombre: string, descripcion: string, vacantes: number, vacantesLibres: number, id: number) {

        if (nombre != undefined) {
            this.id = id;
            console.log("ID ASIGNADO", id);
            this.nombre = nombre;
            this.descripcion = descripcion;
            this.vacantes = vacantes;
            if (vacantesLibres != undefined)
                this.vacantesLibres = vacantesLibres;
            else
                this.vacantesLibres = vacantes;
        }
    }

    public static fromJson(json: any, lowerProps: boolean) {
        if (lowerProps)
            return new Empresa(json.nombre, json.descripcion, json.vacantes, json.vacantesLibres, json.id);

        return new Empresa(json.Nombre, json.Descripcion, json.Vacantes, json.VacantesLibres, json.ID);
    }


    public static fromJsonList(json: any, lowerProps: boolean) {
        var list = [];
        for (var i = 0; i < json.length; i++) {
            list.push(Empresa.fromJson(json[i], lowerProps));
        }
        return list;
    }

    public detach() {
        return new Empresa(this.nombre, this.descripcion, this.vacantes, json.vacantesLibres, this.id);
    }
}