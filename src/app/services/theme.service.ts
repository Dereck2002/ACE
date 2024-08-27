import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private themeKey = 'selected-theme';

  constructor() { }

  // Set the theme
  setTheme(theme: 'light' | 'dark' | 'system') {
    document.body.setAttribute('data-theme', theme);

    // Save the theme preference
    localStorage.setItem(this.themeKey, theme);

    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else if (theme === 'light') {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    } else {
      // Remove any specific theme, system default will be used
      document.body.classList.remove('dark-theme', 'light-theme');
    }
  }

  // Get the theme
  getTheme(): 'light' | 'dark' | 'system' {
    return localStorage.getItem(this.themeKey) as 'light' | 'dark' | 'system' || 'system';
  }

  // Load the saved theme or the system default theme
  loadSavedTheme() {
    const theme = this.getTheme();
    this.setTheme(theme);
  }
}
