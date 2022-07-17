import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../shared/data.service';
import { TaskModel } from '../shared/task.model';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  formValue!: FormGroup;
  task: TaskModel = new TaskModel();
  allTasks: any
  showAdd!: boolean;
  showUpdate!: boolean;
  constructor(private formbuilder: FormBuilder,
    private dataService: DataService) { }

  ngOnInit(): void {
    this.formValue = this.formbuilder.group({
      title: new FormControl(null, Validators.required),
      descr: new FormControl(null, Validators.required),
      date: new FormControl(null, Validators.required),
    })
    this.getAllTasks()

  }
  addTaskClicked() {
    this.formValue.reset()
    this.showAdd = true
    this.showUpdate = false
  }
  addTask() {
    if (this.formValue.invalid) {
      return
    }

    this.task.title = this.formValue.value.title;
    this.task.descr = this.formValue.value.descr;
    this.task.date = this.formValue.value.date;

    this.dataService.addTask(this.task).subscribe(res => {
      this.formValue.reset()
      let cancel = document.getElementById('cancel')
      cancel?.click()
      this.getAllTasks()
    })
  }

  getAllTasks() {
    this.dataService.getAllTasks().subscribe(res => {
      this.allTasks = res
    })    
  }

  deleteTask(task: any) {
    this.dataService.deleteTask(task.id).subscribe(res => {
      this.getAllTasks()
    })
  }

  editChosenTask(task: any) {
    this.showAdd = false
    this.showUpdate = true
    this.formValue.controls['title'].setValue(task.title)
    this.formValue.controls['descr'].setValue(task.descr)
    this.formValue.controls['date'].setValue(task.date)

    this.task.id = task.id
  }

  updateTask () {
    if (this.formValue.invalid) {
      return
    }
    this.task.title = this.formValue.value.title;
    this.task.descr = this.formValue.value.descr;
    this.task.date = this.formValue.value.date;

    this.dataService.editTask(this.task, this.task.id).subscribe(res => {
      this.formValue.reset()
      let cancel = document.getElementById('cancel')
      cancel?.click()
      this.getAllTasks() 
    })
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.allTasks, event.previousIndex, event.currentIndex);
  }

  showDetailsToggle(id: number) {
    const idx = this.allTasks.findIndex((t: { id: number; }) => t.id === id)
    this.allTasks[idx].showDescr = !this.allTasks[idx].showDescr
  }

  completeTaskToogle(id: number) {
    const idx = this.allTasks.findIndex((t: { id: number; }) => t.id === id)
    this.allTasks[idx].completed = !this.allTasks[idx].completed
  }

}
