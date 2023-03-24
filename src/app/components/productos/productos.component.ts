import { Component, OnInit } from '@angular/core';

import { ProductoService } from '../../services/producto.service';
import { ProductoI } from '../../interfaces/producto';
import { Object } from 'core-js';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  product: ProductoI = {
    id: 0,
    name: '',
    description: '',
    price: 0
  };

  
  productoForm: FormGroup;
  productos: ProductoI[];
  selectedProduct: ProductoI = { id: null, name: null, description: null, price: null };

  constructor(private fb: FormBuilder, private productoService: ProductoService) { }

  ngOnInit(): void {
    this.productoForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required]
    });
    
    this.getProducts();

    this.productoService.productos$.subscribe(productos => {
      this.productos = productos;
    });
    this.productoService.getProducts().subscribe();
  }

  getProducts() {
    this.productoService.getProducts().subscribe(
      (res: ProductoI[]) => {
        this.productos = Object.values(res);
        console.log(this.productos);
      },
      err => console.error(err)
    );
  }

  saveProduct(): void {
    const product = this.productoForm.value;
    if (this.selectedProduct && this.selectedProduct.id) {
      product.id = this.selectedProduct.id;
      this.productoService.updateProduct(product)
        .subscribe(
          response => console.log('UPDATED OK'),
          error => console.log(error)
        );
    } else {
      this.productoService.createProduct(product)
        .subscribe(
          response => console.log('CREATED OK'),
          error => console.log(error)
        );
    }
    this.clearForm();
  }


  editProduct(product: ProductoI): void {
    this.selectedProduct = product;
    this.productoForm.setValue({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price
    });
  }

  deleteProduct(id: number) {
    this.productoService.deleteProduct(id).subscribe(
      res => {
        console.log(res);
        this.getProducts();
      },
      err => console.error(err)
    );
  }

  clearForm(): void {
    this.selectedProduct = null;
    this.productoForm.reset();
  }
  
}