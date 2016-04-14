import {Empresa}                                    from '../models/empresa'
import {Alumno}                                     from '../models/alumno'
import {Historial}                                  from '../models/historial'
import {DatosEvento}                                from '../models/datos-evento'
import {AlumnoService}                              from '../services/alumno.service'
import {LogService}                                 from '../services/log.service'
import {Component, OnInit, EventEmitter}            from 'angular2/core'

@Component({
    selector: 'resumen-proceso',
    templateUrl: BASE_URL + '/templates/resumen-proceso.template.html',
    outputs: ['resumenProcesoEvt'],
    inputs: ['listaAlumnosRestantes', 'listaAlumnosFinal', 'listaEmpresas'],
    providers: [AlumnoService]
})

export class ResumenProcesoComponent {

    public listaAlumnosRestantes: Alumno[];
    public listaAlumnosFinal: Alumno[];
    public listaEmpresas: Empresa[];
    public resumenProcesoEvt: EventEmitter;


    constructor(private _alumnoService: AlumnoService) {
        this.resumenProcesoEvt = new EventEmitter();
    }

    public ngOnInit() {

        var dataJson = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.listaAlumnosFinal));
        var aJson = document.getElementById("descargarJson");
        aJson.href = 'data:' + dataJson;
        aJson.download = 'AlumnosEmpresa.json';


        var dataCsv = "data:text/csv;charset=utf-8," + escape(this.getCsv());
        var aCsv = document.getElementById("descargarCsv");
        aCsv.href = 'data:' + dataCsv;
        aCsv.download = 'AlumnosEmpresa.csv';


        this.addHistorial();
    }

    public addHistorial() {
        let historial = new Historial(JSON.stringify(this.listaAlumnosFinal), new Date().toLocaleString());

        this._alumnoService.addHistorial(historial).subscribe(
            data => {
                this.lanzarEvento("AGREGAR_HISTORIAL", Historial.fromJson(data.d));
            },
            err => { LogService.log("POST Historial Error: " + err._body); }
        );
    }

    private getCsv() {
        var array = this.listaAlumnosFinal;
        var str = '';
        for (var i = 0; i < array.length; i++) {
            var line = '';
            for (var index in array[i]) {
                if (line != '') line += ','
                line += array[i][index];
            }
            str += line + '\r\n';
        }
        return str;
    }

    public lanzarEvento(orden: string, datos: any) {
        this.resumenProcesoEvt.next(new DatosEvento(orden, datos));
    }

}
