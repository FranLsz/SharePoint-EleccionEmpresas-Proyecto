import {Empresa}                                    from '../models/empresa'
import {Alumno}                                     from '../models/alumno'
import {EmpresaService}                             from '../services/empresa.service'
import {AlumnoService}                              from '../services/alumno.service'
import {Inject, Injectable}                         from 'angular2/core';

export class DataInitService {

    constructor( @Inject(EmpresaService) private _empresaService: EmpresaService, @Inject(AlumnoService) private _alumnoService: AlumnoService) { }

    public init() {
        return new Promise(resolve => {

            // Se recorren ambas listas de datos y se insertan en las listas de SharePoint
            for (var i = 0; i < this.empresasData.length; i++) {
                this._empresaService.addEmpresa(this.empresasData[i]).subscribe(
                    data => { },
                    err => { console.log("POST Empresa: " + err._body); }
                );
            }

            for (var i = 0; i < this.alumnosData.length; i++) {
                this._alumnoService.addAlumno(this.alumnosData[i]).subscribe(
                    data => { },
                    err => { console.log("POST Empresa: " + err._body); }
                );
            }

            resolve();
        });
    }

    private getRandomPuntacion() {
        var max = 100;
        var min = 0;
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    // Empresas
    private empresasData: Empresa[] = [
        new Empresa("Kabel", ".NET C# SharePoint .NET C# SharePoint .NET C# SharePoint .NET C# SharePoint", 1),
        new Empresa("Plain Concepts", "C# .NET MVC .NET C# SharePoint .NET C# SharePoint .NET C# SharePoint", 3),
        new Empresa("Softland", "MVC C# .NET .NET C# SharePoint .NET C# SharePoint .NET C# SharePoint", 2)
    ];

    // Alumnos
    private alumnosData: Alumno[] = [
        new Alumno("Bob", "Fill Clark", this.getRandomPuntacion()),
        new Alumno("Lucy", "Sum Hey", this.getRandomPuntacion()),
        new Alumno("Kouk", "Bale Nill", this.getRandomPuntacion()),
        new Alumno("Kouk", "Bale Nill", this.getRandomPuntacion()),
        new Alumno("Kouk", "Bale Nill", this.getRandomPuntacion()),
        new Alumno("Kouk", "Bale Nill", this.getRandomPuntacion()),
        new Alumno("Kouk", "Bale Nill", this.getRandomPuntacion()),
        new Alumno("Kouk", "Bale Nill", this.getRandomPuntacion()),
        new Alumno("Kouk", "Bale Nill", this.getRandomPuntacion()),
        new Alumno("Kouk", "Bale Nill", this.getRandomPuntacion())
    ];

}

