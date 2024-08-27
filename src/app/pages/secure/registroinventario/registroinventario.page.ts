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
    productName: '', // Nombre del producto
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
  ) {
    this.authService.getSession('productos').then((res: any) => {
      this.codigo = res.codigo;
      this.lproductos(this.codigo);
    });
  }

  ngOnInit() {
    // Inicializa la fecha de registro con la fecha actual
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Meses de 1 a 12
    const day = String(today.getDate()).padStart(2, '0'); // Día del mes

    this.initial.fechaRegistro = `${year}-${month}-${day}`;
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
  
    // Asegúrate de que `this.initial.product` sea un número
    const productId = parseInt(this.initial.product, 10);
  
    console.log('ID del producto seleccionado:', productId);
    console.log('Lista de productos:', this.productos);
  
    // Busca el objeto producto correspondiente al id seleccionado
    const selectedProduct = this.productos.find(
      (product) => parseInt(product.codigo, 10) === productId
    );
  
    if (!selectedProduct) {
      console.error('No se encontró el producto seleccionado en la lista.');
      return;
    }
  
    // Asigna el nombre del producto seleccionado al objeto inicial
    this.initial.productName = selectedProduct.nombre;
    this.initial.price = parseFloat(selectedProduct.pvp);
  
    // Llama al método para guardar los datos iniciales
    this.guardarDatos();
  }


  guardarDatos() {
    let datos = {
      accion: 'guardar_inventario',
      producto_id: this.initial.product, // Asegúrate de que esto sea el ID correcto del producto
      cantidad_inicial: this.initial.quantity,
      precio_venta: this.initial.price,
      cantidad_vendida: this.final.sold,
      dinero_total: this.final.totalMoney,
      muestras: this.final.gifted,
      ganancias_perdidas: this.results.profitLoss,
      perdidas_productos_regalados: this.results.giftedLoss,
      productos_no_vendidos: this.results.remainingProducts,
      fecha_registro: this.initial.fechaRegistro, // Agregar la fecha de registro
    };
  
    console.log('Datos a guardar:', datos); // Verifica los datos que se envían
  
    this.http
      .post<any>('http://localhost/ACE/WsMunicipioIonic/ws_gad.php', datos)
      .subscribe(
        (response) => {
          console.log('Datos guardados correctamente:', response);
          if (response.estado) {
            this.authService.showToast('Datos guardados correctamente.');
          } else {
            this.authService.showToast(response.mensaje);
          }
        },
        (error) => {
          console.error('Error en la solicitud:', error);
          this.authService.showToast('Error al guardar los datos. Intenta de nuevo.');
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
        console.log('Productos cargados:', this.productos); // Verifica los productos cargados
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
    }
  
    this.updateTotalMoney();
  }
  
  updateTotalMoney() {
    // Asegúrate de que `this.final.sold` y `this.initial.price` tengan valores válidos
    if (this.final.sold >= 0 && this.initial.price >= 0) {
      this.final.totalMoney = this.final.sold * this.initial.price;
    } else {
      console.warn('Cantidad vendida o precio no válidos.');
    }
  }
  registerFinal(){
    
  }
}  