import {Alumno} from './alumno'
import {Empresa} from './empresa'

export class Historial {

    public id: number;
    public datosJson: string;
    public fecha: any;
    public terminado: boolean;
    public empresasJson: string;
    public alumnosJson: string;

    public empresas: Empresa[];
    public alumnos: Alumno[];

    constructor();
    constructor(datosJson: string, fecha: any, terminado: boolean, empresasJson: string, alumnosJson: string);
    constructor(datosJson: string, fecha: any, terminado: boolean, empresasJson: string, alumnosJson: string, id: number) {

        if (datosJson != undefined) {
            if (id != undefined)
                this.id = id;

            this.datosJson = datosJson;
            this.fecha = fecha;
            this.terminado = terminado;
            this.empresasJson = empresasJson;
            this.alumnosJson = alumnosJson;
        }
    }

    public static fromJson(json: any) {
        return new Historial(json.DatosJson, json.Fecha, json.Terminado, json.EmpresasJson, json.AlumnosJson, json.ID);
    }

    public static fromJsonList(json: any) {
        var list = [];
        for (var i = 0; i < json.length; i++)
            list.push(Historial.fromJson(json[i]));

        return list;
    }
}