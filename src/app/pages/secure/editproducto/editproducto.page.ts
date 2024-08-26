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
  otrosCostosList: { nombre: string, vtotal: number, costo: number }[] = [{ nombre: '', vtotal: 0, costo: 0 }];
  txt_margenBeneficio: number = 0;
  txt_utilidadv: number = 0;
  txt_utilidadc: number = 0;
  txt_impuestos: number = 0;
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
        this.txt_margenBeneficio = res.productos[0].margenBeneficio;
        this.txt_utilidadv = res.productos[0].utilidadVenta;
        this.txt_utilidadc = res.productos[0].utilidadDis;
        this.txt_impuestos = res.productos[0].impuestos;
        this.costoProduccion = res.productos[0].costoProduccion;
        this.costoFabrica = res.productos[0].costoFabrica;
        this.costoDistribucion = res.productos[0].costoDistribucion;
        this.pvp = res.productos[0].pvp;

        // Filtrar y asignar datos sin duplicados
        this.materiasPrimas = this.filterUniqueItems(res.productos[0].materiasPrimas, 'nombre');
        this.manoDeObraList = this.filterUniqueItems(res.productos[0].manoDeObraList, 'nombre');
        this.costosIndirectosList = this.filterUniqueItems(res.productos[0].costosIndirectosList, 'nombre');
        this.otrosCostosList = this.filterUniqueItems(res.productos[0].otrosCostosList, 'nombre');
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

  quitarMateriaPrima() {
    this.materiasPrimas.pop();
  }

  agregarManoDeObra() {
    this.manoDeObraList.push({ nombre: '', sueldoMensual: 0, tipoTiempo: '', horasTrabajadas: 0, costo: 0 });
  }

  quitarManoDeObra() {
    this.manoDeObraList.pop();
  }

  agregarCostosIndirectos() {
    this.costosIndirectosList.push({ nombre: '', cantidadHoras: 0, valorMensual: 0, horas: 0, cantidadagua: 0, cantidadGas: 0, costo: 0 });
  }

  quitarCostosIndirectos() {
    this.costosIndirectosList.pop();
  }

  agregarGasto() {
    this.otrosCostosList.push({ nombre: '', vtotal: 0, costo: 0 });
  }

  quitarGasto() {
    this.otrosCostosList.pop();
  }

  shouldShowCantidad(unidad: string): boolean {
    return unidad !== 'unidad' && unidad !== '';
  }

  unidadChange(event, index) {
    const selectedUnit = event.detail.value;
    this.materiasPrimas[index].unidad = selectedUnit;
  }

  async guardarCambios() {
    const datos = {
      accion: "guardarProducto",
      productoId: this.productoId,
      nombre: this.txt_producto,
      tproducto: this.tproducto,
      margenBeneficio: this.txt_margenBeneficio,
      utilidadVenta: this.txt_utilidadv,
      utilidadDis: this.txt_utilidadc,
      impuestos: this.txt_impuestos,
      costoProduccion: this.costoProduccion,
      costoFabrica: this.costoFabrica,
      costoDistribucion: this.costoDistribucion,
      pvp: this.pvp,
      materiasPrimas: this.materiasPrimas,
      manoDeObra: this.manoDeObraList,
      costosIndirectos: this.costosIndirectosList,
      otrosCostos: this.otrosCostosList
    };

    this.authService.postData(datos).subscribe((res: any) => {
      if (res.estado == true) {
        this.navCtrl.navigateRoot('producto');
      } else {
        this.authService.showToast(res.mensaje);
      }
    });
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
}