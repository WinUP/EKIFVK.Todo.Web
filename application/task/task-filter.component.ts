import { Component, EventEmitter, Output } from '@angular/core'
import { TaskFilter } from '../task/task-list.component'
import { handleServerError } from '../message/message.service'

@Component({
    selector: 'task-filter',
    templateUrl: 'view/task-filter.component.html',
    styleUrls: [ 'content/task-filter.css' ]
})
export class TaskFilterComponent {
    @Output() filterChanged = new EventEmitter<TaskFilter>();

    private filter: TaskFilter = {
        showFinished: true,
        showUnfinish: true,
        showScheduled: true,
        showUnSchedule: true
    };

    public apply(): void {
        this.filterChanged.emit(this.filter);
    }
    public changeFilter(filter: TaskFilter): void {
        this.filter.showFinished = filter.showFinished;
        this.filter.showScheduled = filter.showScheduled;
        this.filter.showUnfinish = filter.showUnfinish;
        this.filter.showUnSchedule = filter.showUnSchedule;
    }
}