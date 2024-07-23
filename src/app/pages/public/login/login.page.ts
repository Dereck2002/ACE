import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'src/app/services/toast/toast.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  txt_usuario:string="";
  txt_cedula:string="";
  txt_clave:string="";
  clave:string="";
  claveType: string = 'password';
  backgroundImage: string = "url('/assets/obelisco.png')";


  current_year: number = new Date().getFullYear();

  login_form: FormGroup;
  submit_attempt: boolean = false;

  constructor(
    private authService: AuthService,
    private loadingController: LoadingController,
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private router: Router,
    public navCtrl: NavController,
  ) { }

  ngOnInit() {
    

    // Setup form
    this.login_form = this.formBuilder.group({
      cedula: ['', Validators.compose([Validators.minLength(10), Validators.required])],
      clave: ['', Validators.compose([Validators.minLength(4), Validators.required])]
    });
  
  }

  // Sign in
  /*async login() {

    this.submit_attempt = true;

    // If email or password empty
    if (this.login_form.value.txt_cedula == '' || this.login_form.value.txt_clave == '') {
      this.toastService.presentToast('Error', 'Please input email and password', 'top', 'danger', 2000);

    } else {

      // Proceed with loading overlay
      const loading = await this.loadingController.create({
        cssClass: 'default-loading',
        message: '<p>Loging in...</p><span>Please be patient.</span>',
        spinner: 'crescent'
      });
      await loading.present();

      // Fake timeout
      setTimeout(async () => {
        // Sign in success
        await this.router.navigate(['/home']);
        loading.dismiss();
      }, 2000);

    }
    
  }*/

  async login(){
    let datos={
      accion:"login",
      usuario:this.txt_cedula,
      clave:this.txt_clave
    }
    this.authService.postData(datos).subscribe((res:any)=>{
      if (this.login_form.value.cedula == '' || this.login_form.value.clave == '') {
        this.toastService.presentToast('Error', 'Ingrese su cédula y contraseña', 'top', 'danger', 2000);
      }
    if(res.estado==true)
    {
      this.authService.creatSession('codigo', res.persona[0].codigo);
      this.authService.creatSession('persona', res.persona[0].nombre+" "+res.persona[0].apellido);
      this.authService.creatSession('nombre', res.persona[0].nombre);
      this.authService.creatSession('apellido', res.persona[0].apellido);
      this.authService.creatSession('cedula', res.persona[0].cedula);
      this.authService.creatSession('correo', res.persona[0].correo);
      this.authService.creatSession("imgUrl", res.persona[0].img_perfil);
      this.authService.showToast2('Bienvenido');
      
      this.navCtrl.navigateRoot(['/home']);
      
    }
    
    else
    {
      this.authService.showToast(res.mensaje);
    }
  
    });
    
    

  }
  togglePasswordVisibility(show: boolean): void {
    this.claveType = show ? 'text' : 'password';
  }
  setBackgroundImage(imageUrl: string): void {
    this.backgroundImage = `url('${imageUrl}')`;
  }
  
}
