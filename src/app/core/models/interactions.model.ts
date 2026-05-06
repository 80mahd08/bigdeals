export interface Favori {
  idFavori: number;
  idUtilisateur: number;
  idAnnonce: number;
  dateCreation?: string | Date;
}

export interface Signalement {
  idSignalement: number;
  idUtilisateurSignalant?: number;
  idAnnonceSignalee?: number;
  idUtilisateurSignale?: number;
  motif: string;
  description?: string;
  statut?: string;
  dateSignalement?: string | Date;
}

export interface ContactAnnonceur {
  idContact: number;
  idUtilisateur?: number;
  idAnnonceur: number;
  idAnnonce?: number;
  typeContact: number; // 1 = TELEPHONE, 2 = WHATSAPP
  dateContact?: string | Date;
}


export interface DemandeAnnonceur {
  idDemandeAnnonceur: number;
  idUtilisateur: number;
  statut: 'EN_ATTENTE' | 'APPROUVEE' | 'REJETEE' | string;
  documentUrl: string;
  documentNomOriginal: string;
  documentType: string;
  documentTaille: number;
  motifRejet?: string | null;
  dateDemande: string;
  dateTraitement?: string | null;
  idAdminTraitant?: number | null;
}

