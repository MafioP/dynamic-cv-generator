import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'dynamic-cv-generator';

  currentLanguages: string[] = ['de', 'en'];

  updateLanguages(languages: string[]) {
    this.currentLanguages = languages;
  }
}
