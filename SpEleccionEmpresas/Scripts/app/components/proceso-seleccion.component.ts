import {Empresa}                                    from '../models/empresa'
import {Alumno}                                     from '../models/alumno'
import {DatosEvento}                                from '../models/datos-evento'
import {EmpresaService}                             from '../services/empresa.service'
import {AlumnoService}                              from '../services/alumno.service'
import {ListaEmpresasComponent}                     from './lista-empresas.component'
import {DetalleEmpresaComponent}                    from './detalle-empresa.component'
import {ResumenProcesoComponent}                    from './resumen-proceso.component'
import {LogService}                                 from '../services/log.service';
import {Component, OnInit, EventEmitter}            from 'angular2/core'

@Component({
    selector: 'proceso-seleccion',
    templateUrl: BASE_URL + '/templates/proceso-seleccion.template.html',
    inputs: ['listaEmpresas', 'listaAlumnos'],
    outputs: ['procesoSeleccionEvt'],
    directives: [ListaEmpresasComponent, DetalleEmpresaComponent, ResumenProcesoComponent],
    providers: [EmpresaService, AlumnoService]
})


export class ProcesoSeleccionComponent {

    public listaEmpresas: Empresa[];
    public listaEmpresasAux: Empresa[];
    public listaAlumnos: Alumno[];
    public listaAlumnosAux: Alumno[];
    public listaAlumnosFinal: Alumno[];
    public empresa: Empresa;
    public alumno: Alumno;
    public finalizado: boolean = false;

    public procesoSeleccionEvt: EventEmitter;

    constructor(private _empresaService: EmpresaService, private _alumnoService: AlumnoService) {
        this.alumno = new Alumno();
        this.listaAlumnosFinal = [];
        this.procesoSeleccionEvt = new EventEmitter();
        this.listaAlumnosAux = [];
        this.listaEmpresasAux = [];
    }

    public ngOnInit() {

        document.getElementById("volverAtras").style.display = 'none';

        for (var i = 0; i < this.listaAlumnos.length; i++) {
            this.listaAlumnosAux.push(this.listaAlumnos[i].detach())
        }

        for (var i = 0; i < this.listaEmpresas.length; i++) {
            this.listaEmpresasAux.push(this.listaEmpresas[i].detach())
        }

        this.alumno = Alumno.getMayorPuntuacion(this.listaAlumnosAux);
        console.log(this.empresa);
    }

    public seleccionarEmpresa() {
        //TODO: Guardar el estado de la seleccion hasta que termine (usar lista EmpresaAlumno)

        var alumno = this.alumno;
        var vacantes = false;
        alumno.empresa = this.empresa;

        this.listaAlumnosFinal.push(alumno);

        var i = this.listaAlumnosAux.map(function (e) { return e.id; }).indexOf(alumno.id);
        this.listaAlumnosAux.splice(i, 1);

        this.empresa.vacantesLibres--;

        // Actualizamos las vacantes de la empresa y comprobamos si quedan vacantes libres en general
        for (var i = 0; i < this.listaEmpresasAux.length; i++) {

            if (this.listaEmpresasAux[i].id == this.empresa.id)
                this.listaEmpresasAux[i] = this.empresa;

            //si quedan vacantes
            if (this.listaEmpresasAux[i].vacantesLibres > 0)
                vacantes = true;
        }


        // si hay un siguiente alumno
        if (this.listaAlumnosAux.length > 0) {

            // si no quedan vacantes
            if (!vacantes) {
                this.finalizado = true;

            } else {
                // si quedan buscamos otro alumno
                this.alumno = Alumno.getMayorPuntuacion(this.listaAlumnosAux);
                this.empresa = null;
            }
        } else {
            document.getElementById("volverAtras").style.display = 'block';
            this.finalizado = true;
        }
    }

    public lanzarEvento(orden: string, datos: any) {
        this.procesoSeleccionEvt.next(new DatosEvento(orden, datos));
    }

    public manejarEventos(arg: DatosEvento) {
        switch (arg.orden) {
            case "EDITAR_DETALLE_EMPRESA":
                this.empresa = arg.datos;
                break;
            case "SELECCIONAR_EMPRESA":
                this.seleccionarEmpresa();
                break;
            case "AGREGAR_HISTORIAL":
                this.lanzarEvento("AGREGAR_HISTORIAL", arg.datos);
                break;
        }
    }
}
