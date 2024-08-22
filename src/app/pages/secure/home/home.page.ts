import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Chart, ChartTypeRegistry } from 'chart.js';
import { ReportService } from 'src/app/services/report/report.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  content_loaded = false;
  data: any[] = [];
  view: any[] = [700, 400];
  productos = [];
  myChart: Chart;
  myChart2: Chart<'pie'> | null = null;

  // options
  gradient = true;
  showLegend = true;
  showLabels = true;
  isDoughnut = false;

  colorScheme = {
    domain: [],
  };

  constructor(
    private authService: AuthService,
    private reportService: ReportService
  ) {
    this.getData();
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
        }

        const colors = this.generarColoresHexadecimales(
          (this.productos || []).length
        );

        this.productos = this.productos.map((d, index) => ({
          name: d.nombre,
          value: d.RF_CANTIDAD_VENDIDA,
          color: colors[index],
        }));
        this.generarChart();
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

    this.graficoPastel();
  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  generarChart() {
    const canvas = document.getElementById('myChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    this.myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.productos.map((x) => x.name),
        datasets: [
          {
            label: 'Productos mas vendidos',
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

  graficoPastel() {
    const canvas = document.getElementById('myChart2') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    this.myChart2 = new Chart<'pie'>(ctx, {
      type: 'pie', // Especifica el tipo de gráfico
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'], // Etiquetas de las secciones del pastel
        datasets: [
          {
            label: 'My Dataset',
            data: [12, 19, 3, 5, 2, 3], // Datos para cada sección del pastel
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true, // Hace que el gráfico sea responsivo
        plugins: {
          legend: {
            position: 'top', // Posición de la leyenda
          },
          tooltip: {
            enabled: true, // Habilita o deshabilita los tooltips
          },
        },
      },
    });
  }
}
