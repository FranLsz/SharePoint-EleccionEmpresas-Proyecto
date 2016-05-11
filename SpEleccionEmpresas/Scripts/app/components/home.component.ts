import {Empresa}                                    from '../models/empresa'
import {Alumno}                                     from '../models/alumno'
import {Historial}                                  from '../models/historial'
import {DatosEvento}                                from '../models/datos-evento'
import {EmpresaService}                             from '../services/empresa.service'
import {AlumnoService}                              from '../services/alumno.service'
import {HistorialService}                           from '../services/historial.service'
import {FormAlumnoComponent}                        from './form-alumno.component'
import {FormEmpresaComponent}                       from './form-empresa.component'
import {ListaAlumnosComponent}                      from './lista-alumnos.component'
import {ListaEmpresasComponent}                     from './lista-empresas.component'
import {ProcesoSeleccionComponent}                  from './proceso-seleccion.component'
import {ListaHistorialComponent}                    from './lista-historial.component'
import {LogService}                                 from '../services/log.service'
import {ROUTER_DIRECTIVES, RouteConfig, Router}     from 'angular2/router'
import {Component, OnInit}                          from 'angular2/core'

@Component({
    selector: 'home',
    templateUrl: BASE_URL + '/templates/home.template.html',
    providers: [EmpresaService, AlumnoService, HistorialService],
    directives: [FormAlumnoComponent, FormEmpresaComponent, ListaAlumnosComponent, ListaEmpresasComponent, ProcesoSeleccionComponent, ListaHistorialComponent]
})

export class HomeComponent {

    public alumnoLogeado: Alumno;
    public empresaForm: Empresa;
    public alumnoForm: Alumno;
    public accionEmpresaForm: string;
    public accionAlumnoForm: string;
    public listaEmpresas: Empresa[];
    public listaAlumnos: Alumno[];
    public seleccionIniciada: boolean;
    public estadoVacantes: string;
    public nivelVacantes: number;
    public verHistorial: boolean;
    public listaHistorial: Historial[];

    constructor(private _empresaService: EmpresaService, private _alumnoService: AlumnoService, private _historialService: HistorialService) {
        this.empresaForm = new Empresa();
        this.alumnoForm = new Alumno();
        this.listaEmpresas = [];
        this.listaAlumnos = [];
        this.listaHistorial = [];
        this.accionEmpresaForm = "Nueva empresa";
        this.accionAlumnoForm = "Nuevo alumno";
    };

    public ngOnInit() {

        this.cargarDatos();

    }

    public cargarDatos() {
        // CARGAR ALUMNOS
        this._alumnoService.getAlumno().subscribe(
            data => {
                LogService.info("Lista de alumnos cargada");
                this.listaAlumnos = Alumno.fromJsonList(data.d.results, false);
                this.calcularVacantes();

                // CARGAR EMPRESAS
                this._empresaService.getEmpresa().subscribe(
                    data => {
                        LogService.info("Lista de empresas cargada");
                        this.listaEmpresas = Empresa.fromJsonList(data.d.results, false);
                        this.calcularVacantes();

                        // CARGAR HISTORIALES
                        this._historialService.getHistorial(false).subscribe(
                            data => {
                                LogService.info("Historial cargado");
                                this.listaHistorial = Historial.fromJsonList(data.d.results);

                                // una vez cargado todo, comprueba si el usuario logeado es un alumno
                                this.comprobarUsuario();
                            },
                            err => { LogService.log("GET Historial Error: " + err._body); }
                        );
                    },
                    err => { LogService.error("GET Empresas: " + err._body); }
                );
            },
            err => { LogService.error("GET Alumnos: " + err._body); }
        );
    }

