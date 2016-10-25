import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule }   from '@angular/forms';
import { MaterialModule } from '@angular/material'
import { TaskComponent } from './task.component'
import { TaskListComponent } from './task-list.component'
import { TaskFilterComponent } from './task-filter.component'
import { TaskService } from './task.service'

@NgModule({
  imports:      [ CommonModule, FormsModule, MaterialModule.forRoot() ],
  declarations: [ TaskComponent, TaskListComponent, TaskFilterComponent ],
  exports:      [ TaskComponent, TaskListComponent, TaskFilterComponent ],
  providers:    [ TaskService ]
})
export class TaskModule { }