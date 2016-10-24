import { Component } from '@angular/core';
import { Response } from '@angular/http'
import { Router } from '@angular/router'
import { UserStorageService, StoragedUser, CachedUser } from './user/user-storage.service'
import { UserService } from './user/user.service'
import { TaskService } from './task/task.service'
import { MessageService, Message, MessageType } from './message/message.service'
import { ServerConst, ServerMessage, ResponseData } from './server'

@Component({
    providers: [ TaskService ],
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
                if (data.message == ServerConst.SUCCESS){
                    this.storage.save(StoragedUser.AutoLogin, 'false');
					this.storage.save(StoragedUser.PasswordHash, null);
					this.storage.save(StoragedUser.Token, null);
					this.storage.cache(CachedUser.IsLogon, 'false');
					this.storage.cache(CachedUser.Username, null);
					this.router.navigate(['/login']);
                } else {
					this.message.show({
						type: MessageType.Error,
    					title: 'Error',
    					content: data.message,
					});
                }
            },
            (error: Response) =>{
                var data: ResponseData = error.json();
				this.message.show({
					type: MessageType.Error,
    				title: `Server ${error.status}`,
    				content: ServerMessage[data.message],
				});
            }
		)

	}
}