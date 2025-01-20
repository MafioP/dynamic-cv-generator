import { Component } from '@angular/core';
import { CvService } from '../services/cv.service';

@Component({
  selector: 'app-cv-preview',
  templateUrl: './cv-preview.component.html',
  styleUrls: ['./cv-preview.component.css']
})
export class CvPreviewComponent {


  skills: string[] = ['Java', 'Python', 'Web Dev', 'C++/Embedded', 'JavaScript/TypeScript', 'Git, CI/CD'];
  experiences = [
    {
      position: 'Amazon Delivery Driver',
      company: 'PRB Logistik GmbH, Rammstein Germany',
      date: 'October 2024 - December 2024',
      description: 'Delivered parcels to various locations throughout the delivery area.'
    },
    {
      position: 'Intern Software Engineer',
      company: 'Comlet GmbH, Zweibrucken Germany',
      date: 'March 2024 - August 2024',
      description: 'Worked with embedded devices and CI/CD tools for test automation.'
    },
    {
      position: 'Intern Software Engineer',
      company: 'Evenbytes, Santander Spain',
      date: 'February 2023 - August 2023',
      description: 'Developed a Gmail addon and a proof-of-concept system for managing access control devices.'
    }
  ];
  languages: string[] = ['Spanish - Native', 'English - Advanced', 'German - Beginner (A1)'];
  projects = [
    {
      title: 'CAN and OBD reader for BMW',
      description: 'A HW and SW solution to read, analyze, and display parameters from the CAN bus and OBD Port.'
    },
    {
      title: 'Factory builder Unity game',
      description: 'A simple Unity engine game for building automated production lines.'
    }
  ];

  constructor(private cvService: CvService) {
    this.cvService.cvData.subscribe(data => {
      this.skills = data.skills;
    });
  }

  downloadPDF() {
    const element = document.getElementById('cv-template');
    import('html2pdf.js').then(html2pdf => {
    html2pdf.default().from(element).save('Generated-CV.pdf');
  }).catch(error => {
    console.error('Error loading html2pdf.js:', error);
  });
  }
}
