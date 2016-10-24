import { Injectable } from '@angular/core'

@Injectable()
export class StorageService {
    getItem(key: string): string {
        return window.localStorage.getItem(key);
    }

    setItem(key: string, value: any): void {
        window.localStorage.setItem(key, value);
    }

    removeItem(key: string): void {
        window.localStorage.removeItem(key);
    }
}