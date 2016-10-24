import { Component, Input } from '@angular/core';
import { Response } from '@angular/http'
import { ResponseData } from '../server'
import { Task, TaskQueryParams, TaskService } from '../task/task.service'
import { handleServerError } from '../message/message.service'

export interface TaskFilter {
    showFinished: boolean,
    showUnfinish: boolean,
    showScheduled: boolean,
    showUnSchedule: boolean
}

@Component({
    selector: 'task-list',
    templateUrl: 'view/task-list.component.html'
})
export class TaskListComponent {
    private _filter: TaskFilter = {
        showFinished: true,
        showUnfinish: true,
        showScheduled: true,
        showUnSchedule: true
    }
    private queryParam: TaskQueryParams = {
        skip: 0,
        count: 10,
        onlyFinished: false,
        onlyUnfinish: false,
        onlyScheduled: false,
        onlyUnschedule: false
    }
    private tasks: Task[];
    private finished: boolean = false;
    @Input()
    set filter(value: TaskFilter){
        this._filter = value;
        if (!this._filter.showFinished) {
            this.queryParam.onlyUnfinish = true;
            if (this._filter.showUnfinish) this.queryParam.onlyFinished = false;
            else this.queryParam.onlyFinished = true;
        } else {
            this.queryParam.onlyUnfinish = false;
            if (this._filter.showUnfinish) this.queryParam.onlyFinished = false;
            else this.queryParam.onlyFinished = true;
        }
        if (!this._filter.showScheduled) {
            this.queryParam.onlyUnschedule = true;
            if (this._filter.showUnSchedule) this.queryParam.onlyScheduled = false;
            else this.queryParam.onlyScheduled = true;
        } else {
            this.queryParam.onlyUnschedule = false;
            if (this._filter.showUnSchedule) this.queryParam.onlyScheduled = false;
            else this.queryParam.onlyScheduled = true;
        }
        this.tasks = new Array<Task>();
        this.read();
    }
    get filter(): TaskFilter {
        return this._filter;
    }

    constructor(private task: TaskService) {        
        this.tasks = new Array<Task>();
    }

    private onTaskRemoved(task: Task): void {
        this.tasks.splice(this.tasks.indexOf(task), 1);
    }

    public read(): void {
        this.queryParam.skip = this.tasks.length;
        this.task.search(this.queryParam).subscribe(
            (value: Response) =>{
                var data: ResponseData = value.json();
                this.tasks = this.tasks.concat(data.data);
                if (data.data.length < 10) this.finished = true;
                else this.finished = false;
            }, handleServerError
        );
    }
    public add(task: Task): void {
        this.tasks.splice(0, 0, {
            id: task.id,
            name: task.name,
            description: task.description,
            deadline: task.deadline == '' ? null : task.deadline,
            finished: false
        });
    }
}