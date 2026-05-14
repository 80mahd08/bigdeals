import { StatutAnnonce } from '../enums';

export interface Annonce {
  idAnnonce: number;
  idUtilisateur: number;
  annonceurNom?: string;
  annonceurPhotoUrl?: string;
  annonceurTelephone?: string;
  prenomUtilisateur?: string;
  nomUtilisateur?: string;
  idCategorie: number;
  categorieNom?: string;
  titre: string;
  description: string;
  prix: number;
  localisation?: string;
  ville?: string;
  statut?: string;
  dateCreation: string | Date;
  datePublication?: string | Date;
  estActive?: boolean;
  mainImageUrl?: string;
  images?: ImageAnnonce[];
  valeursAttributs?: ValeurAttributAnnonce[];
  supportePaiement?: boolean;
}

export interface ImageAnnonce {
  idImageAnnonce: number;
  url: string;
  estPrincipale: boolean;
  ordreAffichage?: number;
}

export interface ValeurAttributAnnonce {
  idAttributCategorie: number;
  nom: string;
  valeur: string;
}
