import {Empresa}                                    from '../models/empresa'
import {Alumno}                                     from '../models/alumno'
import {Historial}                                  from '../models/historial'
import {DatosEvento}                                from '../models/datos-evento'
import {EmpresaService}                             from '../services/empresa.service'
import {AlumnoService}                              from '../services/alumno.service'
import {HistorialService}                           from '../services/historial.service'
import {ListaEmpresasComponent}                     from './lista-empresas.component'
import {DetalleEmpresaComponent}                    from './detalle-empresa.component'
import {ResumenProcesoComponent}                    from './resumen-proceso.component'
import {LogService}                                 from '../services/log.service'
import {RestoreService}                             from '../services/restore.service'
import {Component, OnInit, EventEmitter}            from 'angular2/core'

@Component({
    selector: 'proceso-seleccion',
    templateUrl: BASE_URL + '/templates/proceso-seleccion.template.html',
    //inputs: ['listaEmpresas', 'listaAlumnos', 'alumnoLogeado'],
    inputs: ['alumnoLogeado'],
    outputs: ['procesoSeleccionEvt'],
    providers: [RestoreService, HistorialService],
    directives: [ListaEmpresasComponent, DetalleEmpresaComponent, ResumenProcesoComponent]
})


export class ProcesoSeleccionComponent {

    public alumnoLogeado: Alumno;
    public listaAlumnos: Alumno[];
    public listaAlumnosAux: Alumno[];
    public listaAlumnosFinal: Alumno[];
    public empresa: Empresa;
    public alumno: Alumno;
    public finalizado: boolean = false;
    public sinProcesos: boolean = true;
    public procesoSeleccionEvt: EventEmitter;
    public procesoActual: Historial;
    public listaEmpresas: Empresa[];
    //lista de alumnos con sus empresas
    public estadoProceso: Alumno[];
    // queremos que la lista del proceso sea una copia para no modificar la del componente padre


    constructor(private _empresaService: EmpresaService, private _alumnoService: AlumnoService, private _restoreService: RestoreService<Empresa[]>, private _historialService: HistorialService) {
        this.alumno = new Alumno();
        this.listaAlumnosFinal = [];
        this.procesoSeleccionEvt = new EventEmitter();
        this.listaAlumnosAux = [];
        this.listaEmpresas = [];
    }

    public ngOnInit() {

        // TODO: OPTIMIZACION PENDIENTE no cargar todos los alumnos y empresas si hay un proceso de
        // seleccion activado, ya que estos datos estan incluidos en el propio proceso

        document.getElementById("volverAtras").style.display = 'none';

        // si es así, se buscan procesos de seleccion activos
        this._historialService.getHistorial(true).subscribe(
            data => {
                // si hay algun proceso activo
                if (data.d.results.length > 0) {
                    console.log("PROCESO DE SELECCION DETECTADO");
                    this.sinProcesos = false;
                    this.procesoActual = Historial.fromJson(data.d.results[0]);

                    if (this.procesoActual.datosJson != "vacio")
                        this.estadoProceso = <Alumno[]>Alumno.fromJsonList(JSON.parse(this.procesoActual.datosJson), true);
                    else
                        this.estadoProceso = [];

                    this.listaEmpresas = <Empresa[]>Empresa.fromJsonList(JSON.parse(this.procesoActual.empresasJson), true);
                    this.listaAlumnos = <Alumno[]>Alumno.fromJsonList(JSON.parse(this.procesoActual.alumnosJson), true);

                    console.log("LISTA JSON", this.listaAlumnos);
                    console.log("LISTA", this.listaAlumnos);

                    this.alumno = Alumno.getMayorPuntuacion(this.listaAlumnos);
                    console.log("LOGGED", this.alumnoLogeado.userGuid);
                    console.log("Top puntuacion", this.alumno.userGuid);

                    if (this.alumno.userGuid == this.alumnoLogeado.userGuid) {
                        alert("Holita, tu turno");
                    } else {
                        alert("Que te pires, no es tu turno");
                    }
                }
            },
            error => { console.log(error); }
        );


    }

    public seleccionarEmpresa() {
        var alumno = this.alumno;
        var vacantes = false;
        alumno.empresa = this.empresa;

        this.listaAlumnosFinal.push(alumno);

        var i = this.listaAlumnosAux.map(function (e) { return e.id; }).indexOf(alumno.id);
        this.listaAlumnosAux.splice(i, 1);

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
