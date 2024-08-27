import { Component } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private themeService: ThemeService
  ) {
    this.initializeApp();
    defineCustomElements(window);
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      if (Capacitor.getPlatform() !== 'web') {
        // Optional: Manage status bar appearance
      }

      // Load the saved theme or default to system theme
      this.themeService.loadSavedTheme();

      setTimeout(async () => {
        await SplashScreen.hide();
      }, 2000);
    });
  }
}
