import {Empresa}                                    from '../models/empresa'
import {Alumno}                                     from '../models/alumno'
import {EmpresaService}                             from '../services/empresa.service'
import {AlumnoService}                              from '../services/alumno.service'
import {Injectable}                                 from 'angular2/core';

@Injectable()
export class DataInitService {

    constructor(private _empresaService: EmpresaService, private _alumnoService: AlumnoService) { }

    public init() {
        return new Promise(resolve => {

            // se obtienen los registros actuales
            this._empresaService.getEmpresa().subscribe(
                data => {

                    //// si no hay...
                    if (data.d.results.length == 0) {
                        // ...los añade
                        for (var i = 0; i < this.empresasData.length; i++) {
                            this._empresaService.addEmpresa(this.empresasData[i]).subscribe(
                                data => { },
                                err => { console.log("POST Empresa: " + err._body); }
                            );
                        }
                    }
                    ////
                },
                err => { console.log("GET Empresa: " + err._body); }
            );


            // se obtienen los registros actuales
            this._alumnoService.getAlumno().subscribe(
                data => {

                    //// si no hay...
                    if (data.d.results.length == 0) {
                        // ...los añade
                        for (var i = 0; i < this.alumnosData.length; i++) {
                            this._alumnoService.addAlumno(this.alumnosData[i]).subscribe(
                                data => { },
                                err => { console.log("POST Alumno: " + err._body); }
                            );
                        }
                    }
                    ////
                },
                err => { console.log("GET Alumno: " + err._body); }
            );

            resolve();
        });
    }

    private getRandomPuntacion() {
        return _.random(0, 100);
    }

    // Empresas
    private empresasData: Empresa[] = [
        new Empresa("Kabel", "Empresa española fundada en 1995 que realiza proyectos de desarrollo de software e infraestructuras, y que presta servicios de consultoría en el ámbito de las tecnologías de la información. Microsoft Partner. Url: http://www.kabel.es/", 2, 2),
        new Empresa("Bravent", "Bravent es una Consultora IT especializada en tecnologías Microsoft formada por un equipo que combina experiencia, creatividad y compromiso.", 3, 3),
        new Empresa("Raona", "Consultora internacional en nuevas tecnologías con más de 10 años de experiencia especializada en el desarrollo de soluciones Microsoft.", 2, 2),
        new Empresa("Encamina", "Somos una consultora especializada en tecnología y productos Microsoft, que ofrecemos mejoras de competitividad a organizaciones medianas y grandes, mediante soluciones BI, ECM, CRM y BPM, a través del canal web, la nube y la movilidad empresarial.", 1, 1),
        new Empresa("Tokiota", "TOKIOTA es una compañía nacida en Barcelona, muy cercana a sus clientes. Flexible a cada cliente y escenario, pero procedimental, para garantizar la calidad y el éxito de los proyectos.Orientada a proporcionar soluciones de Negocio con base Tecnológica.", 1, 1),
        new Empresa("Spenta", "Spenta is a Microsoft boutique specialized in cloud computing, SharePoint and related technologies. Founded in 2001, has been awarded twice by Microsoft as World Wide Partner of the Year. With offices in Barcelona, Madrid, Singapore and in 2013 in Sillicon Valley", 2, 2),
        new Empresa("Avanade", "Avanade ayuda a los clientes a obtener resultados en un mundo digital, mediante soluciones tecnológicas empresariales y servicios gestionados en cloud que combinan conocimiento, innovación y experiencia en tecnologías de Microsoft.", 4, 4),
        new Empresa("Miss Tipsi", "Miss Tipsi es un software de TPV y tablets para hostelería que te facilita la gestión de tu restaurante, ayudando a aumentar tus ventas y mejorando tus beneficios.Gestiona el servicio de manera más eficaz con un software a medida. Controla todos los aspectos de tu negocio estés donde estés con tus datos seguros en la nube.", 4, 4),
        new Empresa("Plain Concepts", "Plain Concepts is a leading Microsoft Technology Company. Plain Concepts is specialized in creating cutting-edge, state-of-the-art solutions using the latest Microsoft technologies. Our incredible team is formed by Microsoft MVPs and other experienced professionals in areas like C#, UX, Azure, XBOX, XNA, or Windows Phone.", 2, 2),
        new Empresa("MVP Cluster", "MVP Cluster es una empresa joven formada por Microsoft Most Valuable Professionals (MVPs), IT PROs, Desarrolladores y Microsoft Certified Trainers (MCTs), especializada en Tecnologías Y Plataformas de Microsoft diversas, Soluciones de Colaboración, Productividad, Comunicaciones Unificadas, Seguridad así como Formación Especializada por áreas de conocimiento.", 1, 1),
        new Empresa("Last Mile", "Last Mile Team® es una empresa de Software-como-Servicio cuyo objetivo es la mejora continua de la experiencia de cliente acompañada del incremento simultáneo de los resultados económico, social y medioambiental para todos los integrantes de la cadena de valor.", 1, 1),
        new Empresa("Softland", "Grupo Softland, líder en soluciones empresariales ERP, posee oficinas locales en: Argentina, Colombia, Chile, Costa Rica, El Salvador, España, Guatemala, Honduras, México, Panamá, Perú y República Dominicana.", 1, 1),
    ];

