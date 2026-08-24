import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CvSkills {
  skills: string[];
}

const STORAGE_KEY = 'dynamic-cv-generator:selected-skills';

function loadInitialSkills(): CvSkills {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed?.skills)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Failed to load selected skills from localStorage, starting empty:', error);
  }
  return { skills: [] };
}

@Injectable({
  providedIn: 'root'
})
export class CvService {
  private cvSource = new BehaviorSubject<CvSkills>(loadInitialSkills());
  cvData = this.cvSource.asObservable();

  get snapshot(): CvSkills {
    return this.cvSource.value;
  }

  updateCV(data: CvSkills): void {
    this.cvSource.next(data);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to persist selected skills to localStorage:', error);
    }
  }
}
