import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  private apiUrl = 'http://localhost:3001/upload'; // Updated to work entirely on port 3001

  constructor(private http: HttpClient) {}

  getRecommendation(file: File, domain: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('domain', domain);

    // Debugging: Log request details
    console.log("📤 Sending request to:", this.apiUrl);
    formData.forEach((value, key) => {
      console.log(`FormData: ${key} =`, value);
    });

    // Ensure it sends a POST request to the correct backend route
    return this.http.post<any>(this.apiUrl, formData);
  }
}
