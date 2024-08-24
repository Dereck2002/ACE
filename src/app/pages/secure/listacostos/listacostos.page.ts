import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AlertController } from '@ionic/angular';
import { ToastService } from 'src/app/services/toast/toast.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-listacostos',
  templateUrl: './listacostos.page.html',
  styleUrls: ['./listacostos.page.scss'],
})
export class ListacostosPage implements OnInit {
  codigo: string = '';
  productos: any = [];
  Productos: any = [];
  searchTerm: string = '';

  // Variables para paginación
  page: number = 1;
  pageSize: number = 10; // Número de elementos por página
  totalPages: number = 1;

  constructor(
    private authService: AuthService,
    public navCtrl: NavController,
    private alertController: AlertController,
    private toastService: ToastService,
    private router: Router
  ) { }

  ngOnInit() { }

  async ionViewWillEnter() {
    try {
      const res = await this.authService.getSession('codigo');
      this.codigo = res;
      await this.lproductos(this.codigo);
    } catch (error) {
      console.error('Error al inicializar los datos', error);
      this.authService.showToast(
        'Error al cargar los datos. Por favor, intenta de nuevo.'
      );
    }
  }

  lproductos(codigo: string) {
    let datos = {
      accion: 'lproductos',
      cod_persona: this.codigo,
    };
    this.authService.postData(datos).subscribe((res: any) => {
      if (res.estado === true) {
        this.productos = res.datos;
        this.Productos = res.datos; // Inicialmente muestra todos los productos
        this.calculatePagination();
      } else {
        this.authService.showToast(res.mensaje);
      }
    });
  }

  calculatePagination() {
    this.totalPages = Math.ceil(this.Productos.length / this.pageSize); // Calcula el número total de páginas
  }

  // Metodos para paginación
  getPaginatedProductos() {
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.Productos.slice(startIndex, endIndex);
  }

  // Metodos para paginación ir siguiente
  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
    }
  }

  // Metodos para paginación ir anterior
  previousPage() {
    if (this.page > 1) {
      this.page--;
    }
  }

  irEditar(codigo: string) {
    this.navCtrl.navigateRoot(['/editproducto']);
    this.authService.creatSession('id', codigo);
  }

  filterProductos(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.Productos = this.productos.filter((producto: any) => {
      return producto.nombre.toLowerCase().includes(searchTerm);
    });
  }

  // Metodo para eliminar un producto de la lista
  async eliminarProducto(productoId: string) {
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
          handler: async () => {
            let datos = {
              accion: 'eliminarProducto',
              productoId: productoId,
              cod_persona: this.codigo,
            };

            try {
              const res: any = await this.authService
                .postData(datos)
                .toPromise();
              if (res.estado) {
                this.authService.showToast2('Producto eliminado con éxito');
                this.lproductos(this.codigo); // Actualiza la lista de productos
                window.location.reload();
              } else {
                this.authService.showToast(res.mensaje);
              }
            } catch (error) {
              this.authService.showToast(
                'Error al eliminar el producto. Por favor, intenta de nuevo.'
              );
            }
          },
        },
      ],
    });

    await alert.present();
  }
}
