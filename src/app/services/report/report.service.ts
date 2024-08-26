import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private serverUrl = 'http://localhost/ACE/WsMunicipioIonic/reports/ws_reports.php';

  constructor(private http: HttpClient) {}

  getDataReport(body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(this.serverUrl, JSON.stringify(body), { headers });
  }
}
