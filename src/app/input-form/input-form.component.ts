import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CvService } from '../services/cv.service';


@Component({
  selector: 'app-input-form',
  templateUrl: './input-form.component.html',
  styleUrls: ['./input-form.component.css']
})
export class InputFormComponent {
  availableSkills: string[] = [
    'Java', 'Python', 'Web Dev', 'C++/Embedded','JavaScript', 'TypeScript', 'Git', 'CI/CD', 'Angular', 'NodeJS', 'OOP', 'Scripting', 'MySQL', 'HTML', 'CSS', 'REST APIs', 'Google Cloud', 'Scrum', 'Agile Development'
  ];
  selectedSkills: string[] = [];
  newSkill: string = '';

  @Output() languageChange = new EventEmitter<string[]>(); // Emit an array of selected languages

  selectedLanguages = { de: true, en: true };

  @Output() downloadPDF = new EventEmitter<void>();

  emitDownloadPdf() {
    this.downloadPDF.emit();
  }

  constructor(private cvService: CvService) {}

  onLanguageChange(): void {
    const activeLanguages = Object.keys(this.selectedLanguages).filter(lang => this.selectedLanguages[lang]);
    this.languageChange.emit(activeLanguages);
  }

  toggleSkill(skill: string): void {
    if (this.selectedSkills.includes(skill)) {
      // Remove skill if already selected
      this.selectedSkills = this.selectedSkills.filter(s => s !== skill);
    } else {
      // Add skill if not already selected
      this.selectedSkills.push(skill);
    }
    this.updateCV();
  }

  addSkill(): void {
    if (this.newSkill.trim() && !this.availableSkills.includes(this.newSkill.trim())) {
      this.availableSkills.push(this.newSkill.trim());
      this.newSkill = ''; // Clear the input box
    }
  }

  updateCV(): void {
    this.cvService.updateCV({ skills: this.selectedSkills });
  }

}
