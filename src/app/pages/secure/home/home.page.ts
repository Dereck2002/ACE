import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Chart } from 'chart.js';
import { ReportService } from 'src/app/services/report/report.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  content_loaded = false;
  productos = [];
  totalGanancias: number = 0;
  totalCantidadVendida: number = 0; // Total de cantidad vendida
  myChart: Chart<'bar'> | null = null;
  myChart2: Chart<'pie'> | null = null;

  codigo: string = '';
  searchTerm: string = '';
  stockAlerts: string[] = [];

  constructor(
    private authService: AuthService,
    private reportService: ReportService,
    private alertController: AlertController,
  ) {
    this.getData();
  }

  async ionViewWillEnter() {
    try {
      const res = await this.authService.getSession('codigo');
      this.codigo = res;
      await this.verificarStock(this.codigo);
    } catch (error) {
      console.error('Error al inicializar los datos', error);
      this.authService.showToast(
        'Error al cargar los datos. Por favor, intenta de nuevo.'
      );
    }
  }

  verificarStock(codigo: string) {
    let datos = {
      accion: 'lproductos',
      cod_persona: this.codigo,
    };
    this.authService.postData(datos).subscribe((res: any) => {
      if (res.estado === true) {
        // Verificar stock mínimo con lógica dinámica
        this.stockAlerts = this.authService.checkStockMinimo(res.datos);
        if (this.stockAlerts.length > 0) {
          this.showStockAlert();
        }
      } else {
        this.authService.showToast(res.mensaje);
      }
    });
  }

  async showStockAlert() {
    const alert = await this.alertController.create({
      header: 'Alertas de Stock',
      message: this.stockAlerts.join('<br>'),
      buttons: ['OK']
    });

    await alert.present();
  }

  private generarColoresHexadecimales(cantidad: number): string[] {
    const colores: string[] = [];
    const letrasHex = '89ABCDEF';

    while (colores.length < cantidad) {
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letrasHex[Math.floor(Math.random() * letrasHex.length)];
      }

      if (!colores.includes(color)) {
        colores.push(color);
      }
    }

    return colores;
  }

  private async getData() {
    const userCode = localStorage.getItem('CapacitorStorage.codigo');
    const datos = {
      accion: 'report',
      id_persona: userCode,
      page: 1,
      items_per_page: 1000000000,
      dateFrom: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        .toISOString()
        .split('T')[0],
      dateTo: new Date().toISOString().split('T')[0],
    };

    this.reportService.getDataReport(datos).subscribe((res: any) => {
      if (res.estado) {
        const products = res?.productos;

        if (products && Array.isArray(products)) {
          this.productos = products
            .sort((a, b) => b.RF_CANTIDAD_VENDIDA - a.RF_CANTIDAD_VENDIDA)
            .slice(0, 4);

          const colors = this.generarColoresHexadecimales(
            (this.productos || []).length
          );

          this.productos = this.productos.map((d, index) => ({
            name: d.nombre,
            value: d.RF_CANTIDAD_VENDIDA,
            ganancias: d.cuanto_gana,
            color: colors[index],
          }));

          // Calcular el total de ganancias
          this.totalGanancias = this.productos.reduce(
            (total, producto) => total + producto.ganancias,
            0
          );

          // Calcular el total de cantidad vendida
          this.totalCantidadVendida = this.productos.reduce(
            (total, producto) => total + producto.value,
            0
          );

          this.generarChart();
          this.generarChartPastel();
        } else {
          this.authService.showToast(res.mensaje);
        }
      } else {
        this.authService.showToast(res.mensaje);
      }
    });
  }

  ngOnInit() {
    // Fake timeout
    setTimeout(() => {
      this.content_loaded = true;
    }, 2000);
  }

  generarChart() {
    const canvas = document.getElementById('myChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    this.myChart = new Chart<'bar'>(ctx, {
      type: 'bar',
      data: {
        labels: this.productos.map((x) => x.name),
        datasets: [
          {
            label: 'Productos más vendidos',
            data: this.productos.map((x) => x.value),
            backgroundColor: this.productos.map((x) => x.color),
            borderColor: this.productos.map((x) => x.color),
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  generarChartPastel() {
    const canvas = document.getElementById('myChart2') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    this.myChart2 = new Chart<'pie'>(ctx, {
      type: 'pie',
      data: {
        labels: this.productos.map((x) => x.name),
        datasets: [
          {
            label: 'Ganancias por producto',
            data: this.productos.map((x) => x.ganancias),
            backgroundColor: this.productos.map((x) => x.color),
            borderColor: this.productos.map((x) => x.color),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            enabled: true,
          },
        },
      },
    });
  }
}
