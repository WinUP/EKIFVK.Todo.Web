import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Response } from '@angular/http'
import { Router } from '@angular/router'
import { ModalDirective } from 'ng2-bootstrap/ng2-bootstrap';
import { ResponseData } from '../server'
import { UserStorageService, CachedUser } from '../user/user-storage.service'
import { Task, TaskService } from '../task/task.service'
import { TaskListComponent, TaskFilter } from '../task/task-list.component'
import { MessageService } from '../message/message.service'

@Component({
    selector: 'dashboard',
    templateUrl: 'view/dashboard.component.html',
    styleUrls: [ 'content/dashboard.css' ]
})
export class DashboardComponent implements OnInit, AfterViewInit {
    @ViewChild(TaskListComponent) private taskComponent: TaskListComponent;
    @ViewChild('newTaskModal') private newTaskModal: ModalDirective;
    private filter: TaskFilter ={
        showFinished: true,
        showUnfinish: true,
        showScheduled: true,
        showUnSchedule: true
    };
    private newTask: Task = {
        id: -1,
        name: '',
        description: '',
        deadline: '',
        finished: false
    }
    private addMessage: string;
    private username: string;

    constructor(private router: Router,
                private elementRef: ElementRef,
                private message: MessageService,
                private storage: UserStorageService,
                private task: TaskService) {        

    }

    ngOnInit() {
        if (this.storage.readCache(CachedUser.IsLogon) != 'true')
            this.router.navigate(['/login', '/dashboard']);
        this.username = this.storage.readCache(CachedUser.Username);      
    }

    ngAfterViewInit() {
        //TODO: 这种代码很难看，有机会删掉所有直接的html操作，顺便去掉jQuery
        var s = document.createElement('script');
        s.innerHTML = '$("#taskDueDate").datetimepicker({format:"yyyy-mm-dd hh:ii:ss",autoclose:true});';
        this.elementRef.nativeElement.appendChild(s);
        this.taskComponent.read();        
    }
    public refresh(filter: TaskFilter): void {
        this.filter = {
            showFinished: filter.showFinished,
            showUnfinish: filter.showUnfinish,
            showScheduled: filter.showScheduled,
            showUnSchedule: filter.showUnSchedule
        }
    }
    public showNewTaskModal(): void {
        this.newTaskModal.show();
    }
    public hideNewTaskModal(): void {
        this.newTaskModal.hide();
    }
    public addTask(): void {
        if (this.newTask.name == '') {
            this.addMessage = 'Name must be given';
            return;
        }
        this.addMessage = '';
        this.newTask.deadline = $('#taskDueDate').val();
        this.task.add(this.newTask).subscribe(
            (value: Response) => {
                var data: ResponseData = value.json();
                this.newTask.id = data.data;
                this.taskComponent.add(this.newTask);
                this.newTask.name = '';
                this.newTask.description = '';
                this.newTask.deadline = '';
                this.hideNewTaskModal();
            }, this.message.handleServerError
        );
    }
}