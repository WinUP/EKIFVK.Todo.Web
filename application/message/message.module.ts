import { NgModule } from '@angular/core'
import { Notification, Options, NotificationsService, SimpleNotificationsModule, SimpleNotificationsComponent } from 'angular2-notifications'
import { MessageService } from './message.service'

@NgModule({
  imports:      [ SimpleNotificationsModule ],
  declarations: [],
  exports:      [ SimpleNotificationsComponent ],
  providers:    [ MessageService ]
})
export class MessageModule { }