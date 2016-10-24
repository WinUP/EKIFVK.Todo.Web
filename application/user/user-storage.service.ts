import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { StorageService } from './storage.service'

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
export class UserStorageService {
    constructor(private storage: StorageService){

    }

    private username = new BehaviorSubject<string>(null);
    private isLogon = new BehaviorSubject<string>('false');
    public username$ = this.username.asObservable();
    public isActive$ = this.isLogon.asObservable();

    isSaved(type: StoragedUser): boolean {
        var data = this.readStorage(type);
        switch (type) {
            case StoragedUser.Token:
                var reg = new RegExp('\\w{8}-\\w{4}-\\w{4}-\\w{4}-\\w{12}');
                return reg.test(data);
            case StoragedUser.Username:
                return data != null;
            case StoragedUser.PasswordHash:
                return data != null;
            case StoragedUser.AutoLogin:
                return data != null;
            case StoragedUser.AutoRefresh:
                return data != null;
            default:
                return null;
        }
    }

    readCache(type: CachedUser): string {
        switch (type) {
            case CachedUser.Username:
                return this.username.getValue();
            case CachedUser.IsLogon:
                return this.isLogon.getValue();
            default:
                return null;
        }
    }

    cache(type: CachedUser, data: string): void {
        switch (type) {
            case CachedUser.Username:
                this.username.next(data);
                return;
            case CachedUser.IsLogon:
                this.isLogon.next(data);
                return;
        }
    }

    readStorage(type: StoragedUser): string {
        switch (type) {
            case StoragedUser.Token:
                return this.storage.getItem('token')
            case StoragedUser.Username:
                return this.storage.getItem('username');
            case StoragedUser.PasswordHash:
                return this.storage.getItem('password');
            case StoragedUser.AutoLogin:
                return this.storage.getItem('auto_login');
            case StoragedUser.AutoRefresh:
                return this.storage.getItem('auto_refresh');
            default:
                return null;
        }
    }

    save(type: StoragedUser, data: string): void {
        switch (type) {
            case StoragedUser.Token:
                this.storage.setItem('token', data);
                break;
            case StoragedUser.Username:
                this.storage.setItem('username', data);
                break;
            case StoragedUser.PasswordHash:
                this.storage.setItem('password', data);
            case StoragedUser.AutoLogin:
                this.storage.setItem('auto_login', data);
            case StoragedUser.AutoRefresh:
                this.storage.setItem('auto_refresh', data);
        }
    }
}