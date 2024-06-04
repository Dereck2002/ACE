import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AlertController } from '@ionic/angular';
import { ToastService } from 'src/app/services/toast/toast.service';
import { Router } from '@angular/router';

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

  constructor(
    private authService: AuthService,
    private alertController: AlertController,
    private toastService: ToastService,
    private router: Router
  ) {
    this.authService.getSession('codigo').then((res: any) => {
      this.codigo = res;
      this.lproductos(this.codigo);
    });
  }

  ngOnInit() {}

  lproductos(codigo: string) {
    let datos = {
      accion: "lproductos",
      cod_persona: this.codigo,
    };
    this.authService.postData(datos).subscribe((res: any) => {
      if (res.estado === true) {
        this.productos = res.datos;
        this.Productos = res.datos; // Inicialmente muestra todos los productos
      } else {
        this.authService.showToast(res.mensaje);
      }
    });
  }

  filterProductos(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.Productos = this.productos.filter((producto: any) => {
      return producto.nombre.toLowerCase().includes(searchTerm);
    });
  }

  editarProducto(producto: any) {
    console.log('Editar producto', producto);
    this.router.navigate(['/editar-producto', producto.id]);
  }

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
          }
        },
        {
          text: 'Eliminar',
          handler: async () => {
            let datos = {
              accion: "eliminarProducto",
              productoId: productoId,
              cod_persona: this.codigo,
            };

            try {
              const res: any = await this.authService.postData(datos).toPromise();
              if (res.estado) {
                this.authService.showToast2("Producto eliminado con éxito");
                this.lproductos(this.codigo); // Actualiza la lista de productos
              } else {
                this.authService.showToast(res.mensaje);
              }
            } catch (error) {
              this.authService.showToast('Error al eliminar el producto. Por favor, intenta de nuevo.');
            }
          }
        }
      ]
    });

    await alert.present();
  }
}
