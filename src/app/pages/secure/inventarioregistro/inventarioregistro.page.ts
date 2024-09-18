import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-inventario-registro',
  templateUrl: 'inventarioregistro.page.html',
  styleUrls: ['inventarioregistro.page.scss'],
})export class InventarioregistroPage implements OnInit {
  productId: string;
  initialQuantity: number;
  date: string;
  selectedPvp: string;
  costo_distribucion: string;
  tipoPrecio: string; // Variable para almacenar el tipo de precio seleccionado
  productos: any[] = [];
  initialRecordId: number;
  idPersona: string;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.idPersona = localStorage.getItem('CapacitorStorage.codigo');
    this.loadProducts();
    this.setCurrentDate();
  }

  loadProducts() {
    this.http.post<any>('http://localhost/ACE/WsMunicipioIonic/ws_gad.php', {
      accion: 'cargar_productos',
      id_persona: this.idPersona
    }).subscribe(
      response => {
        if (response.estado) {
          this.productos = response.datos;
        }
      },
      error => console.error('Error en la solicitud:', error)
    );
  }

  setCurrentDate() {
    const today = new Date().toISOString().split('T')[0];
    this.date = today;
  }

  onProductChange(event: any) {
    this.productId = event.detail.value;
    const product = this.productos.find(p => p.id === this.productId);
    if (product) {
      this.selectedPvp = product.pvp;
      this.costo_distribucion = product.costo_distribucion;
      this.loadInitialQuantity(this.productId);
    }
  }

  loadInitialQuantity(productId: string) {
    this.http.post<any>('http://localhost/ACE/WsMunicipioIonic/ws_gad.php', {
      accion: 'obtener_cantidad_inicial',
      producto_id: productId,
    }).subscribe(
      response => {
        if (response.estado) {
          this.initialQuantity = response.cantidad_inicial;
        }
      },
      error => console.error('Error en la solicitud:', error)
    );
  }

  saveProduct() {
    const datos = {
      accion: 'guardar_inventario',
      producto_id: this.productId,
      cantidad_inicial: this.initialQuantity,
      fecha_registro: this.date,
      tipo_precio: this.tipoPrecio, // Guardar el tipo de precio seleccionado
    };

    this.http.post<any>('http://localhost/ACE/WsMunicipioIonic/ws_gad.php', datos)
      .subscribe(
        async response => {
          if (response.estado) {
            await this.showToast('Producto guardado exitosamente.');
            this.router.navigate(['/inventariomenu']).then(() => {
              window.location.reload();
            });
          }
        },
        error => console.error('Error en la solicitud:', error)
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
