import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ResumeData } from '../interfaces/profile';
import * as enData from '../../assets/content-en.json';
import * as deData from '../../assets/content-de.json';

export type Language = 'en' | 'de';
export type CvContent = Record<Language, ResumeData>;

const STORAGE_KEY = 'dynamic-cv-generator:cv-content';

const BUNDLED_CONTENT: CvContent = {
  en: enData as unknown as ResumeData,
  de: deData as unknown as ResumeData,
};

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function isValidContent(value: unknown): value is CvContent {
  return !!value && typeof value === 'object' && 'en' in value && 'de' in value;
}

// `education` used to be a single object; migrate any content saved before
// it became an array so old localStorage/export data keeps loading.
function normalizeContent(content: CvContent): CvContent {
  (Object.keys(content) as Language[]).forEach((lang) => {
    const education = (content[lang] as unknown as { education: unknown }).education;
    if (education && !Array.isArray(education)) {
      content[lang].education = [education as ResumeData['education'][number]];
    }
  });
  return content;
}

/**
 * Single source of truth for the CV's editable content. Seeds from
 * localStorage if the user has previously edited/imported content,
 * otherwise falls back to the bundled content-en.json/content-de.json.
 * Every update is persisted to localStorage immediately.
 */
@Injectable({
  providedIn: 'root'
})
export class CvContentService {
  private contentSource = new BehaviorSubject<CvContent>(this.loadInitialContent());
  content$ = this.contentSource.asObservable();

  get snapshot(): CvContent {
    return this.contentSource.value;
  }

  getDefaultContent(): CvContent {
    return deepClone(BUNDLED_CONTENT);
  }

  updateLanguageContent(lang: Language, data: ResumeData): void {
    this.setContent({ ...this.contentSource.value, [lang]: data });
  }

  setContent(content: CvContent): void {
    this.contentSource.next(content);
    this.persist(content);
  }

  resetToDefault(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.contentSource.next(this.getDefaultContent());
  }

  exportAsJSON(): string {
    return JSON.stringify(this.contentSource.value, null, 2);
  }

  importFromJSON(json: string): void {
    const parsed = JSON.parse(json);
    if (!isValidContent(parsed)) {
      throw new Error('Invalid CV content: expected an object with "en" and "de" keys.');
    }
    this.setContent(normalizeContent(parsed));
  }

  private persist(content: CvContent): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    } catch (error) {
      console.error('Failed to persist CV content to localStorage:', error);
    }
  }

  private loadInitialContent(): CvContent {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (isValidContent(parsed)) {
          return normalizeContent(parsed);
        }
      }
    } catch (error) {
      console.error('Failed to load CV content from localStorage, using defaults:', error);
    }
    return this.getDefaultContent();
  }
}
