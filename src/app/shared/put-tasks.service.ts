import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import * as moment from 'moment';

export interface TaskType{
  id?: string;
  title: string;
  date?: string;
  }
interface ResponseType {
    name: string;
  }

@Injectable({providedIn: 'root'})
export class PutTasksService {
  static public = 'https://angularsmartcalendar-default-rtdb.firebaseio.com/tasks';
  constructor(private  http: HttpClient) {
  }
  load(data: moment.Moment): Observable<TaskType[]>{
    return this.http.get<TaskType[]>(`${PutTasksService.public}/${data.format('DD-MM-YYYY')}.json`)
      .pipe(map(tasks => {
        if (!tasks){
          return [];
        } else {// @ts-ignore
          return Object.keys(tasks).map((key: string) => ({...tasks[key], id: key})); }

      }));
  }
  create(task: TaskType): Observable<TaskType>{
    return this.http.post<ResponseType>(`${PutTasksService.public}/${task.date}.json`, task)
      .pipe(map(res => {
        console.log('res', res);
        return {...task, id: res.name};
      }));
    }
    removeTask(task: TaskType): Observable<void>{
    return this.http.delete<void>(`${PutTasksService.public}/${task.date}/${task.id}.json`);
    }
}
