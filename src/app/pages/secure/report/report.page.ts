import { Component } from '@angular/core';
import { ReportService } from 'src/app/services/report/report.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})
export class ReportPage {
  dateFrom: string;
  dateTo: string;
  reportType: string = 'daily_sales';
  reportData: any = [];
  exportFormat: string = '';

  constructor(private reportService: ReportService) {}

  generateReport() {
    const userCode = localStorage.getItem('CapacitorStorage.codigo');
    const requestBody = {
      accion: 'report',
      id_persona: userCode, // Suponiendo un id_persona estático, puede ser dinámico
      dateFrom: this.dateFrom,
      dateTo: this.dateTo,
      report_type: this.reportType,
      export_format: this.exportFormat,
    };

    this.reportService.getDataReport(requestBody).subscribe((response: any) => {
      if (response.estado) {
        this.reportData = response.productos;
        if (this.exportFormat === 'pdf' || this.exportFormat === 'excel') {
          // Iniciar descarga del archivo generado
          const blob = new Blob([response], { type: 'application/octet-stream' });
          const url = window.URL.createObjectURL(blob);
          window.open(url);
        }
      } else {
        console.error('Error al generar el reporte', response.mensaje);
      }
    });
  }
}
