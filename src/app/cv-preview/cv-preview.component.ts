import { Component } from '@angular/core';
import { CvService } from '../services/cv.service';
import jsPDF from 'jspdf';
import { ImageConverterService } from '../services/image-converter.service';

@Component({
  selector: 'app-cv-preview',
  templateUrl: './cv-preview.component.html',
  styleUrls: ['./cv-preview.component.css'],
})
export class CvPreviewComponent {
  profilePicBase64: string | null = null;
  skills: string[] = [];
  softSkills: string[] = [
    'Fast Learner',
    'Team Player',
    'Problem Solver',
    'Flexible',
    'Good Communication',
  ];
  experiences = [
    {
      position: 'Intern Software Engineer',
      company: 'Comlet GmbH, Zweibrucken Germany',
      date: 'March 2024 - August 2024',
      details: [
        'Automated testing processes for embedded devices using Robot Framework, enabling continuous and repeatable testing without human intervention.',
        'Designed and 3D-printed 8 functional prototypes, including fixtures and mounts, to support hardware development.',
        'Programmed firmware for 3D printers (Marlin and OctoPrint) and integrated TMC2209 stepper drivers for enhanced performance.',
        'Applied CI/CD pipelines to streamline deployment cycles and ensure consistent software updates.',
      ],
    },
    {
      position: 'Intern Software Engineer',
      company: 'Evenbytes, Santander Spain',
      date: 'February 2023 - August 2023',
      details: [
        'Developed a Gmail Addon using Google Apps Script and OpenAI API to automatically process incoming invoices every 5 minutes, streamlining data entry.',
        'Built a cloud-hosted access control system on Google Cloud Run with Firestore, supporting between 100 and 1,000 users.',
        'Replaced legacy tools with a modernized system, halving development and configuration time.',
        'Enhanced backend scalability, enabling seamless integration with multiple access control devices.',
      ],
    },
    {
      position: 'Amazon Delivery Driver',
      company: 'PRB Logistik GmbH, Rammstein Germany',
      date: 'October 2024 - December 2024',
      details: [
        'Delivered approximately 250 parcels daily with a 95% on-time delivery rate, ensuring high customer satisfaction.',
        'Improved German language proficiency through daily interactions with a diverse customer base.',
      ],
    }
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
        'Developed a Python-based tool for real-time monitoring of OBD and CAN systems, supporting up to 6 parameters. Created a web app using Angular and NodeJS for live data visualization, improving diagnostic efficiency by automating insights.',
    },
    {
      title: 'LogistiX: Factory Builder Unity Game',
      description:
        'Designed a 3D factory automation game in Unity with C#, featuring 11 crafting recipes and 3 processing machines. Modeled assets in Blender to maintain cohesive game aesthetics.',
    },
    {
      title: 'Dynamic CV Geneator',
      description:
        'Created a tool for efficiently customizing resumes to job descriptions, streamlining CV tailoring for users.This CV pdf was generated using the tool, you can find a live demo on my GitHub page',
    },
  ];

  constructor(
    private cvService: CvService,
    private imageConverterService: ImageConverterService
  ) {
    this.cvService.cvData.subscribe((data) => {
      this.skills = data.skills;
    });
    this.imageConverterService
      .convertImageToBase64('assets/Profilepic.png')
      .then(
        (base64) => {
          this.profilePicBase64 = base64;
        },
        (error) => {
          console.error('Error converting image:', error);
        }
      );
  }

  async downloadPDF() {
    const doc = new jsPDF({
      unit: 'px',
      format: 'a4',
      orientation: 'portrait',
    });

    console.log('Available events:', doc.internal.events.getTopics());

    doc.internal.events.subscribe('addPage', () => {
      console.log('A new page was added to the PDF');
    });
    doc.internal.events.subscribe('putPage', (page) => {
      console.log('A new page was putted to the PDF', page);
    });

    doc.internal.events.subscribe('putResources', (resource) => {
      console.log('Resource putted ', resource);
    });

    let offsetY = 10; // Starting Y position
    const marginX = 15;

    // Add horizontal list
    const addHorizontalList = (
      items: string[],
      startX: number,
      startY: number
    ): number => {
      const itemHeight = 10; // Height for each item
      const padding = 10; // Space between items
      const rectRoundess = 5;
      let currentX = startX + padding / 2;

      items.forEach((item) => {
        doc.setFillColor(100, 100, 100);
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        // Draw box
        doc.roundedRect(
          currentX - padding / 2,
          startY - padding,
          doc.getTextWidth(item) + padding,
          itemHeight + padding / 2,
          rectRoundess,
          rectRoundess,
          'F'
        );
        // Add text centered inside the box
        doc.text(item, currentX, startY); // Slight padding for alignment
        currentX += doc.getTextWidth(item) + padding * 1.5; // Move to the next position
      });
      doc.setTextColor(0, 0, 0);

      return startY + itemHeight + 10; // Return the new Y position after the list
    };

    const setHeader = (text: String) => {
      doc.setFont('times', 'bold');
      doc.setFontSize(16);
      doc.text(text as string, marginX, offsetY);
      offsetY += 7;
      doc.setDrawColor('#ddd');
      doc.line(
        marginX,
        offsetY,
        doc.internal.pageSize.width - marginX,
        offsetY
      );
      offsetY += 13;
      doc.setFont('times', 'normal');
      doc.setFontSize(12);
    };

    const setContact = () => {
      doc.addImage(this.profilePicBase64 as string, 'PNG', marginX, offsetY, 80, 80); // (x, y, width, height)
      offsetY +=20;
      const tempXOffset = doc.internal.pageSize.getWidth() / 2;
      // Set Font and Styles
      doc.setFont('times', 'bold');
      doc.setFontSize(18);
      doc.text('Mario Pereda', tempXOffset, offsetY += 10, {align:"center"});

      doc.setFontSize(14);
      doc.setFont('times', 'italic');
      doc.text('Junior Software Engineer', tempXOffset, offsetY += 10, {align:"center"});

      doc.setFont('times', 'normal');
      doc.setFontSize(12);

      // Contact Info
      doc.text('+49 1575 1916935', tempXOffset, offsetY += 10, {align:"center"});
      doc.text('mario.pereda.08@gmail.com', tempXOffset, offsetY += 10, {align:"center"});
      doc.text('Friedrichshafenerstr 24a, 70329, Stuttgart, Germany', tempXOffset, offsetY += 10, {align:"center"});

      // Hyperlinks (LinkedIn & GitHub)
      doc.setTextColor(0, 0, 255); // Blue color to indicate a link
      doc.textWithLink('LinkedIn',tempXOffset - doc.getTextWidth('LinkedIn') - 10, offsetY += 10, {url: 'https://www.linkedin.com/in/mario-pereda-puyo-57061b253/'});

      doc.textWithLink('GitHub',tempXOffset + 10, offsetY,{ url: 'https://github.com/MafioP' });
    };

    const sections = ['contact', 'cv-template-1', 'skills', 'cv-template-2'];
    for (const [index, id] of sections.entries()) {
      if (id == 'contact') {
        setContact();
      }
      if (id == 'skills') {
        doc.addPage();
        offsetY = 20;
        setHeader('Skills');
        offsetY = addHorizontalList(this.skills, marginX, offsetY);
        offsetY = addHorizontalList(this.softSkills, marginX, offsetY);
        console.log('Added Skills', id, ' offset ', offsetY);
        setHeader('Languages');
        offsetY = addHorizontalList(this.languages, marginX, offsetY);
        console.log('Added Language ', id, ' offset ', offsetY);
        offsetY = offsetY + doc.internal.pageSize.getHeight() - 15;
      }
      const element = document.getElementById(id);
      if (element) {
        console.log('offset before html: ', offsetY, 'i:', index);

        // Wrap `doc.html` in a Promise
        await new Promise<void>((resolve) => {
          doc.html(element, {
            x: marginX,
            y: offsetY,
            html2canvas: {
              scale: 0.55,
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
