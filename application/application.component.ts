import { Component } from '@angular/core';
import { Router } from '@angular/router'
import { Response } from '@angular/http'
import { ResponseData } from './server'
import { UserStorageService, StoragedUser, CachedUser } from './user/user-storage.service'
import { UserService } from './user/user.service'
import { MessageService, handleServerError } from './message/message.service'

@Component({
    providers: [],
    selector: 'application',
    templateUrl: 'view/application.component.html'
})
export class ApplicationComponent {
	private isLogon: string;
	private NotificationOptions = {
		position: ['bottom', 'left'],
		timeOut: 6000,
		showProgressBar: false,
		animate: 'fromLeft'
	}

    constructor(private router: Router,
				private message: MessageService,
				private storage: UserStorageService,
				private user: UserService){
		this.storage.isActive$.subscribe(e => this.isLogon = e);
    }

	private logout(): void {
		this.user.logout(this.storage.readCache(CachedUser.Username)).subscribe(
			(value: Response) =>{
                var data: ResponseData = value.json();
                this.storage.save(StoragedUser.AutoLogin, 'false');
				this.storage.save(StoragedUser.PasswordHash, null);
				this.storage.save(StoragedUser.Token, null);
				this.storage.cache(CachedUser.IsLogon, 'false');
				this.storage.cache(CachedUser.Username, null);
				this.router.navigate(['/login']);
            }, handleServerError
		);
	}
}