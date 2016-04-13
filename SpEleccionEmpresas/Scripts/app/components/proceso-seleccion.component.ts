import {Empresa}                                    from '../models/empresa'
import {Alumno}                                     from '../models/alumno'
import {DatosEvento}                                from '../models/datos-evento'
import {EmpresaService}                             from '../services/empresa.service'
import {AlumnoService}                              from '../services/alumno.service'
import {ListaEmpresasComponent}                     from './lista-empresas.component'
import {DetalleEmpresaComponent}                    from './detalle-empresa.component'
import {LogService}                                 from '../services/log.service';
import {Component, OnInit}                          from 'angular2/core'

@Component({
    selector: 'proceso-seleccion',
    templateUrl: BASE_URL + '/templates/proceso-seleccion.template.html',
    inputs: ['listaEmpresas', 'listaAlumnos'],
    directives: [ListaEmpresasComponent, DetalleEmpresaComponent],
    providers: [EmpresaService, AlumnoService]
})


export class ProcesoSeleccionComponent {

    public listaEmpresas: Empresa[];
    public listaAlumnos: Alumno[];
    public listaAlumnosFinal: Alumno[];
    public empresa: Empresa;
    public alumno: Alumno;

    constructor(private _empresaService: EmpresaService, private _alumnoService: AlumnoService) {
        this.empresa = new Empresa();
        this.alumno = new Alumno();
        this.listaAlumnosFinal = [];
    }

    ngOnInit() {
        this.alumno = Alumno.getMayorPuntuacion(this.listaAlumnos);
    }

    seleccionarEmpresa() {
        //TODO: meter el boton seleccionar en el template de detalle
        //TODO: recalcular vacantes una vez se selecciona una empresa
        //TODO: mostrar resultado de selecciones al terminar
        //TODO: Guardar el estado de la seleccion hasta que termine (usar lista EmpresaAlumno)


        var alumno = this.alumno;
        alumno.empresa = this.empresa;

        this.listaAlumnosFinal.push(alumno);

        var i = this.listaAlumnos.map(function (e) { return e.id; }).indexOf(alumno.id);
        this.listaAlumnos.splice(i, 1);

        this.alumno = Alumno.getMayorPuntuacion(this.listaAlumnos);
    }

    manejarEventos(arg: DatosEvento) {
        switch (arg.orden) {
            case "EDITAR_EMPRESA":
                console.log("SELECCIONADA 2");
                this.empresa = arg.datos;
                console.log(this.empresa);
                break;
        }
    }
}
