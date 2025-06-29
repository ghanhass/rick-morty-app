import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule, RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: "./app-component.html",
  styleUrl: "./app-component.css",
  imports: [RouterOutlet, CommonModule, RouterModule]
})
export class AppComponent {

  isSideBarOpen: boolean = false;
  toggleSideBar(): void{
    this.isSideBarOpen = !this.isSideBarOpen;
  }
}
