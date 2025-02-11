import { Component, ViewChild } from '@angular/core';
import { CvPreviewComponent } from './cv-preview/cv-preview.component';

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

  @ViewChild(CvPreviewComponent) cvPreview!: CvPreviewComponent;

  callDownloadPdf() {
    this.cvPreview.downloadPDF();
  }
}