    // Alumnos
    private alumnosData: Alumno[] = [
        new Alumno("Adrián", "Arranz Cuervo ", this.getRandomPuntacion(), 0, "672ef9b0-6c2e-480f-bcad-917f8e304728", "fran1@franapp.onmicrosoft.com"),
        new Alumno("Daniel", "Corregidor Coronado", this.getRandomPuntacion(), 1, "552ef9b0-6c2e-480f-bcad-917f8e304729", "fran2@franapp.onmicrosoft.com"),
        new Alumno("Félix", "Martínez Álvaro", this.getRandomPuntacion(), 2, "002ef9b0-6c2e-480f-bcad-917f8e304727", "fran3@franapp.onmicrosoft.com"),
        new Alumno("Álvaro", "Ramiro Ledesma", this.getRandomPuntacion(), 3, "332ef9b0-6c2e-480f-bcad-917f8e304726", "fran4@franapp.onmicrosoft.com"),
        new Alumno("José Antonio", "Pérez-Ruibal Del Águila", this.getRandomPuntacion(), 4, "192ef9b0-6c2e-480f-bcad-917f8e304725", "fran5@franapp.onmicrosoft.com"),
        //new Alumno("Petter Paul", "Lozano Cruzado", this.getRandomPuntacion(), 5, "192ef9b0-6c2e-480f-bcad-917f8e304729", "fran@franapp.onmicrosoft.com"),
        //new Alumno("Eduardo", "Flores Miranda", this.getRandomPuntacion(), 6, "192ef9b0-6c2e-480f-bcad-917f8e304729", "fran@franapp.onmicrosoft.com"),
        //new Alumno("Miguel Ángel", "Gómez Sánchez", this.getRandomPuntacion(), 7, "192ef9b0-6c2e-480f-bcad-917f8e304729", "fran@franapp.onmicrosoft.com"),
        //new Alumno("Gabriel", "González-Santander Natera", this.getRandomPuntacion(), 8,"192ef9b0-6c2e-480f-bcad-917f8e304729", "fran@franapp.onmicrosoft.com"),
        //new Alumno("Alejandro", "García Francos", this.getRandomPuntacion(), 9, "192ef9b0-6c2e-480f-bcad-917f8e304729", "fran@franapp.onmicrosoft.com"),
        //new Alumno("David", "González Álvarez", this.getRandomPuntacion(), 10, "192ef9b0-6c2e-480f-bcad-917f8e304729", "fran@franapp.onmicrosoft.com"),
        //new Alumno("David", "Lozano Rivada", this.getRandomPuntacion()),
        //new Alumno("Cristina", "Machuca Aparicio", this.getRandomPuntacion()),
        //new Alumno("Julio César", "Ruperti Ortiz", this.getRandomPuntacion()),
        //new Alumno("Julio César", "Rodríguez García José Ignacio", this.getRandomPuntacion()),
        //new Alumno("José Carlos", "Quiroga Garre", this.getRandomPuntacion()),
        //new Alumno("Mirel Gabriel", "Stanescu", this.getRandomPuntacion()),
        //new Alumno("Francisco", "López Sánchez", this.getRandomPuntacion()),
        //new Alumno("Álvaro", "Dama Jiménez", this.getRandomPuntacion()),
        //new Alumno("Juan José", "García Herrero", this.getRandomPuntacion()),
    ];
}

