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
        'A tool to optimize the tailoring of CVs to specific job offers, by providing a fast way of updating the user most relevant skills'
    }
  ];

  constructor(private cvService: CvService) {
    this.cvService.cvData.subscribe((data) => {
      this.skills = data.skills;
    });
  }

  downloadPDF(): void {
    const element = document.getElementById('cv-template'); // Target the CV container

    if (element) {
      element.style.fontSize = '14px'; // Adjust the size as needed

      const doc = new jsPDF({
        unit: 'px',
        format: 'a4',
        orientation: 'portrait',
      });

      const margin = 0; // Pixels
      const pageWidth = doc.internal.pageSize.getWidth();

      doc.html(element, {
        x: margin,
        y: margin,
        width: pageWidth - margin * 2,
        windowWidth: element.scrollWidth,
        callback: () => {
          // Restore original font size after rendering
          element.style.fontSize = '';
          doc.save('Generated-CV.pdf');
        },
      });
    }
  }
}
