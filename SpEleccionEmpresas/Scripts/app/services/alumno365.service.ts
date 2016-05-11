import {Alumno}                     from '../models/alumno';
import {Historial}                  from '../models/historial'
import 'rxjs/add/operator/map';
import {Http, Response, Headers}    from 'angular2/http';
import {Injectable}                 from 'angular2/core';

@Injectable()
export class Alumno365Service {

    private spApiUrl: string;
    private spCompanyName: string;

    constructor(private http: Http) {
        this.spApiUrl = _spPageContextInfo.webServerRelativeUrl;

        //temporal
        this.spCompanyName = "franapp";


    }

    // SET HEADERS
    private setHeaders(verb?: string) {
        var headers = new Headers();

        var digest = document.getElementById('__REQUESTDIGEST').value;
        headers.set('Accept', 'application/json;odata=verbose');
        headers.set('X-RequestDigest', digest);

        switch (verb) {
            case "POST":
                headers.set('Content-type', 'application/json;odata=verbose');
                break;
            case "PUT":
                headers.set('Content-type', 'application/json;odata=verbose');
                headers.set("IF-MATCH", "*");
                headers.set("X-HTTP-Method", "MERGE");
                break;
            case "DELETE":
                headers.set("IF-MATCH", "*");
                headers.set("X-HTTP-Method", "DELETE");
                break;
        }

        return headers;
    }

    // GET
    public getAlumno() {
        //return this.http.get(this.spApiUrl + "/_api/SP.UserProfiles.PeopleManager/GetPropertiesFor(accountName=@v)?@v='i:0%23.f|membership|fran@franapp.onmicrosoft.com'", { headers: this.setHeaders() }).map((res: Response) => res.json());
    }

    public getAlumnoByUserName(name: string) {
        return this.http.get(
            this.spApiUrl + "/_api/SP.UserProfiles.PeopleManager/GetPropertiesFor(accountName=@v)?@v='i:0%23.f|membership|" + name + "@" + this.spCompanyName + ".onmicrosoft.com'",
            { headers: this.setHeaders() }).map((res: Response) => res.json());
    }

    // POST
    public addAlumno(alumno: Alumno) {

        var obj = {
            '__metadata': { 'type': 'SP.Data.AlumnoListItem' },
            'Nombre': alumno.nombre,
            'Apellidos': alumno.apellidos,
            'Puntuacion': alumno.puntuacion
        };

        var data = JSON.stringify(obj);
        return this.http.post(this.spApiUrl + "/_api/web/lists/getByTitle('Alumno')/items", data, { headers: this.setHeaders("POST") }).map((res: Response) => res.json());
    }

    // PUT
    public putAlumno(alumno: Alumno) {

        var obj = {
            '__metadata': { 'type': 'SP.Data.AlumnoListItem' },
            'Nombre': alumno.nombre,
            'Apellidos': alumno.apellidos,
            'Puntuacion': alumno.puntuacion
        };

        var data = JSON.stringify(obj);
        return this.http.post(this.spApiUrl + "/_api/web/lists/getByTitle('Alumno')/items(" + alumno.id + ")", data, { headers: this.setHeaders("PUT") });
    }

    // DELETE
    public deleteAlumno(alumno: Alumno) {
        return this.http.post(this.spApiUrl + "/_api/web/lists/getByTitle('Alumno')/items(" + alumno.id + ")", null, { headers: this.setHeaders("DELETE") });
    }
}