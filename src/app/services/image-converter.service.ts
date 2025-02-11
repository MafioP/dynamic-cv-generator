import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ImageConverterService {
  constructor(private http: HttpClient) {}

  /**
   * Converts an image from the provided path to a Base64 string.
   * @param imagePath - The path to the image (relative to `assets`).
   * @returns A Promise that resolves with the Base64 string.
   */
  convertImageToBase64(imagePath: string): Promise<string> {
    return this.http
      .get(imagePath, { responseType: 'blob' }) // Fetch the image as a Blob
      .toPromise()
      .then((blob) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();

          reader.onloadend = () => {
            if (reader.result) {
              resolve(reader.result.toString());
            } else {
              reject('Failed to convert image to Base64');
            }
          };

          reader.onerror = (error) => {
            reject(`Error reading image: ${error}`);
          };

          reader.readAsDataURL(blob as Blob); // Convert Blob to Base64
        });
      });
  }
}
