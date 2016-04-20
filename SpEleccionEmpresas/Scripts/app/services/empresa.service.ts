import {Empresa}                   from '../models/empresa';
import 'rxjs/add/operator/map';
import {Http, Response, Headers}    from 'angular2/http';
import {Injectable}                 from 'angular2/core';

@Injectable()
export class EmpresaService {

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
    public getEmpresa() {
        return this.http.get(this.spApiUrl + "/_api/web/lists/getByTitle('Empresa')/items", { headers: this.setHeaders() }).map((res: Response) => res.json());
    }

    // POST
    public addEmpresa(empresa: Empresa) {

        var obj = {
            '__metadata': { 'type': 'SP.Data.EmpresaListItem' },
            'Nombre': empresa.nombre,
            'Descripcion': empresa.descripcion,
            'Vacantes': empresa.vacantes
        };

        var data = JSON.stringify(obj);
        return this.http.post(this.spApiUrl + "/_api/web/lists/getByTitle('Empresa')/items", data, { headers: this.setHeaders("POST") }).map((res: Response) => res.json());
    }

    // PUT
    public putEmpresa(empresa: Empresa) {

        var obj = {
            '__metadata': { 'type': 'SP.Data.EmpresaListItem' },
            'Nombre': empresa.nombre,
            'Descripcion': empresa.descripcion,
            'Vacantes': empresa.vacantes
        };

        var data = JSON.stringify(obj);
        return this.http.post(this.spApiUrl + "/_api/web/lists/getByTitle('Empresa')/items(" + empresa.id + ")", data, { headers: this.setHeaders("PUT") });
    }

    // DELETE
    public deleteEmpresa(empresa: Empresa) {
        return this.http.post(this.spApiUrl + "/_api/web/lists/getByTitle('Empresa')/items(" + empresa.id + ")", null, { headers: this.setHeaders("DELETE") });
    }
}