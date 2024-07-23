import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormBuilder } from '@angular/forms';
import { ToastService } from 'src/app/services/toast/toast.service';
import { HttpClient } from '@angular/common/http';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-registroinventario',
  templateUrl: './registroinventario.page.html',
  styleUrls: ['./registroinventario.page.scss'],
})
export class RegistroinventarioPage implements OnInit {
  codigo: string = '';
  productos: any = [];
  Productos: any = [];
  searchTerm: string = '';

  initial = {
    product: '', // ID del producto seleccionado
    quantity: 0, // Cantidad inicial
    price: 0, // Precio de venta inicial
  };

  final = {
    sold: 0,
    totalMoney: 0,
    gifted: 0,
  };

  results = {
    profitLoss: 0,
    giftedLoss: 0,
    remainingProducts: 0,
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private http: HttpClient,
    public navCtrl: NavController,
    private alertController: AlertController
  ) {
    this.authService.getSession('productos').then((res: any) => {
      this.codigo = res.codigo;
      this.lproductos(this.codigo);
    });
  }

  ngOnInit() {
    // Puedes inicializar aquí el formulario si es necesario
  }

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

  registerInitial() {
    if (!this.initial.product) {
      console.error('Por favor selecciona un producto.');
      return;
    }

    // Busca el objeto producto correspondiente al id seleccionado
    const selectedProduct = this.productos.find(
      (product) => product.id === parseInt(this.initial.product)
    );

    if (!selectedProduct) {
      console.error('No se encontró el producto seleccionado en la lista.');
      return;
    }

    // Asigna el nombre del producto seleccionado al objeto inicial
    this.initial.product = selectedProduct.nombre;

    // Llama al método para guardar los datos iniciales
    this.guardarDatos();
  }

  registerFinal() {
    const totalIncome = this.final.sold * this.initial.price;
    const giftedValue = this.final.gifted * this.initial.price;
    this.results.profitLoss = totalIncome - giftedValue;
    this.results.giftedLoss = giftedValue;
    this.results.remainingProducts =
      this.initial.quantity - this.final.sold - this.final.gifted;

    this.guardarDatos();
  }

  guardarDatos() {
    let datos = {
      accion: 'guardar_inventario',
      nombre: this.initial.product,
      cantidad_inicial: this.initial.quantity,
      precio_venta: this.initial.price,
      cantidad_vendida: this.final.sold,
      dinero_total: this.final.totalMoney,
      productos_regalados: this.final.gifted,
    };

    this.http
      .post<any>('http://localhost/ACE/WsMunicipioIonic/ws_gad.php', datos)
      .subscribe(
        (response) => {
          // Manejo de la respuesta del servidor
        },
        (error) => {
          console.error('Error en la solicitud:', error);
          // Manejo de errores de conexión u otros errores HTTP
        }
      );
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

  updatePrice() {
    const selectedProduct = this.productos.find(
      (product) => product.id === parseInt(this.initial.product)
    );
    if (selectedProduct) {
      this.initial.price = selectedProduct.pvp; // Asignar el precio de venta (pvp)
    }
    this.updateTotalMoney();
  }

  updateTotalMoney() {
    this.final.totalMoney = this.final.sold * this.initial.price;
  }
}
