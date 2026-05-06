export interface Categorie {
  idCategorie: number;
  nom: string;
  description?: string;
  iconKey?: string;
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
  obligatoire: boolean;
  estPlage: boolean;
  placeholder?: string;
  options?: OptionAttributCategorie[];
}

export interface OptionAttributCategorie {
  idOptionAttributCategorie: number;
  valeur: string;
}
