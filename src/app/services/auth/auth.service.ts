import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Storage } from '@capacitor/storage';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  server: string = "http://localhost/ACE/WsMunicipioIonic/ws_gad.php";
  private toastQueue: Array<{ message: string, duration: number, position: 'top' | 'bottom', color: string }> = [];
  private isToastActive: boolean = false;

  constructor(
    public http: HttpClient,
    public toastCtrl: ToastController,
    private router: Router,
    public navCtrl: NavController,
  ) { }

  postData(body: any) {
    let head = new HttpHeaders({ 'Content-Type': 'application/json, charset:utf-8' });
    let options = {
      headers: head
    };
    return this.http.post(this.server, JSON.stringify(body), options);
  }

  // Verifcar stock 
  checkStockMinimo(productos: any[]): string[] {
    let alertMessages: string[] = [];
    // Define un umbral de stock bajo. Ajusta según tus necesidades.
    const umbralCritico = 1000; // Por ejemplo, cualquier producto con pvp <= 1 es considerado crítico

    productos.forEach((producto) => {
      // Lógica para determinar si el producto es crítico
      if (producto.pvp <= umbralCritico) {
        alertMessages.push(`¡Atención! El stock del producto ${producto.nombre} es bajo.`);
      }
    });
    return alertMessages;
  }

  public uploadIMG(formData: FormData) {
    return this.http.post("http://localhost/ACE/WsMunicipioIonic/ws_img.php", formData);
  }

  async creatSession(id: string, valor: string) {
    await Storage.set({
      key: id,
      value: valor
    });
  }

  async closeSession() {
    await Storage.clear();
    this.navCtrl.navigateRoot(['/login']);
  }

  async getSession(id: string) {
    const item = await Storage.get({
      key: id,
    });
    return item.value;
  }

  // Sign in
  async login(email: string, password: string) {
    let sample_user = {
      email: email,
      password: password
    };

    return sample_user;
  }

  // Sign up
  async registro(email: string, password: string) {
    let sample_user = {
      email: email,
      password: password
    };

    return sample_user;
  }

  // Sign out
  async signOut() {
    this.router.navigateByUrl('/login');
  }

  private async processQueue() {
    if (this.isToastActive || this.toastQueue.length === 0) {
      return;
    }

    this.isToastActive = true;
    const toastData = this.toastQueue.shift();

    if (toastData) {
      const toast = await this.toastCtrl.create({
        message: toastData.message,
        duration: toastData.duration,
        position: toastData.position,
        color: toastData.color
      });

      toast.present();
      setTimeout(() => {
        this.isToastActive = false;
        this.processQueue();
      }, toastData.duration + 500); // Añadir un poco de tiempo extra para asegurarse de que el toast se haya descartado completamente
    }
  }

  public showToast(message: string) {
    this.toastQueue.push({ message, duration: 500, position: 'top', color: 'danger' });
    this.processQueue();
  }

  public showToast1(message: string) {
    this.toastQueue.push({ message, duration: 500, position: 'bottom', color: 'warning' });
    this.processQueue();
  }

  public showToast2(message: string) {
    this.toastQueue.push({ message, duration: 500, position: 'top', color: 'success' });
    this.processQueue();
  }

}