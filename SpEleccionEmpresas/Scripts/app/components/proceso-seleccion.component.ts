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
    public noTuTurno: string;
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
                    console.log("HISTORIAL DEVUELTO", data.d.results[0]);
                    if (this.procesoActual.datosJson != "vacio") {
                        var auxList = [];
                        var auxJson = JSON.parse(this.procesoActual.datosJson);
                        for (var j = 0; j < auxJson.length; j++) {
                            var alum: Alumno;
                            alum.nombre = auxJson[j].nombre;
                            alum.apellidos = auxJson[j].apellidos;
                            alum.puntuacion = auxJson[j].puntuacion;
                            alum.userGuid = auxJson[j].userGuid;
                            alum.accountName = auxJson[j].accountName;
                            alum.id = auxJson[j].id;
                            alum.empresa = Empresa.fromJson(auxJson[j].empresa, true);
                            auxList.push(alum);
                        }

                        this.listaAlumnos = auxList;
                        // this.estadoProceso = <Alumno[]>Alumno.fromJsonList(JSON.parse(this.procesoActual.datosJson), true);
                    }
                    else
                        this.estadoProceso = [];


                    console.log(Empresa.fromJsonList(JSON.parse(this.procesoActual.empresasJson), true));
                    this.listaEmpresas = <Empresa[]>Empresa.fromJsonList(JSON.parse(this.procesoActual.empresasJson), true);
                    console.log(this.listaEmpresas);


                    this.listaAlumnos = <Alumno[]>Alumno.fromJsonList(JSON.parse(this.procesoActual.alumnosJson), true);
                    console.log("LISTADO EMPRESAS", this.listaEmpresas);
                    this.alumno = Alumno.getMayorPuntuacion(this.listaAlumnos);

                    // es tu turno
                    if (this.alumno.userGuid == this.alumnoLogeado.userGuid) {
                        this.noTuTurno = "siEs";

                    } else {

                        console.log("ALUMNOS RESTANTES", this.listaAlumnos);
                        var noHaSeleccionado = false;
                        //  comprueba si el alumno logeado esta entre los alumnos restantes
                        for (var i = 0; i < this.listaAlumnos.length; i++) {
                            if (this.listaAlumnos[i].userGuid == this.alumnoLogeado.userGuid) {
                                this.noTuTurno = "NoHaSeleccionado";
                                noHaSeleccionado = true;
                            }
                        }

                        if (!noHaSeleccionado) {
                            // no es tu turno porque ya has seleccionado
                            this.noTuTurno = "YaHaSeleccionado";
                        }
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

        var i = this.listaAlumnos.map(function (e) { return e.id; }).indexOf(alumno.id);
        this.listaAlumnos.splice(i, 1);

        this.empresa.vacantesLibres--;

        // Actualizamos las vacantes de la empresa y comprobamos si quedan vacantes libres en general
        for (var i = 0; i < this.listaEmpresas.length; i++) {
            console.log(this.listaEmpresas[i].id + "///" + this.empresa.id);
            if (this.listaEmpresas[i].id == this.empresa.id)
                this.listaEmpresas[i] = this.empresa;

            //si quedan vacantes
            if (this.listaEmpresas[i].vacantesLibres > 0)
                vacantes = true;
        }


        // si hay un siguiente alumno
        if (this.listaAlumnos.length > 0) {

            // si no quedan vacants
            if (!vacantes) {
                this.guardarCambios(true);

            } else {
                // si quedan buscamos otro alumno
                //this.alumno = Alumno.getMayorPuntuacion(this.listaAlumnosAux);
                //this.empresa = null;

                this.guardarCambios(false);
            }
        } else {
            // document.getElementById("volverAtras").style.display = 'block';
            this.guardarCambios(true);

        }
    }

    public guardarCambios(finalizado: boolean) {
        this.estadoProceso.push(this.alumno);

        this.procesoActual.datosJson = JSON.stringify(this.estadoProceso);
        this.procesoActual.terminado = finalizado;
        this.procesoActual.alumnosJson = JSON.stringify(this.listaAlumnos);
        this.procesoActual.empresasJson = JSON.stringify(this.listaEmpresas);
        console.log("HISTORIAL FINAL", this.procesoActual);
        this._historialService.putHistorial(this.procesoActual).subscribe(
            data => {
                this.noTuTurno = "YaHaSeleccionado";
            },
            err => { LogService.log("PUT Historial Error: " + err._body); }
        );
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
