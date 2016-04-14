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
        new Empresa("Kabel", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ", 1),
        new Empresa("Plain Concepts", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ", 3),
        new Empresa("Softland", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ", 2)
    ];

    // Alumnos
    private alumnosData: Alumno[] = [
        new Alumno("Adrián", "Arranz Cuervo ", this.getRandomPuntacion()),
        new Alumno("Daniel", "Corregidor Coronado", this.getRandomPuntacion()),
        new Alumno("Félix", "Martínez Álvaro", this.getRandomPuntacion()),
        new Alumno("Álvaro", "Ramiro Ledesma", this.getRandomPuntacion()),
        new Alumno("José Antonio", "Pérez-Ruibal Del Águila", this.getRandomPuntacion()),
        new Alumno("Petter Paul", "Lozano Cruzado", this.getRandomPuntacion()),
        new Alumno("Eduardo", "Flores Miranda", this.getRandomPuntacion()),
        new Alumno("Miguel Ángel", "Gómez Sánchez", this.getRandomPuntacion()),
        new Alumno("Gabriel", "González-Santander Natera", this.getRandomPuntacion()),
        new Alumno("Alejandro", "García Francos", this.getRandomPuntacion()),
        new Alumno("David", "González Álvarez", this.getRandomPuntacion()),
        new Alumno("David", "Lozano Rivada", this.getRandomPuntacion()),
        new Alumno("Cristina", "Machuca Aparicio", this.getRandomPuntacion()),
        new Alumno("Julio César", "Ruperti Ortiz", this.getRandomPuntacion()),
        new Alumno("Julio César", "Rodríguez García José Ignacio", this.getRandomPuntacion()),
        new Alumno("José Carlos", "Quiroga Garre", this.getRandomPuntacion()),
        new Alumno("Gabriel", "Stanescu Mirel", this.getRandomPuntacion()),
        new Alumno("Francisco", "López Sánchez", this.getRandomPuntacion()),
        new Alumno("Álvaro", "Dama Jiménez", this.getRandomPuntacion()),
        new Alumno("Juan José", "García Herrero", this.getRandomPuntacion()),
    ];

}

