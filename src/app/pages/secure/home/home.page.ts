import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

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
}