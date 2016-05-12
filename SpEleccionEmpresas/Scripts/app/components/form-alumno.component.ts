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
    public o365UserName: string;
    public formAlumnoEvt: EventEmitter;
    public activo: boolean = true;
    public userNameValido: number;
    public user365: any;

    // Form
    public form: ControlGroup;
    //public nombre: Control;
    //public apellidos: Control;
    public puntuacion: Control;

    constructor(private _alumnoService: AlumnoService, private builder: FormBuilder) {
        this.formAlumnoEvt = new EventEmitter();

        //this.nombre = new Control('', Validators.required);
        //this.apellidos = new Control('', Validators.required);
        this.puntuacion = new Control('', Validators.compose([Validators.required, this.comprobarSiEsNumero]));

        this.form = builder.group({
            //"nombre": this.nombre,
            //"apellidos": this.apellidos,
            "puntuacion": this.puntuacion
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

    public buscarUsuario(userName) {
        userName = userName.toLowerCase();

        // 0 -> no valido
        // 1 -> valido
        // 2 -> limpio

        if (userName.length == 0) {
            this.userNameValido = 2;
            return;
        }

        // pendiente
        if (!userName.match(/[a-z0-9]/)) {
            this.userNameValido = 0;
            return;
        }

        this._alumnoService.get365UserByName(userName).subscribe(
            data => {
                if (typeof (data.d.AccountName) != 'undefined') {
                    this.userNameValido = 1;
                    this.user365 = data.d;
                }
                else {
                    this.userNameValido = 0;
                }
            },
            err => {
                LogService.log("Alumno 365: " + err._body);
            }
        );

    }

    public onSubmit() {
        if (this.accion == "Nuevo alumno") {

            this.alumno.accountName = this.user365.AccountName;
            this.alumno.userGuid = this.user365.UserProfileProperties.results[0].Value;
            this.alumno.nombre = this.user365.UserProfileProperties.results[4].Value;
            this.alumno.apellidos = this.user365.UserProfileProperties.results[6].Value;

            this._alumnoService.addAlumno(this.alumno).subscribe(
                data => {
                    console.log(data.d);
                    this.lanzarEvento("AGREGAR_A_LISTA_ALUMNO", Alumno.fromJson(data.d, false));
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

        this.o365UserName = "";
        this.userNameValido = 2;

        this.form['_touched'] = false; 
        this.form['_pristine'] = true;

        //this.nombre['_touched'] = false;
        //this.nombre['_pristine'] = true;
        //this.nombre['_valid'] = true;

        //this.apellidos['_touched'] = false;
        //this.apellidos['_pristine'] = true;
        //this.apellidos['_valid'] = true;

        this.puntuacion['_touched'] = false;
        this.puntuacion['_pristine'] = true;
        this.puntuacion['_valid'] = true;
    }

    public lanzarEvento(orden: string, datos: any) {
        this.formAlumnoEvt.next(new DatosEvento(orden, datos));
    }
}