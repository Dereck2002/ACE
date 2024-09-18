import { Component } from '@angular/core';
import { ReportService } from 'src/app/services/report/report.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})
export class ReportPage {
  dateFrom: string;
  dateTo: string;
  reportType = 'daily_sales';
  reportData: any = [];
  exportFormat = '';

  currentPage = 1;
  totalPages = 1;
  isAccordionOpen = true;
  isShowChart = false;

  constructor(private reportService: ReportService) {}

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.generateReport(this.currentPage);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.generateReport(this.currentPage);
    }
  }

  toggleAccordion() {
    this.isAccordionOpen = !this.isAccordionOpen;
  }

  loadChart() {
    const ctx = document.getElementById('barChart') as HTMLCanvasElement;

    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.reportData.map((item) => item.nombre), // Ajusta según tus datos
          datasets: [
            {
              label: 'Ganancias',
              data: this.reportData.map((item) => item.RF_CANTIDAD_VENDIDA), // Ajusta según tus datos
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
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
  }

  generateReport(page?: number) {
    const requestBody = {
      accion: 'report',
      id_persona: localStorage.getItem('CapacitorStorage.codigo'),
      dateFrom: this.dateFrom,
      dateTo: this.dateTo,
      items_per_page: 10,
      page: page || 1,
    };

    this.reportService.getDataReport(requestBody).subscribe((response: any) => {
      if (response.estado) {
        this.reportData = response.productos;

        this.currentPage = response.pagination.current_page;
        this.totalPages = response.pagination.total_pages;
        this.isAccordionOpen = false;

        setTimeout(() => {
          this.loadChart();
        }, 500);
      } else {
        console.error('Error al generar el reporte', response.mensaje);
      }
    });
  }
}