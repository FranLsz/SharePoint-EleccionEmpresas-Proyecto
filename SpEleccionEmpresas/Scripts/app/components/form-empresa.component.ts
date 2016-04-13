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

    constructor(private _empresaService: EmpresaService, private builder: FormBuilder) {
        this.formEmpresaEvt = new EventEmitter();
    };

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

        //this.form['_touched'] = false;
        //this.control['_touched'] = false;


        // Reset de los campos
        this.empresa = new Empresa();
        this.activo = false;
        setTimeout(() => this.activo = true, 0);
    }

    public lanzarEvento(orden: string, datos: any) {
        this.formEmpresaEvt.next(new DatosEvento(orden, datos));
    }
}