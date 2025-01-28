import { Component, ElementRef, Renderer2 } from '@angular/core';
import { CvService } from '../services/cv.service';
import { PdfConverterService } from '../services/pdf-converter.service';

@Component({
  selector: 'app-cv-preview',
  templateUrl: './cv-preview.component.html',
  styleUrls: ['./cv-preview.component.css'],
})
export class CvPreviewComponent {
  skills: string[] = [];
  experiences = [
    {
      position: 'Amazon Delivery Driver',
      company: 'PRB Logistik GmbH, Rammstein Germany',
      date: 'October 2024 - December 2024',
      details: [
        'Delivered parcels to various locations throughout the delivery area.',
        'Employed this time to improve my German language skills while communicating with customers.',
      ],
    },
    {
      position: 'Intern Software Engineer',
      company: 'Comlet GmbH, Zweibrucken Germany',
      date: 'March 2024 - August 2024',
      details: [
        'ERASMUS exchange program for bachelor thesis.',
        'Worked with embedded devices, including the electronics and software side of them, developing a tool for test automation.',
        'Learned the benefits of CI/CD while developing the project.',
      ],
    },
    {
      position: 'Intern Software Engineer',
      company: 'Evenbytes, Santander Spain',
      date: 'February 2023 - August 2023',
      details: [
        'Full-stack web developer with Angular and NodeJS, working in Google Cloud Platform.',
        'Developed a Gmail addon for automated invoice processing and data collection.',
        'Developed a proof of concept system for managing access control devices.',
      ],
    },
  ];
  languages: string[] = [
    'Spanish - Native',
    'English - Advanced',
    'German - Beginner (A1)',
  ];
  projects = [
    {
      title: 'CAN and OBD reader for BMW',
      description:
        'A HW and SW solution to read, analyze, and display parameters from the CAN bus and the Onboard Diagnostics Port.',
    },
    {
      title: 'Factory builder Unity game',
      description:
        'A simple Unity engine game for building automated production lines.',
    },
    {
      title: 'Dynamic CV Geneator',
      description:
        'A tool to optimize the tailoring of CVs to specific job offers, by providing a fast way of updating the user most relevant skills',
    },
  ];

  constructor(
    private cvService: CvService,
    private pdfService: PdfConverterService,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {
    this.cvService.cvData.subscribe((data) => {
      this.skills = data.skills;
    });
  }

  private extractComponentStyles(componentSelector: string): string {
    let styles = '';

    // Loop through all stylesheets in the document
    Array.from(document.styleSheets).forEach((styleSheet: CSSStyleSheet) => {
      try {
        // Loop through each CSS rule
        Array.from(styleSheet.cssRules).forEach((rule: CSSRule) => {
          if (
            rule instanceof CSSStyleRule &&
            rule.selectorText.includes(componentSelector)
          ) {
            styles += rule.cssText + '\n';
          }
        });
      } catch (error) {
        // Some stylesheets might be restricted (e.g., third-party), so we catch and skip them
        console.warn('Unable to access stylesheet:', styleSheet.href, error);
      }
    });

    return styles;
  }

  downloadPDF(): void {
    const element = document.getElementById('cv-template') as HTMLElement; // Target the CV container
    if (!element) {
      console.error('Element not found!');
      return;
    }

    const applyInlineStyles = (element: HTMLElement): void => {
      const styles = window.getComputedStyle(element);
      for (let i = 0; i < styles.length; i++) {
        element.style.setProperty(
          styles[i],
          styles.getPropertyValue(styles[i])
        );
      }

      Array.from(element.children).forEach((child) =>
        applyInlineStyles(child as HTMLElement)
      );
    };

    applyInlineStyles(element);

    const componentSelector = 'cv-template'; // Update this to your component selector
    const extractedStyles = `.cv-container {
      font-family: Arial, sans-serif;
      color: #333;
      background: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .cv-header {
      text-align: center;
      margin-bottom: 20px;
    }

    .cv-header h1 {
      font-size: 2em;
      margin: 0;
    }

    .cv-header h2 {
      font-size: 1.2em;
      color: #666;
      margin: 5px 0;
    }

    .cv-header p {
      margin: 2px 0;
    }

    .cv-section {
      margin-bottom: 20px;
    }

    .cv-section h3 {
      font-size: 1.5em;
      color: #000000;
      margin-bottom: 10px;
      border-bottom: 1px solid #ddd;
      padding-bottom: 5px;
    }

    .skills-list, .languages-list {
      list-style-type: none;
      padding: 0;
      margin: 0;
    }

    .skills-list li, .languages-list li {
      background: #6d6d6d;
      color: white;
      padding: 5px 10px;
      margin: 5px 5px;
      border-radius: 5px;
      display: inline-block;
    }

    .cv-section ul {
      margin-top: 10px;
    }

    .cv-section h4 {
      font-size: 1.2em;
      margin: 5px 0;
    }

    .cv-section p {
      margin: 5px 0;
      color: #555;
    }


    .experience-item {
      margin-bottom: 20px;
    }

    .experience-item ul {
      list-style-type: disc;
      padding-left: 20px;
      margin: 10px 0;
    }

    .experience-item li {
      margin-bottom: 5px;
    }

    /* Header Section */
    .cv-header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }

    .profile-picture {
      flex: 0 0 200px;
      width: 200px;
      height: 200px;
      margin-right: 20px;
      border-radius: 50%;
      overflow: hidden;
      background-color: #e0e0e0;
    }

    .profile-picture img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .personal-info {
      flex: 0.7;
    }

    .personal-info h1 {
      font-size: 2em;
      margin: 0;
    }

    .personal-info h2 {
      font-size: 1.2em;
      color: #666;
      margin: 5px 0;
    }

    .personal-info p {
      margin: 2px 0;
    }`

    const styledHtml = `
    <html>
      <head>
        <meta charset="UTF-8">
        <style>${extractedStyles}</style>
      </head>
      <body>${element.outerHTML}</body>
    </html>`;

    console.log(styledHtml);
    this.pdfService.generatePdf(styledHtml).subscribe({
      next: (pdfBlob) => {
        console.log(pdfBlob);
        // Create a URL for the blob and trigger the download
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = pdfUrl;
        a.download = 'generated.pdf';
        a.click();
        URL.revokeObjectURL(pdfUrl); // Clean up
      },
      error: (err) => {
        console.error('Error generating PDF:', err);
      },
    });
  }
}
