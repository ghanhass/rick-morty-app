import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { ChildComponent } from './child.component';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
  <app-child (addItemEvent)="addItem($event)" />
  <p>🐢 all the way down {{ items.length }}</p>
`,
  imports: [ChildComponent],
})
export class App {
  items = new Array();

  addItem(item: string) {
    this.items.push(item);
  }
}

bootstrapApplication(App);
