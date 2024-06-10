import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HelperService } from 'src/app/services/helper/helper.service';
import { HttpClient } from '@angular/common/http'; // Asegúrate de importar HttpClient
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
  codigo: string="";
  margenBeneficio: number = 0;
  impuestos: number = 0;
  costoProduccion: number | null = null;
  costoFabrica: number | null = null;
  costoDistribucion: number | null = null;
  pvp: number | null = null;
  txt_producto: string = '';
  materiasPrimas: Array<{ nombre: string; costo: number; unidad: string; cantidad?: number }> = [{ nombre: '', costo: 0, unidad: '' }];
  manoDeObraList: Array<{ nombre: string; costo: number }> = [{ nombre: '', costo: 0 }];
  costosIndirectosList: Array<{ nombre: string; costo: number }> = [{ nombre: '', costo: 0 }];
  otrosGastoList: Array<{ nombre: string; costo: number }> = [{ nombre: '', costo: 0 }
  ];
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

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
          color: '#ccc' // Ajuste de color del grid
        },
        ticks: {
          color: '#666',
          font: {
            family: 'Inter',
            weight: '500'
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
    this.authService.getSession('codigo').then((res:any)=>{
      this.codigo=res;
      
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
    return unidad !== 'unid' && unidad !== '';
  }
  agregarMateriaPrima() {
    this.materiasPrimas.push({ nombre: '', costo: 0, unidad: '' });
  }

  quitarMateriaPrima() {
    if (this.materiasPrimas.length > 1) {
      this.materiasPrimas.pop();
    }
  }

  agregarManoDeObra() {
    this.manoDeObraList.push({ nombre: '', costo: 0 });
  }

  quitarManoDeObra() {
    if (this.manoDeObraList.length > 1) {
      this.manoDeObraList.pop();
    }
  }

  agregarCostosIndirectos() {
    this.costosIndirectosList.push({ nombre: '', costo: 0 });
  }

  quitarCostosIndirectos() {
    if (this.costosIndirectosList.length > 1) {
      this.costosIndirectosList.pop();
    }
  }

  agregarGasto() {
    this.otrosGastoList.push({ nombre: '', costo: 0 });
  }

  quitarGasto() {
    if (this.otrosGastoList.length > 1) {
      this.otrosGastoList.pop();
    }
  }
  calcular() {
    // Calcular el costo de las materias primas
    const costoMateriasPrimas = this.materiasPrimas.reduce((total, materia) => total + (materia.costo || 0), 0);
  
    // Calcular el costo de la mano de obra
    const totalManoDeObra = this.manoDeObraList.reduce((total, mano) => total + (mano.costo || 0), 0);
  
    // Calcular el costo de los costos indirectos
    const totalCostosIndirectos = this.costosIndirectosList.reduce((total, costo) => total + (costo.costo || 0), 0);
  
    // Calcular el costo de otros gastos
    const totalOtrosGastos = this.otrosGastoList.reduce((total, costo) => total + (costo.costo || 0), 0);
  
    // Calcular el costo de producción
    this.costoProduccion = costoMateriasPrimas + totalManoDeObra + totalCostosIndirectos + totalOtrosGastos;
  
    // Calcular el costo de fábrica
    this.costoFabrica = this.costoProduccion * (this.margenBeneficio / 100);
  
    // Calcular el costo de distribución
    this.costoDistribucion = this.costoFabrica * (1 + this.impuestos / 100);
  
    // Calcular el precio de venta al público (PVP)
    this.pvp = this.costoDistribucion * (1 + this.margenBeneficio / 100);
  
    console.log('Costo de materias primas:', costoMateriasPrimas);
    console.log('Total de mano de obra:', totalManoDeObra);
    console.log('Total de costos indirectos:', totalCostosIndirectos);
    console.log('Total de otros gastos:', totalOtrosGastos);
    console.log('Costo de producción:', this.costoProduccion);
    console.log('Costo de fábrica:', this.costoFabrica);
    console.log('Costo de distribución:', this.costoDistribucion);
    console.log('PVP:', this.pvp);
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
    // Validar datos antes de enviarlos
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
      margenBeneficio: this.margenBeneficio,
      impuestos: this.impuestos,
      costoProduccion: this.costoProduccion,
      costoFabrica: this.costoFabrica,
      costoDistribucion: this.costoDistribucion,
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
        // Utiliza uno de los dos métodos para actualizar la página
  
        // Método 1: Navegar a la misma página (actualiza el componente)
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
      // Si la unidad seleccionada es "unidad", mostrar la cantidad y establecerla en 1 automáticamente
      this.materiasPrimas[index].cantidad = 1;
    } else {
      // Si no es "unidad", ocultar la cantidad
      this.materiasPrimas[index].cantidad = null;
    }
    // Llamar a la función calcular para actualizar los cálculos
    this.calcular();
  }  
      
}