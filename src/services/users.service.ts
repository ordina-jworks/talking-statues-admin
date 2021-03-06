import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AppUser} from '../models/AppUser';
import {map, tap} from 'rxjs/operators';
import {Observable} from 'rxjs/internal/Observable';
import {environment} from '../environments/environment.prod';


@Injectable()
export class UsersService {

  data: AppUser[];
  constructor(private _http: HttpClient) {}


  // http requests are asynchronous --> use observable return type
  getUsers(): Observable<AppUser[]> {
    const dbUrl = environment.backendUrl + '/appusers';
    return this._http.get<AppUser[]>(dbUrl).pipe(
      map( res => this.data =  res),
      tap( res => console.log(res))
    );
  }


  forgetUserById(user: AppUser) {
    const endpoint = environment.backendUrl + '/appusers/forget/' + user.id;
    console.log(endpoint);

    this._http.put(endpoint, '').subscribe();
  }
}


