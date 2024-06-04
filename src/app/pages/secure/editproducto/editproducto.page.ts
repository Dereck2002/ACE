import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HelperService } from 'src/app/services/helper/helper.service';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { ToastService } from 'src/app/services/toast/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editproducto',
  templateUrl: './editproducto.page.html',
  styleUrls: ['./editproducto.page.scss'],
})
export class EditproductoPage implements OnInit {
  codigo: string = "";
  materiasPrimas: { nombre: string, costo: number }[] = [{ nombre: '', costo: 0 }];
  manoDeObraList: { nombre: string, costo: number }[] = [{ nombre: '', costo: 0 }];
  costosIndirectosList: { nombre: string, costo: number }[] = [{ nombre: '', costo: 0 }];
  otrosCostosList: { nombre: string, costo: number }[] = [{ nombre: '', costo: 0 }];
  margenBeneficio: number = 0;
  impuestos: number = 0;
  costoProduccion: number | null = null;
  costoFabrica: number | null = null;
  costoDistribucion: number | null = null;
  pvp: number | null = null;
  txt_producto: string = '';
  nombre: string = '';

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public barChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: { tension: 0.4 }
    },
    animation: { easing: 'easeInOutElastic', delay: 25 },
    responsive: true,
    scales: {
      x: {
        grid: { color: '#ccc' },
        ticks: {
          color: '#666',
          font: { family: 'Inter', weight: '500' }
        }
      },
      y: {
        position: 'right',
        grid: { color: '#ccc' },
        ticks: {
          color: '#666',
          callback: value => '$' + value
        }
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

  content_loaded: boolean = false;

  constructor(
    private helperService: HelperService,
    private http: HttpClient,
    private alertController: AlertController,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
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

  agregarMateriaPrima() {
    this.materiasPrimas.push({ nombre: '', costo: 0 });
  }

  agregarManoDeObra() {
    this.manoDeObraList.push({ nombre: '', costo: 0 });
  }

  agregarCostosIndirectos() {
    this.costosIndirectosList.push({ nombre: '', costo: 0 });
  }

  agregarOtrosCostos() {
    this.otrosCostosList.push({ nombre: '', costo: 0 });
  }

  calcular() {
    const costoMateriasPrimas = this.materiasPrimas.reduce((total, materia) => total + (materia.costo || 0), 0);
    const totalManoDeObra = this.manoDeObraList.reduce((total, mano) => total + (mano.costo || 0), 0);
    const totalCostosIndirectos = this.costosIndirectosList.reduce((total, costo) => total + (costo.costo || 0), 0);
    const totalOtrosCostos = this.otrosCostosList.reduce((total, costo) => total + (costo.costo || 0), 0);
    const totalOtrosGastos = totalManoDeObra + totalCostosIndirectos + totalOtrosCostos;

    this.costoProduccion = costoMateriasPrimas + totalOtrosGastos;

    console.log('Costo de materias primas:', costoMateriasPrimas);
    console.log('Total de mano de obra:', totalManoDeObra);
    console.log('Total de costos indirectos:', totalCostosIndirectos);
    console.log('Total de otros costos:', totalOtrosCostos);
    console.log('Costo de producción:', this.costoProduccion);

    const beneficio = this.costoProduccion * (this.margenBeneficio / 100);
    const impuestosCalculados = this.costoProduccion * (this.impuestos / 100);

    this.costoFabrica = this.costoProduccion + beneficio;
    this.costoDistribucion = this.costoFabrica + impuestosCalculados;

    console.log('Costo de fábrica:', this.costoFabrica);
    console.log('Costo de distribución:', this.costoDistribucion);

    const costoTotal = this.costoProduccion + beneficio + impuestosCalculados;
    console.log('Costo total:', costoTotal);

    this.pvp = costoTotal;

    console.log('PVP:', this.pvp);
  }

  createBarChart() {
    const rand_numbers = [...Array(12)].map(e => Math.random() * 100 | 0);

    this.barChartData.labels = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    this.barChartData.datasets = [
      {
        data: rand_numbers,
        backgroundColor: context => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            return null;
          }

          return this.helperService.createGradientChart(ctx, 'tertiary', 'tertiary');
        },
        barThickness: 10,
        borderRadius: 4,
        borderColor: this.helperService.getColorVariable('secondary'),
        hoverBackgroundColor: this.helperService.getColorVariable('secondary'),
        pointStyle: 'circle',
      }
    ];
  }

  async guardarDatos() {
    if (!this.txt_producto || !this.margenBeneficio || !this.impuestos || !this.costoProduccion ||
      !this.costoFabrica || !this.costoDistribucion || !this.pvp || !this.materiasPrimas.length ||
      !this.manoDeObraList.length || !this.costosIndirectosList.length || !this.otrosCostosList.length) {
      this.authService.showToast('Por favor, completa todos los campos antes de guardar.');
      return;
    }

    const datos = {
      accion: "editarProducto",
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
      otrosCostosList: this.otrosCostosList
    };

    try {
      const res: any = await this.authService.postData(datos).toPromise();
      if (res.estado) {
        this.mostrarMensajeRegistroExitoso();
        this.router.navigate(['/listacostos']).then(() => {
          // window.location.reload(); // Si es necesario refrescar la página completamente
        });
      } else {
        this.authService.showToast(res.mensaje);
      }
    } catch (error) {
      this.authService.showToast('Error al guardar los datos. Por favor, intenta de nuevo.');
    }
  }

  async mostrarMensajeRegistroExitoso() {
    this.authService.showToast2('Éxito, Datos registrados correctamente');
  }
}
