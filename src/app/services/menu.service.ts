import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private url = 'http://localhost:3000/menu';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa('admin:adminadmin;'),
    }),
  };

  constructor(private http: HttpClient) { }

  getAllMenu() {
    return this.http
      .get(`${this.url}/getAllMenu`, this.httpOptions)
      .pipe(
        tap((response) => {
          console.log(response);
        })
      );
  }

  addMenu(menuData: FormData) {
    return this.http.post(`${this.url}/addMenu`, menuData);
  }

  updateMenu(id: number, menuData: FormData) {
    return this.http.put(`${this.url}/updateMenu/${id}`, menuData);
  }

  deleteMenu(id: number) {
    return this.http.delete(`${this.url}/deleteMenu/${id}`);
  }
}
