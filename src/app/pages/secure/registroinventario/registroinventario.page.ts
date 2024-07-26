import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormBuilder} from '@angular/forms';
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
  productos: any[] = [];
  Productos: any[] = [];
  searchTerm: string = '';

  initial = {
    product: '', // ID del producto seleccionado
    quantity: 0, // Cantidad inicial
    price: 0, // Precio de venta inicial
    fechaRegistro: '', // Fecha de registro
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
  ) {}

  ngOnInit() {
    // Inicializa la fecha de registro con la fecha actual
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Meses de 1 a 12
    const day = String(today.getDate()).padStart(2, '0'); // Día del mes

    this.initial.fechaRegistro = `${year}-${month}-${day}`;
    this.ionViewWillEnter(); // Cargar productos al inicializar
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
      (product) => product.id === parseInt(this.initial.product, 10)
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

    this.final.totalMoney = totalIncome; // Asegúrate de que el totalMoney esté calculado antes de guardar

    this.guardarDatos();
  }

  guardarDatos() {
    const datos = {
      accion: 'guardar_inventario',
      producto_id: this.initial.product,  // ID del producto
      cantidad_inicial: this.initial.quantity,  // Cantidad inicial
      precio_venta: this.initial.price,  // Precio de venta
      cantidad_vendida: this.final.sold,  // Cantidad vendida
      dinero_total: this.final.totalMoney,  // Total dinero
      muestras: this.final.gifted,  // Cantidad de muestras
      ganancias_perdidas: this.results.profitLoss,  // Ganancias/perdidas
      perdidas_productos_regalados: this.results.giftedLoss,  // Pérdidas por productos regalados
      productos_no_vendidos: this.results.remainingProducts,  // Productos no vendidos
      fecha_registro: this.initial.fechaRegistro,  // Fecha de registro
    };
  
    this.http
      .post<any>('http://localhost/ACE/WsMunicipioIonic/ws_gad.php', datos)
      .subscribe(
        (response) => {
          if (response.estado) {
            // Manejo de la respuesta exitosa
            console.log('Datos guardados exitosamente:', response.mensaje);
            this.authService.showToast(response.mensaje);
          } else {
            // Manejo de la respuesta de error
            console.error('Error al guardar los datos:', response.mensaje);
            this.authService.showToast(response.mensaje);
          }
        },
        (error) => {
          console.error('Error en la solicitud:', error);
          this.authService.showToast('Error en la solicitud. Por favor, intenta de nuevo.');
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
    }, (error) => {
      console.error('Error en la solicitud:', error);
    });
  }

  filterProductos(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.Productos = this.productos.filter((producto: any) => {
      return producto.nombre.toLowerCase().includes(searchTerm);
    });
  }
  
  updatePrice() {
    if (!this.initial.product) {
      console.warn('No se ha seleccionado ningún producto.');
      return;
    }
  
    const selectedProduct = this.productos.find(
      (product) => product.codigo === this.initial.product // Asegúrate de que coincida el campo correcto
    );
  
    if (selectedProduct) {
      console.log('Producto seleccionado:', selectedProduct);
      
      if (selectedProduct.pvp !== undefined) {
        this.initial.price = parseFloat(selectedProduct.pvp); // Convertir a número
        console.log('Precio actualizado:', this.initial.price);
      } else {
        console.warn('El campo del precio no está definido para el producto seleccionado.');
      }
    } else {
      console.warn('Producto no encontrado.');
    }
  
    this.updateTotalMoney();
  }
  
  updateTotalMoney() {
    // Asegúrate de que this.final.sold y this.initial.price tengan valores válidos
    if (this.final.sold >= 0 && this.initial.price >= 0) {
      this.final.totalMoney = this.final.sold * this.initial.price;
    } else {
      console.warn('Cantidad vendida o precio no válidos.');
    }
  }
}
