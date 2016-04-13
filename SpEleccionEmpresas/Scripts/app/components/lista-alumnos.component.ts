﻿import {Alumno}                                 from '../models/alumno'
import {DatosEvento}                            from '../models/datos-evento'
import {AlumnoService}                          from '../services/alumno.service'
import {OrderBy}                                from '../pipes/order-by.pipe.ts'
import {Component, OnInit, EventEmitter}        from 'angular2/core'

@Component({
    selector: 'lista-alumnos',
    templateUrl: BASE_URL + '/templates/lista-alumnos.template.html',
    inputs: ['listaAlumnos'],
    outputs: ['listaAlumnosEvt'],
    pipes: [OrderBy]
})

export class ListaAlumnosComponent {
    public listaAlumnos: Alumno[];
    public alumno: Alumno;
    public listaAlumnosEvt: EventEmitter;

    constructor(private _alumnoService: AlumnoService) {
        this.listaAlumnosEvt = new EventEmitter();
    };

    onSelect(alumno: Alumno) {
        console.log("Seleccionado 1");
        this.lanzarEvento("EDITAR_ALUMNO", alumno);
    }

    lanzarEvento(orden: string, datos: any) {
        this.listaAlumnosEvt.next(new DatosEvento(orden, datos));
    }
}