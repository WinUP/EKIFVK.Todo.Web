import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { RouterModule } from '@angular/router'
import { HttpModule } from '@angular/http'
import { FormsModule }   from '@angular/forms';
import { MaterialModule } from '@angular/material'
import { UserModule } from './user/user.module'
import { MessageModule } from './message/message.module'
import { ApplicationComponent } from './application.component'
import { LoginComponent } from './user/login.component'
import { TaskComponent } from './task/task.component'
import { TaskListComponent } from './task/task-list.component'
import { DashboardComponent } from './dashboard/dashboard.component'

@NgModule({
  imports: [BrowserModule, HttpModule, FormsModule, MessageModule, UserModule, MaterialModule.forRoot(),
            RouterModule.forRoot([
                { path: 'login',           component: LoginComponent },
                { path: 'login/:redirect', component: LoginComponent },
                { path: 'dashboard',       component: DashboardComponent },
                { path: '',                redirectTo: '/login', pathMatch: 'full' }
            ])],
    providers: [],
    declarations: [ApplicationComponent, TaskComponent, TaskListComponent, DashboardComponent],
    bootstrap: [ApplicationComponent]
})
export class ApplicationModule {
    // Nothing...
 }