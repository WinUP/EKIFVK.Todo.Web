import { Injectable } from '@angular/core'
import { Http, Response } from '@angular/http'
import { Observable } from 'rxjs/Observable'
import { UserStorageService } from '../user/user-storage.service'

export interface Task {
    id: number,
    name: string,
    description: string,
    deadline: string,
    finished: boolean
}

export interface TaskQueryParams {
    skip: number,
    count: number,
    onlyFinished: boolean,
    onlyUnfinish: boolean,
    onlyScheduled: boolean,
    onlyUnschedule: boolean
}

@Injectable()
export class TaskService {
    constructor(private http: Http, private storage: UserStorageService) {

    }

    search(filter: TaskQueryParams,): Observable<Response> {
        return this.http.get(`/task/.list?Skip=${filter.skip}&Count=${filter.count}&OnlyFinished=${filter.onlyFinished}&OnlyUnfinish=${filter.onlyUnfinish}&OnlyScheduled=${filter.onlyScheduled}&OnlyUnschedule=${filter.onlyUnschedule}`);
    }

    finish(id: number): Observable<Response> {
        return this.http.patch(`/task/${id}`, {operation: 'finished', data: true});
    }

    unfinish(id: number): Observable<Response> {
        return this.http.patch(`/task/${id}`, {operation: 'finished', data: false});
    }

    remove(id: number): Observable<Response> {
        return this.http.delete(`/task/${id}`);
    }
    add(task: Task): Observable<Response> {
        var param: any = {
            name: task.name,
            description: task.description
        }
        if (task.deadline != null && task.deadline != '') param.deadline = task.deadline;
        return this.http.post('/task', param);
    }
}