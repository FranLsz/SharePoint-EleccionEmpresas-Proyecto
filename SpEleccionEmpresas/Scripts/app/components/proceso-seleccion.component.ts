import {Empresa}                                    from '../models/empresa'
import {Alumno}                                     from '../models/alumno'
import {DatosEvento}                                from '../models/datos-evento'
import {EmpresaService}                             from '../services/empresa.service'
import {AlumnoService}                              from '../services/alumno.service'
import {ListaEmpresasComponent}                     from './lista-empresas.component'
import {DetalleEmpresaComponent}                    from './detalle-empresa.component'
import {ResumenProcesoComponent}                    from './resumen-proceso.component'
import {LogService}                                 from '../services/log.service';
import {Component, OnInit}                          from 'angular2/core'

@Component({
    selector: 'proceso-seleccion',
    templateUrl: BASE_URL + '/templates/proceso-seleccion.template.html',
    inputs: ['listaEmpresas', 'listaAlumnos'],
    directives: [ListaEmpresasComponent, DetalleEmpresaComponent, ResumenProcesoComponent],
    providers: [EmpresaService, AlumnoService]
})


export class ProcesoSeleccionComponent {

    public listaEmpresas: Empresa[];
    public listaAlumnos: Alumno[];
    public listaAlumnosFinal: Alumno[];
    public empresa: Empresa;
    public alumno: Alumno;
    public finalizado: boolean = false;

    constructor(private _empresaService: EmpresaService, private _alumnoService: AlumnoService) {
        this.alumno = new Alumno();
        this.listaAlumnosFinal = [];
    }

    public ngOnInit() {
        this.alumno = Alumno.getMayorPuntuacion(this.listaAlumnos);
        console.log(this.empresa);
    }

    public seleccionarEmpresa() {
        //TODO: Guardar el estado de la seleccion hasta que termine (usar lista EmpresaAlumno)

        var alumno = this.alumno;
        var vacantes = false;
        alumno.empresa = this.empresa;

        this.listaAlumnosFinal.push(alumno);

        var i = this.listaAlumnos.map(function (e) { return e.id; }).indexOf(alumno.id);
        this.listaAlumnos.splice(i, 1);

        this.empresa.vacantesLibres--;

        // Actualizamos las vacantes de la empresa y comprobamos si quedan vacantes libres en general
        for (var i = 0; i < this.listaEmpresas.length; i++) {

            if (this.listaEmpresas[i].id == this.empresa.id)
                this.listaEmpresas[i] = this.empresa;

            //si quedan vacantes
            if (this.listaEmpresas[i].vacantesLibres > 0)
                vacantes = true;
        }


        // si hay un siguiente alumno
        if (this.listaAlumnos.length > 0) {

            // si no quedan vacantes
            if (!vacantes) {
                this.finalizado = true;

            } else {
                // si quedan buscamos otro alumno
                this.alumno = Alumno.getMayorPuntuacion(this.listaAlumnos);
                this.empresa = null;
            }
        }
        else
            this.finalizado = true;
    }

    public manejarEventos(arg: DatosEvento) {
        switch (arg.orden) {
            case "EDITAR_DETALLE_EMPRESA":
                this.empresa = arg.datos;
                break;
            case "SELECCIONAR_EMPRESA":
                this.seleccionarEmpresa();
                break;
        }
    }
}
