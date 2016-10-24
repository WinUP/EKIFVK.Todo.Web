import { Injectable } from '@angular/core'
import { Http, Headers, Request, Response, RequestOptions, RequestOptionsArgs, ConnectionBackend } from '@angular/http'
import { UserStorageService, StoragedUser } from './user-storage.service'
import { ResponseData, ServerConst } from '../server'
import { Observable } from 'rxjs/Observable'
import '../rxjs-extensions'

enum RequestType {
    GET,
    POST,
    PUT,
    PATCH,
    DELETE
}
/**
 * User client HTTP client
 * When token is overtime, this client will automatically refresh and re-post the http request which failed
 */
@Injectable()
export class UserHttpService extends Http {
    constructor(backend: ConnectionBackend, defaultOptions: RequestOptions, private user: UserStorageService) {
        super(backend, defaultOptions);
    }

    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        var op = this.decorate(options);
         url = ServerConst.URL + url;
        return this.intercept(super.get(url, op), RequestType.GET, url, op);
    }

    post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        var op = this.decorate(options);
         url = ServerConst.URL + url;
        return this.intercept(super.post(url, body, op), RequestType.POST, url, op, body);
    }
 
    put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        var op = this.decorate(options);
         url = ServerConst.URL + url;
        return this.intercept(super.put(url, body, op), RequestType.PUT, url, op, body);
    }
 
    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        var op = this.decorate(options);
        url = ServerConst.URL + url;
        return this.intercept(super.delete(url, op), RequestType.DELETE, url, op);
    }

    patch(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        var op = this.decorate(options);
        url = ServerConst.URL + url;
        return this.intercept(super.patch(url, body, op), RequestType.PATCH, url, op, body);
    }

    private intercept(observable: Observable<Response>, type: RequestType, url: string, options?: RequestOptionsArgs, body?: string): Observable<Response> {
        return observable.catch((response: Response, observer) => {
            var data: ResponseData = response.json();
            if(response.status == 403 && data.message == ServerConst.PERMISSION_OUTOFTIME && this.user.readStorage(StoragedUser.AutoRefresh) == 'true'){
                return super.put(`${ServerConst.URL}/user/${this.user.readStorage(StoragedUser.Username)}?password=${this.user.readStorage(StoragedUser.PasswordHash)}`, null).mergeMap(value => {
                    var data: ResponseData = value.json();
                    this.user.save(StoragedUser.Token, data.data);
                    options.headers.set('X-Access-Token', data.data);
                    switch (type) {
                        case RequestType.GET:
                            return super.get(url, options);
                        case RequestType.POST:
                            return super.post(url, body, options);
                        case RequestType.PUT:
                            return super.put(url, body, options);
                        case RequestType.PATCH:
                            return super.patch(url, body, options);
                        case RequestType.DELETE:
                            return super.delete(url, options);
                        default:
                            return Observable.throw(response);
                    }                  
                }).catch((err: Response, caught) => Observable.throw(err));
            } else
                return Observable.throw(response);
        });
    }

    private decorate(options?: RequestOptionsArgs) : RequestOptionsArgs {
        if (options == null) {
            options = new RequestOptions();
        }
        if (options.headers == null) {
            options.headers = new Headers();
        }
        options.headers.append('Content-Type', 'application/json');
        if(this.user.isSaved(StoragedUser.Token)){
            options.headers.append('X-Access-Token', this.user.readStorage(StoragedUser.Token));
        }
        return options;
    }
}