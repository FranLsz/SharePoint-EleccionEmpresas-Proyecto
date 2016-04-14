import {Alumno} from './alumno'
import {Empresa} from './empresa'

export class Historial {

    public id: number;
    public datosJson: string;
    public fecha: any;

    public empresas: Empresa[];
    public alumnos: Alumno[];

    constructor();
    constructor(datosJson: string, fecha: any);
    constructor(datosJson: string, fecha: any, id: number) {

        if (datosJson != undefined) {
            if (id != undefined)
                this.id = id;

            this.datosJson = datosJson;
            this.fecha = fecha;
        }
    }

    public static fromJson(json: any) {
        return new Historial(json.DatosJson, json.Fecha, json.ID);
    }

    public static fromJsonList(json: any) {
        var list = [];
        for (var i = 0; i < json.length; i++)
            list.push(Historial.fromJson(json[i]));

        return list;
    }
}