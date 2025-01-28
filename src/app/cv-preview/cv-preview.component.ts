import { Component } from '@angular/core';
import { CvService } from '../services/cv.service';
import jsPDF from 'jspdf';

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

  constructor(private cvService: CvService) {
    this.cvService.cvData.subscribe((data) => {
      this.skills = data.skills;
    });
  }

  async downloadPDF() {
    const doc = new jsPDF({
      unit: 'px',
      format: 'a4',
      orientation: 'portrait',
    });

    let offsetY = 10; // Starting Y position

    // Helper function to add HTML content
    const addHtmlToPdf = (
      html: HTMLElement,
      offsetY: number,
      next?: () => void
    ) => {
      console.log('Html to add: ', html);
      doc.html(html, {
        x: 10,
        y: offsetY,
        html2canvas: {
          scale: 0.5,
        },
        callback: () => {
          const contentHeight = html.offsetHeight;
          console.log('Content height added to PDF:', contentHeight);
          offsetY += contentHeight + 10; // Update Y offset
          if (next) {
            next();
          }
        },
      });
    };

    // Add horizontal list
    const addHorizontalList = (
      items: string[],
      startX: number,
      startY: number
    ): number => {
      const itemWidth = 50; // Width for each item
      const itemHeight = 10; // Height for each item
      const padding = 10; // Space between items
      let currentX = startX;

      items.forEach((item) => {
        // Draw box
        doc.rect(currentX, startY, itemWidth, itemHeight);
        // Add text centered inside the box
        doc.text(item, currentX + 5, startY + 7); // Slight padding for alignment
        currentX += itemWidth + padding; // Move to the next position
      });

      return startY + itemHeight + 10; // Return the new Y position after the list
    };
    /*
    // Add the first section
    const section1 = document.getElementById('cv-template-2') as HTMLElement;
    if (section1) {
      addHtmlToPdf(section1, offsetY, () => {
        // Add the second section
        const section2 = document.getElementById('cv-template-1') as HTMLElement;
        if (section2) {
          addHtmlToPdf(section2, offsetY, () => {
            // Add the programmatically generated list
            doc.save('output.pdf');
            const section3 = document.createElement('div');
            section3.innerHTML = `<ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>`;
            addHtmlToPdf(section3, offsetY, () => {
              // Save the PDF after all sections are added
            });
          });
        }
      });
    }
    */

    const sections = ['cv-template-1', 'cv-template-2'];
    for (const [index, id] of sections.entries()) {
      const element = document.getElementById(id);

      if (element) {
        console.log('offset before html: ', offsetY, 'i:', index);

        // Wrap `doc.html` in a Promise
        await new Promise<void>((resolve) => {
          doc.html(element, {
            x: 10,
            y: offsetY,
            html2canvas: {
              scale: 0.5,
            },
            callback: () => {
              console.log('starting offset: ', offsetY, 'i:', index);
              offsetY += element.offsetHeight / 2; // Adjust Y position after rendering
              console.log('Added ', id, ' offset ', offsetY);
              resolve(); // Resolve the Promise when the callback is complete
            },
          });
        });
      }
    }

    // Save the PDF after processing all sections
    doc.save('dynamic-multiple-sections.pdf');
  }
}
