import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';

import { ProductoI } from '../interfaces/producto';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})


export class ProductoService {

  private url = '/api/products/';
  private wskey = '9QMR8FP6SFCICN2RN5U4ZNM16M5HQ4AR';

  private productosSubject = new BehaviorSubject<ProductoI[]>([]);
  productos$ = this.productosSubject.asObservable();
  
  constructor(private http: HttpClient) { }

  getProducts(): Observable<ProductoI[]> {
    return this.http.get<ProductoI[]>(`${this.url}/?ws_key=${this.wskey}&output_format=JSON&display=[id,name,description,price]&limit=999999`);
  }
  

  getProduct(id: number): Observable<ProductoI> {
    return this.http.get<ProductoI>(`${this.url}/${id}`);
  }

  createProduct(product:ProductoI): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/xml' });
    const xml = `
    <prestashop>
    <product>
      <id><language id="1" ><![CDATA[${product.id}]]></language></id>
      <name><language id="1" ><![CDATA[${product.name}]]></language></name>
      <description><language id="1"><![CDATA[${product.description}]]></language></description>
      <price><![CDATA[${product.price}]]></price>
    </product>
    </prestashop>
  `;
  console.log(xml);
    // return this.http.post<any>(`${this.url}?ws_key=${this.wskey}`, xml, { headers });
    return this.http.post<any>(`${this.url}?ws_key=${this.wskey}`, xml, { headers })
    .pipe(
      switchMap(() => this.getProducts())
    );
  }

  updateProduct(product:ProductoI): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/xml' });
    const xml = `
    <prestashop>
    <product>
      <id>${product.id}</id>
      <name>${product.name}</name>
      <description>${product.description}</description>
      <price>${product.price}</price>
    </product>
  </prestashop>
  `;
    // return this.http.patch<any>(`${this.url}${product.id}?ws_key=${this.wskey}`, xml, { headers });
    return this.http.patch<any>(`${this.url}${product.id}?ws_key=${this.wskey}`, xml, { headers })
    .pipe(
      switchMap(() => this.getProducts())
    );
  }

  deleteProduct(id: number): Observable<any> {
    if (!id) {
      return throwError('Invalid ID');
    }
    return this.http.delete<any>(`${this.url}/${id}`);
  }
}