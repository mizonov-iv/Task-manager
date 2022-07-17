import {Directive, ElementRef, HostBinding, Renderer2, Input} from '@angular/core';
import {DataService} from "./data.service";
import { MainComponent } from '../main/main.component';

@Directive({
  selector: '[appDate]'
})
export class DateDirective {
  @Input('date') set date(date: string) {
    this.higlightDate(date);
  }

  constructor(public el: ElementRef, public r: Renderer2, public dataService: DataService, public main: MainComponent) {
  }

  higlightDate(date: string): void {
    if (Date.now() >= Date.parse(date)) {
      this.el.nativeElement.classList.add('orange');
      return;
    }
    if ((Date.parse(date) - Date.now()) / 86400000 <= 3) {
      this.el.nativeElement.classList.add('pink');
      return;
    }
    this.el.nativeElement.classList.add('grey');
  }
}

