import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Response } from '@angular/http'
import { Router } from '@angular/router'
import { ResponseData, ServerConst, ServerMessage } from '../server'
import { UserStorageService, CachedUser } from '../user/user-storage.service'
import { Task, TaskQueryParams, TaskService } from '../task/task.service'
import { TaskListComponent, TaskFilter } from '../task/task-list.component'
import { MessageType, handleServerError } from '../message/message.service'

@Component({
    selector: 'dashboard',
    templateUrl: 'view/dashboard.component.html',
    styleUrls: [ 'content/dashboard.css' ]
})
export class DashboardComponent implements OnInit, AfterViewInit {
    @ViewChild(TaskListComponent) private taskComponent: TaskListComponent;

    private tempFilter: TaskFilter = {
        showFinished: true,
        showUnfinish: true,
        showScheduled: true,
        showUnSchedule: true
    }
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
                private storage: UserStorageService,
                private task: TaskService) {        

    }

    ngOnInit() {
        if (this.storage.readCache(CachedUser.IsLogon) != 'true')
            this.router.navigate(['/login', '/dashboard']);
        this.username = this.storage.readCache(CachedUser.Username);      
    }

    ngAfterViewInit() {
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.innerHTML = '$("#taskDueDate").datetimepicker({format:"yyyy-mm-dd hh:ii:ss",autoclose:true});';
        this.elementRef.nativeElement.appendChild(s);
        this.taskComponent.read();
    }
    refresh() {
        this.filter = {
            showFinished: this.tempFilter.showFinished,
            showUnfinish: this.tempFilter.showUnfinish,
            showScheduled: this.tempFilter.showScheduled,
            showUnSchedule: this.tempFilter.showUnSchedule
        }
    }
    addTask() {
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
                $('#newTaskModal').modal('hide');
            }, handleServerError
        );
    }
}