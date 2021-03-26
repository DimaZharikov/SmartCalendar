import {Component, OnInit} from '@angular/core';
import {DateService} from '../shared/date.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {PutTasksService, TaskType} from '../shared/put-tasks.service';
import {switchMap} from 'rxjs/operators';


@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss']
})
export class OrganizerComponent implements OnInit {
     form: any;
     tasks: TaskType[] = [];
  constructor(public dateService: DateService, public  taskService: PutTasksService) {
  }
  ngOnInit(): void {
    this.dateService.date.pipe(
      switchMap(value => this.taskService.load(value))
    ).subscribe(tasks => {
      this.tasks = tasks;
    });

    this.form = new FormGroup({
      title: new FormControl('', Validators.required)
    });
  }
  submit(): void{
    const {title} =  this.form.value;
    const task: TaskType = {
      title,
      date: this.dateService.date.value.format('DD-MM-YYYY')
    };
    this.taskService.create(task).subscribe(task => {
      this.tasks.unshift(task);
      console.log('new Task:', task);
      this.form.reset();
    }, err => console.error(err));
    console.log(title);
  }
  remove(task: TaskType): void{
    this.taskService.removeTask(task).subscribe(() => {
      this.tasks.filter(t => t.id !== task.id);
    }, err => console.error(err));
  }
}
