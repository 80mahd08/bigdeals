import { StatutCommande, MethodePaiement } from '../enums';

export interface Commande {
    idCommande: number;
    idAnnonce: number;
    idAcheteur: number;
    idAnnonceur: number;
    montant: number;
    statutCommande: number; // Matches backend StatutCommande enum
    dateCreation: string;
    annonceTitre?: string;

    // Delivery fields
    statutLivraison: number;
    adresseLivraison?: string;
    villeLivraison?: string;
    telephoneLivraison?: string;

    dateExpedition?: string;
    dateLivraison?: string;
    dateDerniereMiseAJourLivraison?: string;
}

export interface LigneCommande {
    id: number;
    idAnnonce: number;
    annonceTitre: string;
    quantite: number;
    prixUnitaire: number;
}
