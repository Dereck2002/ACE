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
  txt_producto: string = '';
  materiasPrimas: { txt_nombre: string, txt_costo: number, txt_unidad: string, txt_cantidad: number }[] = [{ txt_nombre: '', txt_costo: 0, txt_unidad: '', txt_cantidad: 0 }];
  manoDeObraList: { txt_nombre: string, txt_costo: number }[] = [{ txt_nombre: '', txt_costo: 0 }];
  costosIndirectosList: { txt_nombre: string, txt_costo: number }[] = [{ txt_nombre: '', txt_costo: 0 }];
  otrosCostosList: { txt_nombre: string, txt_costo: number }[] = [{ txt_nombre: '', txt_costo: 0 }];
  txt_margenBeneficio: number = 0;
  txt_impuestos: number = 0;
  costoProduccion: number | null = null;
  costoFabrica: number | null = null;
  costoDistribucion: number | null = null;
  pvp: number | null = null;
  
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
        this.codigo = res.productos[0].codigo;
        this.txt_producto = res.productos[0].nombre;
        this.txt_margenBeneficio = res.productos[0].margenBeneficio;
        this.txt_impuestos = res.productos[0].impuestos;
        this.costoProduccion = res.productos[0].costoProduccion;
        this.costoFabrica = res.productos[0].costoProduccion;
        this.costoDistribucion = res.productos[0].costoDistribucion;
        this.pvp = res.productos[0].pvp;

        // Asignar valores a materiasPrimas
        this.materiasPrimas = res.productos[0].materiasPrimas.map((item: any) => ({
          txt_nombre: item.txt_nombre,
          txt_costo: item.txt_costo,
          txt_unidad: item.txt_unidad,
          txt_cantidad: item.txt_cantidad
        }));

        // Asignar valores a manoDeObraList
        this.manoDeObraList = res.productos[0].manoDeObraList.map((item: any) => ({
          txt_nombre: item.txt_nombre,
          txt_costo: item.txt_costo
        }));

        // Asignar valores a costosIndirectosList
        this.costosIndirectosList = res.productos[0].costosIndirectosList.map((item: any) => ({
          txt_nombre: item.txt_nombre,
          txt_costo: item.txt_costo
        }));

        // Asignar valores a otrosCostosList
        this.otrosCostosList = res.productos[0].otrosCostosList.map((item: any) => ({
          txt_nombre: item.txt_nombre,
          txt_costo: item.txt_costo
        }));

      } else {
        this.authService.showToast(res.mensaje);
      }
    });
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.content_loaded = true;
    }, 2000);
  }

  agregarMateriaPrima() {
    this.materiasPrimas.push({ txt_nombre: '', txt_costo: 0, txt_unidad: '', txt_cantidad: 0 });
  }
  quitarMateriaPrima() {
    if (this.materiasPrimas.length > 1) {
      this.materiasPrimas.pop();
    }
  }

  agregarManoDeObra() {
    this.manoDeObraList.push({ txt_nombre: '', txt_costo: 0 });
  }
  quitarManoDeObra() {
    if (this.manoDeObraList.length > 1) {
      this.manoDeObraList.pop();
    }
  }

  agregarCostosIndirectos() {
    this.costosIndirectosList.push({ txt_nombre: '', txt_costo: 0 });
  }

  quitarCostosIndirectos() {
    if (this.costosIndirectosList.length > 1) {
      this.costosIndirectosList.pop();
    }
  }

  agregarGasto() {
    this.otrosCostosList.push({ txt_nombre: '', txt_costo: 0 });
  }

  quitarGasto() {
    if (this.otrosCostosList.length > 1) {
      this.otrosCostosList.pop();
    }
  }

  agregarOtrosCostos() {
    this.otrosCostosList.push({ txt_nombre: '', txt_costo: 0 });
  }
  shouldShowCantidad(unidad: string): boolean {
    return unidad !== 'unid' && unidad !== '';
  }
  

  calcular() {
    const costoMateriasPrimas = this.materiasPrimas.reduce((total, materia) => total + (materia.txt_costo || 0), 0);
    const totalManoDeObra = this.manoDeObraList.reduce((total, mano) => total + (mano.txt_costo || 0), 0);
    const totalCostosIndirectos = this.costosIndirectosList.reduce((total, costo) => total + (costo.txt_costo || 0), 0);
    const totalOtrosCostos = this.otrosCostosList.reduce((total, costo) => total + (costo.txt_costo || 0), 0);
    const totalOtrosGastos = totalManoDeObra + totalCostosIndirectos + totalOtrosCostos;

    this.costoProduccion = costoMateriasPrimas + totalOtrosGastos;

    console.log('Costo de materias primas:', costoMateriasPrimas);
    console.log('Total de mano de obra:', totalManoDeObra);
    console.log('Total de costos indirectos:', totalCostosIndirectos);
    console.log('Total de otros costos:', totalOtrosCostos);
    console.log('Costo de producción:', this.costoProduccion);

    const beneficio = this.costoProduccion * (this.txt_margenBeneficio / 100);
    const impuestosCalculados = this.costoProduccion * (this.txt_impuestos / 100);

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

  async editarProducto() {
    if (!this.txt_producto || !this.txt_margenBeneficio || !this.txt_impuestos || !this.costoProduccion ||
      !this.costoFabrica || !this.costoDistribucion || !this.pvp || !this.materiasPrimas.length ||
      !this.manoDeObraList.length || !this.costosIndirectosList.length || !this.otrosCostosList.length) {
      this.authService.showToast('Por favor, completa todos los campos antes de guardar.');
      return;
    }

    const datos = {
      accion: "editarProducto",
      codigo: this.codigo,
      nombre: this.txt_producto,
      margenBeneficio: this.txt_margenBeneficio,
      impuestos: this.txt_impuestos,
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
  
  regresar() {
    this.navCtrl.back();
  }

  async mostrarMensajeRegistroExitoso() {
    this.authService.showToast2('Éxito, Datos registrados correctamente');
  }
}
