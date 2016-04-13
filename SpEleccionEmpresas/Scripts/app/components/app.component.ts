import {HomeComponent}                              from './home.component'
import {ROUTER_DIRECTIVES, RouteConfig, Router}     from 'angular2/router'
import {LogService}                                 from '../services/log.service';
import {DataInitService}                            from '../services/data-init.service';
import {Component, OnInit}                          from 'angular2/core'

@Component({
    selector: 'app-main',
    templateUrl: BASE_URL + '/templates/app.template.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [DataInitService]
})

@RouteConfig([
    {
        path: '/',
        component: HomeComponent,
        name: 'Home'
    }
])

export class AppComponent {

    constructor(private router: Router, private _dataInitService: DataInitService) { }

    public ngOnInit() {

        // Si es la primera ejecucion del add in, cargamos datos en las listas
        if (localStorage.getItem("DATOS_INICIALIZADOS") == null) {

            LogService.info("Primera ejecución, inicializando datos..");

            this._dataInitService.init().then(
                () => {
                    localStorage.setItem("DATOS_INICIALIZADOS", "true");
                    LogService.log("Datos cargados correctamente");
                    this.router.navigate(['/Home']);
                }
            );

        } else {
            this.router.navigate(['/Home']);
        }

    }
}
