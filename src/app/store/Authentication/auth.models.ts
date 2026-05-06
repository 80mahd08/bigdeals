export class User {
  idUtilisateur?: number;
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  ville?: string;
  photoProfilUrl?: string;
  token?: string;
  role?: 'VISITOR' | 'CLIENT' | 'ANNONCEUR' | 'ADMIN';
  statutCompte?: string;
  dateCreation?: string | Date;
}
