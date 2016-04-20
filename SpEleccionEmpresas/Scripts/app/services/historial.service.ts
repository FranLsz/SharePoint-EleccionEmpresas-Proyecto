import {Historial}                  from '../models/historial'
import 'rxjs/add/operator/map';
import {Http, Response, Headers}    from 'angular2/http';
import {Injectable}                 from 'angular2/core';

@Injectable()
export class HistorialService {

    private spApiUrl: string;

    constructor(private http: Http) {
        this.spApiUrl = _spPageContextInfo.webServerRelativeUrl;
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
    public getHistorial() {
        return this.http.get(this.spApiUrl + "/_api/web/lists/getByTitle('EmpresaAlumno')/items", { headers: this.setHeaders() }).map((res: Response) => res.json());
    }

    // POST
    public addHistorial(historial: Historial) {

        var obj = {
            '__metadata': { 'type': 'SP.Data.EmpresaAlumnoListItem' },
            'DatosJson': historial.datosJson,
            'Fecha': historial.fecha,
        };

        var data = JSON.stringify(obj);
        return this.http.post(this.spApiUrl + "/_api/web/lists/getByTitle('EmpresaAlumno')/items", data, { headers: this.setHeaders("POST") }).map((res: Response) => res.json());
    }
}