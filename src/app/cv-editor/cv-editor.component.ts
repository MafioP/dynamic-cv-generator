import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CvContentService, Language, CvContent } from '../services/cv-content.service';
import { ResumeData, WorkExperience, Project } from '../interfaces/profile';

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

@Component({
  selector: 'app-cv-editor',
  templateUrl: './cv-editor.component.html',
  styleUrls: ['./cv-editor.component.css']
})
export class CvEditorComponent implements OnInit {
  // Detailed content-editing form starts open; the skill selector above it
  // is always visible.
  expanded = true;
  selectedLang: Language = 'en';

  @Output() downloadPDF = new EventEmitter<void>();
  @Output() languageChange = new EventEmitter<string[]>();

  // Both languages are kept in memory at once so switching tabs never
  // discards unsaved edits in the language you're not currently viewing.
  private drafts!: CvContent;
  justSaved = false;
  importError: string | null = null;

  constructor(private cvContentService: CvContentService) {}

  ngOnInit(): void {
    this.drafts = deepClone(this.cvContentService.snapshot);
  }

  get draft(): ResumeData {
    return this.drafts[this.selectedLang];
  }

  toggleExpanded(): void {
    this.expanded = !this.expanded;
  }

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
