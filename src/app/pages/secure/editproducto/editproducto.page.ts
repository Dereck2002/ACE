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
  materiasPrimas: { txt_nombre: string, txt_costo: number, txt_unidad: string, txt_cantidad: number }[] = [{ txt_nombre: '', txt_costo: 0, txt_unidad: '', txt_cantidad: 0 }];
  manoDeObraList: { txt_nombre: string, txt_costo: number }[] = [{ txt_nombre: '', txt_costo: 0 }];
  costosIndirectosList: { txt_nombre: string, txt_costo: number }[] = [{ txt_nombre: '', txt_costo: 0 }];
  otrosCostosList: { txt_nombre: string, txt_costo: number }[] = [{ txt_nombre: '', txt_costo: 0 }];
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
        ticks: { color: '#666', font: { family: 'Inter', weight: '500' } }
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
        console.log("Producto ID asignado:", this.productoId); // Agrega esta línea para verificar
        this.codigo = res.productos[0].codigo;
        this.txt_producto = res.productos[0].nombre;
        this.txt_margenBeneficio = res.productos[0].margenBeneficio;
        this.txt_utilidadv = res.productos[0].utilidadVenta;
        this.txt_utilidadc = res.productos[0].utilidadDis;
        this.txt_impuestos = res.productos[0].impuestos;
        this.costoProduccion = res.productos[0].costoProduccion;
        this.costoFabrica = res.productos[0].costoFabrica;
        this.costoDistribucion = res.productos[0].costoDistribucion;
        this.pvp = res.productos[0].pvp;

        // Filtrar y asignar datos de materias primas sin duplicados
        this.materiasPrimas = this.filterUniqueItems(res.productos[0].materiasPrimas, 'txt_nombre');

        // Filtrar y asignar datos de mano de obra sin duplicados
        this.manoDeObraList = this.filterUniqueItems(res.productos[0].manoDeObraList, 'txt_nombre');

        // Filtrar y asignar datos de costos indirectos sin duplicados
        this.costosIndirectosList = this.filterUniqueItems(res.productos[0].costosIndirectosList, 'txt_nombre');

        // Filtrar y asignar datos de otros costos sin duplicados
        this.otrosCostosList = this.filterUniqueItems(res.productos[0].otrosCostosList, 'txt_nombre');
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
    this.materiasPrimas.push({ txt_nombre: '', txt_costo: 0, txt_unidad: '', txt_cantidad: 0 });
  }

  quitarMateriaPrima() {
    this.materiasPrimas.pop();
  }

  agregarManoDeObra() {
    this.manoDeObraList.push({ txt_nombre: '', txt_costo: 0 });
  }

  quitarManoDeObra() {
    this.manoDeObraList.pop();
  }

  agregarCostosIndirectos() {
    this.costosIndirectosList.push({ txt_nombre: '', txt_costo: 0 });
  }

  quitarCostosIndirectos() {
    this.costosIndirectosList.pop();
  }

  agregarGasto() {
    this.otrosCostosList.push({ txt_nombre: '', txt_costo: 0 });
  }

  quitarGasto() {
    this.otrosCostosList.pop();
  }

  shouldShowCantidad(unidad: string): boolean {
    return unidad !== 'unidad' && unidad !== '';
  }

  unidadChange(event, index) {
    const selectedUnit = event.detail.value;
    this.materiasPrimas[index].txt_unidad = selectedUnit;
    if (selectedUnit === 'unidad') {
      this.materiasPrimas[index].txt_cantidad = 1;
    } else {
      this.materiasPrimas[index].txt_cantidad = null; // or set a default value
    }
    this.calcular();
  }
  
  calcular() {
    // Función para limpiar números
    const limpiarNumero = (valor: any): number => {
      if (typeof valor === 'string') {
        valor = valor.replace(/[^0-9.-]+/g, ''); // Eliminar caracteres no numéricos
      }
      return parseFloat(valor) || 0; // Convertir a número y manejar NaN
    };
  
    // Calcular el costo de las materias primas
    const costoMateriasPrimas = this.materiasPrimas.reduce((total, materia) => total + limpiarNumero(materia.txt_costo), 0);
  
    // Calcular el costo de la mano de obra
    const totalManoDeObra = this.manoDeObraList.reduce((total, mano) => total + limpiarNumero(mano.txt_costo), 0);
  
    // Calcular el costo de los costos indirectos
    const totalCostosIndirectos = this.costosIndirectosList.reduce((total, costo) => total + limpiarNumero(costo.txt_costo), 0);
  
    // Calcular el costo de otros gastos
    const totalOtrosGastos = this.otrosCostosList.reduce((total, costo) => total + limpiarNumero(costo.txt_costo), 0);
  
    // Calcular el costo de producción
    this.costoProduccion = parseFloat((costoMateriasPrimas + totalManoDeObra + totalCostosIndirectos + totalOtrosGastos - 0.02).toFixed(2));
  
    // Calcular el costo de fábrica
    const beneficio = parseFloat((this.costoProduccion * (this.txt_margenBeneficio / 100)).toFixed(2));
    this.costoFabrica = parseFloat((this.costoProduccion + beneficio).toFixed(2));
  
    // Calcular el costo de distribución
    const utilidadVendedor = parseFloat((this.costoFabrica * (this.txt_utilidadv / 100)).toFixed(2));
    this.costoDistribucion = parseFloat((this.costoFabrica + utilidadVendedor).toFixed(2));
  
    // Calcular el precio de venta al público (PVP)
    const utilidadComercial = parseFloat((this.costoDistribucion * (this.txt_utilidadc / 100)).toFixed(2));
    const impuestosCalculados = parseFloat((this.costoDistribucion * (this.txt_impuestos / 100)).toFixed(2));
    this.pvp = parseFloat((this.costoDistribucion + utilidadComercial + impuestosCalculados).toFixed(2));
  
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
 

  async editarProducto() {
    const datos = {
      accion: "editarProducto",
      codigo: this.codigo,
      nombre: this.txt_producto,
      margenBeneficio: this.txt_margenBeneficio,
      utilidad_venta: this.txt_utilidadv,
      utilidad_dis: this.txt_utilidadc,
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
        this.navCtrl.navigateRoot(['/listacostos']);
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
