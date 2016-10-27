import { Component, EventEmitter, Input, Output, trigger, state, style, transition, animate, AnimationTransitionEvent } from '@angular/core'
import { Response } from '@angular/http'
import { ResponseData } from '../server'
import { Task, TaskService } from './task.service'
import { MessageService } from '../message/message.service'

@Component({
    selector: 'task',
    templateUrl: 'view/task.component.html',
    styleUrls: [ 'content/task.css' ],
    animations: [
        trigger('removeState', [
            state('waiting', style({
                opacity: 1.0
            })),
            state('removing', style({
                opacity: 0.9
            })),
            state('finished', style({
                opacity: 0.0
            })),
            transition('waiting => removing', animate('100ms ease-out')),
            transition('removing => waiting', animate('100ms ease-out')),
            transition('removing => finished', animate('500ms ease-out'))
        ])
    ]
})
export class TaskComponent {
    @Input() task: Task;
    private removeState: 'waiting' | 'removing' | 'finished';
    @Output() afterRemoved = new EventEmitter();
    @Output() afterFinished = new EventEmitter();
    @Output() afterUnfinish = new EventEmitter();

    constructor(private taskService: TaskService, private message: MessageService){
        this.removeState = 'waiting'
    }

    private stateChanged($event: AnimationTransitionEvent): void {
        if ($event.toState == 'finished'){
            this.afterRemoved.emit();
        }
    }

    public finish(): void {
        this.taskService.finish(this.task.id).subscribe(
            (value: Response) => {
                this.task.finished = true;
                this.afterFinished.emit();
            }, this.message.handleServerError
        );
    }
    public unfinish(): void {
        this.taskService.unfinish(this.task.id).subscribe(
            (value: Response) => {
                this.task.finished = false;
                this.afterUnfinish.emit();
            }, this.message.handleServerError
        );
    }
    public remove(): void {
        this.removeState = 'removing';
        this.taskService.remove(this.task.id).subscribe(
            (value: Response) => {
                this.removeState = 'finished';
            }, this.message.handleServerError
        );
    }
}