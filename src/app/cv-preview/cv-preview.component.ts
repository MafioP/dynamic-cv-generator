import { Component } from '@angular/core';
import { CvService } from '../services/cv.service';
import jsPDF from 'jspdf';
import { ImageConverterService } from '../services/image-converter.service';
import { ResumeData, ContactDetails } from '../interfaces/profile';
import * as enData from '../../assets/content-en.json';
import * as deData from '../../assets/content-de.json';

@Component({
  selector: 'app-cv-preview',
  templateUrl: './cv-preview.component.html',
  styleUrls: ['./cv-preview.component.css'],
})
export class CvPreviewComponent {
  profileData = [deData,enData];
  profilePicBase64: string | null = null;
  skills: string[] = [];

  constructor(private cvService: CvService) {
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
      console.log("Adding skills");
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

    const setContactInfo = (profileData: ContactDetails) => {
      console.log("Setting contact info ", profileData);
      doc.addImage(
        this.profilePicBase64 as string,
        'PNG',
        marginX,
        offsetY,
        80,
        80
      ); // (x, y, width, height)
      offsetY += 20;
      const tempXOffset = doc.internal.pageSize.getWidth() / 2;
      // Set Font and Styles
      doc.setFont('times', 'bold');
      doc.setFontSize(18);
      doc.text(profileData.name, tempXOffset, (offsetY += 10), {
        align: 'center',
      });

      doc.setFontSize(14);
      doc.setFont('times', 'italic');
      doc.text(profileData.title, tempXOffset, (offsetY += 10), {
        align: 'center',
      });

      doc.setFont('times', 'normal');
      doc.setFontSize(12);

      // Contact Info
      doc.text(profileData.phoneNumber, tempXOffset, (offsetY += 10), {
        align: 'center',
      });
      doc.text(profileData.gmailAddress, tempXOffset, (offsetY += 10), {
        align: 'center',
      });
      doc.text(profileData.livingAddress, tempXOffset, (offsetY += 10), {
        align: 'center',
      });

      // Hyperlinks (LinkedIn & GitHub)
      doc.setTextColor(0, 0, 255); // Blue color to indicate a link
      doc.textWithLink(
        'LinkedIn',
        tempXOffset - doc.getTextWidth('LinkedIn') - 10,
        (offsetY += 10),
        { url: 'https://www.linkedin.com/in/mario-pereda-puyo-57061b253/' }
      );

      doc.textWithLink('GitHub', tempXOffset + 10, offsetY, {
        url: 'https://github.com/MafioP',
      });
    };

    const sections = ['contact', 'cv-template-1', 'skills', 'cv-template-2'];

      for (const [langIndex, langData] of this.profileData.entries()) {
        for (const [index, id] of sections.entries()) {
          if (id === 'contact') {
            setContactInfo(langData.contactDetails);
          }
          if (id === 'skills') {
            console.log("[SKILLS (before addpage)]Current page" + doc.getCurrentPageInfo().pageNumber);
            doc.addPage();
            console.log("[SKILLS (after addpage)]Current page" + doc.getCurrentPageInfo().pageNumber);
            offsetY = 20;
            setHeader('Skills');
            offsetY = addHorizontalList(this.skills, marginX, offsetY);
            offsetY = addHorizontalList(langData.softSkills, marginX, offsetY);
            console.log('Added Skills', id, 'offset', offsetY);
            setHeader('Languages');
            offsetY = addHorizontalList(langData.languages, marginX, offsetY);
            console.log('Added Language', id, 'offset', offsetY);
            offsetY += doc.internal.pageSize.getHeight() - 15;
          }

          const element = document.getElementsByClassName(id).item(langIndex) as HTMLElement;
          if (element) {
            console.log('Offset before html:', offsetY, 'i:', index);
            console.log("HTML: ",element);
            console.log("[ELEMENT]Current page" + doc.getCurrentPageInfo().pageNumber);

            // Wait for doc.html() to finish before proceeding
            await new Promise<void>((resolve) => {
              doc.html(element, {
                x: marginX,
                y: offsetY + doc.internal.pageSize.getHeight() * (langIndex*2),
                html2canvas: { scale: 0.55 },
                callback: () => {
                  console.log('Starting offset:', offsetY, 'i:', index);
                  offsetY += element.offsetHeight / 2;
                  console.log('Added', id, 'offset', offsetY);
                  resolve(); // Ensure the loop waits for this step
                },
              });
            });
          }
        }
        if (langIndex < this.profileData.length-1){
          doc.addPage();
          offsetY = 20;
          console.log("New page from loop end");
        }
      }
    // Save the PDF after processing all sections
    doc.save('dynamic-multiple-sections.pdf');
  }
}
