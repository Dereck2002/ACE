import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { ToastService } from 'src/app/services/toast/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperer_c',
  templateUrl: './recuperer_c.page.html',
  styleUrls: ['./recuperer_c.page.scss'],
})
export class PasswordResetPage implements OnInit {
  reset_form: FormGroup;
  submit_attempt: boolean = false;
  current_year: number = new Date().getFullYear();

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private loadingController: LoadingController,
    private toastService: ToastService,
    private router: Router
  ) { }

  ngOnInit() {
    this.reset_form = this.formBuilder.group({
      cedula: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])],
    });
  }

  async resetPassword() {
    this.submit_attempt = true;

    if (this.reset_form.valid) {
      const loading = await this.loadingController.create({
        cssClass: 'default-loading',
        message: '<p>Enviando solicitud...</p><span>Por favor, espere.</span>',
        spinner: 'crescent'
      });
      await loading.present();

      const cedula = this.reset_form.value.cedula;
      const datos = { accion: 'recuperar_contrasena', cedula };

      this.http.post<any>("http://localhost/ACE/WsMunicipioIonic/ws_gad.php", datos).subscribe(
        async (response) => {
          loading.dismiss();
          if (response.estado) {
            await this.toastService.presentToast('Éxito', response.mensaje, 'top', 'success', 2000);
          } else {
            await this.toastService.presentToast('Error', response.mensaje, 'top', 'danger', 2000);
          }
        },
        async (error) => {
          loading.dismiss();
          await this.toastService.presentToast('Error', 'Error al enviar la solicitud de recuperación de contraseña.', 'top', 'danger', 2000);
        }
      );
    } else {
      await this.toastService.presentToast('Error', 'Por favor ingrese una cédula válida.', 'top', 'danger', 2000);
    }
  }
}
