import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {Observable, from} from 'rxjs';
import {environment} from '../../../environments/environment';
 import {StorageService} from './storage.service';
// import {HelperService} from './helper/helper.service'

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl;
  apiUrl: string;


  constructor(
    private http: HttpClient,
    private storage:StorageService
  ) {
     this.baseUrl = environment.base_url;
     this.apiUrl = environment.base_url
  }

  getPageData = {
    size: 100,
    pageSizeOptions: [10, 25, 50, 100],
    sort: "createdAt%2Cdesc"
  };

  getSearchData(data:any) {
    let searchString = "";
    if (data) {
      searchString = `&search=` + data.trim().replace(new RegExp("[" + "AND" + "]+$"), "");
    }
    return searchString;
  }



  getHeader(params?:HttpParams) {
    let token = this.storage.getAccessToken();
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
      'Authorization': 'Bearer '+token
   });
   if(params){
     return { headers: reqHeader,params:params}
   }
    return { headers: reqHeader}
  }

  getLoginHeader(){
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',

   });

    return { headers: reqHeader}
  }

  getHeaderExceptContent(){
    let token = this.storage.getAccessToken();
    var reqHeader = new HttpHeaders({
      'Authorization': 'Bearer '+token
   });

    return { headers: reqHeader }
  }

  public fileUpload(route:any,data:any): Observable<any> {
    let headers = this.getHeaderExceptContent();
    const url = this.baseUrl + route;
    return this.http.post(url, data,headers);
  }
  public get(route:any,params?:HttpParams): Observable<any> {
    let headers = this.getHeader(params);

    const url = this.baseUrl + route;
    return this.http.get(url,headers);
  }

  public post(route:any, data:any): Observable<any> {
    let headers = this.getHeader();
    const url = this.baseUrl + route;
    return this.http.post(url, data,headers);
  }
  public put(route:any, data?:any): Observable<any> {
    let headers = this.getHeader();
    const url = this.baseUrl + route;
    return this.http.put(url, data,headers);
  }

  public delete(route:any): Observable<any> {
    let headers = this.getHeader();
    const url = this.baseUrl + route;
    return this.http.delete(url,headers);
  }

  public login(route:any, data:any): Observable<any> {
    let headers = this.getLoginHeader();
    const url = this.baseUrl + route;
    return this.http.post(url, data,headers);
  }

  public saveWithoutToken(route:any, data:any): Observable<any> {
    const url = this.apiUrl + route;
    return this.http.post(url, data);
  }

  // public update(route, data): Observable<any> {
  //   const url = this.apiUrl + route;
  //   return this.http.put(url, data, this.getHeader());
  // }

  // public delete(route, id): Observable<any> {
  //   const url = this.apiUrl + route + id;
  //   return this.http.delete(url, this.getHeader());
  // }

}

