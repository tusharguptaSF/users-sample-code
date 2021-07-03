import { HttpHeaders, HttpParams } from '@angular/common/http';

export interface OptionModel {
  params?: HttpParams;
  observe:string;
  headers?:HttpHeaders;
  }
