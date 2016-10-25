import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { RouterModule } from '@angular/router'
import { HttpModule } from '@angular/http'
import { FormsModule }   from '@angular/forms';
import { MaterialModule } from '@angular/material'
import { ModalModule } from 'ng2-bootstrap/ng2-bootstrap';
import { UserModule } from './user/user.module'
import { TaskModule } from './task/task.module'
import { MessageModule } from './message/message.module'
import { ApplicationComponent } from './application.component'
import { LoginComponent } from './user/login.component'
import { DashboardComponent } from './dashboard/dashboard.component'

@NgModule({
  imports: [BrowserModule, HttpModule, FormsModule, MaterialModule.forRoot(),
            MessageModule, UserModule, TaskModule, ModalModule,
            RouterModule.forRoot([
                { path: 'login',           component: LoginComponent },
                { path: 'login/:redirect', component: LoginComponent },
                { path: 'dashboard',       component: DashboardComponent },
                { path: '',                redirectTo: '/login', pathMatch: 'full' }
            ])],
    providers: [],
    declarations: [ApplicationComponent, DashboardComponent],
    bootstrap: [ApplicationComponent]
})
export class ApplicationModule {
    // Nothing...
 }