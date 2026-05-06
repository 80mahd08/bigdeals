export interface Panier {
  idPanier: number;
  idUtilisateur: number;
  lignes?: LignePanier[];
  total?: number;
}

export interface LignePanier {
  idLignePanier: number;
  idPanier: number;
  idAnnonce: number;
  annonceTitre?: string;
  annonceImage?: string;
  quantite: number;
  prixUnitaire?: number;
}

export interface Commande {
  idCommande: number;
  idUtilisateur: number;
  statut: string;
  total: number;
  dateCommande?: string | Date;
  lignes?: LigneCommande[];
}

export interface LigneCommande {
  idLigneCommande: number;
  idCommande: number;
  idAnnonce: number;
  annonceTitre?: string;
  quantite: number;
  prixUnitaire: number;
  totalLigne?: number;
}
