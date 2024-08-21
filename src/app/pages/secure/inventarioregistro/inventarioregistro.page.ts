import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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
  productos: any[] = [];

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.setCurrentDate(); // Usa el mismo método para obtener la fecha
  }

  setCurrentDate() {
    const today = new Date().toISOString().split('T')[0]; // Obtener la fecha en formato YYYY-MM-DD
    this.date = today;
  }

  loadProducts() {
    this.http
      .post<any>('http://localhost/ACE/WsMunicipioIonic/ws_gad.php', {
        accion: 'cargar_productos',
      })
      .subscribe(
        (response) => {
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

  onProductChange(event: any) {
    this.productId = event.detail.value;
    const product = this.productos.find((p) => p.id === this.productId);
    if (product) {
      this.selectedPvp = product.pvp;
      this.loadInitialQuantity(this.productId);
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
      producto_id: this.productId,
      cantidad_inicial: this.initialQuantity,
      fecha_registro: this.date,
    };

    this.http
      .post<any>('http://localhost/ACE/WsMunicipioIonic/ws_gad.php', datos)
      .subscribe(
        async (response) => {
          if (response.estado) {
            await this.showToast('Producto guardado exitosamente.');
            this.router.navigate(['/inventariomenu']).then(() => {
              window.location.reload();
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
