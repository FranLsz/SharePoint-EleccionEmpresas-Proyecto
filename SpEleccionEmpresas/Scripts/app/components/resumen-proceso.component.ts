import {Empresa}                                    from '../models/empresa'
import {Alumno}                                     from '../models/alumno'
import {LogService}                                 from '../services/log.service';
import {Component, OnInit}                          from 'angular2/core'

@Component({
    selector: 'resumen-proceso',
    templateUrl: BASE_URL + '/templates/resumen-proceso.template.html',
    inputs: ['listaAlumnosRestantes', 'listaAlumnosFinal', 'listaEmpresas']
})

export class ResumenProcesoComponent {

    public listaAlumnosRestantes: Alumno[];
    public listaAlumnosFinal: Alumno[];
    public listaEmpresas: Empresa[];

    constructor() { }

    public ngOnInit() {

        var dataJson = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.listaAlumnosFinal));
        var aJson = document.getElementById("descargarJson");
        aJson.href = 'data:' + dataJson;
        aJson.download = 'AlumnosEmpresa.json';


        var dataCsv = "data:text/csv;charset=utf-8," + escape(this.getCsv());
        var aCsv = document.getElementById("descargarCsv");
        aCsv.href = 'data:' + dataCsv;
        aCsv.download = 'AlumnosEmpresa.csv';
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

}
