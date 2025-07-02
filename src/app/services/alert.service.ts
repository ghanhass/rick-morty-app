import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class AlertService {

  private topCoordinate = 65;
  constructor() {
  }

  updateTopCoordinate(){
    let elsSet: NodeListOf<Element> =document.querySelectorAll('.alert-container');
    
    if(elsSet.length){
      this.topCoordinate = elsSet[elsSet.length - 1].getBoundingClientRect().top+40;
    }
  }

  generateAlertContainer(): HTMLElement{
    this.updateTopCoordinate();
    let div = document.createElement("div");
    div.style.cssText = ``;
        div.className = "alert-container";
        div.appendChild(document.createElement("h3"));
        div.style.top = this.topCoordinate+"px";
        document.body.appendChild(div);
        return div;
  }
  success(msg: string) {
    let self = this;
    let newAlert = this.generateAlertContainer();
    newAlert.textContent = "success";
    setTimeout(()=>{

    },1500)
  }

  warning(warnMsg: string) {
    let newAlert = this.generateAlertContainer();
    newAlert.textContent = "warning";
  }

  error(errMsg: string) {
    let newAlert = this.generateAlertContainer();
    newAlert.textContent = "error";
  }

  destroy(el:HTMLElement) {
    el.remove();
  }
}