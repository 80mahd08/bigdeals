import { Ad } from './ad.model';

/**
 * @deprecated LEGACY INTERFACE. Bridge for public profile pages.
 * Please migrate to Utilisateur when possible.
 */
export interface ProfilAnnonceurPublic {
    idUser: number;
    username?: string;
    firstName?: string;
    lastName?: string;
    profilePicture?: string;
    creationDate?: string;
    isVerified?: number;
    isPremuim?: number;
    isBusinessAccount?: number;
    idState?: number;
    idCountry?: number;
    location?: string;
    active?: number;
}

/**
 * @deprecated LEGACY INTERFACE. Used by orphaned UsersService.
 */
export interface UserPage {
    user?: ProfilAnnonceurPublic;
    ads?: Ad[];
}
