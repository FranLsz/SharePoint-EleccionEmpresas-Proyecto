import {Empresa}                                                   from '../models/empresa'
import {DatosEvento}                                               from '../models/datos-evento'
import {EmpresaService}                                            from '../services/empresa.service'
import {LogService}                                                from '../services/log.service';
import {NgForm, Control, Validators, FormBuilder, ControlGroup}    from 'angular2/common'
import {Component, OnInit, OnChanges, EventEmitter}                from 'angular2/core'

@Component({
    selector: 'form-empresa',
    templateUrl: BASE_URL + '/templates/form-empresa.template.html',
    inputs: ['empresa', 'accion'],
    outputs: ['formEmpresaEvt']
})

export class FormEmpresaComponent {

    public accion: string;
    public btnAccion: string;
    public empresa: Empresa;
    public formEmpresaEvt: EventEmitter;
    public activo: boolean = true;

    // Form
    public form: ControlGroup;
    public nombre: Control;
    public descripcion: Control;
    public vacantes: Control;

    constructor(private _empresaService: EmpresaService, private builder: FormBuilder) {
        this.formEmpresaEvt = new EventEmitter();

        this.nombre = new Control('', Validators.required);
        this.descripcion = new Control('', Validators.required);
        this.vacantes = new Control('', Validators.compose([Validators.required, this.comprobarSiEsNumero]));

        this.form = builder.group({
            "nombre": this.nombre,
            "descripcion": this.descripcion,
            "vacantes": this.vacantes
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
            if (cambios.accion.currentValue == "Nueva empresa") {
                this.btnAccion = "Agregar";
            } else {
                this.btnAccion = "Guardar cambios";
            }
        } else {
            if (this.accion == "Nueva empresa")
                this.btnAccion = "Agregar";
            else
                this.btnAccion = "Guardar cambios";
        }
    }

    public onSubmit() {
        if (this.accion == "Nueva empresa") {
            this._empresaService.addEmpresa(this.empresa).subscribe(
                data => {
                    this.lanzarEvento("AGREGAR_A_LISTA_EMPRESA", Empresa.fromJson(data.d));
                    this.reiniciarCampos();
                },
                err => { LogService.log("POST Empresas Error: " + err._body); }
            );
        } else {
            this.empresa.vacantesLibres = this.empresa.vacantes;

            this._empresaService.putEmpresa(this.empresa).subscribe(
                data => {
                    this.lanzarEvento("ACTUALIZAR_DE_LA_LISTA_EMPRESA", this.empresa);

                    this.accion = "Nueva empresa"
                    this.btnAccion = "Dar de alta";

                    this.reiniciarCampos();
                },
                err => {
                    LogService.log("PUT Empresa Error: " + err._body);
                }
            );
        }
    }

    public deleteEmpresa() {
        this._empresaService.deleteEmpresa(this.empresa).subscribe(
            data => {
                this.lanzarEvento("DELETE_EMPRESA", this.empresa);
                this.reiniciarCampos();
            },
            err => { LogService.error("Delete Empresa: " + err._body); }
        );
    }

    private reiniciarCampos() {
        // Reset de los campos
        this.empresa = new Empresa();

        this.form['_touched'] = false;
        this.form['_pristine'] = true;

        this.nombre['_touched'] = false;
        this.nombre['_pristine'] = true;
        this.nombre['_valid'] = true;

        this.descripcion['_touched'] = false;
        this.descripcion['_pristine'] = true;
        this.descripcion['_valid'] = true;

        this.vacantes['_touched'] = false;
        this.vacantes['_pristine'] = true;
        this.vacantes['_valid'] = true;
    }

    public lanzarEvento(orden: string, datos: any) {
        this.formEmpresaEvt.next(new DatosEvento(orden, datos));
    }
}