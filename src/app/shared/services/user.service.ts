import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import type {DefaultResponseType} from '../../../types/default-response.type';
import type {UserInfoType} from '../../../types/user-info.type';


@Injectable({
  providedIn: 'root'
})
export  class UserService {
  private http = inject(HttpClient);

  updateUserInfo(params: UserInfoType ): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'user', params);
  }
  getUserInfo(): Observable<UserInfoType | DefaultResponseType> {
    return this.http.get<UserInfoType | DefaultResponseType>(environment.api + 'user');
  }
}
