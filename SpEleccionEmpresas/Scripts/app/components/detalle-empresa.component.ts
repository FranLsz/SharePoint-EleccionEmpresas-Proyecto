import {Empresa}                                    from '../models/empresa'
import {LogService}                                 from '../services/log.service';
import {Component, OnInit}                          from 'angular2/core'

@Component({
    selector: 'detalle-empresa',
    templateUrl: BASE_URL + '/templates/detalle-empresa.template.html',
    inputs: ['empresa']
})

export class DetalleEmpresaComponent {

    public empresa: Empresa;

    constructor() { }

    ngOnInit() {
        console.log("Detalle empresa");
    }
}
