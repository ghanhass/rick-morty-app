import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  showLoader():void{
    console.log("inside showLoader");
    (document.querySelector("#app-loader") as HTMLElement).style.display = "flex";
  }

  hideLoader():void{
    console.log("inside hideLoader");
    (document.querySelector("#app-loader") as HTMLElement).style.display = "none";
  }

  constructor() { }
}
