import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Monument} from '../models/AppUser';
import {environment} from '../environments/environment.prod';
import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Authorization': `${localStorage.getItem('JSESSIONID')}`
  })
};

@Injectable()
export class MonumentsService {

  data: Monument[];
  sharingData: Monument;
  constructor(private _http: HttpClient) { }

  // http requests are asynchronous --> use observable return type
  getMonuments(): Observable<Monument[]> {
    const dbUrl = environment.backendUrl + '/monuments';
    return this._http.get<Monument[]>(dbUrl, {withCredentials: true}).pipe(
      map( res => this.data =  res),
      tap( res => console.log(res))
    );
  }

  getAreas(): Observable<any> {
    return this._http.get(environment.backendUrl + '/monuments/areas', {withCredentials: true});
  }

  getMonumentById(id: string): Observable<Monument> {
    return this._http.get<Monument>(environment.backendUrl + '/monuments/' + id, {withCredentials: true});
  }

  addMonument(monument: Monument): Observable<Monument> {
    console.log('ready to send new added monument: ', monument);
    httpOptions.headers = httpOptions.headers.append('Accept', 'application/json');
    return this._http.put<Monument>(environment.backendUrl + '/monuments/', monument);
  }

  removeMonument(monument: Monument): Observable<{}> {
    return this._http.delete(environment.backendUrl + '/monuments/' + monument.id, {withCredentials: true}).pipe(
      tap(_ => {
        console.log(`Monument ${monument.information[0].name} deleted`);
      }),
      catchError((error: any) => {
        console.error(`En error occured while deleting monument ${monument.information[0].name}`);
        console.error(`error: ${error.message}`);
        return of(error);
      })
    );
  }

  editMonument(monument: Monument): Observable<Monument> {
    httpOptions.headers = httpOptions.headers.append('Accept', 'application/json');
    console.log('ready to send edited monument: ', monument);
    // return this._http.put<Monument>('', monument, {withCredentials: true});
    return this._http.put<Monument>(environment.backendUrl + '/monuments/' +  monument.id, monument,
    {withCredentials: true}).pipe(
        tap(_ => {
          console.log(`Monument ${monument.information[0].name} edited`);
        }),
        catchError((error: any) => {
          console.error(`En error occured while editing monument ${monument.information[0].name}`);
          console.error(`error: ${error.message}`);
          return of(error);
        })
      );
  }

  uploadImage(file: File, monument: Monument) {
    return this._http.put(environment.backendUrl + '/images/' + monument.id, file, {withCredentials: true});
  }

  saveData(str) {
    this.sharingData = str;
  }
  getData() {
  return this.sharingData;
  }

}
