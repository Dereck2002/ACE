import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'src/app/services/toast/toast.service';
import { Router } from '@angular/router';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.page.html',
  styleUrls: ['./ajustes.page.scss'],
})
export class AjustesPage implements OnInit {
  nombre: string = "";
  correo: string = "";
  imgUrl: any;
  selectedTheme: 'light' | 'dark' | 'system';

  constructor(
    private authService: AuthService,
    private loadingController: LoadingController,
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private router: Router,
    private themeService: ThemeService) {

    this.authService.getSession('persona').then((res: any) => {
      this.nombre = res;

    });
    this.authService.getSession('correo').then((res: any) => {
      this.correo = res;

    });

    this.authService.getSession("imgUrl").then((res: any) => {
      this.imgUrl = res;
    });


  }

  ngOnInit() {
    this.selectedTheme = this.themeService.getTheme();
  }

  // Sign out
  signOut() {
    this.authService.closeSession();
  }

  onThemeChange(event: any) {
    this.selectedTheme = event.detail.value;
    this.themeService.setTheme(this.selectedTheme);
  }


}