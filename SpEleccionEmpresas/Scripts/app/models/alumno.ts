import {Empresa} from './empresa'

export class Alumno {

    public id: number;
    public nombre: string;
    public apellidos: string;
    public puntuacion: number;
    public userGuid: string;
    public accountName: string;
    public empresa: Empresa;

    constructor();
    constructor(nombre: string, apellidos: string, puntuacion: number);
    constructor(nombre: string, apellidos: string, puntuacion: number, id: number, userGuid: string, accountName: string) {

        if (nombre != undefined) {
            if (id != undefined) {
                this.id = id;
                this.userGuid = userGuid;
                this.accountName = accountName;
            }

            this.nombre = nombre;
            this.apellidos = apellidos;
            this.puntuacion = puntuacion;
        }
    }

    public static fromJson(json: any, lowerProp: boolean) {
        if (lowerProp)
            return new Alumno(json.nombre, json.apellidos, json.puntuacion, json.id, json.userGuid, json.accountName);

        return new Alumno(json.Nombre, json.Apellidos, json.Puntuacion, json.ID, json.Guid, json.AccountName);
    }

    public static fromJsonList(json: any, lowerProp: boolean) {
        var list = [];
        for (var i = 0; i < json.length; i++) {
            list.push(Alumno.fromJson(json[i], lowerProp));
        }
        return list;
    }

    public static getMayorPuntuacion(lista: Alumno[]) {

        var alumno = lista[0];
        for (var i = 0; i < lista.length; i++) {
            if (lista[i].puntuacion > alumno.puntuacion)
                alumno = lista[i];
            else if (lista[i].puntuacion === alumno.puntuacion) {
                if (lista[i].apellidos < alumno.apellidos)
                    alumno = lista[i];
            }
        }

        return alumno
    }

    public detach() {
        return new Alumno(this.nombre, this.apellidos, this.puntuacion, this.id, this.userGuid, this.accountName);
    }
}