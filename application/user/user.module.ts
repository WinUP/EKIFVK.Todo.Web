import { NgModule } from '@angular/core'
import { FormsModule }   from '@angular/forms';
import { MaterialModule } from '@angular/material'
import { Http, XHRBackend, RequestOptions } from '@angular/http'
import { StorageService } from './storage.service'
import { UserHttpService } from './user-http.service'
import { UserService } from './user.service'
import { UserStorageService } from './user-storage.service'

import { LoginComponent } from './login.component'

export function httpFactory(xhrBackend, requestOptions, user: UserStorageService) {
    return new UserHttpService(xhrBackend, requestOptions, user);
}

@NgModule({
  imports:      [ FormsModule, MaterialModule.forRoot() ],
  declarations: [ LoginComponent ],
  exports:      [ LoginComponent ],
  providers:    [ StorageService, UserStorageService, {provide: Http, useFactory: httpFactory, deps: [XHRBackend, RequestOptions, UserStorageService]}, UserService ]
})
export class UserModule { }