/**
 * @deprecated LEGACY MODEL. Please use Annonce instead.
 */
export interface Ad {
  idAd: number;
  titleAd?: string;
  descriptionAd?: string;
  detailsAd?: string;
  priceAd?: string;
  idPricesDelevery?: number;
  datePublication?: string;
  imageAd?: string;
  videoAd?: string;
  idCateg?: number;
  idUser?: number;
  idState?: number;
  idCountry?: number;
  locationAd?: string;
  dateEnd?: string;
  color?: string;
  brand?: string;
  ownerads?: string;
  telephone?: string;
  email?: string;
  startDate?: string;
  idtypecat?: number;
  active?: number;
  imageList?: string[];
  primaryImage?: string;
}

// PaginatedResponse is now replaced by ApiResponse<PagedResponse<T>> from core/types
