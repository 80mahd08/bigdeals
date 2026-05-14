import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../core/services/auth.service';
import { User } from '../../../store/Authentication/auth.models';
import Swal from 'sweetalert2';
import { TUNISIA_CITIES } from '../../../core/constants/cities';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: false
})
export class ProfileComponent implements OnInit {

  currentUser: User | null = null;
  
  editForm = {
    prenom: '',
    nom: '',
    telephone: '',
    adresse: '',
    ville: ''
  };

  passwordForm = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  selectedFile: File | null = null;
  imagePreview: string | null = null;
  imageError = false;
  cities = TUNISIA_CITIES;

  constructor(private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.editForm = {
          prenom: user.prenom || (user as any).Prenom || '',
          nom: user.nom || (user as any).Nom || '',
          telephone: user.telephone || (user as any).Telephone || '',
          adresse: user.adresse || (user as any).Adresse || '',
          ville: user.ville || (user as any).Ville || '0'
        };
      }
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  updateProfile() {
    // Validate Phone Number if provided
    if (this.editForm.telephone && this.editForm.telephone.trim() !== '') {
      const phone = this.editForm.telephone.trim();
      const phoneRegex = /^[2579][0-9]{7}$/;
      if (!phoneRegex.test(phone)) {
        Swal.fire('Format Invalide', 'Le numéro de téléphone doit contenir 8 chiffres et commencer par 2, 5, 7 ou 9.', 'error');
        return;
      }
    }

    const formData = new FormData();
    formData.append('Prenom', this.editForm.prenom);
    formData.append('Nom', this.editForm.nom);
    formData.append('Telephone', this.editForm.telephone);
    formData.append('Adresse', this.editForm.adresse);
    formData.append('Ville', this.editForm.ville === '0' || !this.editForm.ville ? '' : this.editForm.ville);
    
    if (this.selectedFile) {
      formData.append('Photo', this.selectedFile);
    }

    this.authService.updateProfile(formData).subscribe({
      next: () => {
        Swal.fire('Succès', 'Profil mis à jour avec succès.', 'success');
        this.selectedFile = null;
        this.imagePreview = null;
      },
      error: (err) => {
        Swal.fire('Erreur', err.error?.message || 'Une erreur est survenue', 'error');
      }
    });
  }

  updatePassword() {
    if (!this.passwordForm.oldPassword || !this.passwordForm.newPassword) {
      Swal.fire('Erreur', 'Veuillez remplir tous les champs.', 'error');
      return;
    }

    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      Swal.fire('Erreur', 'Le nouveau mot de passe et la confirmation ne correspondent pas.', 'error');
      return;
    }

    this.authService.changePassword(this.passwordForm.oldPassword, this.passwordForm.newPassword).subscribe({
      next: (res) => {
        if (res.success) {
            Swal.fire('Succès', 'Mot de passe mis à jour avec succès.', 'success');
            this.passwordForm = { oldPassword: '', newPassword: '', confirmPassword: '' };
        } else {
            Swal.fire('Erreur', res.message || 'Échec de la mise à jour', 'error');
        }
      },
      error: (err) => {
        Swal.fire('Erreur', err.error?.message || 'Ancien mot de passe incorrect ou erreur serveur', 'error');
      }
    });
  }

  get photoUrl(): string {
    if (!this.currentUser?.photoProfilUrl) return '';
    if (this.currentUser.photoProfilUrl.startsWith('http')) return this.currentUser.photoProfilUrl;
    const baseUrl = 'http://localhost:5049'; // Default for local dev
    return `${baseUrl}${this.currentUser.photoProfilUrl.startsWith('/') ? '' : '/'}${this.currentUser.photoProfilUrl}`;
  }

  get avatarLetter(): string {
    if (!this.currentUser) return '?';
    const name = this.currentUser.prenom || this.currentUser.nom || this.currentUser.email || '?';
    return name.charAt(0).toUpperCase();
  }

  onImageError() {
    this.imageError = true;
  }
}

