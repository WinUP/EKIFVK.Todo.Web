import { Component, OnInit, AfterViewInit, ElementRef, trigger, state, style, transition, animate, AnimationTransitionEvent } from '@angular/core';
import { Response } from '@angular/http'
import { Router, ActivatedRoute, Params } from '@angular/router'
import { MessageService } from '../message/message.service'
import { UserService } from './user.service'
import { UserStorageService, StoragedUser, CachedUser } from './user-storage.service'
import { ResponseData, ServerConst, ServerMessage } from '../server'

@Component({
    selector: 'login',
    templateUrl: 'view/login.component.html',
    styleUrls: [ 'content/login.css' ],
    animations: [
        trigger('loginState', [
            state('waiting', style({
                opacity: 1.0
            })),
            state('logging', style({
                opacity: 0.9
            })),
            state('finished', style({
                opacity: 0.0
            })),
            transition('waiting => logging', animate('100ms ease-out')),
            transition('logging => waiting', animate('100ms ease-out')),
            transition('logging => finished', animate('500ms ease-out'))
        ])
    ]
})
export class LoginComponent implements OnInit, AfterViewInit {
    username: string;
    password: string;
    message: string;
    loginState: string = 'waiting';
    rememberMe: false;
    previousURL: string = null;
    private SHA256 = require("crypto-js/sha256");

    constructor(private router: Router,
                private activateRoute: ActivatedRoute,
                private elementRef: ElementRef,
                private messageService: MessageService,
                private user: UserService,
                private storage: UserStorageService) {        
    
    }

    ngOnInit(): void {
        this.activateRoute.params.forEach((params: Params) => {
            this.previousURL = params['redirect'];
        });
        if (this.storage.isSaved(StoragedUser.Username))
            this.username = this.storage.readStorage(StoragedUser.Username);
        if (this.storage.readStorage(StoragedUser.AutoLogin) == 'true') {
            this.password = this.storage.readStorage(StoragedUser.PasswordHash);
            this.login(true);
        }
    }

    ngAfterViewInit() {
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.innerHTML = `
        new Particleground.wave('#effect', {
            num: 3,
            lineColor: ['rgba(13, 135, 233, .5)', 'rgba(13, 135, 233, .7)', 'rgba(13, 135, 233, .9)'],
            lineWidth: [.5, .7, .9],
            offsetLeft: [2, 1, 0],
            offsetTop: .75,
            crestHeight: [10, 14, 18],
            rippleNum: 2,
            speed: .1,
            fill: false,
            stroke: true
        });`;
        this.elementRef.nativeElement.appendChild(s);
    }

    private checkParameter(): boolean {
        if (this.username == null) {
            this.message = ServerMessage.EMPTY_USERNAME;
            return false;
        }
        if (this.password == null) {
            this.message = ServerMessage.EMPTY_PASSWORD;
            return false;
        }
        return true;
    }

    private hashPassword(): string {
        return (this.SHA256(this.password) + '').toUpperCase();
    }

    private tryRememberUser(): void {
        if (this.rememberMe) {
            this.storage.save(StoragedUser.Username, this.username);
            this.storage.save(StoragedUser.PasswordHash, this.hashPassword());
            this.storage.save(StoragedUser.AutoLogin, 'true');
        }
        else
            this.storage.save(StoragedUser.AutoLogin, 'false');
    }

    login(noHash: boolean = false): void {
        if (!noHash) {
            if (!this.checkParameter()) return;
            this.tryRememberUser();
        }
        this.loginState = 'logging';
        this.user.login(this.username, noHash? this.password : this.hashPassword()).subscribe(
            (value: Response) =>{
                var data: ResponseData = value.json();
                if (data.message == ServerConst.SUCCESS){
                    this.storage.save(StoragedUser.Token, data.data);
                    this.loginState = 'finished';
                } else {
                    this.message = data.message;
                    this.password = '';
                    this.loginState = 'waiting';
                }
            },
            (error: Response) =>{
                var data: ResponseData = error.json();
                this.message = ServerMessage[data.message];
                this.password = '';
                this.loginState = 'waiting';
            }
        );
    }

    register() {
        if (!this.checkParameter()) return;
        this.tryRememberUser();
        this.loginState = 'logging';
        this.user.register(this.username, this.hashPassword(), '').subscribe(
            (value: Response) =>{
                var data: ResponseData = value.json();
                if (data.message == ServerConst.SUCCESS){
                    this.login();
                } else {
                    this.message = data.message;
                    this.loginState = 'waiting';
                }
            },
            (error: Response) =>{
                var data: ResponseData = error.json();
                this.message = ServerMessage[data.message];
                this.loginState = 'waiting';
            }
        );
    }

    stateChanged($event: AnimationTransitionEvent): void {
        if ($event.toState == 'finished'){
            this.storage.cache(CachedUser.Username, this.username);
            this.storage.cache(CachedUser.IsLogon, 'true');
            if (this.previousURL != null)
                this.router.navigate([this.previousURL]);
            else
                this.router.navigate(['/dashboard']);
        }
    }
}