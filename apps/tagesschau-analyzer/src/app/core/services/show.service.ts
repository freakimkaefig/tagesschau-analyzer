import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ShowService {
  private readonly API_URL: string = environment.api;

  constructor(private http: HttpClient) {}

  getCount(): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/count`);
  }
}
