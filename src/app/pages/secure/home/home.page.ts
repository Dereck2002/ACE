import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Chart, ChartTypeRegistry } from 'chart.js';


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

  constructor(private authService: AuthService) {
    this.getData();
  }

  private generarColoresHexadecimales(cantidad: number): string[] {
    const colores: string[] = [];
    const letrasHex = '89ABCDEF'; // Evitar 01234567 para obtener colores más brillantes

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
      accion: 'lproductos',
      cod_persona: userCode,
    };

    this.authService.postData(datos).subscribe((res: any) => {
      if (res.estado === true) {
        const colors = this.generarColoresHexadecimales(
          (res?.datos || []).length
        );

        const data = (res?.datos || []).sort(
          (a, b) => b.utilidad_venta - a.utilidad_venta
        );

        this.colorScheme.domain = colors;

        // Asignar datos y colores a 'single' para el gráfico
        this.data = data.map((d, index) => ({
          name: d.nombre,
          value: d.utilidad_venta,
          color: colors[index],
        }));

        // Asignar datos y colores a 'productos' para la tabla
        this.productos = data.map((x, index) => ({
          ...x,
          color: colors[index], // Asegúrate de incluir los colores si los has generado
        }));
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

    this.generarChart();
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
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  graficoPastel() {
    const canvas = document.getElementById('myChart2') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    this.myChart2 = new Chart<'pie'>(ctx, {
      type: 'pie', // Especifica el tipo de gráfico
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'], // Etiquetas de las secciones del pastel
        datasets: [{
          label: 'My Dataset',
          data: [12, 19, 3, 5, 2, 3], // Datos para cada sección del pastel
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
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
        }
      }
    });
  }
}