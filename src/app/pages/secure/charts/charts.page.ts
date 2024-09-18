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
  selector: 'app-charts',
  templateUrl: './charts.page.html',
  styleUrls: ['./charts.page.scss'],
})
export class ChartsPage implements OnInit {
  codigo: string = "";
  margenBeneficio: number = 35; // Porcentaje
  impuestos: number = 15; // Porcentaje
  costoProduccion: number | null = null;
  costoFabrica: number | null = null;
  costoDistribucion: number | null = null;
  pvp: number | null = null;
  txt_producto: string = '';
  utilidadv: number = 0;
  utilidadc: number = 0;
  materiasPrimas: Array<{ nombre: string; costo: number; unidad: string; cantidad?: number; vtotal: number }> = [
    { nombre: '', costo: 0, unidad: 'unidad', vtotal: 0 }
  ];
  manoDeObraList: Array<{ nombre: string; costo: number; sueldoMensual?: number; tipoTiempo?: string; horasTrabajadas?: number }> = [
    {  nombre: '', costo: 0, sueldoMensual: 0, tipoTiempo: '', horasTrabajadas: 0 }
  ];
  costosIndirectosList: Array<{
    nombre: string;
    costo: number;
    cantidadHoras?: number;
    valorMensual?: number;
    horas?: number;
    cantidadagua?: number;
    cantidadGas?: number;
  }> = [
    { nombre: '', costo: 0,horas: 0, cantidadagua: 0,cantidadGas: 0 }
  ];
  otrosGastoList: Array<{ nombre: string; costo: number; vtotal: number }> = [{ nombre: '', costo: 0, vtotal: 0 }];
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  tipoRegistro: string = 'unico'; // 'unico' o 'varios'
  tproducto: number | null = null;
  


  public barChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.4
      }
    },
    animation: {
      easing: 'easeInOutElastic',
      delay: 25
    },
    responsive: true,
    scales: {
      x: {
        grid: {
          color: '#ccc'
        },
        ticks: {
          color: '#666',
          font: {
            family: 'Inter',
            weight: 'bold',
          }
        }
      },
      y: {
        position: 'right',
        grid: {
          color: '#ccc'
        },
        ticks: {
          color: '#666',
          callback: function (value) {
            return '$' + value;
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#333',
        bodyColor: '#666',
        titleColor: '#fff',
        titleFont: {
          size: 14,
          weight: 'normal'
        },
        bodyFont: {
          size: 16,
          weight: 'bold'
        },
        padding: 12,
        boxWidth: 10,
        boxHeight: 10,
        boxPadding: 3,
        usePointStyle: true,
        callbacks: {
          label: function (context) {
            var label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
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

  content_loaded: boolean = false;

  constructor(
    private helperService: HelperService,
    private http: HttpClient,
    private alertController: AlertController,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
    private navCtrl: NavController
  ) {
    this.authService.getSession('codigo').then((res: any) => {
      this.codigo = res;
    });
  }

  ngOnInit() {
    this.createBarChart();
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.content_loaded = true;
    }, 2000);
  }

  shouldShowCantidad(unidad: string): boolean {
    return unidad !== 'unidad' && unidad !== '';
  }

  agregarMateriaPrima() {
    this.materiasPrimas.push({ nombre: '', costo: 0, unidad: 'unidad', vtotal: 0 });
  }

  quitarMateriaPrima(index: number) {
    if (this.materiasPrimas.length > 1) {
      this.materiasPrimas.splice(index, 1);
    }
  }

  agregarManoDeObra() {
    this.manoDeObraList.push({ nombre: '', costo: 0 });
  }

  quitarManoDeObra(index: number) {
    if (this.manoDeObraList.length > 1) {
      this.manoDeObraList.splice(index, 1);
    }
  }

  agregarCostosIndirectos() {
    this.costosIndirectosList.push({ nombre: '', costo: 0 });
  }

  quitarCostosIndirectos(index: number) {
    if (this.costosIndirectosList.length > 1) {
      this.costosIndirectosList.splice(index, 1);
    }
  }

  agregarGasto() {
    this.otrosGastoList.push({ nombre: '', costo: 0 , vtotal: 0 });
  }

  quitarGasto(index: number) {
    if (this.otrosGastoList.length > 1) {
      this.otrosGastoList.splice(index, 1);
    }
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
  
  createBarChart() {
    let helperService = this.helperService;
    let rand_numbers = [...Array(12)].map(e => Math.random() * 100 | 0);

    this.barChartData.labels = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    this.barChartData.datasets = [
      {
        data: rand_numbers,
        backgroundColor: function (context) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            return null;
          }

          return helperService.createGradientChart(ctx, 'tertiary', 'tertiary');
        },
        barThickness: 10,
        borderRadius: 4,
        borderColor: helperService.getColorVariable('secondary'),
        hoverBackgroundColor: helperService.getColorVariable('secondary'),
        pointStyle: 'circle',
      }
    ];
  }

  async guardarDatos() {
    if (!this.txt_producto || !this.margenBeneficio || !this.impuestos || !this.costoProduccion ||
      !this.costoFabrica || !this.costoDistribucion || !this.pvp || !this.materiasPrimas.length ||
      !this.manoDeObraList.length || !this.costosIndirectosList.length || !this.otrosGastoList.length) {
      this.authService.showToast('Por favor, completa todos los campos antes de guardar.');
      return;
    }

    let datos = {
      accion: "guardar_costos_produccion",
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
      if (res.estado) {
        this.mostrarMensajeRegistroExitoso();
        this.navCtrl.navigateRoot(['/listacostos']);
      } else {
        this.authService.showToast(res.mensaje);
      }
    } catch (error) {
      this.authService.showToast('Error al guardar los datos. Por favor, intenta de nuevo.');
    }
  }

  async mostrarMensajeRegistroExitoso() {
    const toast = await this.authService.showToast2('Éxito, ¡Datos registrados correctamente!');
  }

  unidadChange(event, index) {
    if (event.detail.value === 'unidad') {
      this.materiasPrimas[index].cantidad = 1; // Asigna una cantidad por defecto
    } else {
      this.materiasPrimas[index].cantidad = null; // No asigna cantidad si la unidad no es 'unidad'
    }
    this.calcular(); // Recalcula después de cambiar la unidad
  }
  onCostoChange(costoIndirecto: any) {
    // Lógica para manejar el cambio de costo indirecto (ej: si es luz, internet, etc.)
  }
  

}