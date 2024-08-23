import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-inventariomenu',
  templateUrl: './inventariomenu.page.html',
  styleUrls: ['./inventariomenu.page.scss'],
})
export class InventariomenuPage implements OnInit {
  currentDate: string;
  productos: any[] = [];
  productInfoVisible: { [key: number]: boolean } = {};
  idPersona: string;
  selectedDate: string;
  modalDate: string;
  isDateModalOpen = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private alertController: AlertController,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.idPersona = localStorage.getItem('CapacitorStorage.codigo');
    console.log('ID Persona:', this.idPersona);
    this.setCurrentDate();
    this.selectedDate = this.currentDate;
    this.loadProducts();
  }

  setCurrentDate() {
    const today = new Date();
    const offset = today.getTimezoneOffset(); // Obtener el desfase horario en minutos
    const localDate = new Date(today.getTime() - offset * 60 * 1000); // Ajustar la fecha para la zona local
    const formattedDate = localDate.toISOString().split('T')[0]; // Obtener la fecha en formato YYYY-MM-DD
    this.currentDate = formattedDate;
  }

  loadProducts() {
    if (!this.idPersona) {
      console.error('ID de persona no disponible');
      return;
    }

    this.http
      .post<any>('http://localhost/ACE/WsMunicipioIonic/ws_gad.php', {
        accion: 'cargar_productos2',
        id_persona: this.idPersona,
        fecha: this.selectedDate,
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
    // Alternar visibilidad del producto seleccionado
    this.productInfoVisible[producto.id] =
      !this.productInfoVisible[producto.id];

    // Cerrar la información de los otros productos
    for (let id in this.productInfoVisible) {
      if (id !== producto.id.toString()) {
        this.productInfoVisible[id] = false;
      }
    }
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
                    this.loadProducts(); // Recargar productos después de eliminar
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

  openDateModal() {
    this.modalDate = this.selectedDate; // Inicializar el modal con la fecha seleccionada
    this.isDateModalOpen = true;
  }

  async saveDate() {
    this.isDateModalOpen = false;
    this.selectedDate = this.modalDate;
    this.loadProducts();
  }

  closeDateModal() {
    this.isDateModalOpen = false;
  }

  onDateModalDismiss() {
    this.closeDateModal();
  }
}
