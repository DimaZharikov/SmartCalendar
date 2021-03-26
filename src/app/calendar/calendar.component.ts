import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import {DateService} from '../shared/date.service';

interface DayType{
  value: moment.Moment;
  active: boolean;
  disabled: boolean;
  selected: boolean;
}

interface WeekType{
  days: DayType[];
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  calendar: WeekType[] = [];

  constructor(public dateService: DateService) { }

  ngOnInit(): void {
    this.dateService.date.subscribe(this.generate.bind(this));
  }
  generate(timeNow: moment.Moment): void{
    const startDay = timeNow.clone().startOf('month').startOf('week');
    const endDay = timeNow.clone().endOf('month').endOf('week');
    const date = startDay.clone().subtract(1, 'day');
    const calendar = [];

    while (date.isBefore(endDay, 'day')){
        calendar.push({
          days: Array(7).fill(0).map(() => {
            const value = date.add(1, 'day').clone();
            const active = moment().isSame(value, 'date');
            const disabled = !timeNow.isSame(value, 'month');
            const selected = timeNow.isSame(value, 'date');
            return {
              value, active, disabled, selected
            };
          })
        });
    }
    this.calendar = calendar;
    console.log(calendar);
  }
  select(selectedDay: moment.Moment): void{
      this.dateService.changeDateHandler(selectedDay);
  }
}
