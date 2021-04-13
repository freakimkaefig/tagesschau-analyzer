import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ShowListResponse,
  ShowListSortBy,
} from '@tagesschau-analyzer/core/types';

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

  getShowList(
    limit: number,
    offset: number,
    sortBy: ShowListSortBy
  ): Observable<ShowListResponse> {
    const params = new HttpParams()
      .set('limit', limit.toString())
      .set('offset', offset.toString())
      .set('sortKey', sortBy.key)
      .set('sortDirection', sortBy.direction);

    return this.http.get<ShowListResponse>(`${this.API_URL}/shows`, {
      params,
    });
  }
}
