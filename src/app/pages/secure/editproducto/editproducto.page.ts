import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HelperService } from 'src/app/services/helper/helper.service';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { ToastService } from 'src/app/services/toast/toast.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-editproducto',
  templateUrl: './editproducto.page.html',
  styleUrls: ['./editproducto.page.scss'],
})
export class EditproductoPage implements OnInit {
  codigo: string = "";
  productoId: number | null = null;
  txt_producto: string = '';
  tproducto: number = 0;
  materiasPrimas: { nombre: string, vtotal: number, costo: number, unidad: string, cantidad?: number }[] = [{ nombre: '', vtotal: 0, costo: 0, unidad: '', cantidad: 0 }];
  manoDeObraList: { nombre: string, sueldoMensual: number, tipoTiempo: string, horasTrabajadas: number, costo: number }[] = [{ nombre: '', sueldoMensual: 0, tipoTiempo: '', horasTrabajadas: 0, costo: 0 }];
  costosIndirectosList: { nombre: string, cantidadHoras?: number, valorMensual?: number, horas?: number, cantidadagua?: number, cantidadGas?: number, costo: number }[] = [{ nombre: '', cantidadHoras: 0, valorMensual: 0, horas: 0, cantidadagua: 0, cantidadGas: 0, costo: 0 }];
  otrosGastoList: { nombre: string, vtotal: number, costo: number }[] = [{ nombre: '', vtotal: 0, costo: 0 }];
  margenBeneficio: number = 0;
  utilidadv: number = 0;
  utilidadc: number = 0;
  impuestos: number = 0;
  costoProduccion: number | null = null;
  costoFabrica: number | null = null;
  costoDistribucion: number | null = null;
  pvp: number | null = null;
  content_loaded: boolean = false;

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public barChartOptions: ChartConfiguration['options'] = {
    elements: { line: { tension: 0.4 } },
    animation: { easing: 'easeInOutElastic', delay: 25 },
    responsive: true,
    scales: {
      x: {
        grid: { color: '#ccc' },
        ticks: { color: '#666', font: { family: 'Inter', weight: 'bold' } }
      },
      y: {
        position: 'right',
        grid: { color: '#ccc' },
        ticks: { color: '#666', callback: value => '$' + value }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#333',
        bodyColor: '#666',
        titleColor: '#fff',
        titleFont: { size: 14, weight: 'normal' },
        bodyFont: { size: 16, weight: 'bold' },
        padding: 12,
        boxWidth: 10,
        boxHeight: 10,
        boxPadding: 3,
        usePointStyle: true,
        callbacks: {
          label: context => {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    }
  };

  public barChartLabels: string[] = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: this.barChartLabels,
    datasets: [
      { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
      { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
    ]
  };

  public polarAreaChartLabels: string[] = ['Download Sales', 'In-Store Sales', 'Mail Sales', 'Telesales', 'Corporate Sales'];
  public polarAreaChartData: ChartData<'polarArea'> = {
    labels: this.polarAreaChartLabels,
    datasets: [{
      data: [300, 500, 100, 40, 120],
      label: 'Series 1'
    }]
  };
  public polarAreaLegend = true;
  public polarAreaChartType: ChartType = 'polarArea';

  constructor(
    private helperService: HelperService,
    public navCtrl: NavController,
    private http: HttpClient,
    private alertController: AlertController,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
  ) {
    this.authService.getSession('id').then((res: any) => {
      this.codigo = res;
      this.consultarDato(this.codigo);
    });
  }

  ngOnInit() {
    this.createBarChart();
  }

  async consultarDato(codigo: string) {
    let datos = {
      accion: "consultarDatoProductos",
      id: codigo
    };

    this.authService.postData(datos).subscribe((res: any) => {
      if (res.estado == true) {
        // Asignar datos generales
        this.productoId = res.productos[0].id;
        this.codigo = res.productos[0].codigo;
        this.txt_producto = res.productos[0].nombre;
        this.tproducto = res.productos[0].tproducto;
        this.margenBeneficio = res.productos[0].margenBeneficio;
        this.utilidadv = res.productos[0].utilidadVenta;
        this.utilidadc = res.productos[0].utilidadDis;
        this.impuestos = res.productos[0].impuestos;
        this.costoProduccion = res.productos[0].costoProduccion;
        this.costoFabrica = res.productos[0].costoFabrica;
        this.costoDistribucion = res.productos[0].costoDistribucion;
        this.pvp = res.productos[0].pvp;

        // Filtrar y asignar datos sin duplicados
        this.materiasPrimas = this.filterUniqueItems(res.productos[0].materiasPrimas, 'nombre');
        this.manoDeObraList = this.filterUniqueItems(res.productos[0].manoDeObraList, 'nombre');
        this.costosIndirectosList = this.filterUniqueItems(res.productos[0].costosIndirectosList, 'nombre');
        this.otrosGastoList = this.filterUniqueItems(res.productos[0].otrosGastoList, 'nombre');
      } else {
        this.authService.showToast(res.mensaje);
      }
    });
  }

  // Función para filtrar elementos únicos por una propiedad específica
  filterUniqueItems(array: any[], property: string): any[] {
    return array.filter((item, index, self) =>
      index === self.findIndex((t) => (
        t[property] === item[property]
      ))
    );
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.content_loaded = true;
    }, 2000);
  }

  agregarMateriaPrima() {
    this.materiasPrimas.push({ nombre: '', vtotal: 0, costo: 0, unidad: '', cantidad: 0 });
  }

  quitarMateriaPrima(index: number) {
    this.materiasPrimas.splice(index, 1);
}

  agregarManoDeObra() {
    this.manoDeObraList.push({ nombre: '', sueldoMensual: 0, tipoTiempo: '', horasTrabajadas: 0, costo: 0 });
  }

  quitarManoDeObra(index: number) {
    this.manoDeObraList.splice(index, 1);
  }

  agregarCostosIndirectos() {
    this.costosIndirectosList.push({ nombre: '', cantidadHoras: 0, valorMensual: 0, horas: 0, cantidadagua: 0, cantidadGas: 0, costo: 0 });
  }

  quitarCostosIndirectos(index: number) {
    this.costosIndirectosList.splice(index, 1);
}

  agregarGasto() {
    this.otrosGastoList.push({ nombre: '', vtotal: 0, costo: 0 });
  }

  quitarGasto(index: number) {
    this.otrosGastoList.splice(index, 1);
  }

  shouldShowCantidad(unidad: string): boolean {
    return unidad !== 'unidad' && unidad !== '';
  }
  calcular() {
    this.manoDeObraList.forEach((manoDeObra, index) => {
      const sueldoMensual = manoDeObra.sueldoMensual || 0;
      const tipoTiempo = +manoDeObra.tipoTiempo || 1; // Convertir a número
      const horasTrabajadas = manoDeObra.horasTrabajadas || 0;
      const cantidadProductos = this.tproducto || 1;
  
      console.log('Mano de obra:', sueldoMensual, tipoTiempo, horasTrabajadas, cantidadProductos);
      
      if (cantidadProductos > 0 && tipoTiempo > 0) {
        const costo = (sueldoMensual / tipoTiempo) * horasTrabajadas / cantidadProductos;
        this.manoDeObraList[index].costo = costo;
      } else {
        this.manoDeObraList[index].costo = 0;
      }
    });
  
    // Costos indirectos
    this.costosIndirectosList.forEach((costoIndirecto, i) => {
      console.log('Costo indirecto:', costoIndirecto.nombre, costoIndirecto);
  
      if (this.tproducto > 0) {
        switch (costoIndirecto.nombre) {
          case 'luz':
            const costoLuz = (0.09 * costoIndirecto.cantidadHoras) / this.tproducto;
            this.costosIndirectosList[i].costo = costoLuz;
            break;
  
          case 'agua':
            const cantidadagua = costoIndirecto.cantidadagua; 
            if (cantidadagua != null && cantidadagua > 0) {
              const costoAgua = cantidadagua / this.tproducto;
              this.costosIndirectosList[i].costo = costoAgua;
            } else {
              this.costosIndirectosList[i].costo = 0;
            }
            break;
  
          case 'gas':
            if (costoIndirecto.cantidadGas && costoIndirecto.cantidadGas > 0) {
              const costoGas =  costoIndirecto.cantidadGas / this.tproducto;
              this.costosIndirectosList[i].costo = costoGas;
            }
            break;
  
          case 'telecomunicaciones':
            if (costoIndirecto.valorMensual && costoIndirecto.horas) {
              const costoTelecom = ((costoIndirecto.valorMensual / 720) * costoIndirecto.horas) / this.tproducto;
              this.costosIndirectosList[i].costo = costoTelecom;
            }
            break;
  
          default:
            this.costosIndirectosList[i].costo = 0;
            break;
        }
      }
    });
  
    // Función para limpiar números y convertir a float
    const limpiarNumero = (valor: any): number => {
      if (typeof valor === 'string') {
        valor = valor.replace(/[^0-9.-]+/g, ''); // Eliminar caracteres no numéricos
      }
      return parseFloat(valor) || 0; // Convertir a número y manejar NaN
    };
  
    const cantidadProductos = limpiarNumero(this.tproducto) || 1;
  
    // Costo unitario para materias primas
    this.materiasPrimas.forEach(materia => {
      if (cantidadProductos === 1) {
        materia.costo = limpiarNumero(materia.costo);
      } else {
        const valorTotalMateria = limpiarNumero(materia.vtotal) || 0;
        materia.costo = cantidadProductos > 0 ? valorTotalMateria / cantidadProductos : 0;
      }
    });
  
    // Costo total de materias primas
    const costoMateriasPrimas = this.materiasPrimas.reduce((total, materia) => {
      const costoUnitario = limpiarNumero(materia.costo);
      const cantidadMateria = limpiarNumero(materia.cantidad) || 1;
      return total + (costoUnitario * cantidadMateria);
    }, 0);
  
    // Costo de otros gastos
    this.otrosGastoList.forEach(otroCosto => {
      if (cantidadProductos === 1) {
        otroCosto.costo = limpiarNumero(otroCosto.costo);
      } else {
        const valorTotalOtroCosto = limpiarNumero(otroCosto.vtotal) || 0;
        otroCosto.costo = cantidadProductos > 0 ? valorTotalOtroCosto / cantidadProductos : 0;
      }
    });
  
    const totalManoDeObra = this.manoDeObraList.reduce((total, mano) => total + limpiarNumero(mano.costo), 0);
    const totalCostosIndirectos = this.costosIndirectosList.reduce((total, costo) => total + limpiarNumero(costo.costo), 0);
    const totalOtrosGastos = this.otrosGastoList.reduce((total, costo) => total + limpiarNumero(costo.costo), 0);
  
    this.costoProduccion = parseFloat((costoMateriasPrimas + totalManoDeObra + totalCostosIndirectos + totalOtrosGastos).toFixed(2));
  
    const beneficio = parseFloat((this.costoProduccion * (this.margenBeneficio / 100)).toFixed(2));
    this.costoFabrica = parseFloat((this.costoProduccion + beneficio).toFixed(2));
  
    const utilidadVendedor = parseFloat((this.costoFabrica * (this.utilidadv / 100)).toFixed(2));
    this.costoDistribucion = parseFloat((this.costoFabrica + utilidadVendedor).toFixed(2));
  
    const utilidadComercial = parseFloat((this.costoDistribucion * (this.utilidadc / 100)).toFixed(2));
    const impuestosCalculados = parseFloat((this.costoDistribucion * (this.impuestos / 100)).toFixed(2));
    this.pvp = parseFloat((this.costoDistribucion + utilidadComercial + impuestosCalculados).toFixed(2));
  
    console.log('Cantidad de productos:', cantidadProductos);
    console.log('Costo Unitario por materia prima:', this.materiasPrimas.map(m => m.costo));
    console.log('Costo de materias primas:', costoMateriasPrimas);
    console.log('Total de mano de obra:', totalManoDeObra);
    console.log('Total de costos indirectos:', totalCostosIndirectos);
    console.log('Total de otros gastos:', totalOtrosGastos);
    console.log('Costo de producción:', this.costoProduccion);
    console.log('Costo de fábrica:', this.costoFabrica);
    console.log('Costo de distribución:', this.costoDistribucion);
    console.log('PVP:', this.pvp);
    console.log('Valor de tproducto:', this.tproducto);
  }

  unidadChange(event, index) {
    const selectedUnit = event.detail.value;
    this.materiasPrimas[index].unidad = selectedUnit;
  }

  async guardarCambios() {
    const datos = {
      accion: "editarProducto",
      productoId: this.productoId,
      codigo: this.codigo,
      nombre: this.txt_producto,
      tproducto: this.tproducto,
      margenBeneficio: this.margenBeneficio,
      impuestos: this.impuestos,
      costoProduccion: this.costoProduccion,
      costoFabrica: this.costoFabrica,
      costoDistribucion: this.costoDistribucion,
      utilidad_venta: this.utilidadv,
      utilidad_dis: this.utilidadc,
      pvp: this.pvp,
      materiasPrimas: this.materiasPrimas,
      manoDeObraList: this.manoDeObraList,
      costosIndirectosList: this.costosIndirectosList,
      otrosGastoList: this.otrosGastoList
    };
  
    try {
      const res: any = await this.authService.postData(datos).toPromise();
  
      if (res.success) {
        await this.authService.showToast('Éxito: Producto actualizado correctamente');
        this.navCtrl.navigateRoot('/listacostos');
      } else {
        await this.authService.showToast(`Error: ${res.message}`);
      }
    } catch (error) {
      await this.authService.showToast('Error: No se pudo completar la solicitud. Inténtalo de nuevo.');
    }
  }
  
  private createBarChart() {
    const data = [65, 59, 80, 81, 56, 55, 40];
    this.barChartData.datasets = [{
      data: data,
      label: 'Series A'
    }];
    this.barChartData.labels = ['01', '02', '03', '04', '05', '06', '07'];
    if (this.chart) {
      this.chart.update();
    }
  }
  
  onCostoChange(costoIndirecto: any) {
    // Lógica para manejar el cambio de costo indirecto (ej: si es luz, internet, etc.)
  }
  
  regresar() {
    this.navCtrl.back();
  }
  
  async mostrarMensajeRegistroExitoso() {
    await this.authService.showToast('Éxito: Datos registrados correctamente');
  }
}