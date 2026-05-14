import { UserRole } from '../enums';

export interface Utilisateur {
  idUtilisateur: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  adresse?: string;
  ville?: string;
  photoProfilUrl?: string;
  role: string | UserRole;
  statutCompte?: string;
  statutLabel?: string;
  dateCreation?: Date | string;
}

export interface AuthResponseDto {
  token: string;
  user: Utilisateur;
}