    public comprobarUsuario() {
        this._alumnoService.getUsuarioActual().subscribe(
            data => {
                for (var i = 0; i < this.listaAlumnos.length; i++) {
                    if (this.listaAlumnos[i].accountName == data.d.AccountName) {
                        console.log("ALUMNO DETECTADO");
                        this.alumnoLogeado = this.listaAlumnos[i].detach();
                        this.seleccionIniciada = true;
                    }
                }
            },
            error => { console.log(error); },
            def => {
                document.getElementById("cargando").style.display = 'none';
                document.getElementsByTagName("app-main")[0].style.display = 'block';
            });
    }

    public iniciarSeleccion() {
        var historial = new Historial("vacio", new Date().toLocaleString("en-US"), false, JSON.stringify(this.listaEmpresas), JSON.stringify(this.listaAlumnos));

        this._historialService.addHistorial(historial).subscribe(
            data => {
                alert("--PROCESO INICIADO--");
            },
            err => { LogService.log("POST Historial Error: " + err._body); }
        );
    }

    public getEmpresas() {
        this._empresaService.getEmpresa().subscribe(
            data => {
                LogService.info("Lista de empresas cargada");
                this.listaEmpresas = Empresa.fromJsonList(data.d.results, false);
                this.calcularVacantes();
            },
            err => { LogService.error("GET Empresas: " + err._body); }
        );
    }

    public getAlumnos() {
        this._alumnoService.getAlumno().subscribe(
            data => {
                LogService.info("Lista de alumnos cargada");
                this.listaAlumnos = Alumno.fromJsonList(data.d.results);
                this.calcularVacantes();
            },
            err => { LogService.error("GET Alumnos: " + err._body); }
        );
    }

    public getHistoriales() {
        this._historialService.getHistorial(false).subscribe(
            data => {
                LogService.info("Historial cargado");
                this.listaHistorial = Historial.fromJsonList(data.d.results);
            },
            err => { LogService.log("GET Historial Error: " + err._body); }
        );
    }

    public calcularVacantes() {
        this.nivelVacantes = 0;

        var numAlumnos = this.listaAlumnos.length;
        var numVacantes = 0;

        for (var i = 0; i < this.listaEmpresas.length; i++)
            numVacantes += parseInt(this.listaEmpresas[i].vacantes.toString());


        if (numAlumnos > numVacantes) {
            this.nivelVacantes = numAlumnos - numVacantes;
            this.estadoVacantes = "Insuficientes";
        }
        else if (numAlumnos == numVacantes) {
            this.estadoVacantes = "Equilibrado";
        }
        else {
            this.nivelVacantes = numVacantes - numAlumnos;
            this.estadoVacantes = "Sobrantes";
        }
    }

    public manejarEventos(arg: DatosEvento) {
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
            case "DELETE_ALUMNO":
                //_.remove(this.listaAlumnos, function (e) { return e.id == arg.datos.id; });
                //this.accionAlumnoForm = "Nuevo alumno";
                break;
            case "DELETE_EMPRESA":
                _.remove(this.listaEmpresas, function (e) { return e.id == arg.datos.id; });
                this.accionEmpresaForm = "Nueva empresa";
                break;
            case "EDITAR_DETALLE_EMPRESA":
                this.accionEmpresaForm = "Modificar empresa";
                this.empresaForm = arg.datos.detach();
                break;
            case "EDITAR_ALUMNO":
                // Borra el alumno de la app
                var res = confirm("¿Desea borrar el alumno?");
                if (res) {
                    _.remove(this.listaAlumnos, function (e) { return e.id == arg.datos.id; });
                    this._alumnoService.deleteAlumno(arg.datos).subscribe(
                        data => {
                            _.remove(this.listaAlumnos, function (e) { return e.id == arg.datos.id; });
                        },
                        err => { LogService.error("Delete Alumno: " + err._body); }
                    );
                }
                //this.accionAlumnoForm = "Detalle alumno";
                //this.alumnoForm = arg.datos.detach();
                break;
            case "AGREGAR_HISTORIAL":
                this.listaHistorial.push(arg.datos)
                break;
        }

        this.calcularVacantes();
    }
}
