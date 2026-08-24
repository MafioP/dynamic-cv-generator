import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CvService } from '../services/cv.service';
import { CvContentService } from '../services/cv-content.service';
import { extractSkillsFromText, getSearchableText } from '../utils/skill-extractor';
import { SKILL_CATEGORIES, SkillCategory } from '../data/skill-categories';

const CUSTOM_CATEGORY = 'Custom';

@Component({
  selector: 'app-input-form',
  templateUrl: './input-form.component.html',
  styleUrls: ['./input-form.component.css']
})
export class InputFormComponent implements OnInit {
  skillCategories: SkillCategory[] = SKILL_CATEGORIES.map(category => ({
    name: category.name,
    skills: [...category.skills],
  }));
  selectedSkills: string[] = [];
  detectedSkills: string[] = [];
  searchQuery: string = '';

  @Output() languageChange = new EventEmitter<string[]>(); // Emit an array of selected languages

  selectedLanguages = { de: true, en: true };

  @Output() downloadPDF = new EventEmitter<void>();

  emitDownloadPdf() {
    this.downloadPDF.emit();
  }

  constructor(private cvService: CvService, private cvContentService: CvContentService) {}

  ngOnInit(): void {
    this.cvContentService.content$.subscribe((content) => {
      const cvText = [content.en, content.de].map(getSearchableText).join(' ');
      this.detectedSkills = extractSkillsFromText(cvText, this.allSkills());
    });
  }

  allSkills(): string[] {
    return this.skillCategories.flatMap(category => category.skills);
  }

  isDetected(skill: string): boolean {
    return this.detectedSkills.includes(skill);
  }

  isSelected(skill: string): boolean {
    return this.selectedSkills.includes(skill);
  }

  filteredCategories(): SkillCategory[] {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) {
      return this.skillCategories;
    }
    return this.skillCategories
      .map(category => ({
        name: category.name,
        skills: category.skills.filter(skill => skill.toLowerCase().includes(query)),
      }))
      .filter(category => category.skills.length > 0);
  }

  hasExactMatch(): boolean {
    const query = this.searchQuery.trim().toLowerCase();
    return this.allSkills().some(skill => skill.toLowerCase() === query);
  }

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

  // Handles both the search field's Enter key and its "Add" button: toggles
  // an exact existing match, or adds the typed text as a new custom skill.
  submitSearch(): void {
    const query = this.searchQuery.trim();
    if (!query) {
      return;
    }

    const existingSkill = this.allSkills().find(skill => skill.toLowerCase() === query.toLowerCase());
    if (existingSkill) {
      this.toggleSkill(existingSkill);
    } else {
      this.addCustomSkill(query);
    }
    this.searchQuery = '';
  }

  private addCustomSkill(skill: string): void {
    let customCategory = this.skillCategories.find(category => category.name === CUSTOM_CATEGORY);
    if (!customCategory) {
      customCategory = { name: CUSTOM_CATEGORY, skills: [] };
      this.skillCategories.push(customCategory);
    }
    customCategory.skills.push(skill);
    this.toggleSkill(skill);
  }

  updateCV(): void {
    this.cvService.updateCV({ skills: this.selectedSkills });
  }

}
