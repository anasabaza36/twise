import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Pour *ngIf, etc.
import { FormsModule } from '@angular/forms'; // Pour ngModel
import { RecommendationService } from './services/recommendation.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, FormsModule],
})
export class AppComponent {
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';
  title = 'fashion-predictor';

  // Résultats de l'analyse
  age: number | null = null;
  gender: string = '';
  recommendedOutfit: string[] = [];

  // Champs du formulaire
  formData = {
    domain: ''
  };

  constructor(private recommendationService: RecommendationService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      console.log("📁 Fichier sélectionné :", this.selectedFile);

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  sendImage(): void {
    if (!this.selectedFile) {
      alert("❌ Veuillez sélectionner une image !");
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    console.log("📤 Données envoyées :", this.formData);
    console.log("📸 Fichier envoyé :", this.selectedFile.name);

    this.recommendationService.getRecommendation(this.selectedFile, this.formData.domain)
      .subscribe(
        response => {
          this.isLoading = false;
          console.log("✅ Réponse reçue de Node.js :", response);
          if (response && response.age !== undefined && response.gender && response.recommended_outfit) {
            this.age = response.age;
            this.gender = response.gender;
            this.recommendedOutfit = response.recommended_outfit;
          } else {
            console.warn("⚠ Réponse API incomplète :", response);
            this.errorMessage = "Erreur : réponse incorrecte de l'API.";
          }
        },
        error => {
          this.isLoading = false;
          console.error("🚨 Erreur API :", error);
          this.errorMessage = "Erreur lors de l'analyse. Vérifiez les logs.";
        }
      );
  }
}
