import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CvService {
  private cvSource = new BehaviorSubject({ skills: [""] });
  cvData = this.cvSource.asObservable();

  updateCV(data: { skills: string[]; }) {
    this.cvSource.next(data);
  }
}
