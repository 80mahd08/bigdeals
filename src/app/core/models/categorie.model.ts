export interface Categorie {
    idCategorie: number;
    nom: string;
    description?: string;
    iconKey?: string;
    ordreAffichage?: number;
    dateCreation?: string | Date;
}

export interface CategorieSchema {
    idCategorie: number;
    nom: string;
    attributs: AttributCategorie[];
}

export interface AttributCategorie {
    idAttributCategorie: number;
    nom: string;
    typeDonnee: string;
    ordreAffichage?: number;
    estPlage: boolean;
    placeholder?: string;
    options?: OptionAttributCategorie[];
}

export interface OptionAttributCategorie {
    idOptionAttributCategorie: number;
    valeur: string;
    ordreAffichage?: number;
}
