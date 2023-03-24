import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ProductosComponent } from './components/productos/productos.component';

//importaciones
import { HttpClientModule, HttpBackend, HttpClient } from '@angular/common/http';
import { ProductoService } from '../app/services/producto.service';
import { FilterPipe } from './pipes/filter.pipe';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    ProductosComponent,
    FilterPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([]),
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: HttpClient,
      useFactory: (backend: HttpBackend) => {
        return new HttpClient(backend);
      },
      deps: [HttpBackend]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
