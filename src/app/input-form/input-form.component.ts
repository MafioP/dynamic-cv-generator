import { Component } from '@angular/core';
import { CvService } from '../services/cv.service';

@Component({
  selector: 'app-input-form',
  templateUrl: './input-form.component.html',
  styleUrls: ['./input-form.component.css']
})
export class InputFormComponent {
  availableSkills: string[] = [
    'Java', 'Python', 'Web Dev', 'C++/Embedded',
    'JavaScript/TypeScript', 'Git', 'CI/CD', 'Angular', 'NodeJS'
  ];
  selectedSkills: string[] = [];
  newSkill: string = '';

  constructor(private cvService: CvService) {}

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
