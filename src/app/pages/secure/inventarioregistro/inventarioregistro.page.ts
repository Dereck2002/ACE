<<<<<<< HEAD
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
=======
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
>>>>>>> main
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-inventario-registro',
  templateUrl: 'inventarioregistro.page.html',
  styleUrls: ['inventarioregistro.page.scss'],
})
export class InventarioregistroPage implements OnInit {
  productId: string;
  initialQuantity: number;
  date: string;
  selectedPvp: string;
<<<<<<< HEAD
  productos: any[] = []; // Arreglo para almacenar los productos
  initialRecordId: number; // Para almacenar el ID del registro inicial
  idPersona: string; 
=======
  productos: any[] = [];
>>>>>>> main

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private toastController: ToastController
  ) {}

  ngOnInit() {
<<<<<<< HEAD
    this.idPersona = localStorage.getItem('CapacitorStorage.codigo');
    console.log("ID Persona:", this.idPersona);
    this.loadProducts();
    this.setCurrentDate();
  }
=======
    this.loadProducts();
    this.setCurrentDate(); // Usa el mismo método para obtener la fecha
  }

  setCurrentDate() {
    const today = new Date().toISOString().split('T')[0]; // Obtener la fecha en formato YYYY-MM-DD
    this.date = today;
  }

>>>>>>> main
  loadProducts() {
    this.http
      .post<any>('http://localhost/ACE/WsMunicipioIonic/ws_gad.php', {
        accion: 'cargar_productos',
<<<<<<< HEAD
        id_persona: this.idPersona
      })
      .subscribe(
        (response) => {
          console.log('Respuesta del servidor:', response); // Depuración
=======
      })
      .subscribe(
        (response) => {
>>>>>>> main
          if (response.estado) {
            this.productos = response.datos;
          } else {
            console.error('Error al cargar productos:', response.mensaje);
          }
        },
        (error) => {
          console.error('Error en la solicitud:', error);
        }
      );
  }

<<<<<<< HEAD
  setCurrentDate() {
    const today = new Date().toISOString().split('T')[0]; // Obtener la fecha en formato YYYY-MM-DD
    this.date = today;
  }

=======
>>>>>>> main
  onProductChange(event: any) {
    this.productId = event.detail.value;
    const product = this.productos.find((p) => p.id === this.productId);
    if (product) {
      this.selectedPvp = product.pvp;
<<<<<<< HEAD
      this.loadInitialQuantity(this.productId); // Nueva función para obtener la cantidad inicial
=======
      this.loadInitialQuantity(this.productId);
>>>>>>> main
    }
  }

  loadInitialQuantity(productId: string) {
    this.http
      .post<any>('http://localhost/ACE/WsMunicipioIonic/ws_gad.php', {
        accion: 'obtener_cantidad_inicial',
        producto_id: productId,
      })
      .subscribe(
        (response) => {
          if (response.estado) {
            this.initialQuantity = response.cantidad_inicial;
          } else {
            console.error(
              'Error al obtener la cantidad inicial:',
              response.mensaje
            );
          }
        },
        (error) => {
          console.error('Error en la solicitud:', error);
        }
      );
  }

  saveProduct() {
    const datos = {
      accion: 'guardar_inventario',
<<<<<<< HEAD
      producto_id: this.productId, // ID del producto
      cantidad_inicial: this.initialQuantity, // Cantidad inicial
      fecha_registro: this.date, // Fecha de registro
=======
      producto_id: this.productId,
      cantidad_inicial: this.initialQuantity,
      fecha_registro: this.date,
>>>>>>> main
    };

    this.http
      .post<any>('http://localhost/ACE/WsMunicipioIonic/ws_gad.php', datos)
      .subscribe(
        async (response) => {
          if (response.estado) {
            await this.showToast('Producto guardado exitosamente.');
            this.router.navigate(['/inventariomenu']).then(() => {
<<<<<<< HEAD
              window.location.reload(); // Recargar la página después de redirigir
=======
              window.location.reload();
>>>>>>> main
            });
          } else {
            console.error('Error al guardar los datos:', response.mensaje);
          }
        },
        (error) => {
          console.error('Error en la solicitud:', error);
        }
      );
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
      color: 'success',
    });
    toast.present();
  }
}
