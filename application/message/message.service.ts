import { Injectable } from '@angular/core'
import { Response } from '@angular/http'
import { Subject }    from 'rxjs/Subject'
import { Notification, Options, NotificationsService } from 'angular2-notifications'
import { ResponseData, ServerConst, ServerMessage } from '../server'

export enum MessageType {
    Alert,
    Error,
    Info,
    Success
}

export interface Message {
    type: MessageType,
    title: string,
    content: string,
    options?: Options
}

export function handleServerError(error: Response): void {
    var data: ResponseData = error.json();

    var content = ServerConst[data.message] != undefined
                ? ServerMessage[ServerConst[data.message]]
                : data.message;
        this.message.show({
            title: 'SERVER ERROR',
            content: content,
            type: MessageType.Error
        });
}

@Injectable()
export class MessageService {
    constructor(private notify: NotificationsService) {

    }

    public show(message: Message) : Notification {
        var type: string;
        if (message.type == MessageType.Alert) type = 'alert';
        else if (message.type == MessageType.Error) type = 'error';
        else if (message.type == MessageType.Success) type = 'success';
        else type = 'info';
        return this.notify.create(message.title, message.content, type, message.options);
    }
    public remove(notify: Notification): void {
        this.notify.remove(notify.id);
    }
    public clear(): void {
        this.notify.remove();
    }
}