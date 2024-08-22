import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  server = 'http://localhost/ACE/WsMunicipioIonic/reports';

  constructor(
    public http: HttpClient,
    public toastCtrl: ToastController,
    private router: Router,
    public navCtrl: NavController
  ) {}

  getDataReport(body: {}) {
    const head = new HttpHeaders({
      'Content-Type': 'application/json, charset:utf-8',
    });
    const options = {
      headers: head,
    };
    return this.http.post(
      `${this.server}/ws_reports.php`,
      JSON.stringify(body),
      options
    );
  }
}
