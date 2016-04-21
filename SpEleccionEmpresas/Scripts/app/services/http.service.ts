// EN CONSTRUCCION
// EN CONSTRUCCION
// EN CONSTRUCCION
// EN CONSTRUCCION

import {Http, Headers, Response}    from 'angular2/http'
import {Injectable}                 from 'angular2/core'
import 'rxjs/add/operator/map';

@Injectable()
export class HttpService {

    private spApiUrl: string;
    private spListName: string;

    constructor(private http: Http) {
        this.spListName = "ListName";
        this.spApiUrl = _spPageContextInfo.webServerRelativeUrl + "/_api/web/lists/getByTitle('" + this.spListName + "')";
    }

    // GET HEADERS
    private getHeaders(verb?: string) {
        var headers = new Headers();
        var digest = document.getElementById('__REQUESTDIGEST').value;

        headers.set('X-RequestDigest', digest);
        headers.set('Accept', 'application/json;odata=verbose');

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
    public getData() {
        return this.http.get(this.spApiUrl + "/items", { headers: this.getHeaders() }).map((res: Response) => res.json());
    }

    // POST
    public addData(model: any) {

        var obj = {
            '__metadata': { 'type': "SP.Data." + this.spListName + "ListItem" },
            //'Nombre': model.nombre,
            //'Apellidos': model.apellidos,
            //'Nota': model.nota
        };

        var data = JSON.stringify(obj);
        return this.http.post(this.spApiUrl + "/items", data, { headers: this.getHeaders("POST") }).map((res: Response) => res.json());
    }

    // PUT
    public putData(model: any) {

        var obj = {
            '__metadata': { 'type': "SP.Data." + this.spListName + "ListItem" },
            //'Nombre': model.nombre,
            //'Apellidos': model.apellidos,
            //'Nota': model.nota
        };

        var data = JSON.stringify(obj);
        return this.http.post(this.spApiUrl + "/items(" + model.id + ")", data, { headers: this.getHeaders("PUT") });
    }

    // DELETE
    public deleteData(model: any) {
        return this.http.post(this.spApiUrl + "/items(" + model.id + ")", null, { headers: this.getHeaders("DELETE") });
    }
}