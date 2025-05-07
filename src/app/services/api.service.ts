import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  private apiUrl = 'https://localhost:7146/api';

  constructor(private http: HttpClient) { }

  getAll(searchQuery: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Words/search?keyword=${searchQuery}`);
  }
}
