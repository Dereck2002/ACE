import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  productos: any[] = []; // Arreglo para almacenar los productos
  initialRecordId: number; // Para almacenar el ID del registro inicial
  idPersona: string;
  isDateModalOpen = false; // Calendario

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.idPersona = localStorage.getItem('CapacitorStorage.codigo');
    console.log('ID Persona:', this.idPersona);
    this.loadProducts();
    this.setCurrentDate();
  }

  loadProducts() {
    this.http
      .post<any>('http://localhost/ACE/WsMunicipioIonic/ws_gad.php', {
        accion: 'cargar_productos',
        id_persona: this.idPersona,
      })
      .subscribe(
        (response) => {
          console.log('Respuesta del servidor:', response); // Depuración
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

  //--------------------------Funciones necesarias para el calendario-------------------------
  openDateModal() {
    this.isDateModalOpen = true;
  }

  closeDateModal() {
    this.isDateModalOpen = false;
  }

  onDateModalDismiss(event: any) {
    const selectedDate = event.detail?.value;
    if (selectedDate) {
      this.date = selectedDate.split('T')[0];
    } else {
      console.log('Modal cerrado sin seleccionar fecha');
    }
    this.closeDateModal();
  }

  confirmDate(selectedDate: string) {
    this.date = selectedDate.split('T')[0];
    this.closeDateModal();
  }

  //----------------------------------------------------------------------------------------

  setCurrentDate() {
    const today = new Date();
    const offset = today.getTimezoneOffset(); // Obtener el desfase horario en minutos
    const localDate = new Date(today.getTime() - offset * 60 * 1000); // Ajustar la fecha para la zona local
    const formattedDate = localDate.toISOString().split('T')[0]; // Obtener la fecha en formato YYYY-MM-DD
    this.date = formattedDate;
  }

  onProductChange(event: any) {
    this.productId = event.detail.value;
    const product = this.productos.find((p) => p.id === this.productId);
    if (product) {
      this.selectedPvp = product.pvp;
      this.loadInitialQuantity(this.productId); // Nueva función para obtener la cantidad inicial
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
              window.location.reload(); // Recargar la página después de redirigir
            });
          } else {
            await this.showToast(response.mensaje); // Mostrar mensaje de error
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
      color: 'danger', // Cambia el color a rojo para los mensajes de error
    });
    toast.present();
  }
}
