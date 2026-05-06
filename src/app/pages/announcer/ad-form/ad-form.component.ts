import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnnouncerDashboardService } from '../../../core/services/announcer-dashboard.service';
import { CategoriesService } from '../../../core/services/categories.service';
import { Annonce, Categorie, CategorieSchema } from '../../../core/models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ad-form',
  templateUrl: './ad-form.component.html',
  styleUrls: ['./ad-form.component.scss'],
  standalone: false
})
export class AdFormComponent implements OnInit {

  isEdit = false;
  id: string | null = null;
  categories: Categorie[] = [];
  selectedCategorySchema: CategorieSchema | null = null;
  
  // Form State
  ad: any = {
    titre: '',
    description: '',
    prix: null,
    idCategorie: null
  };

  dynamicValues: { [key: number]: any } = {};
  selectedFiles: File[] = [];
  previews: string[] = [];
  existingImages: any[] = [];
  imagesToDelete: number[] = [];
  submitting = false;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private announcerService: AnnouncerDashboardService,
    private categoriesService: CategoriesService
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id && this.id !== 'new') {
      this.isEdit = true;
      this.loadAdDetails(this.id);
    }
  }

  loadCategories() {
    this.categoriesService.getCategories().subscribe(res => {
      if (res.success && res.data) {
        this.categories = res.data;
      }
    });
  }

  loadAdDetails(id: string) {
    this.announcerService.getAnnouncementById(id).subscribe((res: any) => {
      if (res.success && res.data) {
        this.ad = { ...res.data };
        this.existingImages = this.ad.images || [];
        
        if (this.ad.idCategorie) {
          this.categoriesService.getCategorySchema(this.ad.idCategorie).subscribe(schemaRes => {
            if (schemaRes.success && schemaRes.data) {
              this.selectedCategorySchema = schemaRes.data;
              
              // Map existing dynamic values to dynamicValues
              if (this.ad.valeursAttributs) {
                this.ad.valeursAttributs.forEach((v: any) => {
                  const attr = this.selectedCategorySchema?.attributs.find(a => a.idAttributCategorie === v.idAttributCategorie);
                  if (attr?.typeDonnee === 'LISTE') {
                    this.dynamicValues[v.idAttributCategorie] = v.valeurId;
                  } else if (attr?.typeDonnee === 'BOOLEAN') {
                    this.dynamicValues[v.idAttributCategorie] = v.valeur === 'Oui' || v.valeur === true;
                  } else {
                    this.dynamicValues[v.idAttributCategorie] = v.valeur;
                  }
                });
              }
            }
          });
        }
      } else {
        Swal.fire('Erreur', 'Annonce introuvable ou non autorisée', 'error');
        this.router.navigate(['/announcer/announcements']);
      }
    });
  }

  onCategoryChange(idCategorie: any) {
    const id = Number(idCategorie);
    if (!id) {
        this.selectedCategorySchema = null;
        return;
    }

    this.categoriesService.getCategorySchema(id).subscribe(res => {
      if (res.success && res.data) {
        this.selectedCategorySchema = res.data;
        // Initialize dynamic values if not present
        this.selectedCategorySchema.attributs.forEach(attr => {
           if (this.dynamicValues[attr.idAttributCategorie] === undefined) {
               this.dynamicValues[attr.idAttributCategorie] = null;
           }
        });
      }
    });
  }

  onFilesSelected(event: any) {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.selectedFiles.push(file);
        
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previews.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeImage(index: number) {
    this.selectedFiles.splice(index, 1);
    this.previews.splice(index, 1);
  }

  removeExistingImage(idImageAnnonce: number) {
    this.imagesToDelete.push(idImageAnnonce);
    this.existingImages = this.existingImages.filter(img => img.idImageAnnonce !== idImageAnnonce);
  }

  saveAd() {
    if (this.submitting) return;

    // Price Validation
    if (!this.ad.prix || this.ad.prix <= 0) {
        Swal.fire('Erreur', 'Le prix doit être supérieur à 0. Les annonces gratuites ne sont pas autorisées.', 'error');
        return;
    }

    // Image Validation: At least one image is required
    const totalImages = this.existingImages.length + this.selectedFiles.length;
    if (totalImages === 0) {
        Swal.fire('Erreur', 'Au moins une image est requise pour publier cette annonce.', 'error');
        return;
    }

    this.submitting = true;

    const formData = new FormData();
    formData.append('titre', this.ad.titre?.trim() || '');
    formData.append('description', this.ad.description?.trim() || '');
    formData.append('prix', this.ad.prix.toString());
    formData.append('idCategorie', this.ad.idCategorie.toString());
    // Localisation will be handled by the backend using seller's address

    // Map Dynamic Attributes to JSON parts
    if (this.selectedCategorySchema) {
        this.selectedCategorySchema.attributs.forEach(attr => {
            const val = this.dynamicValues[attr.idAttributCategorie];
            if (val !== null && val !== undefined && val !== '') {
                const attrValue: any = { idAttributCategorie: attr.idAttributCategorie };
                
                switch (attr.typeDonnee) {
                    case 'TEXTE': attrValue.valeurTexte = val?.trim(); break;
                    case 'NOMBRE': attrValue.valeurNombre = Number(val); break;
                    case 'DATE': attrValue.valeurDate = val; break;
                    case 'BOOLEAN': attrValue.valeurBooleen = val === 'true' || val === true; break;
                    case 'LISTE': attrValue.idOptionAttributCategorie = Number(val); break;
                }
                
                formData.append('valeursJson', JSON.stringify(attrValue));
            }
        });
    }

    // Append Files
    this.selectedFiles.forEach(file => {
        formData.append('newImages', file); // Use 'newImages' for updates to match DTO
        if (!this.isEdit) formData.append('images', file); // Fallback for create if needed
    });

    // Append Images to Delete (only for edit)
    if (this.isEdit) {
        this.imagesToDelete.forEach(id => {
            formData.append('imagesToDelete', id.toString());
        });
    }

    if (this.isEdit && this.id) {
        this.announcerService.updateAnnouncement(this.id, formData).subscribe({
            next: () => {
                Swal.fire('Succès', 'Annonce mise à jour avec succès !', 'success');
                this.router.navigate(['/announcer/announcements']);
            },
            error: (err) => {
                this.submitting = false;
                const msg = err.error?.message || err.error || err.message || 'Une erreur est survenue lors de la mise à jour.';
                Swal.fire('Erreur', msg, 'error');
            }
        });
    } else {
        this.announcerService.createAnnouncement(formData).subscribe({
            next: () => {
                Swal.fire('Succès', 'Annonce publiée avec succès !', 'success');
                this.router.navigate(['/announcer/announcements']);
            },
            error: (err) => {
                this.submitting = false;
                const msg = err.error?.message || err.error || err.message || 'Une erreur est survenue lors de la publication.';
                Swal.fire('Erreur', msg, 'error');
            }
        });
    }
  }

  cancel() {
    this.router.navigate(['/announcer/announcements']);
  }
}
