import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  formData = { domain: '' };
  errorMessage = '';

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  sendImage() {
    if (!this.selectedFile || !this.formData.domain) {
      this.errorMessage = 'Veuillez sélectionner une image et un domaine.';
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('domain', this.formData.domain);

    this.http.post("http://localhost:3001/upload", formData).subscribe(
      response => {
        console.log('✅ Image uploaded successfully:', response);
        this.errorMessage = '';
      },
      error => {
        console.error('🚨 Erreur API:', error);
        this.errorMessage = 'Une erreur est survenue lors de l\'envoi.';
      }
    );
  }
}
