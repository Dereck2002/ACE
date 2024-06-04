import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-password-reset-form',
  templateUrl: './password-form.page.html',
  styleUrls: ['./password-form.page.scss'],
})
export class PasswordFormPage implements OnInit {
  password: string = '';
  confirmPassword: string = '';
  submitAttempt: boolean = false;
  currentYear: number = new Date().getFullYear();
  token: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private loadingController: LoadingController,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.token = this.activatedRoute.snapshot.queryParams['token'];
    if (!this.token) {
      this.router.navigate(['/signin']);
    }
  }

  async resetPassword() {
    this.submitAttempt = true;

    if (this.password && this.confirmPassword && this.password === this.confirmPassword) {
      const loading = await this.loadingController.create({
        cssClass: 'default-loading',
        message: '<p>Restableciendo contraseña...</p><span>Por favor, espere.</span>',
        spinner: 'crescent'
      });
      await loading.present();

      const data = { accion: 'nueva_contrasena', token: this.token, nueva_contrasena: this.password };

      this.http.post<any>("http://localhost/ACE/WsMunicipioIonic/ws_gad.php", data).subscribe(
        async (response) => {
          await loading.dismiss();
          if (response.estado) {
            await this.toastService.presentToast('Éxito', response.mensaje, 'top', 'success', 2000);
            this.router.navigate(['/signin']);
          } else {
            await this.toastService.presentToast('Error', response.mensaje, 'top', 'danger', 2000);
          }
        },
        async (error) => {
          await loading.dismiss();
          await this.toastService.presentToast('Error', 'Error al restablecer la contraseña.', 'top', 'danger', 2000);
        }
      );
    } else {
      await this.toastService.presentToast('Error', 'Por favor ingrese contraseñas válidas y asegúrese de que coincidan.', 'top', 'danger', 2000);
    }
  }
}
