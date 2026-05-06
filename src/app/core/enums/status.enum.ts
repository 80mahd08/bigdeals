export enum StatutAnnonce {
  PUBLIEE = 'PUBLIEE',
  SUSPENDUE = 'SUSPENDUE'
}

export enum StatutCommande {
  EN_ATTENTE = 'EN_ATTENTE',
  VALIDEE = 'VALIDEE',
  EXPEDIEE = 'EXPEDIEE',
  LIVREE = 'LIVREE',
  ANNULEE = 'ANNULEE'
}

export enum StatutPaiement {
  EN_ATTENTE = 'EN_ATTENTE',
  REUSSI = 'REUSSI',
  ECHOUE = 'ECHOUE',
  REMBOURSE = 'REMBOURSE'
}

export enum StatutTransaction {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export enum StatutSignalement {
  EN_ATTENTE = 'EN_ATTENTE',
  EN_COURS = 'EN_COURS',
  TRAITE = 'TRAITE',
  REJETE = 'REJETE'
}

export enum StatutDemandeAnnonceur {
  EN_ATTENTE = 'EN_ATTENTE',
  APPROUVEE = 'APPROUVEE',
  REJETEE = 'REJETEE'
}

export enum TypeContact {
  WHATSAPP = 'WHATSAPP',
  TELEPHONE = 'TELEPHONE'
}

export enum TypeSignalement {
  CONTENU_INAPPROPRIE = 'CONTENU_INAPPROPRIE',
  FRAUDE = 'FRAUDE',
  HARCELEMENT = 'HARCELEMENT',
  AUTRE = 'AUTRE'
}

export enum TypeDonneeAttribut {
  TEXTE = 'TEXTE',
  NOMBRE = 'NOMBRE',
  BOOLEEN = 'BOOLEEN',
  LISTE = 'LISTE',
  DATE = 'DATE'
}

export enum MethodePaiement {
  ESPECES = 'ESPECES',
  PAIEMENT_A_LA_LIVRAISON = 'PAIEMENT_A_LA_LIVRAISON',
  VIREMENT_BANCAIRE = 'VIREMENT_BANCAIRE',
  E_DINAR = 'E_DINAR',
  D17 = 'D17',
  WALLET_LOCAL = 'WALLET_LOCAL',
  AUTRE = 'AUTRE'
}
