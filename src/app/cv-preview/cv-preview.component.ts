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
  profileData = [deData, enData];
  profilePicBase64: string | null = null;
  skills: string[] = [];

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

  getComputedStyles(element: HTMLElement): Record<string, string> {
    const computedStyle = window.getComputedStyle(element);
    const styles: Record<string, string> = {};

    // Copy only necessary properties
    for (let i = 0; i < computedStyle.length; i++) {
      const property = computedStyle[i];
      styles[property] = computedStyle.getPropertyValue(property);
    }

    return styles;
  }

  getClonedElementHeight(element: HTMLElement): number {
    const clonedElement = element.cloneNode(true) as HTMLElement;

    // Apply absolute positioning to avoid layout issues
    clonedElement.style.position = "absolute";
    clonedElement.style.visibility = "hidden";
    clonedElement.style.left = "-9999px";

    document.body.appendChild(clonedElement); // Add to DOM

    const height = clonedElement.offsetHeight; // Get height
    document.body.removeChild(clonedElement); // Remove after measuring
    console.log("HTML Clone Height: ", height);
    return height;
  }

  async downloadPDF() {
    const doc = new jsPDF({
      unit: 'px',
      format: 'a4',
      orientation: 'portrait',
    });
    console.log(doc.getFontList());
    let offsetY = 10; // Starting Y position
    const marginX = 15;

    console.log(doc.internal.events.getTopics())
    doc.getLineHeight()
    doc.internal.events.subscribe("addPage", () => {
      console.log("EVENT: New Page Added");
    })
    doc.internal.events.subscribe("postProcessText", (payload) => {
      //console.log("EVENT: Text preprocessing ", payload);
    })

    // Add horizontal list
    const addHorizontalList = (
      items: string[],
      startX: number,
      startY: number
    ): number => {
      const itemHeight = 8; // Height for each item
      const padding = 8; // Space between items
      const rectRoundess = 5;
      let currentX = startX + padding / 2;
      console.log('Adding skills');
      items.forEach((item) => {
        doc.setFillColor(100, 100, 100);
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
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

      return startY + itemHeight + padding; // Return the new Y position after the list
    };

    const setHeader = (text: String) => {
      doc.setFont('G_ari_bd', 'bold');
      console.log("HEADER: page number", doc.getCurrentPageInfo().pageNumber)
      doc.setPage(doc.getCurrentPageInfo().pageNumber);
      doc.setFontSize(12);
      doc.text(text as string, marginX, offsetY);
      offsetY += 3;
      doc.setDrawColor('#ddd');
      doc.line(
        marginX,
        offsetY,
        doc.internal.pageSize.width - marginX,
        offsetY
      );
      offsetY += 12;
      doc.setFont('arial', 'normal');
      doc.setFontSize(10);
      return offsetY
    };

    const setContactInfo = (profileData: ContactDetails) => {
      console.log('Setting contact info ', profileData);
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
      doc.setFont('G_ari_bd', 'bold');
      doc.setFontSize(18);
      doc.text(profileData.name, tempXOffset, (offsetY += 10), {
        align: 'center',
      });

      doc.setFontSize(14);
      doc.setFont('arial', 'normal');
      doc.text(profileData.title, tempXOffset, (offsetY += 10), {
        align: 'center',
      });

      doc.setFont('arial', 'normal');
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
      //offsetY += doc.internal.pageSize.getHeight() * (doc.getCurrentPageInfo().pageNumber - 1)
    };

    const applyStyles = (element: HTMLElement): HTMLElement => {
      const clonedElement = element.cloneNode(true) as HTMLElement;

      const stylesheetStyles = this.getComputedStyles(element);

      Object.entries(stylesheetStyles).forEach(([property, value]) => {
        clonedElement.style.setProperty(property, value);
      });

      //additional properties
      clonedElement.style.fontSize = "x-small";
      clonedElement.style.fontFamily = "Arial, sans-serif";

      doc.setFont("times","normal");
      return clonedElement;
    };

    const sections = ['contact', 'cv-template-1', 'skills', 'cv-template-2'];

    for (const [langIndex, langData] of this.profileData.entries()) {
      for (const [index, id] of sections.entries()) {
        if (id === 'contact') {
          setContactInfo(langData.contactDetails);
        }
        if (id === 'skills') {
          // console.log("SKILLS: initial offset ", offsetY);
          // console.log("PAGE SIZE: ", doc.internal.pageSize.getHeight() , "index " ,langIndex);
          //nudge the y offset
          offsetY += 10 * (doc.getCurrentPageInfo().pageNumber - 1)
          console.log("skills starting offset: ", offsetY);
          //offsetY = 20;
          offsetY = setHeader('Skills');
          offsetY = addHorizontalList(this.skills, marginX, offsetY);
          offsetY = addHorizontalList(langData.softSkills, marginX, offsetY);
          // console.log('Added Skills', id, 'offset', offsetY);
          offsetY = setHeader('Languages');
          offsetY = addHorizontalList(langData.languages, marginX, offsetY);
          // console.log('Added Language', id, 'offset', offsetY);
          //offsetY += doc.internal.pageSize.getHeight() - 15;
        }

        const element = document
          .getElementsByClassName(id)
          .item(langIndex) as HTMLElement;
        if (element) {
          // console.log('Offset before html:', offsetY, 'i:', index);
          // console.log('HTML: ', element);
          const cloneElement = applyStyles(element);
          // Wait for doc.html() to finish before proceeding
          console.log("PAGE: " + doc.getCurrentPageInfo().pageNumber);
          //doc.setPage(langIndex + 1);
          await new Promise<void>((resolve) => {
            doc.html(cloneElement, {
              x: marginX,
              y: offsetY + doc.internal.pageSize.getHeight() * (doc.getCurrentPageInfo().pageNumber - 1),
              html2canvas: {
                logging: false,
                scale: 0.55,
                useCORS: true
               },
               autoPaging: "text",
              callback: () => {
                console.log('HTML Starting offset:', offsetY, 'i:', index);
                offsetY += Math.floor(this.getClonedElementHeight(cloneElement)/2.7) ;
                console.log('Added', id, 'offset', offsetY);
                resolve(); // Ensure the loop waits for this step
              },
            });
          });
        }
      }
      if (langIndex < this.profileData.length - 1) {
        doc.addPage();
        offsetY = 10;
        console.log('New page from loop end');
      }
    }
    // Save the PDF after processing all sections
    doc.save('dynamic-multiple-sections.pdf');
  }
}
