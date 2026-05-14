export interface AdminUserListItem {
  idUtilisateur: number;
  nom: string;
  prenom: string;
  nomComplet: string;
  email: string;
  telephone: string | null;
  ville: string | null;
  role: number;
  roleLabel: string;
  statutCompte: number;
  statutLabel: string;
  dateCreation: string;
  nombreAnnonces: number;
  photoProfilUrl: string | null;
}
