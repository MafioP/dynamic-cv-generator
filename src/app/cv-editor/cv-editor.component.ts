import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CvService } from '../services/cv.service';
import { CvContentService, Language, CvContent } from '../services/cv-content.service';
import { extractSkillsFromText, getSearchableText } from '../utils/skill-extractor';
import { SKILL_CATEGORIES, SkillCategory } from '../data/skill-categories';
import { ResumeData, WorkExperience, Project, Education } from '../interfaces/profile';

const CUSTOM_CATEGORY = 'Custom';

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

@Component({
  selector: 'app-cv-editor',
  templateUrl: './cv-editor.component.html',
  styleUrls: ['./cv-editor.component.css']
})
export class CvEditorComponent implements OnInit {
  // --- Skill picker state ---
  skillCategories: SkillCategory[] = SKILL_CATEGORIES.map(category => ({
    name: category.name,
    skills: [...category.skills],
  }));
  selectedSkills: string[] = [];
  detectedSkills: string[] = [];
  searchQuery: string = '';
  selectedLanguages = { de: true, en: true };

  @Output() languageChange = new EventEmitter<string[]>();
  @Output() downloadPDF = new EventEmitter<void>();

  // --- Content editor state ---
  selectedLang: Language = 'en';

  // Both languages are kept in memory at once so switching tabs never
  // discards unsaved edits in the language you're not currently viewing.
  private drafts!: CvContent;
  justSaved = false;
  importError: string | null = null;

  // Every section is independently collapsible; all start expanded.
  skillsExpanded = true;
  contactExpanded = true;
  aboutExpanded = true;
  headingsExpanded = true;
  experienceExpanded = true;
  educationExpanded = true;
  projectsExpanded = true;
  languagesExpanded = true;
  softSkillsExpanded = true;
  otherExpanded = true;

  constructor(private cvService: CvService, private cvContentService: CvContentService) {}

  ngOnInit(): void {
    this.drafts = deepClone(this.cvContentService.snapshot);
    this.cvContentService.content$.subscribe((content) => {
      const cvText = [content.en, content.de].map(getSearchableText).join(' ');
      this.detectedSkills = extractSkillsFromText(cvText, this.allSkills());
    });
  }

  get draft(): ResumeData {
    return this.drafts[this.selectedLang];
  }

  // --- Skill picker ---

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
      this.selectedSkills = this.selectedSkills.filter(s => s !== skill);
    } else {
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

  emitDownloadPdf(): void {
    this.downloadPDF.emit();
  }

  // --- Content editor: save / discard / reset ---

  selectLanguage(lang: Language): void {
    this.selectedLang = lang;
    this.justSaved = false;
  }

  save(): void {
    this.cvContentService.updateLanguageContent(this.selectedLang, this.draft);
    this.justSaved = true;
  }

  discard(): void {
    this.drafts[this.selectedLang] = deepClone(this.cvContentService.snapshot[this.selectedLang]);
    this.justSaved = false;
  }

  resetToDefault(): void {
    const defaults = this.cvContentService.getDefaultContent();
    this.drafts[this.selectedLang] = defaults[this.selectedLang];
    this.justSaved = false;
  }

  // --- Generic reordering, shared by every repeatable list section ---

  moveItem<T>(list: T[], index: number, delta: -1 | 1): void {
    const target = index + delta;
    if (target < 0 || target >= list.length) {
      return;
    }
    const [item] = list.splice(index, 1);
    list.splice(target, 0, item);
  }

  // --- Experiences ---

  addExperience(): void {
    this.draft.experiences.push({ position: '', company: '', date: '', details: [''] });
  }

  removeExperience(index: number): void {
    this.draft.experiences.splice(index, 1);
  }

  detailsText(experience: WorkExperience): string {
    return experience.details.join('\n');
  }

  setDetailsText(experience: WorkExperience, text: string): void {
    experience.details = text.split('\n');
  }

  // --- Education ---

  addEducation(): void {
    this.draft.education.push({ degree: '', university: '', graduation_date: '' } as Education);
  }

  removeEducation(index: number): void {
    this.draft.education.splice(index, 1);
  }

  // --- Projects ---

  addProject(): void {
    this.draft.projects.push({ title: '', description: '' } as Project);
  }

  removeProject(index: number): void {
    this.draft.projects.splice(index, 1);
  }

  // --- Generic string-list helpers (languages / softSkills / other) ---

  addListItem(list: string[]): void {
    list.push('');
  }

  removeListItem(list: string[], index: number): void {
    list.splice(index, 1);
  }

  // --- Export / Import ---

  exportJSON(): void {
    const blob = new Blob([this.cvContentService.exportAsJSON()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cv-content.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  onImportFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        this.cvContentService.importFromJSON(reader.result as string);
        this.drafts = deepClone(this.cvContentService.snapshot);
        this.importError = null;
        this.justSaved = true;
      } catch (error) {
        this.importError = error instanceof Error ? error.message : 'Failed to import file.';
      }
    };
    reader.readAsText(file);
    input.value = '';
  }
}
