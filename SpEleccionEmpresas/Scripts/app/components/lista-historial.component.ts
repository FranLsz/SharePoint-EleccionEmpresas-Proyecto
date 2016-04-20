import {Alumno}                                     from '../models/alumno'
import {Empresa}                                    from '../models/empresa'
import {Historial}                                  from '../models/historial'
import {DatosEvento}                                from '../models/datos-evento'
import {LogService}                                 from '../services/log.service'
import {Component, OnInit, EventEmitter}            from 'angular2/core'

@Component({
    selector: 'lista-historial',
    templateUrl: BASE_URL + '/templates/lista-historial.template.html',
    inputs: ['listaHistorial']
})

export class ListaHistorialComponent {

    public listaHistorial: Historial[];
    public historial: Historial;
    public listaAlumnos: Alumno[];

    constructor() {}

    public ngOnInit() {

        // recorre lista de historiales
        for (var i = 0; i < this.listaHistorial.length; i++) {
            let alumnos = [];
            let empresas = [];

            let json = JSON.parse(this.listaHistorial[i].datosJson);
            // recorre lista de alumnos
            for (var j = 0; j < json.length; j++) {

                alumnos.push(json[j]);
                empresas.push(json[j].empresa);

            }

        }
    }


    public onSelect(historial: Historial) {
        this.historial = historial;

        let alumnos = [];

        let json = JSON.parse(this.historial.datosJson);

        // recorre lista de alumnos
        for (var j = 0; j < json.length; j++)
            alumnos.push(json[j]);

        this.historial.alumnos = alumnos;
    }
}
