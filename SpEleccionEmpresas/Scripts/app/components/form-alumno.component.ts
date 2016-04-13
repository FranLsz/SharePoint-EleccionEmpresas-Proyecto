import {Alumno}                                                    from '../models/alumno'
import {DatosEvento}                                               from '../models/datos-evento'
import {AlumnoService}                                             from '../services/alumno.service'
import {LogService}                                                from '../services/log.service';
import {NgForm, Control, Validators, FormBuilder, ControlGroup}    from 'angular2/common'
import {Component, OnInit, OnChanges, EventEmitter}                from 'angular2/core'

@Component({
    selector: 'form-alumno',
    templateUrl: BASE_URL + '/templates/form-alumno.template.html',
    inputs: ['alumno', 'accion'],
    outputs: ['formAlumnoEvt']
})

export class FormAlumnoComponent {

    public accion: string;
    public btnAccion: string;
    public alumno: Alumno;
    public formAlumnoEvt: EventEmitter;
    public activo: boolean = true;
    public form: ControlGroup;

    constructor(private _alumnoService: AlumnoService, private builder: FormBuilder) {
        this.formAlumnoEvt = new EventEmitter();

        this.form = builder.group({
            "nombre": ['', Validators.required],
            "apellidos": ['', Validators.required],
            "puntuacion": ['', Validators.compose([Validators.required, this.comprobarSiEsNumero])]
        });

    };

    public comprobarSiEsNumero(fieldControl: Control) {
        if (!isNaN(fieldControl.value))
            return null;
        return { noNumero: false };
    }

    public ngOnInit() {
        this.btnAccion = "Agregar";
    }

    public ngOnChanges(cambios) {
        if (cambios.accion != null) {
            if (cambios.accion.currentValue == "Nuevo alumno") {
                this.btnAccion = "Agregar";
            } else {
                this.btnAccion = "Guardar cambios";
            }
        } else {
            if (this.accion == "Nuevo alumno")
                this.btnAccion = "Agregar";
            else
                this.btnAccion = "Guardar cambios";
        }
    }

    public onSubmit() {
        if (this.accion == "Nuevo alumno") {
            this._alumnoService.addAlumno(this.alumno).subscribe(
                data => {
                    this.lanzarEvento("AGREGAR_A_LISTA_ALUMNO", Alumno.fromJson(data.d));

                    this.reiniciarCampos();
                },
                err => { LogService.log("POST Alumnos Error: " + err._body); }
            );
        } else {
            this._alumnoService.putAlumno(this.alumno).subscribe(
                data => {
                    this.lanzarEvento("ACTUALIZAR_DE_LA_LISTA_ALUMNO", this.alumno);

                    this.accion = "Nuevo alumno"
                    this.btnAccion = "Dar de alta";

                    this.reiniciarCampos();
                },
                err => {
                    LogService.log("PUT Alumno Error: " + err._body);
                }
            );
        }
    }

     public deleteAlumno() {
        this._alumnoService.deleteAlumno(this.alumno).subscribe(
            data => {
                this.lanzarEvento("DELETE_ALUMNO", this.alumno);
                this.reiniciarCampos();
            },
            err => { LogService.error("Delete Alumno: " + err._body); }
        );
    }

    private reiniciarCampos() {
        // Reset de los campos
        this.alumno = new Alumno();
        this.activo = false;
        setTimeout(() => this.activo = true, 0);
    }

    public lanzarEvento(orden: string, datos: any) {
        this.formAlumnoEvt.next(new DatosEvento(orden, datos));
    }
}