import { StatutAnnonce } from '../enums';

export interface AnnonceFilterParams {
  search?: string;
  categorieId?: number;
  prixMin?: number;
  prixMax?: number;
  localisation?: string;
  statut?: StatutAnnonce;
  attributs?: AttributFilterValue[];
}

export interface AttributFilterValue {
  attributId: number;
  valeur: string;
  valeurMin?: number | string;
  valeurMax?: number | string;
}
