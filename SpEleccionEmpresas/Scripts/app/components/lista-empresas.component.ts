import {Empresa}                                from '../models/empresa'
import {DatosEvento}                            from '../models/datos-evento'
import {EmpresaService}                         from '../services/empresa.service'
import {OrderBy}                                from '../pipes/order-by.pipe.ts'
import {AcortarTexto}                           from '../pipes/acortar-texto.pipe.ts'
import {Component, OnInit, EventEmitter}        from 'angular2/core'

@Component({
    selector: 'lista-empresas',
    templateUrl: BASE_URL + '/templates/lista-empresas.template.html',
    inputs: ['listaEmpresas'],
    outputs: ['listaEmpresasEvt'],
    pipes: [OrderBy, AcortarTexto]
})

export class ListaEmpresasComponent {
    public listaEmpresas: Empresa[];
    public empresa: Empresa;
    public listaEmpresasEvt: EventEmitter;

    constructor(private _empresaService: EmpresaService) {
        this.listaEmpresasEvt = new EventEmitter();
    };

    onSelect(empresa: Empresa) {
        this.lanzarEvento("EDITAR_EMPRESA", empresa);
    }

    lanzarEvento(orden: string, datos: any) {
        this.listaEmpresasEvt.next(new DatosEvento(orden, datos));
    }
}