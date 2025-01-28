import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PdfConverterService {
  private apiUrl = 'http://127.0.0.1:5000/generate-pdf';  // Flask or Node.js backend URL

  constructor(private http: HttpClient) {}

  // This method sends the HTML content as a string to the backend
  generatePdf(htmlContent: string): Observable<Blob> {
    return this.http.post<Blob>(this.apiUrl, { html: htmlContent }, { responseType: 'blob' as 'json' });
  }
}
