import {Empresa}                                    from '../models/empresa'
import {Alumno}                                     from '../models/alumno'
import {DatosEvento}                                from '../models/datos-evento'
import {EmpresaService}                             from '../services/empresa.service'
import {AlumnoService}                              from '../services/alumno.service'
import {FormAlumnoComponent}                        from './form-alumno.component'
import {FormEmpresaComponent}                       from './form-empresa.component'
import {ListaAlumnosComponent}                      from './lista-alumnos.component'
import {ListaEmpresasComponent}                     from './lista-empresas.component'
import {LogService}                                 from '../services/log.service';
import {ROUTER_DIRECTIVES, RouteConfig, Router}     from 'angular2/router'
import {Component, OnInit}                          from 'angular2/core'

@Component({
    selector: 'home',
    templateUrl: BASE_URL + '/templates/home.template.html',
    providers: [EmpresaService, AlumnoService],
    directives: [FormAlumnoComponent, FormEmpresaComponent, ListaAlumnosComponent, ListaEmpresasComponent]
})

export class HomeComponent {

    public empresaForm: Empresa;
    public alumnoForm: Alumno;
    public accionEmpresaForm: string;
    public accionAlumnoForm: string;
    public listaEmpresas: Empresa[];
    public listaAlumnos: Alumno[];

    constructor(private _empresaService: EmpresaService, private _alumnoService: AlumnoService) {
        this.empresaForm = new Empresa();
        this.alumnoForm = new Alumno();
        this.listaEmpresas = [];
        this.listaAlumnos = [];
    };

    ngOnInit() {
        this.getEmpresas();
        this.getAlumnos();

        this.accionEmpresaForm = "Nueva empresa";
        this.accionAlumnoForm = "Nuevo alumno";
    }

    getEmpresas() {
        this._empresaService.getEmpresas().subscribe(
            data => {
                LogService.info("Lista de empresas cargada");
                this.listaEmpresas = Empresa.fromJsonList(data.d.results);
            },
            err => { LogService.error("GET Empresas: " + err._body); }
        );
    }

    getAlumnos() {
        this._alumnoService.getAlumnos().subscribe(
            data => {
                LogService.info("Lista de alumnos cargada");
                this.listaAlumnos = Alumno.fromJsonList(data.d.results);
            },
            err => { LogService.error("GET Alumnos: " + err._body); }
        );
    }

    manejarEventos(arg: DatosEvento) {
        switch (arg.orden) {
            case "AGREGAR_A_LISTA_EMPRESA":
                this.listaEmpresas.push(arg.datos);
                break;

            case "AGREGAR_A_LISTA_ALUMNO":
                this.listaAlumnos.push(arg.datos);
                break;

            case "ACTUALIZAR_DE_LA_LISTA_EMPRESA":
                for (var i = 0; i < this.listaEmpresas.length; i++) {
                    if (this.listaEmpresas[i].id == arg.datos.id)
                        this.listaEmpresas[i] = arg.datos;
                }
                this.accionEmpresaForm = "Nueva empresa";
                break;

            case "ACTUALIZAR_DE_LA_LISTA_ALUMNO":
                for (var i = 0; i < this.listaAlumnos.length; i++) {
                    if (this.listaAlumnos[i].id == arg.datos.id)
                        this.listaAlumnos[i] = arg.datos;
                }
                this.accionAlumnoForm = "Nuevo alumno";
                break;

            //case "DETALLE":
            //    this.empleadoDetalle = arg.datos;
            //    break;
            //case "DELETE":
            //    var i = this.listaEmpleados.map(function (e) { return e.id; }).indexOf(arg.datos.id);
            //    this.listaEmpleados.splice(i, 1);
            //    break;

            case "EDITAR_EMPRESA":
                this.accionEmpresaForm = "Modificar empresa";
                this.empresaForm = arg.datos.detach();
                break;
            case "EDITAR_ALUMNO":
                this.accionAlumnoForm = "Modificar alumno";
                this.alumnoForm = arg.datos.detach();
                break;
        }
    }





    //addEmpresa(empresa: Alumno) {
    //    this._alumnoService.addAlumno(empresa).subscribe(
    //        data => {
    //            var em = Alumno.fromJson(data.d);
    //            LogService.info("Empresa añadida" + em);
    //            em.puntuacion = 777;
    //            this.editEmpresa(em);
    //        },
    //        err => { LogService.error("POST Empresa: " + err._body); }
    //    );
    //}

    //deleteEmpresa(empresa: Alumno) {
    //    this._alumnoService.deleteAlumno(empresa).subscribe(
    //        data => {
    //            LogService.info("Empresa borrada");
    //            this.getEmpresas();
    //        },
    //        err => { LogService.error("Delete Empresa: " + err._body); }
    //    );
    //}

    //editEmpresa(empresa: Alumno) {
    //    this._alumnoService.putAlumno(empresa).subscribe(
    //        data => {
    //            LogService.info("Empresa editada");
    //            this.getEmpresas();
    //        },
    //        err => { LogService.error("Put Empresa: " + err._body); }
    //    );
    //}
}
