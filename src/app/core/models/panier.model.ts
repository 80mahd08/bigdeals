export interface Panier {
    id: number;
    idUtilisateur: number;
    total: number;
    lignes?: LignePanier[];
}

export interface LignePanier {
    id: number;
    idPanier: number;
    idAnnonce: number;
    quantite: number;
    prixUnitaire: number;
    annonceTitre?: string;
    annonceImage?: string;
}
