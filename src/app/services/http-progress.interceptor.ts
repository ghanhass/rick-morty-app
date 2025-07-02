import { HttpEvent, HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { LoaderService } from './loader.service';

export const httpProgressInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);
  if(req.reportProgress){
      return next(req).pipe(
        tap((event: HttpEvent<any>) => {
          loaderService.showLoader();
          //console.log("http event = ", event);
          if(event.type === HttpEventType.DownloadProgress){
            //console.log("loaded = ", event.loaded);
            //console.log("total = ", event.total);
          }
          else if(event.type === HttpEventType.Response){
            //console.log("response event = ");
            loaderService.hideLoader();
          }
          //console.log("----------------------");
        }, error => {
          console.log("interceptor error = ", error);
          loaderService.hideLoader();
        })
      )
    }
    else{
      return next(req);
    }
};
