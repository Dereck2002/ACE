import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-inventariomenu',
  templateUrl: './inventariomenu.page.html',
  styleUrls: ['./inventariomenu.page.scss'],
})
export class InventariomenuPage implements OnInit {
  currentDate: string;
  productos: any[] = [];
  productInfoVisible: { [key: number]: boolean } = {};

  constructor(
    private http: HttpClient,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.setCurrentDate(); // Usa el mismo método para obtener la fecha
    this.loadProducts();
  }

  setCurrentDate() {
    const today = new Date().toISOString().split('T')[0]; // Obtener la fecha en formato YYYY-MM-DD
    this.currentDate = today;
  }

  loadProducts() {
    this.http
      .post<any>('http://localhost/ACE/WsMunicipioIonic/ws_gad.php', {
        accion: 'cargar_productos2',
      })
      .subscribe(
        (response) => {
          if (response.estado) {
            this.productos = response.datos;
            this.productos.forEach((producto) => {
              this.productInfoVisible[producto.id] = false;
            });
          } else {
            console.error('Error al cargar productos:', response.mensaje);
          }
        },
        (error) => {
          console.error('Error en la solicitud:', error);
        }
      );
  }

  toggleProductInfo(producto: any) {
    this.productInfoVisible[producto.id] =
      !this.productInfoVisible[producto.id];
  }

  editarProducto(riCodigo: string, rfCodigo: string) {
    this.router.navigate([
      '/editinventario',
      { ri_codigo: riCodigo, rf_codigo: rfCodigo },
    ]);
  }

  async eliminarProducto(riCodigo: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar este producto?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancelado');
          },
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.http
              .post<any>('http://localhost/ACE/WsMunicipioIonic/ws_gad.php', {
                accion: 'eliminar',
                RI_CODIGO: riCodigo,
              })
              .subscribe(
                (response) => {
                  if (response.estado) {
                    this.loadProducts(); // Recargar los productos después de la eliminación
                    console.log('Producto eliminado con éxito');
                  } else {
                    console.error(
                      'Error al eliminar producto:',
                      response.mensaje
                    );
                  }
                },
                (error) => {
                  console.error('Error en la solicitud:', error);
                }
              );
          },
        },
      ],
    });

    await alert.present();
  }
}
