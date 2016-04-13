import {Empresa}                                    from '../models/empresa'
import {DatosEvento}                                from '../models/datos-evento'
import {LogService}                                 from '../services/log.service'
import {Component, OnInit, EventEmitter}            from 'angular2/core'

@Component({
    selector: 'detalle-empresa',
    templateUrl: BASE_URL + '/templates/detalle-empresa.template.html',
    inputs: ['empresa'],
    outputs: ['detalleEmpresaEvt']
})

export class DetalleEmpresaComponent {

    public empresa: Empresa;
    public detalleEmpresaEvt: EventEmitter;
    public confirmarSeleccion: boolean = false;
    public btnSeleccionar: string = "Seleccionar";

    constructor() {
        this.detalleEmpresaEvt = new EventEmitter;
    }

    public ngOnInit() { }

    public seleccionarEmpresa() {
        if (!this.confirmarSeleccion) {
            this.btnSeleccionar = "Confirmar";
            this.confirmarSeleccion = !this.confirmarSeleccion
        } else {
            this.btnSeleccionar = "Seleccionar";
            this.confirmarSeleccion = false;
            this.lanzarEvento("SELECCIONAR_EMPRESA", this.empresa);
        }
    }

    public lanzarEvento(orden: string, datos: any) {
        this.detalleEmpresaEvt.next(new DatosEvento(orden, datos));
    }
}
