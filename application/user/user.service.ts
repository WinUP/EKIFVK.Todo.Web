import { Injectable } from '@angular/core'
import { Http, Response } from '@angular/http'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Observable } from 'rxjs/Observable'

export enum StoragedUser {
    Username,
    PasswordHash,
    Token,
    AutoLogin,
    AutoRefresh
}

export enum CachedUser {
    Username,
    IsLogon
}

@Injectable()
export class UserService {
    constructor(private http: Http){

    }

    register(username: string, passwordHash: string, tag: string): Observable<Response> {
        return this.http.post(`/user/${username}`, {password: passwordHash, tag: tag});
    }

    login(username: string, passwordHash: string): Observable<Response> {
        return this.http.put(`/user/${username}?password=${passwordHash}`, null);
    }

    logout(username: string): Observable<Response> {
        return this.http.patch( `/user/${username}`, {operation: 'token', data: ''});
    }
}