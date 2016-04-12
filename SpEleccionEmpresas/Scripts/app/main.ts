import {AppComponent}                       from './components/app.component'
import {bootstrap}                          from 'angular2/platform/browser'
import {HTTP_PROVIDERS}                     from 'angular2/http';
import {ROUTER_PROVIDERS, APP_BASE_HREF}    from 'angular2/router';
import {provide}                            from 'angular2/core';
import {EmpresaService}                     from './services/empresa.service'
import {AlumnoService}                      from './services/alumno.service'

bootstrap(AppComponent, [
    HTTP_PROVIDERS,
    ROUTER_PROVIDERS,
    provide(APP_BASE_HREF, { useValue: window.location.href + '/#/' }),
    EmpresaService,
    AlumnoService
]);